use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Site {
    id: i32,
    name: String,
    lat: f64,
    lon: f64,
}

impl From<postgres::Row> for Site {
    fn from(row: postgres::Row) -> Self {
        Self {
            id: row.get("id"),
            name: row.get("name"),
            lat: row.get("lat"),
            lon: row.get("lon"),
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
