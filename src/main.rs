#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

mod db;

use std::collections::HashMap;

use rocket::response::content;
use rocket_contrib::templates::Template;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/map")]
fn map() -> Template {
    let mut context = HashMap::<&str, f64>::new();
    let rows = db::get_client()
        .query("select lat, lon from site where name = 'Villa Azul'", &[])
        .unwrap();
    context.insert("lat", rows[0].get("lat"));
    context.insert("lon", rows[0].get("lon"));
    Template::render("map", context)
}

#[get("/vue")]
fn vue() -> content::Html<&'static str> {
    content::Html(
        r#"<!DOCTYPE html>
<html>
<head>
  <title>My first Vue app</title>
  <script src="https://unpkg.com/vue"></script>
</head>
<body>
  <div id="app">
    {{ message }}
  </div>

  <script>
    var app = new Vue({
      el: '#app',
      data: {
        message: 'Hello Vue!'
      }
    })
  </script>
</body>
</html>
"#,
    )
}

#[get("/json")]
fn json() -> content::Json<&'static str> {
    content::Json(r#"{ "hi": "world" }"#)
}

fn main() {
    rocket::ignite()
        .mount("/", routes![index, json, map, vue])
        .attach(Template::fairing())
        .launch();
}
