import type { CategoryTheme, SoundTheme } from "@/types/sounds.types";
import {
  AudioLines,
  Bird,
  Cloud,
  CloudLightning,
  Coffee,
  Droplet,
  Droplets,
  FlameKindling,
  Grid2X2,
  Leaf,
  MoonStar,
  Mountain,
  TentTree,
  TreePine,
  Volume2,
  Waves,
  Wind,
} from "lucide-react";

// prettier-ignore

// Individual sound styling by ID
export const soundThemes: Record<number, SoundTheme> = {
  // Noise sounds (1-3)
  1: { iconColor: "text-gray-500", ringColor: "ring-gray-500", icon: AudioLines },
  2: { iconColor: "text-pink-300", ringColor: "ring-pink-300", icon: AudioLines },
  3: { iconColor: "text-yellow-900", ringColor: "ring-yellow-900", icon: AudioLines },

  // Rain sounds (4-9)
  4: { iconColor: "text-blue-400", ringColor: "ring-blue-400", icon: Droplet },
  5: { iconColor: "text-blue-600", ringColor: "ring-blue-600", icon: Droplets },
  6: { iconColor: "text-blue-800", ringColor: "ring-blue-800", icon: TentTree },
  7: { iconColor: "text-blue-900", ringColor: "ring-blue-900", icon: Grid2X2 },
  8: { iconColor: "text-green-300", ringColor: "ring-green-300", icon: Leaf },
  9: { iconColor: "text-yellow-500", ringColor: "ring-yellow-500", icon: CloudLightning },

  // Nature sounds (10-16)
  10: { iconColor: "text-green-800", ringColor: "ring-green-800", icon: TreePine },
  11: { iconColor: "text-blue-300", ringColor: "ring-blue-300", icon: Waves },
  12: { iconColor: "text-yellow-200", ringColor: "ring-yellow-200", icon: Bird },
  13: { iconColor: "text-green-300", ringColor: "ring-green-300", icon: Wind },
  14: { iconColor: "text-gray-600", ringColor: "ring-gray-600", icon: MoonStar },
  15: { iconColor: "text-blue-300", ringColor: "ring-blue-300", icon: Mountain },
  16: { iconColor: "text-amber-600", ringColor: "ring-amber-600", icon: FlameKindling },

  // Ambient sounds (17+)
  17: { iconColor: "text-amber-200", ringColor: "ring-amber-300", icon: Coffee },
};

// Category-level themes for fallbacks and new sounds
export const categoryThemes: Record<string, CategoryTheme> = {
  noise: { defaultIcon: Volume2, colorFamily: "gray" },
  rain: { defaultIcon: Cloud, colorFamily: "blue" },
  nature: { defaultIcon: TreePine, colorFamily: "green" },
  ambient: { defaultIcon: Coffee, colorFamily: "amber" },
};

// Helper function to get theme for a sound
export const getSoundTheme = (
  soundId: number,
  category?: string,
): SoundTheme => {
  // Try to get specific theme first
  const specificTheme = soundThemes[soundId];
  if (specificTheme) {
    return specificTheme;
  }

  // Fall back to category theme
  if (category && categoryThemes[category]) {
    const categoryTheme = categoryThemes[category];
    return {
      iconColor: `text-${categoryTheme.colorFamily}-200`,
      ringColor: `ring-${categoryTheme.colorFamily}-300`,
      icon: categoryTheme.defaultIcon,
    };
  }

  // Default fallback
  return {
    iconColor: "text-gray-200",
    ringColor: "ring-gray-300",
    icon: Waves,
  };
};
