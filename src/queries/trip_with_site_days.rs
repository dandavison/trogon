//! A query returning an array of trips, each with a nested array of site days.
use serde::{Deserialize, Serialize};

use crate::db;
use crate::models;

#[derive(Serialize, Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct SiteDay {
    pub day: i32,
    pub site: models::Site,
}

#[derive(Serialize, Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct Trip {
    pub id: i32,
    pub name: String,
    pub days: Vec<SiteDay>,
}

pub fn query() -> Vec<Trip> {
    // Receive flat data from postgres and nest it.
    let postgres_rows = db::get_client()
        .query(
            "
select t.id as trip_id, t.name as trip_name, tsd.day,
       s.id as site_id, s.name as site_name, s.lat as site_lat, s.lng as site_lng
from trip_site_day tsd
inner join trip t on t.id = tsd.trip
inner join site s on s.id = tsd.site
order by t.id, tsd.day
",
            &[],
        )
        .unwrap();

    let mut trips = Vec::<Trip>::new();
    let mut days = Vec::<SiteDay>::new();
    let mut prev_trip_id = 0;
    let mut trip_name: String = "".to_string();
    for postgres_row in &postgres_rows {
        let trip_id: i32 = postgres_row.get("trip_id");
        trip_name = postgres_row.get("trip_name");
        if prev_trip_id > 0 && trip_id != prev_trip_id {
            trips.push(Trip {
                id: trip_id,
                name: trip_name.clone(),
                days,
            });
            days = Vec::<SiteDay>::new();
        } else {
            days.push(SiteDay {
                day: postgres_row.get("day"),
                site: models::Site {
                    id: postgres_row.get("site_id"),
                    name: postgres_row.get("site_name"),
                    lat: postgres_row.get("site_lat"),
                    lng: postgres_row.get("site_lng"),
                },
            });
        }
        prev_trip_id = trip_id;
    }
    if !postgres_rows.is_empty() {
        trips.push(Trip {
            id: prev_trip_id,
            name: trip_name,
            days,
        })
    };
    trips
}
