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
pub struct Guide {
    id: i32,
    name: String,
    trip_guide: bool,
    biography: Option<String>,
}

impl From<postgres::Row> for Guide {
    fn from(row: postgres::Row) -> Self {
        Self {
            id: row.get("id"),
            name: row.get("name"),
            trip_guide: row.get("trip_guide"),
            biography: row.get("biography"),
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
            locId: row.get("locId"),
            locName: row.get("locName"),
            countryCode: row.get("countryCode"),
            subnational1Code: row.get("subnational1Code"),
            lat: row.get("lat"),
            lng: row.get("lng"),
            latestObsDt: row.get("latestObsDt"),
            numSpeciesAllTime: row.get("numSpeciesAllTime"),
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

#[derive(Serialize, Deserialize, Debug)]
pub struct Trip {
    pub id: i32,
    pub name: String,
}

impl From<postgres::Row> for Trip {
    fn from(row: postgres::Row) -> Self {
        Self {
            id: row.get("id"),
            name: row.get("name"),
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TripSiteDay {
    pub id: i32,
    pub trip: i32,
    pub site: i32,
    pub day: i32,
}

impl From<postgres::Row> for TripSiteDay {
    fn from(row: postgres::Row) -> Self {
        Self {
            id: row.get("id"),
            trip: row.get("trip"),
            site: row.get("site"),
            day: row.get("day"),
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
