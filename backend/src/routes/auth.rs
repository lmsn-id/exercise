
use actix_web::web;
use actix_web_httpauth::middleware::HttpAuthentication;

use crate::routes::middlewares::api_key_validator;

use crate::handlers::authregister;
use crate::handlers::authlogin;
use crate::handlers::authuihome;

pub fn auth_routes(cfg: &mut web::ServiceConfig) {
    let auth = HttpAuthentication::bearer(api_key_validator);
    cfg.service(
        web::scope("/api/auth") 
            .wrap(auth) 
            .service(authregister::register_user)
            .service(authlogin::login)
            .service(authlogin::logout)
            .service(authlogin::refresh_token)
            .service(authuihome::post_ui_home_dashboard)
            .service(authuihome::get_ui_home_dashboard)
            .service(authuihome::delete_ui_home_dashboard)
    );
}