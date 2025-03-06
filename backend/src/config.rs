use sqlx::mysql::MySqlPool;
use std::env;
use dotenv::dotenv;

pub async fn connect_db() -> MySqlPool {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    
    MySqlPool::connect(&database_url)
        .await
        .expect("Failed to connect to database")
}
