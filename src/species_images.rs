use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use crate::db;

#[derive(Serialize, Deserialize, Debug)]
pub struct SpeciesImages {
    species: String,
    urls: Vec<String>,
}

pub fn get_images(species: Vec<&str>, cached_only: bool) -> Vec<SpeciesImages> {
    if cached_only {
        get_images_from_cache(species)
    } else {
        get_images_from_cache_or_scraper(species)
    }
}

pub fn fill_cache() {
    let mut dbclient = db::get_client();
    let rows = dbclient
        .query(
            "select sciname from ebird_species where sciname ~ '^[^/ ]+ [^/ ]+$'",
            &[],
        )
        .unwrap();
    let species: Vec<&str> = rows.iter().map(|row| row.get("sciname")).collect();
    get_images_from_cache_or_scraper(species);
}

pub fn get_images_from_cache(species: Vec<&str>) -> Vec<SpeciesImages> {
    let keys2species: HashMap<String, &str> = species
        .into_iter()
        .map(|s| (make_wikipedia_url(s), s))
        .collect();
    let rows: Vec<postgres::Row> = db::get_client()
        .query(
            "select key, value from cache where key = ANY($1)",
            &[&keys2species.keys().collect::<Vec<&String>>()],
        )
        .unwrap();

    rows.iter()
        .map(|row| {
            let key: &str = row.get("key");
            let url: String = row.get("value");
            SpeciesImages {
                species: keys2species.get(key).unwrap().to_string(),
                urls: vec![url],
            }
        })
        .collect()
}

pub fn get_images_from_cache_or_scraper(species: Vec<&str>) -> Vec<SpeciesImages> {
    let mut images = Vec::new();
    for sp in species.iter() {
        images.push(_get_images_for_one_species(sp))
    }
    images
}

fn make_wikipedia_url(species: &str) -> String {
    format!(
        "https://en.wikipedia.org/w/index.php?title={}",
        species.replace(" ", "_")
    )
}

fn _get_images_for_one_species(species: &str) -> SpeciesImages {
    let html_url = make_wikipedia_url(species);
    let mut dbclient = db::get_client();
    let img_url = match dbclient
        .query_one("select value from cache where key = $1", &[&html_url])
        .map(|row| row.get("value"))
    {
        Ok(value) => value,
        Err(_) => {
            let img_url = _scrape_wikipedia_image(&html_url);
            dbclient
                .execute(
                    "insert into cache (key, value) values ($1, $2);",
                    &[&html_url, &img_url],
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
    let response = match reqwest::blocking::get(html_url) {
        Ok(r) => r,
        Err(err) => {
            eprintln!("Error scraping {}: {}", html_url, err);
            return "".to_string();
        }
    };
    let html = match response.text() {
        Ok(h) => h,
        Err(err) => {
            eprintln!("Error scraping {}: {}", html_url, err);
            return "".to_string();
        }
    };
    let doc = scraper::Html::parse_document(&html);
    let table_selector = scraper::Selector::parse("table.infobox").unwrap();
    let table = match doc.select(&table_selector).next() {
        Some(t) => t,
        None => {
            eprintln!("Error scraping {}: table not found in HTML", html_url);
            return "".to_string();
        }
    };
    let img_selector = scraper::Selector::parse("img").unwrap();
    let img = match table.select(&img_selector).next() {
        Some(i) => i,
        None => {
            eprintln!("Error scraping {}: img not found in HTML", html_url);
            return "".to_string();
        }
    };
    let mut url = img.value().attr("src").unwrap().to_string();
    if url.starts_with("//") {
        url = format!("https:{}", url);
    }
    println!("scraped image: {}", &url);
    url
}
