// Re-export sound options using the new shared data system
// This file maintains backward compatibility while using the new architecture

import { getCategoryOptions } from "@/lib/sounds";

export const noiseSoundOptions = getCategoryOptions("noise");
export const rainSoundOptions = getCategoryOptions("rain");
export const natureSoundOptions = getCategoryOptions("nature");
export const ambientSoundOptions = getCategoryOptions("ambient");
