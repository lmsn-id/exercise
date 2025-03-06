use actix_web::web;

use crate::handlers::authregister;
use crate::handlers::authlogin;


pub fn auth_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/auth") 
            .service(authregister::register_user)
            .service(authlogin::login)
            .service(authlogin::logout)
            .service(authlogin::refresh_token)

    );
}
