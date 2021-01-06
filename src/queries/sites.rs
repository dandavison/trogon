//! A query returning an array of sites, each with a nested array of image urls.
use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use crate::db;
use crate::models;

#[derive(Serialize, Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct Site {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub lat: f64,
    pub lng: f64,
    pub guides: Vec<models::Guide>,
    pub habitats: Vec<models::Habitat>,
    pub images: Vec<String>,
}

pub fn query() -> Vec<Site> {
    let guides = make_guides_lookup_table();
    let habitats = make_habitats_lookup_table();
    let mut sites = Vec::<Site>::new();
    for row in db::get_client()
        .query(
            "
select s.id, s.name, s.description, s.lat, s.lng,
       array_remove(array_agg(distinct g.id), null) as guides,
       array_remove(array_agg(distinct h.id), null) as habitats,
       array_remove(array_agg(distinct i.url), null) as images
from site s
left outer join image i on i.site = s.id
left outer join site_guide sg on sg.site = s.id
left outer join guide g on g.id = sg.guide
left outer join site_habitat sh on sh.site = s.id
left outer join habitat h on h.id = sh.habitat
group by s.id;
",
            &[],
        )
        .unwrap()
    {
        let guide_ids: Vec<i32> = row.get("guides");
        let habitat_ids: Vec<i32> = row.get("habitats");
        sites.push(Site {
            id: row.get("id"),
            name: row.get("name"),
            description: row.get("description"),
            lat: row.get("lat"),
            lng: row.get("lng"),
            guides: guide_ids
                .iter()
                .map(|id| guides.get(id).unwrap())
                .map(|x| (*x).clone())
                .collect(),
            habitats: habitat_ids
                .iter()
                .map(|id| habitats.get(id).unwrap())
                .map(|x| (*x).clone())
                .collect(),
            images: row.get("images"),
        })
    }
    sites
}

fn make_guides_lookup_table() -> HashMap<i32, models::Guide> {
    // Fetch all guides to use as a lookup table.
    // TODO: do this in one query.
    let guides: Vec<models::Guide> =
        models::serializable(db::get_client().query("select * from guide", &[]).unwrap());

    guides.into_iter().map(|guide| (guide.id, guide)).collect()
}

fn make_habitats_lookup_table() -> HashMap<i32, models::Habitat> {
    // Fetch all habitats to use as a lookup table.
    // TODO: do this in one query.
    let habitats: Vec<models::Habitat> = models::serializable(
        db::get_client()
            .query("select * from habitat", &[])
            .unwrap(),
    );

    habitats
        .into_iter()
        .map(|habitat| (habitat.id, habitat))
        .collect()
}
