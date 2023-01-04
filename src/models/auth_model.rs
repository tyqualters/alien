use serde::{Serialize, Deserialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct UserAccount {
    pub username: String,
    pub password: String,
}

impl UserAccount {
    #[allow(dead_code)]
    pub fn to_string(&self) -> String {
        format!("User Account U:{} P:{}", self.username, self.password)
    }
}

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub name: String,
    pub exp: u64,
    pub iat: u64,
}

#[derive(Serialize, Deserialize)]
pub struct UserPayload {
    pub uid: String,
}