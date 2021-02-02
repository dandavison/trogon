use rocket::response::content;

use crate::db;

#[get("/?<query>")]
pub fn proxy(query: String) -> content::Json<String> {
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
