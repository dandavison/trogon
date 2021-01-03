use crate::db;
use crate::models;
use crate::queries;

use rocket::response::content;

#[get("/sites")]
pub fn sites() -> content::Json<String> {
    let sites: Vec<models::Site> =
        models::serializable(db::get_client().query("select * from site", &[]).unwrap());
    let json = serde_json::to_string(&sites).unwrap();
    content::Json(json)
}

#[get("/trips")]
pub fn trips() -> content::Json<String> {
    content::Json(serde_json::to_string(&queries::trip_with_site_days::query()).unwrap())
}
