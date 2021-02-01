use crate::queries;

use rocket::response::content;

#[get("/ebird-hotspots")]
pub fn ebird_hotspots() -> content::Json<String> {
    content::Json(serde_json::to_string(&queries::ebird_hotspots::query()).unwrap())
}

#[get("/ebird-hotspot-species/<loc_id>")]
pub fn ebird_hotspot_species(loc_id: String) -> content::Json<String> {
    content::Json(serde_json::to_string(&queries::ebird_hotspot_species::query(&loc_id)).unwrap())
}

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
    content::Json(serde_json::to_string(&queries::guides::query()).unwrap())
}
