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

export const MasterControls = () => {
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
            <p className="text-sm font-semibold text-neutral-500">50%</p>
          </div>
          <div className="flex w-full items-center justify-evenly gap-2">
            <Button variant="ghost" className="h-8 w-8">
              <VolumeX className="text-neutral-500" />
            </Button>
            <Slider defaultValue={[50]} max={100} step={1} />
            <Button variant="ghost" className="h-8 w-8">
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

        {/* Selected Sounds Control */}
        <div className="flex w-full flex-col justify-center gap-2">
          <p className="text-sm text-neutral-500">Selected Sounds Control</p>
          <div className="flex w-full items-center justify-between gap-2">
            <Button
              variant="outline"
              className="w-1/2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            >
              <Play className="mr-2 h-4 w-4" />
              <p>Play</p>
            </Button>
            <Button
              variant="outline"
              className="w-1/2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <Pause className="mr-2 h-4 w-4" />
              <p>Pause</p>
            </Button>
          </div>
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
