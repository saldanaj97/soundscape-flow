import { getSoundTheme } from "@/components/shared/sounds/sound-themes";
import soundsData from "@/data/sounds.json";
import type {
  SoundCatalog,
  SoundItem,
  SoundOption,
} from "@/types/sounds.types";
import { createElement } from "react";

// Load the sound catalog with type assertion
export const soundCatalog: SoundCatalog = soundsData as SoundCatalog;

// Get all sounds as a flat array
export const getAllSounds = (): SoundItem[] => {
  return Object.values(soundCatalog.categories).flat();
};

// Get sounds by category
export const getSoundsByCategory = (category: string): SoundItem[] => {
  return soundCatalog.categories[category] || [];
};

// Get a specific sound by ID
export const getSoundById = (id: number): SoundItem | undefined => {
  return getAllSounds().find((sound) => sound.id === id);
};

// Convert sound data to legacy SoundOption format for compatibility
export const soundToOption = (sound: SoundItem): SoundOption => {
  const theme = getSoundTheme(sound.id, sound.category);
  const IconComponent = theme.icon;

  return {
    id: sound.id,
    name: sound.name,
    status: "Paused", // Default status
    icon: createElement(IconComponent),
    iconColor: "text-white",
    bgColor: theme.bgColor,
    ringColor: theme.ringColor,
  };
};

// Convert category sounds to legacy format
export const getCategoryOptions = (category: string): SoundOption[] => {
  return getSoundsByCategory(category).map(soundToOption);
};
