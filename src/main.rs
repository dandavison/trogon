#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

use rocket::response::content;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/html")]
fn html() -> content::Html<&'static str> {
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
        .mount("/", routes![index, html, json])
        .launch();
}
