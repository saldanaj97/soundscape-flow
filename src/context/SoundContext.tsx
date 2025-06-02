"use client";

import { SoundState } from "@/types/sounds.types";
import { invoke } from "@tauri-apps/api/core";
import React, { createContext, useContext } from "react";

type SoundContextType = {
  sounds: SoundState[];
  dispatch: React.Dispatch<SoundAction>;
};

// Action types for sound state management
type SoundAction =
  // Playback Control Actions
  | { type: "PLAY_SOUND"; id: number }
  | { type: "STOP_SOUND"; id: number }
  | { type: "SET_ALL_PLAYING" }
  | { type: "SET_ALL_PAUSED" }

  // Volume Control Actions
  | { type: "SET_VOLUME"; id: number; volume: number }
  | { type: "SET_MASTER_VOLUME"; volume: number }

  // Mute Control Actions
  | { type: "MUTE_SOUND"; id: number; isMuted: boolean }
  | { type: "MUTE_ALL_EXCEPT"; id: number }

  // Mix & Preset Actions
  | { type: "APPLY_MIX_SETTINGS"; mixLevels: Record<number, number> }
  | { type: "LOAD_PRESET"; preset: SoundState[] }
  | { type: "SAVE_PRESET"; name: string }

  // Selection Actions
  | { type: "SELECT_SOUND"; id: number }
  | { type: "DESELECT_SOUND"; id: number }
  | { type: "SELECT_ALL_SOUNDS" }
  | { type: "DESELECT_ALL_SOUNDS" }

  // System Actions
  | { type: "RESET_ALL" };

export const SoundContext = createContext<SoundContextType | undefined>(
  undefined,
);

export const useSoundContext = () => {
  const ctx = useContext(SoundContext);
  if (!ctx)
    throw new Error("useSoundContext must be used within SoundProvider");
  return ctx;
};

export const soundReducer = (
  state: SoundState[],
  action: SoundAction,
): SoundState[] => {
  console.log("🎵 SoundContext Action:", action.type, action);

  switch (action.type) {
    // ========== PLAYBACK CONTROL ==========
    case "PLAY_SOUND":
      console.log("▶️ Playing sound", action.id);
      invoke("play_sound", { id: action.id })
        .then(() => console.log("✅ Play sound command successful"))
        .catch((err) => console.error("❌ Play sound failed:", err));
      return state.map((s) =>
        s.id === action.id ? { ...s, isPlaying: true } : s,
      );

    case "STOP_SOUND":
      console.log("⏹️ Stopping sound", action.id);
      invoke("stop_sound", { id: action.id })
        .then(() => console.log("✅ Stop sound command successful"))
        .catch((err) => console.error("❌ Stop sound failed:", err));
      return state.map((s) =>
        s.id === action.id ? { ...s, isPlaying: false } : s,
      );

    case "SET_ALL_PLAYING":
      invoke("set_all_playing");
      return state.map((s) => ({ ...s, isPlaying: true }));

    case "SET_ALL_PAUSED":
      invoke("set_all_paused");
      return state.map((s) => ({ ...s, isPlaying: false }));

    // ========== VOLUME CONTROL ==========
    case "SET_VOLUME":
      console.log(
        "🔊 Setting volume for sound",
        action.id,
        "to",
        action.volume,
      );
      invoke("set_volume", { id: action.id, volume: action.volume })
        .then(() => console.log("✅ Set volume command successful"))
        .catch((err) => console.error("❌ Set volume failed:", err));
      return state.map((s) =>
        s.id === action.id ? { ...s, volume: action.volume } : s,
      );

    case "SET_MASTER_VOLUME":
      console.log("🔊 Setting master volume to", action.volume);
      invoke("set_master_volume", { volume: action.volume })
        .then(() => console.log("✅ Set master volume command successful"))
        .catch((err) => console.error("❌ Set master volume failed:", err));
      return state.map((s) => ({ ...s, volume: action.volume }));

    // ========== MUTE CONTROL ==========
    case "MUTE_SOUND":
      invoke("mute_sound", { id: action.id, is_muted: action.isMuted });
      return state.map((s) =>
        s.id === action.id ? { ...s, isMuted: action.isMuted } : s,
      );

    case "MUTE_ALL_EXCEPT":
      invoke("mute_all_except", { id: action.id });
      return state.map((s) =>
        s.id === action.id ? s : { ...s, isMuted: true },
      );

    // ========== MIX & PRESETS ==========
    case "APPLY_MIX_SETTINGS":
      invoke("apply_mix_settings", { mix_levels: action.mixLevels });
      return state.map((s) =>
        action.mixLevels[s.id] !== undefined
          ? { ...s, mixLevel: action.mixLevels[s.id] }
          : s,
      );

    case "LOAD_PRESET":
      invoke("load_preset", { preset_name: action.preset.toString() });
      return action.preset;

    case "SAVE_PRESET":
      invoke("save_preset", { name: action.name });
      return state;

    // ========== SELECTION CONTROL ==========
    case "SELECT_SOUND":
      // invoke("select_sound", { id: action.id });
      return state.map((s) =>
        s.id === action.id ? { ...s, selected: true } : s,
      );

    case "DESELECT_SOUND":
      // invoke("deselect_sound", { id: action.id });
      return state.map((s) =>
        s.id === action.id ? { ...s, selected: false, isPlaying: false } : s,
      );

    case "SELECT_ALL_SOUNDS":
      invoke("select_all_sounds");
      return state.map((s) => ({ ...s, selected: true }));

    case "DESELECT_ALL_SOUNDS":
      invoke("reset_all");
      return state.map((s) => ({ ...s, selected: false, isPlaying: false }));

    // ========== SYSTEM CONTROL ==========
    case "RESET_ALL":
      invoke("reset_all");
      return state.map((s) => ({
        ...s,
        isPlaying: false,
        volume: 50,
        isMuted: false,
        mixLevel: 1,
      }));

    default:
      return state;
  }
};
