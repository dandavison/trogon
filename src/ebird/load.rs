//! Load eBird API data into the database from JSON files on disk.
use std::collections::HashSet;
use std::fs;
use std::path::PathBuf;

use crate::db;
use crate::ebird::{deserialize_json, get_data_directory, get_species_file, read_to_string};
use crate::models;

pub fn load_hotspots() -> std::io::Result<i32> {
    let dir = PathBuf::from(format!("{}/ebird/hotspots", get_data_directory()));
    assert!(dir.is_dir());
    let mut existing_loc_ids = HashSet::<String>::new();
    for row in db::get_client()
        .query("select locId from ebird_hotspot;", &[])
        .unwrap()
    {
        existing_loc_ids.insert(row.get("locId"));
    }
    for entry in fs::read_dir(dir)? {
        _load_hotspots(entry?.path(), &existing_loc_ids)?;
    }
    Ok(0)
}

pub fn _load_hotspots(path: PathBuf, existing_loc_ids: &HashSet<String>) -> std::io::Result<i32> {
    let hotspots: Vec<models::EbirdHotspot> =
        deserialize_json(&read_to_string(&path)).unwrap_or_default();
    let mut dbclient = db::get_client();
    let mut n_loaded = 0;
    for hotspot in &hotspots {
        if existing_loc_ids.contains(&hotspot.locId) {
            continue;
        }
        let _ = dbclient
            .execute(
                "
insert into ebird_hotspot
(locId, locName, countryCode, subnational1Code, lat, lng, latestObsDt, numSpeciesAllTime)
values ($1, $2, $3, $4, $5, $6, $7, $8);",
                &[
                    &hotspot.locId,
                    &hotspot.locName,
                    &hotspot.countryCode,
                    &hotspot.subnational1Code,
                    &hotspot.lat,
                    &hotspot.lng,
                    &hotspot.latestObsDt,
                    &hotspot.numSpeciesAllTime,
                ],
            )
            .unwrap_or_else(|err| {
                eprintln!("error: {:?}", err);
                n_loaded -= 1;
                1
            });
        n_loaded += 1;
    }
    println!(
        "Loaded {}/{} hotspots from {:?}",
        n_loaded,
        hotspots.len(),
        path
    );
    Ok(0)
}

pub fn load_hotspot_species() -> std::io::Result<i32> {
    let dir = PathBuf::from(format!("{}/ebird/hotspot-species", get_data_directory()));
    assert!(dir.is_dir());
    for entry in fs::read_dir(dir)? {
        _load_hotspot_species(entry?.path())?;
    }
    Ok(0)
}

pub fn _load_hotspot_species(path: PathBuf) -> std::io::Result<i32> {
    let loc_id = path.file_stem().unwrap().to_str().unwrap();
    let species: Vec<String> = deserialize_json(&read_to_string(&path)).unwrap_or_default();
    let mut dbclient = db::get_client();
    let mut n_loaded = 0;
    for sp in &species {
        let _ = dbclient
            .execute(
                "
insert into ebird_hotspot_species
(species, locId)
values ($1, $2);",
                &[&sp, &loc_id],
            )
            .unwrap_or_else(|err| {
                eprintln!("error: {:?}", err);
                n_loaded -= 1;
                1
            });
        n_loaded += 1;
    }
    println!(
        "Loaded {}/{} species for {} from {:?}",
        n_loaded,
        species.len(),
        loc_id,
        path
    );
    Ok(0)
}

pub fn load_species() -> std::io::Result<i32> {
    let species: Vec<models::EbirdSpecies> =
        deserialize_json(&read_to_string(&get_species_file())).unwrap_or_default();
    let mut dbclient = db::get_client();
    let mut n_loaded = 0;
    for sp in &species {
        let _ = dbclient
            .execute(
                "
insert into ebird_species
(sciName, comName, speciesCode, category, taxonOrder, _order, familyComName, familySciName)
values
($1, $2, $3, $4, $5, $6, $7, $8);",
                &[
                    &sp.sciName,
                    &sp.comName,
                    &sp.speciesCode,
                    &sp.category,
                    &(sp.taxonOrder as i32), // FIXME why are we using a float type in the Rust model?
                    &sp.order,
                    &sp.familyComName,
                    &sp.familySciName,
                ],
            )
            .unwrap_or_else(|err| {
                eprintln!("error: {:?}", err);
                n_loaded -= 1;
                1
            });
        n_loaded += 1;
    }
    println!("Loaded {}/{} species", n_loaded, species.len());
    Ok(0)
}
