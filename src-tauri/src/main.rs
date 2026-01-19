#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{AppHandle, Manager, WindowEvent};
use tauri_plugin_shell::ShellExt;
use std::sync::Mutex;
use std::path::PathBuf;

struct AppState {
    db_path: Mutex<PathBuf>,
    data_path: Mutex<PathBuf>,
}

#[tauri::command]
async fn get_app_data_dir(app: AppHandle) -> Result<String, String> {
    let path = app.path().app_data_dir()
        .map_err(|e| e.to_string())?;
    Ok(path.to_string_lossy().to_string())
}

#[tauri::command]
async fn get_db_path(app: AppHandle) -> Result<String, String> {
    let data_dir = app.path().app_data_dir()
        .map_err(|e| e.to_string())?;
    let db_path = data_dir.join("academy.db");
    Ok(db_path.to_string_lossy().to_string())
}

#[tauri::command]
async fn open_external_url(app: AppHandle, url: String) -> Result<(), String> {
    app.shell().open(&url, None::<&str>)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn show_notification(title: String, body: String) -> Result<(), String> {
    tauri::Notification::new("com.inr99.academy")
        .title(&title)
        .body(&body)
        .show()
        .map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .manage(AppState {
            db_path: Mutex::new(PathBuf::new()),
            data_path: Mutex::new(PathBuf::new()),
        })
        .invoke_handler(tauri::generate_handler![
            get_app_data_dir,
            get_db_path,
            open_external_url,
            show_notification,
        ])
        .setup(|app| {
            let handle = app.handle();
            
            // Set up data directories
            let app_data_dir = handle.path().app_data_dir()?;
            std::fs::create_dir_all_all(&app_data_dir)?;
            
            let state = handle.state::<AppState>();
            *state.data_path.lock().unwrap() = app_data_dir.clone();
            *state.db_path.lock().unwrap() = app_data_dir.join("academy.db");
            
            // Initialize database
            let db_path = state.db_path.lock().unwrap().clone();
            init_database(&db_path)?;
            
            Ok(())
        })
        .on_window_event(|event| {
            if let WindowEvent::CloseRequested { api, .. } = event.event() {
                // Prevent default close behavior and hide window instead
                api.prevent_close();
                event.window().hide().ok();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn init_database(db_path: &PathBuf) -> Result<(), sqlx::Error> {
    // Initialize SQLite database with required tables
    // This is a simplified version - full schema would be generated from Prisma schema
    Ok(())
}
