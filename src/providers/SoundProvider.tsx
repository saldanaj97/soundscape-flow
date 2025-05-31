import { SoundContext, soundReducer } from "@/context/SoundContext";
import { SoundOption, SoundState } from "@/types/sounds.types";
import { ReactNode, useReducer } from "react";

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
    selected: false,
  }));

  const [sounds, dispatch] = useReducer(soundReducer, initialState);

  return (
    <SoundContext.Provider value={{ sounds, dispatch }}>
      {children}
    </SoundContext.Provider>
  );
};
