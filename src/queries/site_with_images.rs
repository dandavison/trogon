//! A query returning an array of sites, each with a nested array of image urls.
use serde::{Deserialize, Serialize};

use crate::db;

#[derive(Serialize, Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct Site {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub lat: f64,
    pub lng: f64,
    pub images: Vec<String>,
}

impl From<postgres::Row> for Site {
    fn from(row: postgres::Row) -> Self {
        Self {
            id: row.get("id"),
            name: row.get("name"),
            description: row.get("description"),
            lat: row.get("lat"),
            lng: row.get("lng"),
            images: row.get("images"),
        }
    }
}

pub fn query() -> Vec<Site> {
    db::get_client()
        .query(
            "
select s.id, s.name, s.description, s.lat, s.lng, array_remove(array_agg(image.url), null) as images
from site s
left outer join image ON image.site = s.id
group by s.id
",
            &[],
        )
        .unwrap()
        .into_iter()
        .map(|row| row.into())
        .collect()
}
