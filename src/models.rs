use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Site {
    id: i32,
    name: String,
    lat: f64,
    lng: f64,
}

impl From<postgres::Row> for Site {
    fn from(row: postgres::Row) -> Self {
        Self {
            id: row.get("id"),
            name: row.get("name"),
            lat: row.get("lat"),
            lng: row.get("lon"),
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct EbirdHotspot {
    pub locId: String,
    pub locName: String,
    pub countryCode: String,
    pub subnational1Code: String,
    pub lat: f64,
    pub lng: f64,
    pub latestObsDt: Option<String>,
    pub numSpeciesAllTime: Option<i32>,
}

impl From<postgres::Row> for EbirdHotspot {
    fn from(row: postgres::Row) -> Self {
        Self {
            locId: row.try_get("locId").unwrap_or("".to_string()),
            locName: row.try_get("locName").unwrap_or("".to_string()),
            countryCode: row.try_get("countryCode").unwrap_or("".to_string()),
            subnational1Code: row.try_get("subnational1Code").unwrap_or("".to_string()),
            lat: row.try_get("lat").unwrap_or(-360.0),
            lng: row.try_get("lng").unwrap_or(-360.0),
            latestObsDt: row.try_get("latestObsDt").unwrap_or(None),
            numSpeciesAllTime: row.try_get("numSpeciesAllTime").unwrap_or(None),
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct EbirdSpecies {
    pub sciName: String,
    pub comName: String,
    pub speciesCode: String,
    pub category: String,
    pub taxonOrder: f64, // FIXME this should be an integer type
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
