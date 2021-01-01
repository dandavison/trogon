use serde::{Deserialize, Serialize};

use crate::db;

#[derive(Serialize, Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct Row {
    pub day: i32,
    pub name: String,
}

pub fn query(trip_id: i32) -> Vec<Row> {
    db::get_client()
        .query(
            "
select tsd.day as day, s.name as name
from trip_site_day as tsd
inner join trip as t on tsd.trip = t.id
inner join site as s on tsd.site = s.id
where t.id = $1
order by tsd.day
",
            &[&trip_id],
        )
        .unwrap()
        .into_iter()
        .map(|row| row.into())
        .collect()
}

impl From<postgres::Row> for Row {
    fn from(row: postgres::Row) -> Self {
        Self {
            day: row.get("day"),
            name: row.get("name"),
        }
    }
}
