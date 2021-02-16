use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct EbirdSpecies {
    pub sciName: String,
    pub comName: String,
    pub speciesCode: String,
    pub category: String,
    pub taxonOrder: i32, // FIXME: i32/f64 confusion
    pub order: String,
    pub familyComName: Option<String>,
    pub familySciName: Option<String>,
}

impl From<postgres::Row> for EbirdSpecies {
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

pub fn serializable<Model>(postgres_rows: Vec<postgres::Row>) -> Vec<Model>
where
    Model: From<postgres::Row>,
{
    let mut rows = Vec::new();
    for postgres_row in postgres_rows {
        rows.push(postgres_row.into())
    }
    rows
}
