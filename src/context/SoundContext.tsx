"use client";

import { SoundState } from "@/types/sounds.types";
import React, { createContext, useContext } from "react";

type SoundContextType = {
  sounds: SoundState[];
  dispatch: React.Dispatch<SoundAction>;
};

// Action types for sound state management
type SoundAction =
  | { type: "TOGGLE_SOUND"; id: number }
  | { type: "SET_ALL_PLAYING"; playing: boolean }
  | { type: "SET_VOLUME"; id: number; volume: number }
  | { type: "SET_MASTER_VOLUME"; volume: number }
  | { type: "MUTE_SOUND"; id: number; isMuted: boolean }
  | { type: "MUTE_ALL_EXCEPT"; id: number }
  | { type: "APPLY_MIX_SETTINGS"; mixLevels: Record<number, number> }
  | { type: "LOAD_PRESET"; preset: SoundState[] }
  | { type: "SAVE_PRESET"; name: string }
  | { type: "RESET_ALL" }
  | { type: "SELECT_SOUND"; id: number }
  | { type: "DESELECT_SOUND"; id: number }
  | { type: "TOGGLE_SOUND_SELECTION"; id: number }
  | { type: "SELECT_ALL_SOUNDS" }
  | { type: "DESELECT_ALL_SOUNDS" };

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
  switch (action.type) {
    case "TOGGLE_SOUND":
      return state.map((s) =>
        s.id === action.id ? { ...s, isPlaying: !s.isPlaying } : s,
      );
    case "SET_ALL_PLAYING":
      return state.map((s) => ({ ...s, isPlaying: action.playing }));
    case "SET_VOLUME":
      return state.map((s) =>
        s.id === action.id ? { ...s, volume: action.volume } : s,
      );
    case "SET_MASTER_VOLUME":
      // Optionally, scale all volumes by master volume
      return state.map((s) => ({ ...s, volume: action.volume }));
    case "MUTE_SOUND":
      return state.map((s) =>
        s.id === action.id ? { ...s, isMuted: action.isMuted } : s,
      );
    case "MUTE_ALL_EXCEPT":
      return state.map((s) =>
        s.id === action.id ? s : { ...s, isMuted: true },
      );
    case "APPLY_MIX_SETTINGS":
      return state.map((s) =>
        action.mixLevels[s.id] !== undefined
          ? { ...s, mixLevel: action.mixLevels[s.id] }
          : s,
      );
    case "LOAD_PRESET":
      return action.preset;
    case "RESET_ALL":
      return state.map((s) => ({
        ...s,
        isPlaying: false,
        volume: 50,
        isMuted: false,
        mixLevel: 1,
      }));
    case "SELECT_SOUND":
      return state.map((s) =>
        s.id === action.id ? { ...s, selected: true } : s,
      );
    case "DESELECT_SOUND":
      return state.map((s) =>
        s.id === action.id ? { ...s, selected: false, isPlaying: false } : s,
      );
    case "TOGGLE_SOUND_SELECTION":
      return state.map((s) =>
        s.id === action.id ? { ...s, selected: !s.selected } : s,
      );
    case "SELECT_ALL_SOUNDS":
      return state.map((s) => ({ ...s, selected: true }));
    case "DESELECT_ALL_SOUNDS":
      return state.map((s) => ({ ...s, selected: false, isPlaying: false }));
    default:
      return state;
  }
};
