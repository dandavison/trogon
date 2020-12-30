use serde::{Deserialize, Serialize};

use crate::db;

#[derive(Serialize, Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct Row {
    pub locId: String,
    pub locName: String,
    pub lat: f64,
    pub lng: f64,
    pub n_species: i64,
}

pub fn query() -> Vec<Row> {
    db::get_client()
        .query(
            "
select eh.locId, eh.locName, eh.lat, eh.lng, count(*) as n_species
from ebird_hotspot eh
inner join ebird_hotspot_species ehs on ehs.locId = eh.locId
group by eh.locId",
            &[],
        )
        .unwrap()
        .into_iter()
        .map(|row| row.into())
        .collect()
}

impl From<postgres::Row> for Row {
    fn from(row: postgres::Row) -> Self {
        Self {
            locId: row.get("locId"),
            locName: row.get("locName"),
            lat: row.get("lat"),
            lng: row.get("lng"),
            n_species: row.get("n_species"),
        }
    }
}
