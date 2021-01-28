use rocket::response::content;

#[get("/?<query>")]
pub fn proxy(query: String) -> content::Json<String> {
    let url = format!(
        "https://www.xeno-canto.org/api/2/recordings?query={}",
        query
    );
    let response = reqwest::blocking::get(&url).unwrap().text().unwrap();
    content::Json(response)
}
