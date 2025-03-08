use actix_web::{dev::ServiceRequest, Error};
use actix_web_httpauth::extractors::bearer::BearerAuth;
use std::env;

pub async fn api_key_validator(req: ServiceRequest, credentials: BearerAuth) -> Result<ServiceRequest, Error> {
    let api_key = env::var("API_Key").expect("API_Key must be set");
    
    if credentials.token() == api_key {
        Ok(req)
    } else {
        Err(actix_web::error::ErrorUnauthorized("Invalid API Key"))
    }
}