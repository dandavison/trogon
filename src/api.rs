use crate::queries;

use rocket::response::content;

#[get("/sites")]
pub fn sites() -> content::Json<String> {
    content::Json(serde_json::to_string(&queries::site_with_images::query()).unwrap())
}

#[get("/trips")]
pub fn trips() -> content::Json<String> {
    content::Json(serde_json::to_string(&queries::trip_with_site_days::query()).unwrap())
}

#[get("/guides")]
pub fn guides() -> content::Json<String> {
    content::Json(serde_json::to_string(&queries::guide_with_images::query()).unwrap())
}
