use std::io::Write;
use std::path::PathBuf;
use std::process;

pub struct DatabaseConnection {}

impl DatabaseConnection {
    pub fn new() -> Self {
        DatabaseConnection {}
    }

    pub fn send_query(self, query: &str) -> String {
        // https://doc.rust-lang.org/std/process/index.html
        let mut psql_process = process::Command::new(PathBuf::from("psql"))
            .args(&["-d", "sylph"])
            .stdin(process::Stdio::piped())
            .stdout(process::Stdio::piped())
            .spawn()
            .unwrap();
        psql_process
            .stdin
            .as_mut()
            .unwrap()
            .write(query.as_bytes())
            .unwrap();
        String::from_utf8(psql_process.wait_with_output().unwrap().stdout).unwrap()
    }
}
