"use client";

import { SoundOption } from "@/types/sounds.types";
import { SoundCard } from "./SoundCard";

export const Sounds = ({ soundOptions }: { soundOptions: SoundOption[] }) => {
  return (
    <div className="flex w-full flex-col gap-4 px-4 py-2 md:flex-wrap md:justify-center lg:flex-row">
      {soundOptions.map((sound) => (
        <SoundCard key={sound.id} sound={sound} />
      ))}
    </div>
  );
};

export default Sounds;
