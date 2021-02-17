pub mod load;

use std::path::PathBuf;

fn get_species_file() -> PathBuf {
    PathBuf::from("data/ebird/species.json")
}
