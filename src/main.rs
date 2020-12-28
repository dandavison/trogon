#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

mod db;

use rocket::response::content;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
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

#[get("/query")]
fn query() -> String {
    // FIXME: connection should persist across requests!
    db::DatabaseConnection::new().send_query(
        "select sg.name
from site_guide as sg
inner join site_day_guide as sdg on sdg.site_guide = sg.id
where sdg.day = 2;
",
    )
}

fn main() {
    rocket::ignite()
        .mount("/", routes![index, vue, json, query])
        .launch();
}
