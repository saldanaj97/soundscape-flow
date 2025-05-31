"use client";

import { SoundOption, SoundState } from "@/types/sounds.types";
import React, { createContext, ReactNode, useContext, useReducer } from "react";

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
  | { type: "RESET_ALL" };

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSoundContext = () => {
  const ctx = useContext(SoundContext);
  if (!ctx)
    throw new Error("useSoundContext must be used within SoundProvider");
  return ctx;
};

const soundReducer = (
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
        volume: 100,
        isMuted: false,
        mixLevel: 1,
      }));
    default:
      return state;
  }
};

export const SoundProvider: React.FC<{
  children: ReactNode;
  initialSounds: SoundOption[];
}> = ({ children, initialSounds }) => {
  const initialState: SoundState[] = initialSounds.map((s) => ({
    id: s.id,
    name: s.name,
    isPlaying: false,
    volume: 50,
    isMuted: false,
    mixLevel: 1,
    presetId: undefined,
  }));

  const [sounds, dispatch] = useReducer(soundReducer, initialState);

  return (
    <SoundContext.Provider value={{ sounds, dispatch }}>
      {children}
    </SoundContext.Provider>
  );
};
