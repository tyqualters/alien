use axum::{
    body::{self, Full},
    extract::State,
    http::{header, HeaderValue, StatusCode},
    response::{IntoResponse, Response},
    Json,
};

use mime_guess::mime;

use mongodb::Client;

use serde_json::Value;

pub async fn handle_login(Json(payload): Json<Value>) -> impl IntoResponse {
    let json_txt = payload.to_string();

    Response::builder()
        .status(StatusCode::OK)
        .header(
            header::CONTENT_TYPE,
            HeaderValue::from_str(mime::APPLICATION_JSON.as_ref()).unwrap(),
        )
        .body(body::boxed(Full::from(json_txt)))
        .unwrap()
}

pub async fn handle_new_user(Json(payload): Json<Value>) -> impl IntoResponse {
    let json_txt = payload.to_string();

    Response::builder()
        .status(StatusCode::OK)
        .header(
            header::CONTENT_TYPE,
            HeaderValue::from_str(mime::APPLICATION_JSON.as_ref()).unwrap(),
        )
        .body(body::boxed(Full::from(json_txt)))
        .unwrap()
}

pub async fn test_api(State(client): State<Client>) -> impl IntoResponse {

    let db = client.database("chat");

    let mut collection_names_v: Vec<String> = Vec::new();

    for collection_name in db.list_collection_names(None).await.expect("Could not iterate collections") {
        collection_names_v.push(collection_name);
    }

    (StatusCode::OK, collection_names_v.join(", "))
}
