use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::path::PathBuf;
use std::fs::File;
use std::io::BufReader;
use rodio::{OutputStream, OutputStreamHandle, Sink, Source};
use rodio::source::SineWave;
use serde::{Deserialize, Serialize};
use tauri::State;

// Sound catalog structures
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SoundItem {
    pub id: u32,
    pub name: String,
    pub filename: String,
    pub category: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SoundCatalog {
    pub categories: HashMap<String, Vec<SoundItem>>,
}

pub struct AudioPlayer {
    _stream: OutputStream,
    stream_handle: OutputStreamHandle,
    sinks: Arc<Mutex<HashMap<u32, Sink>>>,              // Changed to store multiple sinks, one per sound ID
    volumes: Arc<Mutex<HashMap<u32, f32>>>,             // Track volume for each sound
    playing: Arc<Mutex<HashMap<u32, bool>>>,            // Track playback state for each sound
    muted: Arc<Mutex<HashMap<u32, bool>>>,              // Track mute state for each sound
    master_volume: Arc<Mutex<f32>>,                     // Global master volume
    sound_catalog: Arc<Mutex<Option<SoundCatalog>>>,    // Sound catalog loaded from JSON
    sounds_directory: PathBuf,                          // Base directory for sound files
}

unsafe impl Send for AudioPlayer {}
unsafe impl Sync for AudioPlayer {}

impl AudioPlayer {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let (stream, stream_handle) = OutputStream::try_default()?;
        let sounds_directory = PathBuf::from("assets/sounds");

        // Log the sounds directory path
        println!("📂 Using sounds directory: {:?}", sounds_directory);

        // Check if the directory exists
        if sounds_directory.exists() && sounds_directory.is_dir() {
            println!("✓ Sounds directory exists");
        } else {
            println!("❌ Sounds directory does not exist or is not a directory");
        }

        Ok(AudioPlayer {
            _stream: stream,
            stream_handle,
            sinks: Arc::new(Mutex::new(HashMap::new())),
            volumes: Arc::new(Mutex::new(HashMap::new())),
            playing: Arc::new(Mutex::new(HashMap::new())),
            muted: Arc::new(Mutex::new(HashMap::new())),
            master_volume: Arc::new(Mutex::new(1.0)),
            sound_catalog: Arc::new(Mutex::new(None)),
            sounds_directory,
        })
    }

    // Load sound catalog from JSON
    pub fn load_sound_catalog(&self, catalog_path: &str) -> Result<(), String> {
        println!("📂 Looking for catalog at: {}", catalog_path);

        // Check if the file exists
        let catalog_file_path = PathBuf::from(catalog_path);
        if !catalog_file_path.exists() {
            println!("❌ File does not exist at: {:?}", catalog_file_path);
            return Err(format!("File does not exist at: {:?}", catalog_file_path));
        } else {
            println!("✓ File exists at: {:?}", catalog_file_path);
        }

        // Try opening the file
        let file = File::open(&catalog_file_path)
            .map_err(|e| format!("Failed to open catalog file {}: {}", catalog_path, e))?;

        let reader = BufReader::new(file);
        let catalog: SoundCatalog = serde_json::from_reader(reader)
            .map_err(|e| format!("Failed to parse catalog JSON: {}", e))?;

        let mut sound_catalog = self.sound_catalog.lock()
            .map_err(|_| "Failed to acquire catalog lock")?;

        *sound_catalog = Some(catalog);

        println!("✅ Loaded sound catalog from {}", catalog_path);
        Ok(())
    }

    // Get sound file path by ID
    fn get_sound_path(&self, id: u32) -> Result<PathBuf, String> {
        let catalog_guard = self.sound_catalog.lock()
            .map_err(|_| "Failed to acquire catalog lock")?;

        let catalog = catalog_guard.as_ref()
            .ok_or("Sound catalog not loaded")?;

        // Find the sound in all categories
        for sounds in catalog.categories.values() {
            if let Some(sound) = sounds.iter().find(|s| s.id == id) {
                let mut path = self.sounds_directory.clone();
                path.push(&sound.category);
                path.push(&sound.filename);

                // Debug: check if the path exists
                if path.exists() {
                    println!("✅ Sound file exists: {:?}", path);
                } else {
                    println!("❌ Sound file not found: {:?}", path);

                    // Print the sounds directory
                    println!("📂 Sounds directory: {:?}", self.sounds_directory);

                    // Try looking in the current directory
                    let mut alt_path = PathBuf::from("./sounds");
                    alt_path.push(&sound.category);
                    alt_path.push(&sound.filename);

                    if alt_path.exists() {
                        println!("✅ Found sound file at alternate path: {:?}", alt_path);
                        return Ok(alt_path);
                    }
                }

                return Ok(path);
            }
        }

        Err(format!("Sound with ID {} not found in catalog", id))
    }

    pub fn play_sound(&self, id: u32) -> Result<(), String> {
        let mut sinks = self.sinks.lock()
            .map_err(|_| "Failed to acquire sinks lock")?;

        let mut playing = self.playing.lock()
            .map_err(|_| "Failed to acquire playing lock")?;

        // If the sound is already playing, do nothing
        if playing.get(&id).copied().unwrap_or(false) {
            return Ok(());
        }

        // Create a new sink
        let sink = Sink::try_new(&self.stream_handle)
            .map_err(|e| format!("Failed to create sink: {}", e))?;

        // Get current volume settings
        let volumes = self.volumes.lock()
            .map_err(|_| "Failed to acquire volumes lock")?;
        let muted = self.muted.lock()
            .map_err(|_| "Failed to acquire muted lock")?;
        let master_volume = self.master_volume.lock()
            .map_err(|_| "Failed to acquire master volume lock")?;

        let volume = volumes.get(&id).unwrap_or(&0.5);
        let is_muted = muted.get(&id).unwrap_or(&false);
        let final_volume = if *is_muted { 0.0 } else { volume * (*master_volume) };

        // Try to load actual sound file first, fall back to test tone if needed

        let source: Box<dyn Source<Item = f32> + Send> = match self.get_sound_path(id) {
            Ok(path) => {
                match File::open(&path) {
                    Ok(file) => {
                        let buf_reader = BufReader::new(file);
                        match rodio::Decoder::new(buf_reader) {
                            Ok(source) => {
                                println!("🎵 Loaded audio file: {:?}", path);
                                Box::new(
                                    source
                                        .convert_samples::<f32>()
                                        .amplify(final_volume)
                                        .repeat_infinite()
                                )
                            }
                            Err(e) => {
                                println!("⚠️ Failed to decode audio file {:?}: {}", path, e);
                                // Fall back to test tone
                                Box::new(
                                    SineWave::new(100.0 + (id as f32 * 50.0))
                                        .amplify(final_volume)
                                        .repeat_infinite()
                                )
                            }
                        }
                    }
                    Err(e) => {
                        println!("⚠️ Failed to open audio file: {}", e);
                        // Fall back to test tone
                        Box::new(
                            SineWave::new(100.0 + (id as f32 * 50.0))
                                .amplify(final_volume)
                                .repeat_infinite()
                        )
                    }
                }
            }
            Err(e) => {
                println!("⚠️ Sound catalog not loaded or sound not found: {}", e);
                // Fall back to test tone
                Box::new(
                    SineWave::new(100.0 + (id as f32 * 50.0))
                        .amplify(final_volume)
                        .repeat_infinite()
                )
            }
        };

        sink.append(source);
        sinks.insert(id, sink);

        // Update playing state
        playing.insert(id, true);

        println!("▶️ Started sound {} with volume {}", id, final_volume);
        Ok(())
    }

    pub fn stop_sound(&self, id: u32) -> Result<(), String> {
        let mut sinks = self.sinks.lock()
            .map_err(|_| "Failed to acquire sinks lock")?;

        let mut playing = self.playing.lock()
            .map_err(|_| "Failed to acquire playing lock")?;

        if let Some(sink) = sinks.remove(&id) {
            sink.stop();
            playing.insert(id, false);
            println!("⏹️ Stopped sound {}", id);
        }

        Ok(())
    }

    pub fn set_volume(&self, id: u32, volume: f64) -> Result<(), String> {
        let mut volumes = self.volumes.lock()
            .map_err(|_| "Failed to acquire volumes lock")?;

        let volume_f32 = (volume / 100.0) as f32; // Convert 0-100 to 0.0-1.0
        volumes.insert(id, volume_f32);

        // If sound is currently playing, update its volume
        let sinks = self.sinks.lock()
            .map_err(|_| "Failed to acquire sinks lock")?;

        if let Some(sink) = sinks.get(&id) {
            let muted = self.muted.lock()
                .map_err(|_| "Failed to acquire muted lock")?;
            let master_volume = self.master_volume.lock()
                .map_err(|_| "Failed to acquire master volume lock")?;

            let is_muted = muted.get(&id).unwrap_or(&false);
            let final_volume = if *is_muted { 0.0 } else { volume_f32 * (*master_volume) };

            sink.set_volume(final_volume);
            println!("🔊 Set volume for sound {} to {}", id, final_volume);
        }

        Ok(())
    }

    pub fn set_master_volume(&self, volume: f64) -> Result<(), String> {
        let mut master_volume = self.master_volume.lock()
            .map_err(|_| "Failed to acquire master volume lock")?;

        let volume_f32 = (volume / 100.0) as f32;
        *master_volume = volume_f32;

        // Update all currently playing sounds
        let sinks = self.sinks.lock()
            .map_err(|_| "Failed to acquire sinks lock")?;
        let volumes = self.volumes.lock()
            .map_err(|_| "Failed to acquire volumes lock")?;
        let muted = self.muted.lock()
            .map_err(|_| "Failed to acquire muted lock")?;

        for (id, sink) in sinks.iter() {
            let sound_volume = volumes.get(id).unwrap_or(&0.5);
            let is_muted = muted.get(id).unwrap_or(&false);
            let final_volume = if *is_muted { 0.0 } else { sound_volume * volume_f32 };

            sink.set_volume(final_volume);
        }

        println!("🔊 Set master volume to {}", volume_f32);
        Ok(())
    }

    pub fn mute_sound(&self, id: u32, is_muted: bool) -> Result<(), String> {
        let mut muted = self.muted.lock()
            .map_err(|_| "Failed to acquire muted lock")?;

        muted.insert(id, is_muted);

        // If sound is currently playing, update its volume
        let sinks = self.sinks.lock()
            .map_err(|_| "Failed to acquire sinks lock")?;

        if let Some(sink) = sinks.get(&id) {
            let volumes = self.volumes.lock()
                .map_err(|_| "Failed to acquire volumes lock")?;
            let master_volume = self.master_volume.lock()
                .map_err(|_| "Failed to acquire master volume lock")?;

            let sound_volume = volumes.get(&id).unwrap_or(&0.5);
            let final_volume = if is_muted { 0.0 } else { sound_volume * (*master_volume) };

            sink.set_volume(final_volume);
            println!("🔇 {} sound {}", if is_muted { "Muted" } else { "Unmuted" }, id);
        }

        Ok(())
    }

    pub fn set_all_playing(&self) -> Result<(), String> {
        let mut sinks = self.sinks.lock()
            .map_err(|_| "Failed to acquire sinks lock")?;
        let mut playing = self.playing.lock()
            .map_err(|_| "Failed to acquire playing lock")?;

        // Set all sounds to playing
        for (id, sink) in sinks.iter_mut() {
            if !playing.get(id).copied().unwrap_or(false) {
                sink.play();
                playing.insert(*id, true);
                println!("▶️ Set sound {} to playing", id);
            }
        }

        Ok(())
    }

    pub fn set_all_paused(&self) -> Result<(), String> {
        let mut sinks = self.sinks.lock()
            .map_err(|_| "Failed to acquire sinks lock")?;
        let mut playing = self.playing.lock()
            .map_err(|_| "Failed to acquire playing lock")?;

        // Pause all sounds
        for (id, sink) in sinks.iter_mut() {
            if playing.get(id).copied().unwrap_or(false) {
                sink.pause();
                playing.insert(*id, false);
            }
        }

        Ok(())
    }

    pub fn reset_all(&self) -> Result<(), String> {
        // Stop all sounds first
        let mut sinks = self.sinks.lock()
            .map_err(|_| "Failed to acquire sinks lock")?;

        // Properly stop each sink before clearing
        for (id, sink) in sinks.drain() {
            sink.stop();
            println!("⏹️ Stopped sound {} during reset", id);
        }

        // Reset all state
        let mut volumes = self.volumes.lock()
            .map_err(|_| "Failed to acquire volumes lock")?;
        volumes.clear();

        let mut muted = self.muted.lock()
            .map_err(|_| "Failed to acquire muted lock")?;
        muted.clear();

        let mut playing = self.playing.lock()
            .map_err(|_| "Failed to acquire playing lock")?;
        playing.clear();

        // Reset master volume
        let mut master_volume = self.master_volume.lock()
            .map_err(|_| "Failed to acquire master volume lock")?;
        *master_volume = 1.0;

        println!("🔄 Reset all audio settings");
        Ok(())
    }

}
/// Tauri commands that use the AudioPlayer
#[tauri::command]
pub fn play_sound(player: State<AudioPlayer>, id: u32) -> Result<(), String> {
    player.play_sound(id)
}

#[tauri::command]
pub fn stop_sound(player: State<AudioPlayer>, id: u32) -> Result<(), String> {
    player.stop_sound(id)
}

#[tauri::command]
pub fn set_volume(player: State<AudioPlayer>, id: u32, volume: f64) -> Result<(), String> {
    player.set_volume(id, volume)
}

#[tauri::command]
pub fn set_master_volume(player: State<AudioPlayer>, volume: f64) -> Result<(), String> {
    player.set_master_volume(volume)
}

#[tauri::command]
pub fn mute_sound(player: State<AudioPlayer>, id: u32, is_muted: bool) -> Result<(), String> {
    player.mute_sound(id, is_muted)
}

#[tauri::command]
pub fn set_all_playing(player: State<AudioPlayer>) -> Result<(), String> {
    player.set_all_playing()
}

#[tauri::command]
pub fn set_all_paused(player: State<AudioPlayer>) -> Result<(), String> {
    player.set_all_paused()
}

#[tauri::command]
pub fn reset_all(player: State<AudioPlayer>) -> Result<(), String> {
    player.reset_all()
}

#[tauri::command]
pub fn load_sound_catalog(player: State<AudioPlayer>, catalog_path: String) -> Result<(), String> {
    player.load_sound_catalog(&catalog_path)
}
