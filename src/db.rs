use std::env;

pub fn get_client() -> postgres::Client {
    postgres::Client::connect(&env::var("TROGON_DB").unwrap(), postgres::NoTls).unwrap()
}
