use tauri::Wry;

mod commands;

#[tauri::command]
pub async fn get_app_version() -> Result<String, String> {
    Ok(env!("CARGO_PKG_VERSION").to_string())
}

#[tauri::command]
pub async fn platform_info() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "os": std::env::consts::OS,
        "arch": std::env::consts::ARCH,
        "family": std::env::consts::FAMILY,
    }))
}

#[tauri::command]
pub async fn restart_app(app: tauri::Window<Wry>) -> Result<(), String> {
    app.restart();
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_database_path,
            commands::execute_database_query,
            commands::check_network_status,
            commands::sync_data,
            commands::download_content,
            get_app_version,
            platform_info,
            restart_app,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
