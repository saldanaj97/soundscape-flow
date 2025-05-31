"use client";

import { SoundOption } from "@/types/sounds.types";
import React, { createContext, ReactNode, useContext, useState } from "react";

export type SoundState = {
  id: number;
  name: string;
  isPlaying: boolean;
  // Optionally add more fields as needed
};

export type SoundContextType = {
  sounds: SoundState[];
  toggleSound: (id: number) => void;
  setAllPlaying: (playing: boolean) => void;
  setSounds: React.Dispatch<React.SetStateAction<SoundState[]>>;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSoundContext = () => {
  const ctx = useContext(SoundContext);
  if (!ctx)
    throw new Error("useSoundContext must be used within SoundProvider");
  return ctx;
};

export const SoundProvider: React.FC<{
  children: ReactNode;
  initialSounds: SoundOption[];
}> = ({ children, initialSounds }) => {
  const [sounds, setSounds] = useState<SoundState[]>(
    initialSounds.map((s) => ({ id: s.id, name: s.name, isPlaying: false })),
  );

  const toggleSound = (id: number) => {
    setSounds((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isPlaying: !s.isPlaying } : s)),
    );
  };

  const setAllPlaying = (playing: boolean) => {
    setSounds((prev) => prev.map((s) => ({ ...s, isPlaying: playing })));
  };

  return (
    <SoundContext.Provider
      value={{ sounds, toggleSound, setAllPlaying, setSounds }}
    >
      {children}
    </SoundContext.Provider>
  );
};
