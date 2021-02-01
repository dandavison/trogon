use serde::{Deserialize, Serialize};

use crate::db;
use crate::ebird;

#[derive(Serialize, Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct Row {
    pub sciName: String,
    pub comName: String,
    pub speciesCode: String,
    pub category: String,
    pub taxonOrder: i32,
    pub order: String,
    pub familyComName: String,
    pub familySciName: String,
    pub images: Vec<String>,
}

pub fn query(loc_id: &str) -> Vec<Row> {
    let mut dbclient = db::get_client();
    if dbclient
        .query_one(
            "select locId from ebird_hotspot_species where locId = $1 limit 1",
            &[&loc_id],
        )
        .is_err()
    {
        // loc_id has no species cached locally
        if let Err(_) = ebird::fetch_and_load_hotspot_species(&loc_id) {
            eprintln!("Failed to fetch and load hotspot species: {}", loc_id);
            return vec![];
        }
    }
    dbclient
        .query(
            "
select es.sciName, es.comName, es.speciesCode, es.category, es.taxonOrder, es._order, es.familyComName, es.familySciName, si.url
from ebird_species es
inner join ebird_hotspot_species ehs on es.speciesCode = ehs.species
inner join species_image si on es.speciesCode = si.speciesCode
where ehs.locId = $1",
            &[&loc_id],
        )
        .unwrap()
        .into_iter()
        .map(|row| row.into())
        .collect()
}

impl From<postgres::Row> for Row {
    fn from(row: postgres::Row) -> Self {
        Self {
            sciName: row.get("sciName"),
            comName: row.get("comName"),
            speciesCode: row.get("speciesCode"),
            category: row.get("category"),
            taxonOrder: row.get("taxonOrder"),
            order: row.get("_order"),
            familyComName: row.get("familyComName"),
            familySciName: row.get("familySciName"),
            images: vec![row.get("url")],
        }
    }
}
