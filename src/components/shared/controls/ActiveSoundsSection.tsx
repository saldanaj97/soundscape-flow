"use client";

import { Button } from "@/components/ui/button";
import { Headphones } from "lucide-react";
import { SelectedSoundsList } from "./SelectedSoundsList";

interface SelectedSound {
  id: number;
  name: string;
  isPlaying: boolean;
}

interface ActiveSoundsSectionProps {
  selectedSounds: SelectedSound[];
  soundsPlayingCount: number;
  isPlaying: boolean;
  onClearSelection: () => void;
}

export const ActiveSoundsSection: React.FC<ActiveSoundsSectionProps> = ({
  selectedSounds,
  soundsPlayingCount,
  onClearSelection,
}) => {
  const displayText =
    soundsPlayingCount > 0 ? "Active Sounds" : "Sounds Selected";

  return (
    <div className="flex w-full flex-col gap-2">
      {selectedSounds.length > 0 && (
        <div className="flex w-full items-center justify-between rounded-lg bg-blue-500/20 p-2.5">
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-bold text-blue-500">
              {displayText}
            </span>
          </div>
          <span className="text-sm font-bold text-blue-500">
            {soundsPlayingCount > 0
              ? `${soundsPlayingCount}`
              : `${selectedSounds.length}`}
          </span>
        </div>
      )}

      <SelectedSoundsList selectedSounds={selectedSounds} />

      {selectedSounds.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-red-500 hover:bg-red-500 hover:text-white"
            onClick={onClearSelection}
            aria-label="Clear all selected sounds"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};
