#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

mod db;
mod models;

use std::collections::HashMap;

use rocket_contrib::templates::Template;

#[get("/map")]
fn map() -> Template {
    let rows = db::get_client().query("select * from site", &[]).unwrap();
    let mut context = HashMap::<&str, Vec<models::Site>>::new();
    context.insert("sites", models::serializable(rows));
    Template::render("map", context)
}

fn main() {
    rocket::ignite()
        .mount("/", routes![map])
        .attach(Template::fairing())
        .launch();
}
