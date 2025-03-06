use actix_web::{post, delete, web, HttpResponse, Responder};
use sqlx::MySqlPool;
use serde::{Deserialize, Serialize};
use log::{info, error};
use bcrypt::verify;
use chrono::{NaiveDateTime, Duration};

use crate::utils::random_id::generate_random_id;

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub username: String, 
    pub password: String,
    pub time: String,
}

#[derive(Deserialize, Debug)]
pub struct LogoutRequest {
    pub access_token: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub id: String,
    pub token: String,
    pub is_superadmin: String,
    pub role: String,
    pub expired: String, 
    pub navigate: String,
    pub message: String,
}


#[derive(Deserialize, Debug)]
pub struct RefreshTokenRequest {
    pub id: String,
    pub token: String,
    pub time: String, 
}

#[derive(Debug, Serialize)]
pub struct RefreshTokenResponse {
    pub id: String,
    pub token: String,
    pub is_superadmin: String,
    pub role: String,
    pub expired: String,
}

#[derive(Debug, Serialize)]
pub struct BadRequestResponse {
    pub message: String,
}

#[post("/login")]
pub async fn login(
    db: web::Data<MySqlPool>,
    form: web::Json<LoginRequest>,
) -> impl Responder {
    info!("Menerima permintaan Login: {:?}", form);

    let user_result = sqlx::query!(
        r#"
        SELECT id, password, role, is_superadmin FROM users WHERE username = ?
        "#,
        form.username
    )
    .fetch_optional(db.get_ref())
    .await;

    let user = match user_result {
        Ok(Some(user)) => user,
        Ok(None) => {
            return HttpResponse::Unauthorized().json(BadRequestResponse{
                message: "Akun belum terdaftar".to_string(),
            });
        }
        Err(_) => {
            return HttpResponse::InternalServerError().json("Terjadi kesalahan saat memeriksa username");
        }
    };

    if !verify(&form.password, &user.password).unwrap_or(false) {
        return HttpResponse::Unauthorized().json(BadRequestResponse{
            message: "Password salah".to_string(),
        });
    }

    let delete_result = sqlx::query!(
        r#"
        DELETE FROM accsestoken WHERE user_id = ?
        "#,
        user.id
    )
    .execute(db.get_ref())
    .await;

    if let Err(e) = delete_result {
        error!("Gagal menghapus token lama: {:?}", e);
        return HttpResponse::InternalServerError().json("Gagal menghapus token lama");
    }

    let token = generate_random_id(32);

    let time_format = "%d/%m/%Y %H:%M";
    let parsed_time = NaiveDateTime::parse_from_str(&form.time, time_format);

    let expired_datetime = match parsed_time {
        Ok(time) => time + Duration::minutes(3),
        Err(_) => {
            error!("Gagal parsing waktu dari NextAuth.js");
            return HttpResponse::BadRequest().json("Format waktu tidak valid");
        }
    };

    let expired_formatted = expired_datetime.format("%Y-%m-%d %H:%M:%S").to_string();

    let insert_result = sqlx::query!(
        r#"
        INSERT INTO accsestoken (id, token, expired, user_id)
        VALUES (?, ?, ?, ?)
        "#,
        generate_random_id(20),
        token,
        expired_formatted,
        user.id
    )
    .execute(db.get_ref())
    .await;

    if let Err(e) = insert_result {
        error!("Gagal menyimpan token: {:?}", e);
        return HttpResponse::InternalServerError().json("Gagal menyimpan token");
    }

    let redirect_url = match user.role.as_deref() {
        Some("superadmin") => "/superadmin",
        Some("admin") => "/admin",
        _ => "/", 
    };

    HttpResponse::Ok().json(LoginResponse {
        id: user.id,
        token,
        is_superadmin: user.is_superadmin.unwrap_or_default(),
        role: user.role.unwrap_or_default(),
        expired: expired_formatted,
        navigate: redirect_url.to_string(), 
        message: "Login Berhasil".to_string(),
    })
}



#[post("/refresh-token")]
pub async fn refresh_token(
    db: web::Data<MySqlPool>,
    form: web::Json<RefreshTokenRequest>,
) -> impl Responder {
    info!("Menerima permintaan Refresh Token: {:?}", form);

    let token_result = sqlx::query!(
        r#"
        SELECT user_id, expired FROM accsestoken WHERE token = ? AND user_id = ?
        "#,
        form.token,
        form.id
    )
    .fetch_one(db.get_ref())
    .await;

    let token_data = match token_result {
        Ok(token) => token,
        Err(_) => return HttpResponse::Unauthorized().json("Token tidak valid"),
    };

    let delete_result = sqlx::query!(
        r#"
        DELETE FROM accsestoken WHERE token = ?
        "#,
        form.token
    )
    .execute(db.get_ref())
    .await;

    if let Err(e) = delete_result {
        error!("Gagal menghapus token lama: {:?}", e);
        return HttpResponse::InternalServerError().json("Gagal menghapus token lama");
    }

    let new_token = generate_random_id(32);
    let expired_datetime = NaiveDateTime::parse_from_str(&form.time, "%d/%m/%Y %H:%M")
        .unwrap() + Duration::minutes(5); 
    let expired_formatted = expired_datetime.format("%Y-%m-%d %H:%M:%S").to_string();

    let insert_result = sqlx::query!(
        r#"
        INSERT INTO accsestoken (id, token, expired, user_id)
        VALUES (?, ?, ?, ?)
        "#,
        generate_random_id(20),
        new_token,
        expired_formatted,
        token_data.user_id
    )
    .execute(db.get_ref())
    .await;

    if let Err(e) = insert_result {
        error!("Gagal menyimpan token baru: {:?}", e);
        return HttpResponse::InternalServerError().json("Gagal menyimpan token baru");
    }

    let user_result = sqlx::query!(
        r#"
        SELECT role, is_superadmin FROM users WHERE id = ?
        "#,
        token_data.user_id
    )
    .fetch_one(db.get_ref())
    .await;

    let user = match user_result {
        Ok(user) => user,
        Err(_) => return HttpResponse::InternalServerError().json("Gagal mengambil data pengguna"),
    };

    HttpResponse::Ok().json(RefreshTokenResponse {
        id: token_data.user_id,
        token: new_token,
        is_superadmin: user.is_superadmin.unwrap_or_else(|| "".to_string()),
        role: user.role.unwrap_or_else(|| "user".to_string()),
        expired: expired_formatted,
    })
}


#[delete("/logout")]
pub async fn logout(
    db: web::Data<MySqlPool>,
    form: web::Json<LogoutRequest>,
) -> impl Responder {
    info!("Menerima permintaan Logout: {:?}", form);

    let delete_result = sqlx::query!(
        r#"
        DELETE FROM accsestoken WHERE token = ?
        "#,
        form.access_token
    )
    .execute(db.get_ref())
    .await;

    match delete_result {
        Ok(result) => {
            if result.rows_affected() > 0 {
                info!("Token berhasil dihapus: {}", form.access_token);
                HttpResponse::Ok().json("Logout berhasil")
            } else {
                info!("Token tidak ditemukan: {}", form.access_token);
                HttpResponse::NotFound().json("Token tidak ditemukan")
            }
        }
        Err(e) => {
            error!("Gagal menghapus token: {:?}", e);
            HttpResponse::InternalServerError().json("Gagal menghapus token")
        }
    }
}