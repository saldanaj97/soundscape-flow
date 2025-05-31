"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { SoundOption } from "@/types/sounds.types";
import { Pause, Play } from "lucide-react";
import { useCallback, useState } from "react";

const SoundCards = ({ sound }: { sound: SoundOption }) => {
  const [playing, setPlaying] = useState(false);

  const handlePlayPause = useCallback(() => {
    setPlaying((prev) => !prev);
    // Handle the actual sound playing logic
    // For example, play or pause the sound based on the `playing` state
  }, [sound, playing]);

  return (
    <Card className="flex max-w-xs min-w-xs bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
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
          <Toggle className="text-neutral-800" onClick={handlePlayPause}>
            {playing ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Toggle>
        </div>
      </CardHeader>
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
