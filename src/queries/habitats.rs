//! A query returning an array of habitats, each with a nested array of image urls.
use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use crate::db;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Habitat {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub images: Vec<String>,
}

impl From<postgres::Row> for Habitat {
    fn from(row: postgres::Row) -> Self {
        Self {
            id: row.get("id"),
            name: row.get("name"),
            description: row.get("description"),
            images: row.get("images"),
        }
    }
}

pub fn query() -> Vec<Habitat> {
    db::get_client()
        .query(
            "
select h.id, h.name, h.description, array_remove(array_agg(i.url), null) as images
from habitat h
left outer join image i ON i.habitat = h.id
group by h.id
",
            &[],
        )
        .unwrap()
        .into_iter()
        .map(|row| row.into())
        .collect()
}

pub fn lookup_table() -> HashMap<i32, Habitat> {
    query().into_iter().map(|h| (h.id, h)).collect()
}
