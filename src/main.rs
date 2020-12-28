#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

use rocket::response::content;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/json")]
fn json() -> content::Json<&'static str> {
    content::Json(r#"{ "hi": "world" }"#)
}

fn main() {
    rocket::ignite().mount("/", routes![index, json]).launch();
}
