pub fn get_client() -> postgres::Client {
    postgres::Client::connect("host=localhost user=catherine dbname=sylph", postgres::NoTls).unwrap()
}
