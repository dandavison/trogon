import json
import sys
import time
from functools import partial

import requests
from bs4 import BeautifulSoup


def fetch_image_url(query):
    response = requests.get(f"https://en.wikipedia.org/w/index.php?title={query}")
    response.raise_for_status()
    html = response.content
    soup = BeautifulSoup(html, features="html5lib")
    image_url = soup.select_one("table.infobox").select_one("img")["src"]
    if not image_url.startswith("http"):
        image_url = "http:" + image_url
    return image_url


if __name__ == "__main__":
    with open("data/ebird/species_images.json") as f:
        urls = json.load(f)
    for sciname in json.loads(sys.stdin.read()):
        genus, species = sciname.split()
        try:
            sys.stderr.write(sciname + "\n")
            urls.append({
                "genus": genus,
                "species": species,
                "image": fetch_image_url(f"{genus}_{species}"),
            })
        except Exception as exc:
            sys.stderr.write(f"{exc.__class__.__name__}: {exc}\n")
    with open("data/ebird/species_images.json", "w") as f:
        json.dump(urls, f, indent=2)
