use serde::{Deserialize, Serialize};

use crate::db;

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
}

pub fn query(loc_id: String) -> Vec<Row> {
    db::get_client()
        .query(
            "
select sciName, comName, speciesCode, category, taxonOrder, _order, familyComName, familySciName
from ebird_species es
inner join ebird_hotspot_species ehs on es.speciesCode = ehs.species
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
        }
    }
}
