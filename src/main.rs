// Hippity hoppity your code is now my property

use std::env;

use axum::{
    body::{self, Empty, Full},
    extract::Path,
    http::{header, HeaderValue, Response, StatusCode},
    response::IntoResponse,
    routing::get,
};

use include_dir::{include_dir, Dir};

use mime_guess::mime;

use mongodb::{Client, options::ClientOptions};

// Set the static directory as the public_html directory
static STATIC_DIR: Dir<'_> = include_dir!("$CARGO_MANIFEST_DIR/public_html");

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create a new router
    let app = axum::Router::new()
        .route("/", get(serve_index))
        .route("/*path", get(serve_static));

    // Create a Socket Address
    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], 3000));

    // Get Mongo serv addr
    let mongo_addr = match env::var("MONGO_SERVER_URL") {
        Ok(value) => value,
        Err(err) => panic!("Couldn't acquire MongoDB service URL: {err}"),
    };

    // Get the Axum port no
    let port_no = match env::var("AXUM_PORT") {
        Ok(value) => match value.parse::<u16>() {
            Ok(value) => value,
            Err(err) => {
                eprintln!("Failed to parse Axum port: {err}");
                println!("Resorting to port 3000.");
                3000u16
            }
        },
        Err(err) => {
            eprintln!("Axum port not readable: {err}");
            3000u16
        }
    };

    // Parse a connection string into an options struct.
    let mut client_options = ClientOptions::parse(mongo_addr).await?;

    // Set the app name (doesn't really matter)
    client_options.app_name = Some("Cluster0".to_string());

    // Get a handle to the deployment.
    let client = Client::with_options(client_options)?;

    // List the names of the databases in that deployment.
    for db_name in client.list_database_names(None, None).await? {
        println!("{}", db_name);
    }

    println!("Server starting on http://localhost:{}", port_no);

    // Bind the Socket Address to Axum and start
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}

async fn serve_index() -> impl IntoResponse {
    match STATIC_DIR.get_file("index.html") {
        // File does not exist
        None => Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(body::boxed(Empty::new()))
            .unwrap(),
        // File exists
        Some(file) => Response::builder()
            .status(StatusCode::OK)
            .header(
                header::CONTENT_TYPE,
                HeaderValue::from_str(mime::TEXT_HTML_UTF_8.as_ref()).unwrap(),
            )
            .body(body::boxed(Full::from(file.contents())))
            .unwrap(),
    }
}

async fn serve_static(Path(path): Path<String>) -> impl IntoResponse {
    // Split path by /
    let path = path.trim_start_matches('/');

    // Try to figure out the MIME type
    let mime_type = mime_guess::from_path(path).first_or_text_plain();

    match STATIC_DIR.get_file(path) {
        // File does not exist
        None => Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(body::boxed(Empty::new()))
            .unwrap(),
        // File exists
        Some(file) => Response::builder()
            .status(StatusCode::OK)
            .header(
                header::CONTENT_TYPE,
                HeaderValue::from_str(mime_type.as_ref()).unwrap(),
            )
            .body(body::boxed(Full::from(file.contents())))
            .unwrap(),
    }
}
