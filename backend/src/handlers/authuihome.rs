use actix_multipart::Multipart;
use actix_web::{web, post, get, delete, put, HttpResponse, HttpRequest};
use futures::StreamExt;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::fs::File;
use std::io::Write;
use std::path::Path;
use crate::utils::random_id::generate_random_id;

#[derive(Debug, Serialize, Deserialize)]
struct ApiResponse {
    message: String,
    navigate: String,
}


#[derive(Debug, Serialize, Deserialize)]
pub struct FormData {
    urutan: String,
    title: String,
    text: String,
    descriptions: Vec<String>,
    posisi: String,
    image_url: Option<String>,
    page: String,
    layout: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct UserInterface {
    id: String,
    title: String,
    text: String,
    description: serde_json::Value,
    image: serde_json::Value,
    page: String,
    layout: String,
    urutan: i32,
    position: String,
    status: bool,
}

#[post("/userinterfaces/post")]
pub async fn post_ui_home_dashboard(
    req: HttpRequest,
    mut payload: Multipart,
    pool: web::Data<sqlx::MySqlPool>,
) -> HttpResponse {
    let role = req.headers().get("Role").and_then(|h| h.to_str().ok());

    if role != Some("Admin") && role != Some("Superadmin") {
        return HttpResponse::Unauthorized().json("Unauthorized: Only Admin or Superadmin can access this endpoint");
    }

    let mut form_data = FormData {
        urutan: "".to_string(),
        title: "".to_string(),
        text: "".to_string(),
        descriptions: vec![],
        posisi: "".to_string(),
        image_url: None,
        page: "".to_string(),
        layout: "".to_string(),
    };

    let mut file_path = None;

    while let Some(item) = payload.next().await {
        match item {
            Ok(mut field) => {
                let content_disposition = field.content_disposition().clone();
                let field_name = content_disposition
                    .as_ref()
                    .and_then(|cd| cd.get_name())
                    .unwrap_or_default()
                    .to_string();

                if field_name == "image_file" {
                    let file_name = format!(
                        "{}_{}_{}.jpg",
                        form_data.page,
                        form_data.layout,
                        generate_random_id(10)
                    );

                    let path = Path::new("media/image").join(&file_name);
                    let mut file = File::create(&path).unwrap();

                    while let Some(chunk) = field.next().await {
                        let data = chunk.unwrap();
                        file.write_all(&data).unwrap();
                    }

                    file_path = Some(format!("http://localhost:8080/media/image/{}", file_name));
                } else {
                    let mut value = Vec::new();
                    while let Some(chunk) = field.next().await {
                        value.extend_from_slice(&chunk.unwrap());
                    }
                    let value = String::from_utf8(value).unwrap();

                    match field_name.as_str() {
                        "urutan" => form_data.urutan = value,
                        "title" => form_data.title = value,
                        "text" => form_data.text = value,
                        "posisi" => form_data.posisi = value,
                        "page" => form_data.page = value,
                        "layout" => form_data.layout = value,
                        "descriptions" => {
                            if let Ok(parsed) = serde_json::from_str::<Vec<String>>(&value) {
                                form_data.descriptions = parsed;
                            } else {
                                form_data.descriptions.push(value);
                            }
                        },
                        "image_url" => form_data.image_url = Some(value),
                        _ => (),
                    }
                }
            }
            Err(e) => return HttpResponse::BadRequest().body(format!("Failed to process field: {}", e)),
        }
    }

    println!("Received Form Data: {:?}", form_data);

    let image = if let Some(ref url) = form_data.image_url {
        serde_json::json!(url)
    } else if let Some(ref path) = file_path {
        serde_json::json!(path)
    } else {
        serde_json::json!(null)
    };

    let id = generate_random_id(20);
    let descriptions = serde_json::to_value(&form_data.descriptions).unwrap();

    let user_interface = UserInterface {
        id,
        title: form_data.title.clone(),
        text: form_data.text.clone(),
        description: descriptions,
        image,
        page: form_data.page.clone(),
        layout: form_data.layout.clone(),
        urutan: form_data.urutan.parse().unwrap_or(0),
        position: form_data.posisi.clone(),
        status: false,
    };

    match sqlx::query("INSERT INTO userinterface (id, title, text, description, image, page, layout, urutan, position, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .bind(&user_interface.id)
        .bind(&user_interface.title)
        .bind(&user_interface.text)
        .bind(&user_interface.description)
        .bind(&user_interface.image)
        .bind(&user_interface.page)
        .bind(&user_interface.layout)
        .bind(&user_interface.urutan)
        .bind(&user_interface.position)
        .bind(&user_interface.status)
        .execute(pool.get_ref())
        .await
    {
        Ok(_) => HttpResponse::Ok().json(ApiResponse {
            message: "Data inserted successfully".to_string(),
            navigate: "/admin/ui/home/dashboard/".to_string(),
        }),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse {
            message: format!("Failed to insert data: {}", e),
            navigate: "".to_string(),
        }),
    }
}

#[get("/userinterfaces/get")]
pub async fn get_ui_home_dashboard(pool: web::Data<sqlx::MySqlPool>) -> HttpResponse {
    match sqlx::query_as::<_, UserInterface>("SELECT * FROM userinterface WHERE page = 'Home' AND layout = 'Dashboard'")
        .fetch_all(pool.get_ref())
        .await
    {
        Ok(data) => HttpResponse::Ok().json(data),
        Err(e) => HttpResponse::InternalServerError().json(format!("Failed to fetch data: {}", e)),
    }
}

#[get("/userinterfaces/get/{id}")]
pub async fn get_ui_home_dashboard_by_id(
    id: web::Path<String>,
    pool: web::Data<sqlx::MySqlPool>,
) -> HttpResponse {
    match sqlx::query_as::<_, UserInterface>("SELECT * FROM userinterface WHERE id = ?")
        .bind(id.into_inner())
        .fetch_one(pool.get_ref())
        .await
    {
        Ok(data) => HttpResponse::Ok().json(data),
        Err(_) => HttpResponse::NotFound().json("Data not found"),
    }
}

#[put("/userinterfaces/update/{id}")]
pub async fn update_ui_home_dashboard(
    req: HttpRequest,
    id: web::Path<String>,
    mut payload: Multipart,
    pool: web::Data<sqlx::MySqlPool>,
) -> HttpResponse {
    let role = req.headers().get("Role").and_then(|h| h.to_str().ok());

    if role != Some("Admin") && role != Some("Superadmin") {
        return HttpResponse::Unauthorized().json("Unauthorized: Only Admin or Superadmin can update data");
    }

    let existing_ui = match sqlx::query!(
        "SELECT image FROM userinterface WHERE id = ?",
        id.clone()
    )
    .fetch_one(pool.get_ref())
    .await
    {
        Ok(result) => result,
        Err(_) => return HttpResponse::NotFound().json("Data tidak ditemukan"),
    };

    let old_image_path = existing_ui.image.unwrap_or_default();

    let mut form_data = FormData {
        urutan: "".to_string(),
        title: "".to_string(),
        text: "".to_string(),
        descriptions: vec![],
        posisi: "".to_string(),
        image_url: None,
        page: "".to_string(),
        layout: "".to_string(),
    };

    let mut file_path = None;

    while let Some(item) = payload.next().await {
        match item {
            Ok(mut field) => {
                let content_disposition = field.content_disposition().clone();
                let field_name = content_disposition
                    .as_ref()
                    .and_then(|cd| cd.get_name())
                    .unwrap_or_default()
                    .to_string();

                if field_name == "image_file" {
                    
                    if !old_image_path.as_str().unwrap_or("").is_empty() {
                        let old_file_path = old_image_path.as_str().unwrap_or("").replace("http://localhost:8080/", "");
                        let old_path = Path::new(&old_file_path);
                        if old_path.exists() {
                            std::fs::remove_file(old_path).unwrap_or_else(|err| {
                                println!("Gagal menghapus file lama: {}", err);
                            });
                        }
                    }

                    let file_name = format!(
                        "{}_{}_{}.jpg",
                        form_data.page,
                        form_data.layout,
                        generate_random_id(10)
                    );

                    let path = Path::new("media/image").join(&file_name);
                    let mut file = File::create(&path).unwrap();

                    while let Some(chunk) = field.next().await {
                        let data = chunk.unwrap();
                        file.write_all(&data).unwrap();
                    }

                    file_path = Some(format!("http://localhost:8080/media/image/{}", file_name));
                } else {
                    let mut value = Vec::new();
                    while let Some(chunk) = field.next().await {
                        value.extend_from_slice(&chunk.unwrap());
                    }
                    let value = String::from_utf8(value).unwrap();

                    match field_name.as_str() {
                        "urutan" => form_data.urutan = value,
                        "title" => form_data.title = value,
                        "text" => form_data.text = value,
                        "position" => form_data.posisi = value,
                        "page" => form_data.page = value,
                        "layout" => form_data.layout = value,
                        "descriptions" => {
                            if let Ok(parsed) = serde_json::from_str::<Vec<String>>(&value) {
                                form_data.descriptions = parsed;
                            } else {
                                form_data.descriptions.push(value);
                            }
                        },
                        "image_url" => form_data.image_url = Some(value),
                        _ => (),
                    }
                }
            }
            Err(e) => return HttpResponse::BadRequest().body(format!("Failed to process field: {}", e)),
        }
    }

    println!("Received Form Data: {:?}", form_data);

    let image = if let Some(ref url) = form_data.image_url {
        serde_json::json!(url)
    } else if let Some(ref path) = file_path {
        serde_json::json!(path)
    } else {
        serde_json::json!(null)
    };

    let descriptions = serde_json::to_value(&form_data.descriptions).unwrap();

    let query_result = sqlx::query!(
        r#"
        UPDATE userinterface 
        SET 
            urutan = ?, 
            title = ?, 
            text = ?, 
            description = ?, 
            image = ?, 
            page = ?, 
            layout = ?, 
            position = ? 
        WHERE id = ?
        "#,
        form_data.urutan,
        form_data.title,
        form_data.text,
        descriptions,
        image,
        form_data.page,
        form_data.layout,
        form_data.posisi,
        id.into_inner()
    )
    .execute(pool.get_ref())
    .await;

    match query_result {
        Ok(_) => HttpResponse::Ok().json(ApiResponse {
            message: "Data Berhasil Diupdate".to_string(),
            navigate: "/admin/ui/home/dashboard/".to_string(),
        }),
        Err(e) => HttpResponse::InternalServerError().json(format!("Failed to update data: {}", e)),
    }
}

#[delete("/userinterfaces/delete/{id}")]
pub async fn delete_ui_home_dashboard(
    req: HttpRequest,
    id: web::Path<String>,
    pool: web::Data<sqlx::MySqlPool>,
) -> HttpResponse {
    let role = req.headers().get("Role").and_then(|h| h.to_str().ok());

    if role != Some("Admin") && role != Some("Superadmin") {
        return HttpResponse::Unauthorized().json("Unauthorized: Only Admin or Superadmin can access this endpoint");
    }

    let id_value = id.clone();
    let query_result = sqlx::query!("SELECT image FROM userinterface WHERE id = ?", id_value)
            .fetch_one(pool.get_ref())
            .await;
    
    match query_result {
        Ok(record) => {
            if let Some(image_url) = record.image {
                if image_url.as_str().is_some() {
                    // Removed unused variable `file_name`
                    let file_name = image_url.as_str().unwrap_or("").replace("http://localhost:8080/media/image/", "");
                    let file_path = Path::new("media/image").join(&file_name);

                    println!("Attempting to delete file: {:?}", file_path);

                    if file_path.exists() {
                        if let Err(e) = std::fs::remove_file(&file_path) {
                            println!("Failed to delete file: {}", e);
                            return HttpResponse::InternalServerError().json(format!("Failed to delete image file: {}", e));
                        } else {
                            println!("File deleted successfully: {:?}", file_path);
                        }
                    } else {
                        println!("File not found: {:?}", file_path);
                    }
                }
            }

            match sqlx::query("DELETE FROM userinterface WHERE id = ?")
                .bind(id.into_inner())
                .execute(pool.get_ref())
                .await
            {
                Ok(_) => HttpResponse::Ok().json(ApiResponse {
                    message: "Data Berhasil Dihapus".to_string(),
                    navigate: "".to_string(),
                }),
                Err(e) => HttpResponse::InternalServerError().json(format!("Failed to delete data: {}", e)),
            }
        }
        Err(e) => HttpResponse::NotFound().json(format!("Data not found: {}", e)),
    }
}
