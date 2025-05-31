"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useMasterControls } from "@/hooks/useMasterControls";
import { SlidersHorizontal } from "lucide-react";
import { ActiveSoundsSection } from "./ActiveSoundsSection";
import { PlayPauseControl } from "./PlayPauseControl";
import { QuickActionsSection } from "./QuickActionsSection";
import { VolumeControlSection } from "./VolumeControlSection";

export const MasterControls: React.FC = () => {
  const {
    masterVolume,
    selectedSounds,
    isPlaying,
    activeSelectedCount,
    hasSelectedSounds,
    volumeConfig,
    handlers,
  } = useMasterControls();

  return (
    <Card className="flex w-full max-w-xs min-w-xs flex-col gap-4">
      <CardHeader className="flex items-center">
        <SlidersHorizontal className="h-6 w-6 text-green-500" />
        <h2 className="dark:text-foreground text-xl font-bold text-neutral-800">
          Master Controls
        </h2>
      </CardHeader>

      <CardContent className="flex w-full flex-col gap-6">
        <VolumeControlSection
          volume={masterVolume}
          onVolumeChange={handlers.handleVolumeChange}
          onMute={handlers.handleMuteVolume}
          onMaxVolume={handlers.handleMaxVolume}
          max={volumeConfig.MAX}
          step={volumeConfig.STEP}
        />

        <ActiveSoundsSection
          selectedSounds={selectedSounds}
          activeSelectedCount={activeSelectedCount}
          isPlaying={isPlaying}
          onClearSelection={handlers.handleClearSelection}
        />

        <PlayPauseControl
          isPlaying={isPlaying}
          hasSelectedSounds={hasSelectedSounds}
          onToggle={handlers.handlePlayPauseToggle}
        />

        <QuickActionsSection />
      </CardContent>
    </Card>
  );
};

export default MasterControls;
