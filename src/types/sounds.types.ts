export type SoundOption = {
  id: number;
  name: string;
  status: string;
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
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

export type SoundCategory = "rain" | "nature" | "whiteNoise";
