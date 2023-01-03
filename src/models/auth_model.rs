use serde::{Serialize, Deserialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct UserAccount {
    pub id: Option<u32>,
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct UserToken {
    pub token: String,
}