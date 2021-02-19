#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

use rocket::response::content;
use rocket::response::NamedFile;
use rocket_contrib::serve::StaticFiles;
use structopt::clap::AppSettings::{ColorAlways, ColoredHelp, DeriveDisplayOrder};
use structopt::StructOpt;

mod api;
mod cors;
mod db;
mod ebird;
mod models;
mod proxy;
mod queries;
mod species_images;
mod status;
mod utils;

#[derive(StructOpt)]
#[structopt(
    name = "trogon",
    setting(ColorAlways),
    setting(ColoredHelp),
    setting(DeriveDisplayOrder)
)]
struct Opt {
    #[structopt(long)]
    load_ebird_species: bool,

    #[structopt(long)]
    fetch_species_images: bool,
}

fn main() -> std::io::Result<()> {
    let opt = Opt::from_args();
    if opt.load_ebird_species {
        std::process::exit(ebird::load::load_species()?)
    } else if opt.fetch_species_images {
        species_images::fill_cache();
    } else {
        rocket::ignite()
            .mount("/api", routes![api::ebird_species, api::species_images])
            .mount(
                "/proxy",
                routes![proxy::ebird, proxy::xeno_canto, proxy::xeno_canto_cached],
            )
            .mount("/challenge", routes![ui])
            .mount("/status", routes![status::status])
            .mount("/", StaticFiles::from("ui/dist"))
            .attach(cors::CORS())
            .launch();
    }
    Ok(())
}

#[rocket::get("/")]
pub fn ui() -> content::Html<Option<NamedFile>> {
    content::Html(NamedFile::open("ui/dist/index.html").ok())
}
