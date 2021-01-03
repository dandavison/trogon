use crate::queries;

use rocket::response::content;

#[get("/sites")]
pub fn sites() -> content::Json<String> {
    content::Json(serde_json::to_string(&queries::sites::query()).unwrap())
}

#[get("/trips")]
pub fn trips() -> content::Json<String> {
    content::Json(serde_json::to_string(&queries::trips::query()).unwrap())
}

#[get("/guides")]
pub fn guides() -> content::Json<String> {
    content::Json(serde_json::to_string(&queries::guide_with_images::query()).unwrap())
}
