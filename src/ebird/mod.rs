pub mod load;

use serde::Deserialize;

use std::fs::File;
use std::io::Read;
use std::path::PathBuf;
use std::process;

fn get_species_file() -> PathBuf {
    PathBuf::from("data/ebird/species.json")
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
