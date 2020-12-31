#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

mod db;
mod ebird;
mod models;
mod queries;

use std::process;

use rocket_contrib::templates::Template;
use serde::Serialize;
use structopt::clap::AppSettings::{ColorAlways, ColoredHelp, DeriveDisplayOrder};
use structopt::StructOpt;

#[derive(Serialize)]
struct MapContext {
    sites: Vec<models::Site>,
    ebird_hotspots: Vec<queries::ebird_hotspot_with_species_count::Row>,
}

#[get("/map")]
fn map() -> Template {
    let sites = db::get_client().query("select * from site", &[]).unwrap();
    Template::render(
        "map",
        MapContext {
            sites: models::serializable(sites),
            ebird_hotspots: queries::ebird_hotspot_with_species_count::query(),
        },
    )
}

#[derive(Serialize)]
struct SiteContext {
    site: models::Site,
    guides: Vec<models::Guide>,
}

#[get("/site/<id>")]
fn site(id: i32) -> Template {
    let mut dbclient = db::get_client();
    let site: models::Site = dbclient
        .query("select * from site where id = $1", &[&id])
        .unwrap()
        .remove(0)
        .into();
    let guides = dbclient
        .query(
            "
select * from guide g
inner join site_guide sg on sg.guide = g.id
where sg.site = $1
",
            &[&id],
        )
        .unwrap();
    Template::render(
        "site",
        SiteContext {
            site,
            guides: models::serializable(guides),
        },
    )
}

#[derive(Serialize)]
struct EbirdHotspotContext {
    hotspot: models::EbirdHotspot,
    species: Vec<models::EbirdSpecies>,
}

#[get("/hotspot/<loc_id>")]
fn ebird_hotspot(loc_id: String) -> Template {
    let mut dbclient = db::get_client();
    let context = EbirdHotspotContext {
        hotspot: dbclient
            .query_one(
                "
select * from ebird_hotspot where locId = $1
",
                &[&loc_id],
            )
            .unwrap()
            .into(),
        species: models::serializable(
            dbclient
                .query(
                    "
select * from ebird_species es
inner join ebird_hotspot_species ehs on ehs.species = es.speciesCode
where ehs.locId = $1
",
                    &[&loc_id],
                )
                .unwrap(),
        ),
    };
    Template::render("ebird_hotspot", context)
}

#[derive(Serialize)]
struct TripContext {
    trip: models::Trip,
}

#[get("/trip/<trip_id>")]
fn trip(trip_id: i32) -> Template {
    let mut dbclient = db::get_client();
    let context = TripContext {
        trip: dbclient
            .query_one(
                "
select * from trip where id = $1
",
                &[&trip_id],
            )
            .unwrap()
            .into(),
    };
    Template::render("trip", context)
}

#[derive(StructOpt)]
#[structopt(
    name = "sylph",
    setting(ColorAlways),
    setting(ColoredHelp),
    setting(DeriveDisplayOrder)
)]
struct Opt {
    #[structopt(long, name = "EBIRD_REGION_CODE")]
    fetch_ebird_hotspots: Option<String>,

    #[structopt(long)]
    fetch_ebird_hotspot_species: bool,

    #[structopt(long)]
    fetch_ebird_species: bool,

    #[structopt(long)]
    load_ebird_hotspots: bool,

    #[structopt(long)]
    load_ebird_species: bool,

    #[structopt(long)]
    load_ebird_hotspot_species: bool,
}

fn main() -> std::io::Result<()> {
    let opt = Opt::from_args();
    if let Some(region) = opt.fetch_ebird_hotspots {
        process::exit(ebird::fetch::fetch_hotspots(region)?)
    } else if opt.fetch_ebird_hotspot_species {
        process::exit(ebird::fetch::fetch_hotspot_species()?)
    } else if opt.fetch_ebird_species {
        process::exit(ebird::fetch::fetch_species()?)
    } else if opt.load_ebird_hotspots {
        process::exit(ebird::load::load_hotspots()?)
    } else if opt.load_ebird_hotspot_species {
        process::exit(ebird::load::load_hotspot_species()?)
    } else if opt.load_ebird_species {
        process::exit(ebird::load::load_species()?)
    } else {
        rocket::ignite()
            .mount("/", routes![map, site, ebird_hotspot, trip])
            .attach(Template::fairing())
            .launch();
    }
    Ok(())
}
