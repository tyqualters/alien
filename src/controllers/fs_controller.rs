use axum::{
    body::{self, Empty, Full},
    extract::Path,
    http::{header, HeaderValue, Response, StatusCode},
    response::IntoResponse,
    routing::get,
};

use include_dir::{include_dir, Dir};
use mime_guess::mime;

// Set the static directory as the public_html directory
static STATIC_DIR: Dir<'_> = include_dir!("$CARGO_MANIFEST_DIR/public_html");

pub fn get_static_router() -> axum::Router {
    axum::Router::new()
        .route("/", get(handle_index))
        .route("/*path", get(handle_static))
}

pub async fn handle_index() -> impl IntoResponse {
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

pub async fn handle_static(Path(path): Path<String>) -> impl IntoResponse {
    // Split path by /
    let mut path = path.trim_start_matches('/').to_string();

    // This should be dead code
    if path == "" {
        path = "index.html".to_string();
    }

    // Try to figure out the MIME type
    let mime_type = mime_guess::from_path(path.clone()).first_or_text_plain();

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
