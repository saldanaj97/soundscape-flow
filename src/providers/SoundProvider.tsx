import { SoundContext, soundReducer } from "@/context/SoundContext";
import { loadSoundCatalog } from "@/lib/tauri/commands";
import { SoundOption, SoundState } from "@/types/sounds.types";
import { ReactNode, useEffect, useReducer } from "react";

const PATH = "../sounds.json";

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

  // Initialize sound catalog on app startup
  useEffect(() => {
    const initializeSoundCatalog = async () => {
      try {
        await loadSoundCatalog(PATH);
        console.log(`✅ Sound catalog loaded successfully from: ${PATH}`);
      } catch (error) {
        console.warn(`⚠️ Failed to load sound catalog from: ${PATH}`);
      }
    };

    initializeSoundCatalog();
  }, []);

  return (
    <SoundContext.Provider value={{ sounds, dispatch }}>
      {children}
    </SoundContext.Provider>
  );
};
