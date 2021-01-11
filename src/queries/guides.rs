//! A query returning an array of guides, each with a nested array of image urls.
use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use crate::db;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Guide {
    pub id: i32,
    pub name: String,
    pub trip_guide: bool,
    pub description: Option<String>,
    pub images: Vec<String>,
}

impl From<postgres::Row> for Guide {
    fn from(row: postgres::Row) -> Self {
        Self {
            id: row.get("id"),
            name: row.get("name"),
            trip_guide: row.get("trip_guide"),
            description: row.get("description"),
            images: row.get("images"),
        }
    }
}

pub fn query() -> Vec<Guide> {
    db::get_client()
        .query(
            "
select g.id, g.name, g.trip_guide, g.description, array_remove(array_agg(i.url), null) as images
from guide g
left outer join image i ON i.guide = g.id
group by g.id
",
            &[],
        )
        .unwrap()
        .into_iter()
        .map(|row| row.into())
        .collect()
}

pub fn lookup_table() -> HashMap<i32, Guide> {
    query().into_iter().map(|h| (h.id, h)).collect()
}
