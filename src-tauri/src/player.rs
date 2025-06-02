use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use rodio::{OutputStream, OutputStreamHandle, Sink, Source};
use rodio::source::SineWave;
use tauri::State;

pub struct AudioPlayer {
    _stream: OutputStream,
    stream_handle: OutputStreamHandle,
    sinks: Arc<Mutex<HashMap<u32, Sink>>>,     // Changed to store multiple sinks, one per sound ID
    volumes: Arc<Mutex<HashMap<u32, f32>>>,    // Track volume for each sound
    playing: Arc<Mutex<HashMap<u32, bool>>>,   // Track playback state for each sound
    muted: Arc<Mutex<HashMap<u32, bool>>>,     // Track mute state for each sound
    master_volume: Arc<Mutex<f32>>,            // Global master volume
}

unsafe impl Send for AudioPlayer {}
unsafe impl Sync for AudioPlayer {}

impl AudioPlayer {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let (stream, stream_handle) = OutputStream::try_default()?;

        Ok(AudioPlayer {
            _stream: stream,
            stream_handle,
            sinks: Arc::new(Mutex::new(HashMap::new())),
            volumes: Arc::new(Mutex::new(HashMap::new())),
            playing: Arc::new(Mutex::new(HashMap::new())),
            muted: Arc::new(Mutex::new(HashMap::new())),
            master_volume: Arc::new(Mutex::new(1.0)),
        })
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

        // Create a looping test tone for now
        // TODO: Replace with actual sound files
        let source = SineWave::new(100.0 + (id as f32 * 50.0)) // Different frequency per sound
            .amplify(final_volume)
            .repeat_infinite();

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