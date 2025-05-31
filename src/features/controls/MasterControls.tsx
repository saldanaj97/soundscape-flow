"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Headphones,
  Pause,
  Play,
  SlidersHorizontal,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState } from "react";

export const MasterControls = () => {
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleMuteVolume = () => {
    setVolume(0);
  };

  const handleMaxVolume = () => {
    setVolume(100);
  };

  const handlePlayPauseToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <Card className="flex w-full max-w-xs min-w-xs flex-col gap-4">
      <CardHeader className="flex items-center">
        <SlidersHorizontal className="h-6 w-6 text-green-500" />
        <p className="text-xl font-bold text-neutral-800">Master Controls</p>
      </CardHeader>
      <CardContent className="flex w-full flex-col items-center justify-center gap-8">
        {/* Volume */}
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <p className="text-sm text-neutral-500">Master Volume</p>
            <p className="text-sm font-semibold text-neutral-500">{volume}%</p>
          </div>
          <div className="flex w-full items-center justify-evenly gap-2">
            <Button
              variant="ghost"
              className="h-8 w-8"
              onClick={handleMuteVolume}
            >
              <VolumeX className="text-neutral-500" />
            </Button>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
            />
            <Button
              variant="ghost"
              className="h-8 w-8"
              onClick={handleMaxVolume}
            >
              <Volume2 className="text-neutral-500" />
            </Button>
          </div>
        </div>

        {/* Active Sounds */}
        <div className="flex w-full items-center justify-between gap-2 rounded-lg bg-blue-500/20 p-2">
          <div className="flex items-center gap-2">
            <Headphones className="h-6 w-6 text-blue-500" />
            <p className="text-sm font-bold text-blue-500">Active Sounds</p>
          </div>
          <p className="text-sm font-bold text-blue-500">3</p>
        </div>

        {/* Sound Control */}
        <div className="flex w-full flex-col justify-center gap-2">
          <p className="text-sm text-neutral-500">Sound Control</p>
          <Button
            variant="outline"
            className={`w-full transition-all duration-300 ease-in-out ${
              isPlaying
                ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            }`}
            onClick={handlePlayPauseToggle}
            aria-label={isPlaying ? "Pause sounds" : "Play sounds"}
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                <p>Pause</p>
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                <p>Play</p>
              </>
            )}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex w-full flex-col justify-between gap-2">
          <p className="text-sm text-neutral-500">Quick Actions</p>
          <div className="flex w-full items-center justify-between gap-2">
            <Button variant="outline" className="w-1/2">
              <p>Save Preset</p>
            </Button>
            <Button variant="outline" className="w-1/2">
              <p>Load Preset</p>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MasterControls;
