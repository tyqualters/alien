use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ServerApiResponse {
    pub status: String,
    pub message: String
}

impl ServerApiResponse {
    #[allow(dead_code)]
    pub fn to_string(&self) -> String {
        format!("{}: {}", self.status, self.message)
    }
}