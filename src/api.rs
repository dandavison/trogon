use crate::db;
use crate::models;

use rocket::response::content;

#[get("/sites")]
pub fn sites() -> content::Json<String> {
    let sites: Vec<models::Site> =
        models::serializable(db::get_client().query("select * from site", &[]).unwrap());
    let json = serde_json::to_string(&sites).unwrap();
    content::Json(json)
}
