use std::collections::HashMap;
use std::path::PathBuf;

use reqwest::Method;
use rocket::response::content;

use crate::db;

#[derive(Debug)]
pub struct Query<'q> {
    params: Vec<&'q str>,
}

impl<'q> rocket::request::FromQuery<'q> for Query<'q> {
    type Error = ();

    fn from_query(query: rocket::request::Query<'q>) -> Result<Self, Self::Error> {
        Ok(Query {
            params: query.map(|param| param.raw.as_str()).collect(),
        })
    }
}

pub fn get_ebird_api_token() -> String {
    std::env::var("EBIRD_API_TOKEN").unwrap_or_else(|_| {
        eprintln!("EBIRD_API_TOKEN environment variable is not set.");
        std::process::exit(1);
    })
}

#[get("/ebird/<path..>?<query..>")]
pub fn ebird(path: PathBuf, query: Query) -> content::Json<String> {
    let url = format!(
        "https://api.ebird.org/{}?{}",
        path.to_str().unwrap(),
        query.params.join("&")
    );
    fetch_json_with_caching(
        &url,
        vec![("X-eBirdApiToken", get_ebird_api_token().as_str())]
            .into_iter()
            .collect(),
    )
}

#[get("/xeno-canto/<path..>?<query>")]
pub fn xeno_canto(path: PathBuf, query: String) -> content::Json<String> {
    let url = make_xeno_canto_url(path.to_str().unwrap(), &query);
    fetch_json_with_caching(&url, HashMap::new())
}

#[get("/xeno-canto-cached/<path..>?<queries>")]
pub fn xeno_canto_cached(path: PathBuf, queries: String) -> content::Json<String> {
    let url2query: HashMap<String, &str> = queries
        .split(",")
        .map(|q| (make_xeno_canto_url(path.to_str().unwrap(), q), q))
        .collect();
    let rows: Vec<postgres::Row> = db::get_client()
        .query(
            "select key, value from cache where key = ANY($1)",
            &[&url2query.keys().collect::<Vec<&String>>()],
        )
        .unwrap();
    let mut query2doc: HashMap<&str, String> = HashMap::new();
    for row in rows {
        let url: &str = row.get("key");
        let query: &str = url2query.get(url).unwrap();
        let doc: String = row.get("value");
        query2doc.insert(query, doc);
    }
    content::Json(serde_json::to_string(&query2doc).unwrap())
}

fn make_xeno_canto_url(path: &str, query: &str) -> String {
    format!("https://www.xeno-canto.org/api/{}?query={}", path, query)
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
