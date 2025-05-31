"use client";

import { SoundOption } from "@/types/sounds.types";
import { SoundCard } from "./SoundCard";

export const Sounds = ({ soundOptions }: { soundOptions: SoundOption[] }) => {
  return (
    <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
      {soundOptions.map((sound) => (
        <SoundCard key={sound.id} sound={sound} />
      ))}
    </div>
  );
};

export default Sounds;
