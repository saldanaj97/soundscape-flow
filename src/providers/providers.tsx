"use client";

import {
  natureSoundOptions,
  noiseSoundOptions,
  rainSoundOptions,
} from "@/components/shared/sounds/soundOptions";
import * as React from "react";
import { SoundProvider } from "./SoundProvider";
import { ThemeProvider } from "./ThemeProvider";

const allSounds = [
  ...noiseSoundOptions,
  ...rainSoundOptions,
  ...natureSoundOptions,
];

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SoundProvider initialSounds={allSounds}>{children}</SoundProvider>
    </ThemeProvider>
  );
}
