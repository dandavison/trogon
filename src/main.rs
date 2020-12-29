#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

mod db;

use std::collections::HashMap;

use rocket_contrib::templates::Template;

#[get("/map")]
fn map() -> Template {
    let mut context = HashMap::<&str, Vec<(String, f64, f64, i32)>>::new();
    let rows = db::get_client()
        .query(
            "select id, name, lat, lon from site where name = 'Villa Azul'",
            &[],
        )
        .unwrap();
    context.insert(
        "sites",
        vec![(
            rows[0].get("name"),
            rows[0].get("lat"),
            rows[0].get("lon"),
            rows[0].get("id"),
        )],
    );
    Template::render("map", context)
}

fn main() {
    rocket::ignite()
        .mount("/", routes![map])
        .attach(Template::fairing())
        .launch();
}
