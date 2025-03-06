use actix_cors::Cors;
use actix_web::{App, HttpServer, web, middleware::Logger};

use env_logger::Env;

mod config;
mod routes;
mod utils;
mod handlers;


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    let pool = config::connect_db().await;

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:3000") 
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                    .allowed_headers(vec![
                        actix_web::http::header::CONTENT_TYPE,
                        actix_web::http::header::AUTHORIZATION,
                    ]) 
            )
            
            .app_data(web::Data::new(pool.clone()))
            .configure(routes::auth::auth_routes)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
