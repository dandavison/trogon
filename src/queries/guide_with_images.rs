//! A query returning an array of sites, each with a nested array of image urls.
use serde::{Deserialize, Serialize};

use crate::db;

#[derive(Serialize, Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct Guide {
    id: i32,
    name: String,
    trip_guide: bool,
    biography: Option<String>,
    pub images: Vec<String>,
}

impl From<postgres::Row> for Guide {
    fn from(row: postgres::Row) -> Self {
        Self {
            id: row.get("id"),
            name: row.get("name"),
            trip_guide: row.get("trip_guide"),
            biography: row.get("biography"),
            images: row.get("images"),
        }
    }
}

pub fn query() -> Vec<Guide> {
    db::get_client()
        .query(
            "
select g.id, g.name, g.trip_guide, g.biography, array_remove(array_agg(image.url), null) as images
from guide g
left outer join image ON image.guide = g.id
group by g.id
",
            &[],
        )
        .unwrap()
        .into_iter()
        .map(|row| row.into())
        .collect()
}
