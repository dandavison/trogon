use rocket::response::content;
use serde::Serialize;

use crate::db;

#[derive(Serialize)]
struct Status {
    cache_size: i64,
}

#[get("/")]
pub fn status() -> content::Json<String> {
    let mut dbclient = db::get_client();
    let row = dbclient
        .query_one("select count(*) as cache_size from cache", &[])
        .unwrap();
    let cache_size = row.get("cache_size");
    content::Json(serde_json::to_string(&Status { cache_size }).unwrap())
}
