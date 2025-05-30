import { Waves } from "lucide-react";
import { SoundCard } from "./SoundCard";

export const Sounds = () => {
  const soundOptions = [
    {
      id: 1,
      name: "White Noise",
      icon: <Waves />,
      bgColor: "bg-gray-200",
      iconColor: "text-white",
      status: "Paused",
    },
    {
      id: 2,
      name: "Pink Noise",
      icon: <Waves />,
      bgColor: "bg-pink-200",
      iconColor: "text-white",
      status: "Paused",
    },
    {
      id: 3,
      name: "Brown Noise",
      icon: <Waves />,
      bgColor: "bg-yellow-900",
      iconColor: "text-white",
      status: "Paused",
    },
  ];

  return (
    <div className="flex w-full flex-col items-start gap-4 py-4 sm:flex-row sm:flex-wrap">
      {soundOptions.map((sound) => (
        <SoundCard key={sound.id} sound={sound} />
      ))}
    </div>
  );
};

export default Sounds;
