use std::path::PathBuf;

use reqwest::Method;
use rocket::response::content;

use crate::db;
use crate::ebird::get_ebird_api_token;

// TODO: make the URL parser blindly take everything after /ebird/, i.e. the route (with multiple
// segments) and any query params.
#[get("/ebird/<route..>?<lat>&<lng>&<fmt>")]
pub fn ebird(route: PathBuf, lat: f32, lng: f32, fmt: String) -> content::Json<String> {
    let url = format!(
        "https://api.ebird.org/v2/{}?lat={}&lng={}&fmt={}",
        route.to_str().unwrap(),
        lat,
        lng,
        fmt
    );
    let mut dbclient = db::get_client();
    let text = match dbclient
        .query_one("select value from cache where key = $1", &[&url])
        .map(|row| row.get("value"))
    {
        Ok(value) => value,
        Err(_) => {
            let response = match reqwest::blocking::Client::new()
                .request(Method::GET, &url)
                .header("X-eBirdApiToken", get_ebird_api_token())
                .send()
            {
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

#[get("/xeno-canto?<query>")]
pub fn xeno_canto(query: String) -> content::Json<String> {
    let url = format!(
        "https://www.xeno-canto.org/api/2/recordings?query={}",
        query
    );
    let mut dbclient = db::get_client();
    let text = match dbclient
        .query_one("select value from cache where key = $1", &[&url])
        .map(|row| row.get("value"))
    {
        Ok(value) => value,
        Err(_) => {
            let response = match reqwest::blocking::get(&url) {
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
