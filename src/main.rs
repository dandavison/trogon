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

#[get("/site/<id>")]
fn site(id: i32) -> Template {
    let site: models::Site = db::get_client()
        .query("select * from site where id = $1", &[&id])
        .unwrap()
        .remove(0)
        .into();
    Template::render("site", site)
}

fn main() {
    rocket::ignite()
        .mount("/", routes![map, site])
        .attach(Template::fairing())
        .launch();
}
