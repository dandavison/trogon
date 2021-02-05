use serde::{Deserialize, Serialize};

use crate::db;

#[derive(Serialize, Deserialize, Debug)]
pub struct SpeciesImages {
    species: String,
    urls: Vec<String>,
}

pub fn get_images(species: Vec<&str>) -> Vec<SpeciesImages> {
    let mut images = Vec::new();
    for sp in species.iter() {
        images.push(_get_images(sp))
    }
    images
}

fn _get_images(species: &str) -> SpeciesImages {
    let html_url = format!(
        "https://en.wikipedia.org/w/index.php?title={}",
        species.replace(" ", "_")
    );
    let cache_key = format!("scrape:{}", html_url);
    let mut dbclient = db::get_client();
    let img_url = match dbclient
        .query_one("select value from cache where key = $1", &[&cache_key])
        .map(|row| row.get("value"))
    {
        Ok(value) => value,
        Err(_) => {
            let img_url = _scrape_wikipedia_image(&html_url);
            dbclient
                .execute(
                    "insert into cache (key, value) values ($1, $2);",
                    &[&cache_key, &img_url],
                )
                .unwrap();

            img_url
        }
    };
    SpeciesImages {
        species: species.to_string(),
        urls: vec![img_url],
    }
}

fn _scrape_wikipedia_image(html_url: &str) -> String {
    let html = reqwest::blocking::get(html_url).unwrap().text().unwrap();
    let doc = scraper::Html::parse_document(&html);
    let table_selector = scraper::Selector::parse("table.infobox").unwrap();
    let table = doc.select(&table_selector).next().unwrap();
    let img_selector = scraper::Selector::parse("img").unwrap();
    let img = table.select(&img_selector).next().unwrap();
    let mut url = img.value().attr("src").unwrap().to_string();
    if !url.starts_with("http") {
        url = format!("http:{}", url);
    }
    println!("scraped image: {}", &url);
    url
}
