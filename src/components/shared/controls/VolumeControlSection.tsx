"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from "lucide-react";

interface VolumeControlSectionProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
  onMute: () => void;
  onMaxVolume: () => void;
  max?: number;
  step?: number;
}

export const VolumeControlSection: React.FC<VolumeControlSectionProps> = ({
  volume,
  onVolumeChange,
  onMute,
  onMaxVolume,
  max = 100,
  step = 1,
}) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between">
        <span className="text-sm text-neutral-500">Master Volume</span>
        <span className="text-sm font-semibold text-neutral-500">
          {volume}%
        </span>
      </div>
      <div className="flex w-full items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onMute}
          aria-label="Mute volume"
        >
          <VolumeX className="h-4 w-4 text-neutral-500" />
        </Button>
        <div
          className="flex-1"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <Slider
            value={[volume]}
            onValueChange={onVolumeChange}
            max={max}
            step={step}
            className="w-full"
            aria-label="Master volume"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onMaxVolume}
          aria-label="Maximum volume"
        >
          <Volume2 className="h-4 w-4 text-neutral-500" />
        </Button>
      </div>
    </div>
  );
};
