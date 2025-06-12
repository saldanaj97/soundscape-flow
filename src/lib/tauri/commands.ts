import { invoke } from "@tauri-apps/api/core";

// Audio player commands
export const playSound = (id: number): Promise<void> =>
  invoke("play_sound", { id });

export const stopSound = (id: number): Promise<void> =>
  invoke("stop_sound", { id });

export const setVolume = (id: number, volume: number): Promise<void> =>
  invoke("set_volume", { id, volume });

export const setMasterVolume = (volume: number): Promise<void> =>
  invoke("set_master_volume", { volume });

export const muteSound = (id: number, isMuted: boolean): Promise<void> =>
  invoke("mute_sound", { id, isMuted });

export const setAllPlaying = (): Promise<void> => invoke("set_all_playing");

export const setAllPaused = (): Promise<void> => invoke("set_all_paused");

export const resetAll = (): Promise<void> => invoke("reset_all");

// Sound catalog commands
export const loadSoundCatalog = (catalogPath: string): Promise<void> =>
  invoke("load_sound_catalog", { catalogPath });

// Other commands
export const muteAllExcept = (id: number): Promise<void> =>
  invoke("mute_all_except", { id });

export const applyMixSettings = (
  mixLevels: Record<number, number>,
): Promise<void> => invoke("apply_mix_settings", { mixLevels });

export const loadPreset = (presetName: string): Promise<void> =>
  invoke("load_preset", { presetName });

export const savePreset = (name: string): Promise<void> =>
  invoke("save_preset", { name });
