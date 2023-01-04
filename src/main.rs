// Hippity hoppity your code is now my property

use std::{env, time::Duration, path::PathBuf};

use axum::{
    http::StatusCode,
    response::IntoResponse,
    routing::post,
};

use mongodb::{options::{ClientOptions, Compressor}, Client};

use tower_http::cors::{Any, CorsLayer};

use axum_server::tls_rustls::RustlsConfig;

mod controllers;
use controllers::{auth_controller, fs_controller};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Get Mongo serv addr
    let mongo_addr = env::var("MONGO_SERVER_URL").expect("No MongoDB server URI specified");

    // Parse a connection string into an options struct.
    let mut client_options = ClientOptions::parse(mongo_addr).await?;

    // Set the configuration
    client_options.app_name = Some("Cluster0".to_string());
    client_options.connect_timeout = Some(Duration::from_secs(30));
    client_options.compressors = Some(vec![
        Compressor::Snappy,
        Compressor::Zlib {
            level: Default::default(),
        },
        Compressor::Zstd {
            level: Default::default(),
        },
    ]);
    
    // Get a handle to the deployment.
    let client = Client::with_options(client_options)?;
    
    let config: Option<RustlsConfig> = match RustlsConfig::from_pem_file(
        PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("certs")
            .join("cert.pem"),
        PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("certs")
            .join("key.pem"),
    ).await {
        Ok(config) => Option::from(config),
        Err(err) => {
            eprintln!("{err}");
            println!("TLS certificates (cert.pem, key.pem) not provided in the \"certs\" directory or were incompatible.");
            Option::None
        },
    };
    
    // Cross-Origin Resource Sharing
    let cors = CorsLayer::new().allow_origin(Any);
    
    // Get the Axum port no
    let port = env::var("AXUM_PORT")
        .expect("No Axum port specified")
        .parse::<u16>()?;
    
        // Create the API router (requires client state)
    let app_api = axum::Router::new()
        .route("/auth/login", post(auth_controller::handle_login))
        .route("/auth/create", post(auth_controller::handle_new_user))
        .route("/test", post(auth_controller::test_api))
        .with_state(client);

    // Create the main router (DO NOT include a state)
    let app = axum::Router::new()
        .nest_service("/", fs_controller::get_static_router())
        .nest_service("/api", app_api)
        .layer(cors)
        .fallback(page_not_found);

    // Bind the Socket Address to Axum and start
    if config.is_none() {
        // Create a Socket Address
        let addr = std::net::SocketAddr::from(([0, 0, 0, 0], port));
    
        println!("Server starting on http://{}", addr);
        
        // Spawn server with Axum
        axum::Server::bind(&addr)
            .serve(app.into_make_service())
            .await
            .expect("Failed to start server");
    } else {
        // TODO(?): Add HTTP->HTTPS redirect port

        // Create a Socket Address
        let addr = std::net::SocketAddr::from(([0, 0, 0, 0], port));
    
        println!("Server starting on https://{}", addr);
        
        // Spawn Rustls server with Axum_Server
        axum_server::bind_rustls(addr, config.unwrap())
            .serve(app.into_make_service())
            .await
            .expect("Failed to start server");
    }

    Ok(())
}

async fn page_not_found() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, "404 Page Not Found")
}