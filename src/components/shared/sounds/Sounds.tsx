"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { useSoundContext } from "@/context/SoundContext";
import { SoundOption } from "@/types/sounds.types";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

const SoundCards = ({ sound }: { sound: SoundOption }) => {
  const { sounds, dispatch } = useSoundContext();
  const soundState = sounds.find((s) => s.id === sound.id);
  const playing = soundState?.isPlaying ?? false;
  const volume = soundState?.volume ?? 100;

  const handlePlayPause = () => {
    dispatch({ type: "TOGGLE_SOUND", id: sound.id });
  };

  const handleVolumeChange = (value: number[]) => {
    dispatch({ type: "SET_VOLUME", id: sound.id, volume: value[0] });
  };

  const handleMuteVolume = () => {
    dispatch({ type: "MUTE_SOUND", id: sound.id, isMuted: true });
  };

  const handleMaxVolume = () => {
    dispatch({ type: "SET_VOLUME", id: sound.id, volume: 100 });
  };

  return (
    <Card
      key={sound.id}
      className="flex max-w-xs min-w-xs bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
    >
      <CardHeader className="flex w-full items-start">
        <div
          className={`m-auto rounded-lg p-2 ${sound.bgColor} ${sound.iconColor}`}
        >
          {sound.icon}
        </div>
        <div className="flex w-full flex-col items-start justify-between pl-2">
          <CardTitle>{sound.name}</CardTitle>
          <CardDescription>{playing ? "Playing" : "Paused"}</CardDescription>
        </div>
        <div className="flex items-center justify-center">
          <Toggle
            className="text-neutral-800"
            onClick={handlePlayPause}
            aria-label={playing ? `Pause ${sound.name}` : `Play ${sound.name}`}
          >
            {playing ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Toggle>
        </div>
      </CardHeader>
      <CardContent className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm text-neutral-500">Volume</p>
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
          <Button variant="ghost" className="h-8 w-8" onClick={handleMaxVolume}>
            <Volume2 className="text-neutral-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const Sounds = ({ soundOptions }: { soundOptions: SoundOption[] }) => {
  return (
    <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:flex-wrap">
      {soundOptions.map((sound) => (
        <SoundCards key={sound.id} sound={sound} />
      ))}
    </div>
  );
};

export default Sounds;
