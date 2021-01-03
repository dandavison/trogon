//! Fetch JSON data from the eBird API and write it to disk.
use std::path::PathBuf;

use reqwest::Method;

use crate::db;
use crate::ebird::{get_ebird_api_token, get_hotspots_file, get_species_file, get_writer};
use crate::models;

/// Fetch the hotspots for `region` from the eBird API and write them to $SYLPH_DATA_DIR/ebird/hotspots.
/// SYLPH_DATA_DIR defaults to "data/" if it is not set as an environment variable.
pub fn fetch_hotspots(ebird_region_code: String) -> std::io::Result<i32> {
    let url = format!(
        "https://api.ebird.org/v2/ref/hotspot/{}?fmt=json",
        ebird_region_code
    );
    let hotspots = reqwest::blocking::get(&url)
        .unwrap()
        .json::<Vec<models::EbirdHotspot>>()
        .unwrap();
    let writer = get_writer(&get_hotspots_file(&ebird_region_code));
    serde_json::to_writer(writer, &hotspots)?;
    println!(
        "Fetched {} hotspots for {}",
        hotspots.len(),
        ebird_region_code
    );
    Ok(0)
}

/// For every ebird hotspot in the database, if the species list doesn't already exist on disk,
/// fetch it from the eBird API and write it to disk.
pub fn fetch_hotspot_species() -> std::io::Result<i32> {
    let mut dbclient = db::get_client();
    for row in dbclient
        .query("select locId from ebird_hotspot", &[])
        .unwrap()
    {
        let loc_id: String = row.get("locId");
        let path = PathBuf::from(&format!("data/ebird/hotspot-species/{}.json", loc_id));
        if !path.exists() {
            println!("Fetching species for locId: {}", loc_id);
            let writer = get_writer(&path);
            serde_json::to_writer(writer, &_fetch_hotspot_species(row.get("locId")))?;
        }
    }
    Ok(0)
}

fn _fetch_hotspot_species(loc_id: &str) -> Vec<String> {
    let url = format!("https://api.ebird.org/v2/product/spplist/{}", loc_id);
    reqwest::blocking::Client::new()
        .request(Method::GET, &url)
        .header("X-eBirdApiToken", get_ebird_api_token())
        .send()
        .unwrap()
        .json::<Vec<String>>()
        .unwrap()
}

/// Fetch the full eBird species "taxonomy" and write it to $SYLPH_DATA_DIR/ebird/species.json.
/// SYLPH_DATA_DIR defaults to "data/" if it is not set as an environment variable.
pub fn fetch_species() -> std::io::Result<i32> {
    let url = "https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json".to_string();
    let species = reqwest::blocking::Client::new()
        .request(Method::GET, &url)
        .header("X-eBirdApiToken", get_ebird_api_token())
        .send()
        .unwrap()
        .json::<Vec<models::EbirdSpecies>>()
        .unwrap();
    let writer = get_writer(&get_species_file());
    serde_json::to_writer(writer, &species)?;
    println!("Fetched {} species", species.len());
    Ok(0)
}
