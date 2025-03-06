use rand::{thread_rng, Rng}; 
use rand::distributions::Alphanumeric;

pub fn generate_random_id(length: usize) -> String {
    let rng = thread_rng(); 
    rng.sample_iter(&Alphanumeric)
        .map(char::from)
        .take(length)
        .collect()
}