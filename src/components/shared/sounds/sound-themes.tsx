import type { CategoryTheme, SoundTheme } from "@/types/sounds.types";
import {
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
  1: { bgColor: "bg-gray-200", ringColor: "ring-gray-300", icon: Volume2 },
  2: { bgColor: "bg-pink-200", ringColor: "ring-pink-300", icon: Volume2 },
  3: { bgColor: "bg-yellow-900", ringColor: "ring-yellow-900", icon: Volume2 },

  // Rain sounds (4-9)
  4: { bgColor: "bg-blue-200", ringColor: "ring-blue-300", icon: Droplet },
  5: { bgColor: "bg-blue-300", ringColor: "ring-blue-400", icon: Droplets },
  6: { bgColor: "bg-blue-500", ringColor: "ring-blue-500", icon: TentTree },
  7: { bgColor: "bg-blue-400", ringColor: "ring-blue-400", icon: Grid2X2 },
  8: { bgColor: "bg-green-300", ringColor: "ring-green-300", icon: Leaf },
  9: { bgColor: "bg-gray-400", ringColor: "ring-gray-500", icon: CloudLightning },

  // Nature sounds (10-16)
  10: { bgColor: "bg-green-800", ringColor: "ring-green-800", icon: TreePine },
  11: { bgColor: "bg-blue-200", ringColor: "ring-blue-300", icon: Waves },
  12: { bgColor: "bg-yellow-200", ringColor: "ring-yellow-200", icon: Bird },
  13: { bgColor: "bg-green-300", ringColor: "ring-green-300", icon: Wind },
  14: { bgColor: "bg-gray-600", ringColor: "ring-gray-600", icon: MoonStar },
  15: { bgColor: "bg-blue-300", ringColor: "ring-blue-300", icon: Mountain },
  16: { bgColor: "bg-amber-600", ringColor: "ring-amber-600", icon: FlameKindling },

  // Ambient sounds (17+)
  17: { bgColor: "bg-amber-200", ringColor: "ring-amber-300", icon: Coffee },
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
      bgColor: `bg-${categoryTheme.colorFamily}-200`,
      ringColor: `ring-${categoryTheme.colorFamily}-300`,
      icon: categoryTheme.defaultIcon,
    };
  }

  // Default fallback
  return {
    bgColor: "bg-gray-200",
    ringColor: "ring-gray-300",
    icon: Waves,
  };
};
