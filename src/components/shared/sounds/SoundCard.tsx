import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { useSoundContext } from "@/context/SoundContext";
import { useSoundControls } from "@/hooks/useSoundControls";
import { SoundOption } from "@/types/sounds.types";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";

export const SoundCard = ({ sound }: { sound: SoundOption }) => {
  const { sounds, dispatch } = useSoundContext();
  const {
    selected,
    playing,
    volume,
    handlePlayPause,
    handleVolumeChange,
    handleMuteVolume,
    handleMaxVolume,
  } = useSoundControls(sound);

  // Check if any sounds are currently playing
  const anySoundsPlaying = sounds.some((s) => s.isPlaying);

  const handleSelectToggle = () => {
    if (selected) {
      // Deselecting: stop the sound if it's playing
      if (playing) {
        dispatch({ type: "STOP_SOUND", id: sound.id });
      }
      dispatch({ type: "DESELECT_SOUND", id: sound.id });
    } else {
      // Selecting: add to selection and auto-play if other sounds are playing
      dispatch({ type: "SELECT_SOUND", id: sound.id });
      if (anySoundsPlaying) {
        dispatch({ type: "PLAY_SOUND", id: sound.id });
      }
    }
  };

  const handlePlayButtonClick = () => {
    // Always select the sound when play is clicked
    if (!selected) {
      dispatch({ type: "SELECT_SOUND", id: sound.id });
    }
    handlePlayPause(playing);
  };

  return (
    <Card
      key={sound.id}
      className={`flex max-w-sm min-w-sm bg-white shadow-md transition-shadow duration-300 hover:shadow-lg ${
        selected ? `ring-2 ${sound.ringColor}` : ""
      } cursor-pointer`}
      tabIndex={0}
      aria-checked={selected}
      onClick={handleSelectToggle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleSelectToggle();
        }
      }}
    >
      <CardContent className="flex w-full flex-col gap-2">
        {/* Sound Icon and Name */}
        <div className="flex w-full items-start">
          <div
            className={`m-auto rounded-lg p-2 ${sound.iconColor} dark:bg-secondary`}
          >
            {sound.icon}
          </div>
          <div className="flex w-full flex-col items-start justify-between pl-2">
            <CardTitle>{sound.name}</CardTitle>
            <CardDescription>{playing ? "Playing" : "Paused"}</CardDescription>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <Toggle
              className="text-neutral-800"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayButtonClick();
              }}
              aria-label={
                playing ? `Pause ${sound.name}` : `Play ${sound.name}`
              }
            >
              {playing ? (
                <Pause className="h-6 w-6 dark:text-white" />
              ) : (
                <Play className="h-6 w-6 dark:text-white" />
              )}
            </Toggle>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex w-full items-center justify-between">
          <p className="text-sm text-neutral-500">Volume</p>
          <p className="text-sm font-semibold text-neutral-500">{volume}%</p>
        </div>
        <div className="flex w-full items-center justify-evenly gap-2">
          <Button
            variant="ghost"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              handleMuteVolume();
            }}
          >
            <VolumeX className="text-neutral-500" />
          </Button>
          <div
            className="flex-1"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <Slider
              value={[volume]}
              onValueChange={(value) => {
                handleVolumeChange(value);
              }}
              max={100}
              step={1}
            />
          </div>
          <Button
            variant="ghost"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              handleMaxVolume();
            }}
          >
            <Volume2 className="text-neutral-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
