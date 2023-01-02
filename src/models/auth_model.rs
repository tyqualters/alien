use serde::{Deserialize};

#[derive(Deserialize)]
pub struct User {
    pub email: String,
    pub password: String,
}