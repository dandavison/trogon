//! Fetch data from the eBird API, cache it on disk, and load it into the database.
pub mod fetch;
pub mod load;

use std::env;
use std::fs::{self, File};
use std::io::{BufReader, BufWriter};
use std::path::PathBuf;
use std::process;

fn get_data_directory() -> String {
    env::var("SYLPH_DATA_DIR").unwrap_or("data".to_string())
}

fn get_ebird_api_token() -> String {
    env::var("EBIRD_API_TOKEN").unwrap_or_else(|_| {
        eprintln!("EBIRD_API_TOKEN environment variable is not set.");
        std::process::exit(1);
    })
}

fn get_species_file() -> PathBuf {
    PathBuf::from(format!("{}/ebird/species.json", get_data_directory()))
}

fn get_hotspots_file(ebird_region_code: &str) -> PathBuf {
    PathBuf::from(format!(
        "{}/ebird/hotspots/{}.json",
        get_data_directory(),
        ebird_region_code
    ))
}

fn get_reader(path: &PathBuf) -> BufReader<File> {
    let file = File::open(path).unwrap_or_else(|err| {
        eprintln!("Error opening file for reading: {:?}: {}", path, err);
        process::exit(1);
    });
    BufReader::new(file)
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
