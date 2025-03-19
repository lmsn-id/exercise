use actix_cors::Cors;
use actix_web::{App, HttpServer, web, middleware::Logger, HttpRequest, HttpResponse};
use env_logger::Env;
use std::path::PathBuf;

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
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
                    .allowed_headers(vec![
                        actix_web::http::header::CONTENT_TYPE,
                        actix_web::http::header::AUTHORIZATION,
                        "Token".parse().unwrap(),
                        "Role".parse().unwrap(),
                    ])
                    .supports_credentials()
            )
            .app_data(web::Data::new(pool.clone()))
            .configure(routes::auth::auth_routes)
            .route("/media/image/{filename}", web::get().to(serve_image))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}

async fn serve_image(req: HttpRequest) -> HttpResponse {
    let filename: PathBuf = req.match_info().query("filename").parse().unwrap();
    let file_path = PathBuf::from("media/image").join(filename);

    if file_path.exists() {
        HttpResponse::Ok()
            .content_type("image/jpeg") 
            .body(std::fs::read(file_path).unwrap())
    } else {
        HttpResponse::NotFound().body("File not found")
    }
}