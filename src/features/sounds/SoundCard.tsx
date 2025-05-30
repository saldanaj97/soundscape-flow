import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Play } from "lucide-react";

type SoundOption = {
  id: number;
  name: string;
  status: string;
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
};

export const SoundCard = ({ sound }: { sound: SoundOption }) => {
  return (
    <Card className="flex w-full max-w-xs min-w-xs flex-col items-start bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="flex w-full items-start">
        <div
          className={`m-auto rounded-lg p-2 ${sound.bgColor} ${sound.iconColor}`}
        >
          {sound.icon}
        </div>
        <div className="flex w-full flex-col items-start justify-between pl-2">
          <CardTitle>{sound.name}</CardTitle>
          <CardDescription>{sound.status}</CardDescription>
        </div>
        <div className="flex items-center justify-center">
          <Button className="text-neutral-800" variant="ghost" size="icon">
            <Play size={24} />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};
