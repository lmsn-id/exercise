use actix_web::{post, web, HttpResponse, Responder};
use sqlx::MySqlPool;
use log::info;
use serde::{Deserialize, Serialize};
use bcrypt::{hash, DEFAULT_COST};

use crate::utils::random_id::generate_random_id;



#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub username: String, 
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct ApiResponse {
    pub status: String,
    pub navigate: String,
    pub message: String,
}

#[post("/register")]
pub async fn register_user(
    db: web::Data<MySqlPool>, 
    form: web::Json<RegisterRequest>,
) -> impl Responder {
    info!("Menerima permintaan pendaftaran: {:?}", form);

    let existing_username = sqlx::query!("SELECT id FROM users WHERE username = ?", form.username)
        .fetch_optional(db.get_ref())
        .await
        .unwrap();

    if existing_username.is_some() {
        return HttpResponse::BadRequest().json(ApiResponse {
            status: "error".to_string(),
            message: "Username Sudah Terdaftar".to_string(),
            navigate: "".to_string(),
        });
    }

    let existing_email = sqlx::query!("SELECT id FROM users WHERE email = ?", form.email)
        .fetch_optional(db.get_ref())
        .await
        .unwrap();

    if existing_email.is_some() {
        return HttpResponse::BadRequest().json(ApiResponse {
            status: "error".to_string(),
            message: "Email Sudah Terdaftar".to_string(),
            navigate: "".to_string(),
        });
    }

    let user_id = generate_random_id(20);

    let hashed_password = match hash(&form.password, DEFAULT_COST) {
        Ok(hp) => hp,
        Err(_) => return HttpResponse::InternalServerError().json(ApiResponse {
            status: "error".to_string(),
            message: "Error hashing password".to_string(),
            navigate: "".to_string(),
        }),
    };

    let result = sqlx::query!(
        "INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)",
        user_id,
        form.username,
        form.email,
        hashed_password
    )
    .execute(db.get_ref())
    .await;

    match result {
        Ok(_) => {
            let response = ApiResponse {
                status: "success".to_string(),
                message: format!("User {} registered successfully", form.username),
                navigate: "/auth/login".to_string(),
            };
            info!("User {:?} registered successfully", form.username);
            HttpResponse::Ok().json(response)
        }
        Err(e) => {
            let response = ApiResponse {
                status: "error".to_string(),
                message: format!("Failed to register user: {:?}", e),
                navigate: "".to_string(),
            };
            info!("Failed to register user: {:?}", e);
            HttpResponse::InternalServerError().json(response)
        }
    }
}