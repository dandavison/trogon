use crate::db;
use crate::models;

pub fn query() -> Vec<models::EbirdHotspot> {
    models::serializable(
        db::get_client()
            .query("select * from ebird_hotspot", &[])
            .unwrap(),
    )
}
