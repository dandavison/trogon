use crate::queries;
use crate::species_images;

use rocket::response::content;

#[get("/ebird-species?<species_codes>")]
pub fn ebird_species(species_codes: String) -> content::Json<String> {
    let species_codes = species_codes.split(",").collect();
    content::Json(serde_json::to_string(&queries::ebird_species::query(species_codes)).unwrap())
}

/// Fetch images given comma-separated species scientific names
#[get("/species-image-urls?<species>&<cached_only>")]
pub fn species_images(species: String, cached_only: bool) -> content::Json<String> {
    content::Json(
        serde_json::to_string(&species_images::get_images(
            species.split(",").collect(),
            cached_only,
        ))
        .unwrap(),
    )
}
