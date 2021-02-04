use std::collections::HashMap;

use reqwest::Method;
use rocket::response::content;

use crate::db;
use crate::ebird::get_ebird_api_token;

// TODO: make the URL parser blindly take everything after /ebird/, i.e. the route (with multiple
// segments) and any query params.
#[get("/ebird/ref/hotspot/geo?<lat>&<lng>&<fmt>")]
pub fn ebird_ref_hotspot_geo(lat: f32, lng: f32, fmt: String) -> content::Json<String> {
    let url = format!(
        "https://api.ebird.org/v2/ref/hotspot/geo?lat={}&lng={}&fmt={}",
        lat, lng, fmt
    );
    fetch_json_with_caching(
        &url,
        vec![("X-eBirdApiToken", get_ebird_api_token().as_str())]
            .into_iter()
            .collect(),
    )
}

#[get("/ebird/product/spplist/<loc_id>?<fmt>")]
pub fn ebird_product_spplist(loc_id: String, fmt: String) -> content::Json<String> {
    let url = format!(
        "https://api.ebird.org/v2/product/spplist/{}?fmt={}",
        loc_id, fmt
    );
    fetch_json_with_caching(
        &url,
        vec![("X-eBirdApiToken", get_ebird_api_token().as_str())]
            .into_iter()
            .collect(),
    )
}

#[get("/xeno-canto?<query>")]
pub fn xeno_canto(query: String) -> content::Json<String> {
    let url = format!(
        "https://www.xeno-canto.org/api/2/recordings?query={}",
        query
    );
    fetch_json_with_caching(&url, HashMap::new())
}

// TODO: check we are only caching 200 responses
fn fetch_json_with_caching(url: &str, headers: HashMap<&str, &str>) -> content::Json<String> {
    let mut dbclient = db::get_client();
    let text = match dbclient
        .query_one("select value from cache where key = $1", &[&url])
        .map(|row| row.get("value"))
    {
        Ok(value) => value,
        Err(_) => {
            let mut request = reqwest::blocking::Client::new().request(Method::GET, url);
            for (key, val) in headers {
                request = request.header(key, val)
            }
            let response = match request.send() {
                Ok(response) => response,
                Err(err) => {
                    eprintln!("Error in HTTP GET {}: {}", url, err);
                    return content::Json("null".to_string());
                }
            };
            let text = response.text().unwrap();
            dbclient
                .execute(
                    "insert into cache (key, value) values ($1, $2);",
                    &[&url, &text],
                )
                .unwrap();
            text
        }
    };
    content::Json(text)
}
