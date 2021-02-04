use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct SpeciesImage {
    species: String,
    urls: Vec<String>,
}

pub fn get_images(species: Vec<&str>) -> Vec<SpeciesImage> {
    let mut urls = Vec::new();
    for sp in species.iter() {
        urls.push(SpeciesImage {
            species: sp.to_string(),
            urls: get_images_for_one_species(sp),
        })
    }
    urls
}

fn get_images_for_one_species(species: &str) -> Vec<String> {
    let html_url = format!(
        "https://en.wikipedia.org/w/index.php?title={}",
        species.replace(" ", "_")
    );
    let html = reqwest::blocking::get(&html_url).unwrap().text().unwrap();
    let doc = scraper::Html::parse_document(&html);
    let table_selector = scraper::Selector::parse("table.infobox").unwrap();
    let table = doc.select(&table_selector).next().unwrap();
    let img_selector = scraper::Selector::parse("img").unwrap();
    let img = table.select(&img_selector).next().unwrap();
    let mut url = img.value().attr("src").unwrap().to_string();
    if !url.starts_with("http") {
        url = format!("http:{}", url);
    }
    vec![url]
}
