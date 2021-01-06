use std::env;

pub fn get_client() -> postgres::Client {
    postgres::Client::connect(
        &format!(
            "host=localhost user={} dbname=sylph",
            env::var("USER").unwrap()
        ),
        postgres::NoTls,
    )
    .unwrap()
}
