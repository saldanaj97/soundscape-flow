// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::player::AudioPlayer;
mod commands;
mod player;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AudioPlayer::new().expect("Failed to init AudioPlayer"))
        .invoke_handler(tauri::generate_handler![
            // Audio player commands
            player::play_sound,
            player::stop_sound,
            player::set_volume,
            player::set_master_volume,
            player::mute_sound,
            player::set_all_playing,
            player::set_all_paused,
            player::reset_all,
            player::load_sound_catalog,
            // Other commands
            commands::mute_all_except,
            commands::apply_mix_settings,
            commands::load_preset,
            commands::save_preset,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
