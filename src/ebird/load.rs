//! Load eBird API data into the database from JSON files on disk.

use crate::db;
use crate::ebird::get_species_file;
use crate::models;
use crate::utils::{deserialize_json, read_to_string};

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
