// Core sound data types
export interface SoundItem {
  id: number;
  name: string;
  filename: string;
  category: string;
}

export interface SoundCatalog {
  categories: {
    [categoryName: string]: SoundItem[];
  };
}

// UI-specific types
export interface SoundTheme {
  iconColor: string;
  ringColor: string;
  icon: React.ComponentType;
}

export interface CategoryTheme {
  defaultIcon: React.ComponentType;
  colorFamily: string;
}

// Legacy type for compatibility (deprecated)
export type SoundOption = {
  id: number;
  name: string;
  status: string;
  icon: React.ReactNode;
  iconColor: string;
  ringColor: string;
};

export type SoundState = {
  id: number;
  name: string;
  isPlaying: boolean;
  volume: number; // 0-100
  isMuted: boolean;
  mixLevel: number;
  presetId?: string;
  selected: boolean;
};

export type SoundCategory = "rain" | "nature" | "noise" | "ambient";
