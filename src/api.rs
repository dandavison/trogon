use crate::queries;
use crate::species_images;

use rocket::response::content;

#[get("/ebird-hotspots")]
pub fn ebird_hotspots() -> content::Json<String> {
    content::Json(serde_json::to_string(&queries::ebird_hotspots::query()).unwrap())
}

#[get("/ebird-hotspot-species/<loc_id>")]
pub fn ebird_hotspot_species(loc_id: String) -> content::Json<String> {
    content::Json(serde_json::to_string(&queries::ebird_hotspot_species::query(&loc_id)).unwrap())
}

#[get("/sites")]
pub fn sites() -> content::Json<String> {
    content::Json(serde_json::to_string(&queries::sites::query()).unwrap())
}

#[get("/trips")]
pub fn trips() -> content::Json<String> {
    content::Json(serde_json::to_string(&queries::trips::query()).unwrap())
}

#[get("/guides")]
pub fn guides() -> content::Json<String> {
    content::Json(serde_json::to_string(&queries::guides::query()).unwrap())
}

/// Fetch EbirdSpecies given comma-separated ebird species codes
#[get("/ebird-species?<species_codes>")]
pub fn ebird_species(species_codes: String) -> content::Json<String> {
    let species_codes = species_codes.split(",").collect();
    content::Json(serde_json::to_string(&queries::ebird_species::query(species_codes)).unwrap())
}

/// Fetch images given comma-separated species scientific names
#[get("/species-image-urls?<species>")]
pub fn species_images(species: String) -> content::Json<String> {
    content::Json(
        serde_json::to_string(&species_images::get_images(
            species.split(",").map(String::from).collect(),
        ))
        .unwrap(),
    )
}
