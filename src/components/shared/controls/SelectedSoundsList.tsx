"use client";

import { Button } from "@/components/ui/button";
import { useSoundContext } from "@/context/SoundContext";
import { X } from "lucide-react";

interface SelectedSound {
  id: number;
  name: string;
  isPlaying: boolean;
}

interface SelectedSoundsListProps {
  selectedSounds: SelectedSound[];
}

export const SelectedSoundsList: React.FC<SelectedSoundsListProps> = ({
  selectedSounds,
}) => {
  const { dispatch } = useSoundContext();

  if (selectedSounds.length === 0) return null;

  const handleDeselectSound = (soundId: number, soundName: string) => {
    dispatch({ type: "DESELECT_SOUND", id: soundId });
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <ul className="flex w-full flex-col gap-1">
        {selectedSounds.map((sound) => (
          <li
            key={sound.id}
            className={`flex items-center justify-between rounded-lg p-2 transition-colors ${
              sound.isPlaying
                ? "bg-green-100 text-green-800"
                : "bg-neutral-100 text-neutral-800"
            }`}
          >
            <span className="truncate text-sm font-medium">{sound.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-red-500 hover:bg-red-100 hover:text-red-600"
              aria-label={`Remove ${sound.name} from selection`}
              onClick={() => handleDeselectSound(sound.id, sound.name)}
            >
              <X className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
