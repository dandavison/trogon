use crate::db;
use crate::models;

pub fn query(species_codes: Vec<&str>) -> Vec<models::EbirdSpecies> {
    models::serializable(
        db::get_client()
            .query(
                "select * from ebird_species es where es.speciescode = ANY($1)",
                &[&species_codes],
            )
            .unwrap(),
    )
}
