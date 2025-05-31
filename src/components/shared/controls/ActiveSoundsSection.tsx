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
  activeSelectedCount: number;
  isPlaying: boolean;
  onClearSelection: () => void;
}

export const ActiveSoundsSection: React.FC<ActiveSoundsSectionProps> = ({
  selectedSounds,
  activeSelectedCount,
  isPlaying,
  onClearSelection,
}) => {
  const displayText = isPlaying ? "Sounds Playing" : "Sounds Selected";
  const countText = isPlaying
    ? `${activeSelectedCount} of ${selectedSounds.length}`
    : selectedSounds.length.toString();

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between rounded-lg bg-blue-500/20 p-2.5">
        <div className="flex items-center gap-2">
          <Headphones className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-bold text-blue-500">{displayText}</span>
        </div>
        <span className="text-sm font-bold text-blue-500">{countText}</span>
      </div>

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
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};
