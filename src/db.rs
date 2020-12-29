pub fn get_client() -> postgres::Client {
    postgres::Client::connect("host=localhost user=dan dbname=sylph", postgres::NoTls).unwrap()
}
