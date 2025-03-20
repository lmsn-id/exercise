use actix_web::{web, put, HttpResponse};
use serde_json::json;
use serde::{Deserialize, Serialize};
use sqlx::MySqlPool;

#[derive(Debug, Serialize, Deserialize)]
struct StatusUpdate {
    status: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct ApiResponse {
    message: String,
}

#[put("/userinterfaces/status/{id}")]
pub async fn update_ui_status(
    pool: web::Data<MySqlPool>,
    id: web::Path<String>,
    status: web::Json<StatusUpdate>,
) -> HttpResponse {
    let id_value = id.into_inner();
    let new_status = status.status;

    println!("Received request to update status for id: {}", id_value);
    println!("New status: {}", new_status);

    let mut tx = match pool.begin().await {
        Ok(tx) => tx,
        Err(e) => {
            println!("Failed to begin transaction: {}", e);
            return HttpResponse::InternalServerError()
                .json(json!({ "message": "Failed to start transaction" }));
        }
    };

    let item_result = sqlx::query!(
        "SELECT page, layout, urutan FROM userinterface WHERE id = ?",
        id_value
    )
    .fetch_one(&mut *tx)
    .await;

    let item = match item_result {
        Ok(item) => item,
        Err(e) => {
            println!("Failed to fetch item: {}", e);
            return HttpResponse::InternalServerError()
                .json(json!({ "message": "Failed to fetch item" }));
        }
    };

    if new_status {
        let active_item_result = sqlx::query!(
            "SELECT id FROM userinterface WHERE page = ? AND layout = ? AND urutan = ? AND status = true",
            item.page,
            item.layout,
            item.urutan
        )
        .fetch_optional(&mut *tx)
        .await;

        if let Ok(Some(existing_item)) = active_item_result {
            println!(
                "Cannot activate item. Another item '{}' is already active.",
                existing_item.id
            );
            return HttpResponse::BadRequest().json(json!({
                "message": "Item lain sudah aktif untuk page, layout, dengan urutan yang sama."
            }));
        }
    }

    match sqlx::query("UPDATE userinterface SET status = ? WHERE id = ?")
        .bind(new_status)
        .bind(&id_value)
        .execute(&mut *tx)
        .await
    {
        Ok(_) => {
            if let Err(e) = tx.commit().await {
                println!("Failed to commit transaction: {}", e);
                return HttpResponse::InternalServerError()
                    .json(json!({ "message": "Failed to commit transaction" }));
            }

            println!("Successfully updated status for item with id: {}", id_value);
            HttpResponse::Ok().json(json!(ApiResponse {
                message: format!("Successfully updated status ")
            }))
        }
        Err(e) => {
            println!("Failed to update status: {}", e);
            HttpResponse::InternalServerError()
                .json(json!({ "message": "Failed to update status" }))
        }
    }
}
