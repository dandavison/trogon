//! Fetch data from the eBird API, cache it on disk, and load it into the database.
pub mod fetch;
pub mod load;

use serde::Deserialize;

use std::env;
use std::fs::{self, File};
use std::io::{BufWriter, Read};
use std::path::PathBuf;
use std::process;

fn get_data_directory() -> String {
    env::var("SYLPH_DATA_DIR").unwrap_or_else(|_| "data".to_string())
}

pub fn get_ebird_api_token() -> String {
    env::var("EBIRD_API_TOKEN").unwrap_or_else(|_| {
        eprintln!("EBIRD_API_TOKEN environment variable is not set.");
        std::process::exit(1);
    })
}

fn get_species_file() -> PathBuf {
    PathBuf::from(format!("{}/ebird/species.json", get_data_directory()))
}

fn get_species_images_file() -> PathBuf {
    PathBuf::from(format!(
        "{}/ebird/species_images.json",
        get_data_directory()
    ))
}

fn get_hotspots_file(ebird_region_code: &str) -> PathBuf {
    PathBuf::from(format!(
        "{}/ebird/hotspots/{}.json",
        get_data_directory(),
        ebird_region_code
    ))
}

fn read_to_string(path: &PathBuf) -> String {
    let mut file = File::open(path).unwrap_or_else(|err| {
        eprintln!("Error opening file for reading: {:?}: {}", path, err);
        process::exit(1);
    });
    let mut s = String::new();
    file.read_to_string(&mut s).unwrap();
    s
}

fn deserialize_json<'a, T>(json: &'a str) -> Option<T>
where
    T: Deserialize<'a>,
{
    if json.is_empty() {
        None
    } else {
        Some(serde_json::from_str(&json).unwrap())
    }
}

fn get_writer(path: &PathBuf) -> BufWriter<File> {
    fs::create_dir_all(path.parent().unwrap()).unwrap_or_else(|err| {
        eprintln!(
            "Failed to create parent directories for: {:?}: {}",
            path, err
        );
        process::exit(1);
    });
    let file = File::create(path).unwrap_or_else(|err| {
        eprintln!("Error opening file for writing: {:?}: {}", path, err);
        process::exit(1);
    });
    BufWriter::new(file)
}

pub fn fetch_and_load_hotspot_species(loc_id: &str) -> std::io::Result<i32> {
    println!("fetch_and_load_hotspot_species: {}", loc_id);
    fetch::fetch_hotspots(&loc_id)?;
    load::load_hotspots()?;
    fetch::fetch_hotspot_species()?;
    load::load_hotspot_species()?;
    Ok(0)
}
