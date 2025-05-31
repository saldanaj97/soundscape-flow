export type SoundOption = {
  id: number;
  name: string;
  status: string;
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
};

export type SoundState = {
  id: number;
  name: string;
  isPlaying: boolean;
  volume: number; // 0-100
  isMuted: boolean;
  mixLevel: number;
  presetId?: string;
};

export type SoundCategory = "rain" | "nature" | "whiteNoise";
