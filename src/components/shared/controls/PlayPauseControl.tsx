"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pause, Play } from "lucide-react";

interface PlayPauseControlProps {
  isPlaying: boolean;
  hasSelectedSounds: boolean;
  onToggle: () => void;
}

export const PlayPauseControl: React.FC<PlayPauseControlProps> = ({
  isPlaying,
  hasSelectedSounds,
  onToggle,
}) => {
  const buttonText = isPlaying ? "Pause" : "Play";
  const Icon = isPlaying ? Pause : Play;
  const ariaLabel = isPlaying ? "Pause sounds" : "Play sounds";

  const buttonStyles = cn(
    "w-full transition-all duration-300 ease-in-out",
    isPlaying
      ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
      : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white",
  );

  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-sm text-neutral-500">Sound Control</span>
      <Button
        variant="outline"
        className={buttonStyles}
        onClick={onToggle}
        disabled={!hasSelectedSounds}
        aria-label={ariaLabel}
      >
        <Icon className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  );
};
