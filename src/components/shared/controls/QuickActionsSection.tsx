"use client";

import { Button } from "@/components/ui/button";

interface QuickActionsSectionProps {
  onSavePreset?: () => void;
  onLoadPreset?: () => void;
  hasSelectedSounds: boolean;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onSavePreset,
  onLoadPreset,
  hasSelectedSounds,
}) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-sm text-neutral-500">Quick Actions</span>
      <div className="flex w-full gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onSavePreset}
          disabled={!onSavePreset && !hasSelectedSounds}
        >
          Save Preset
        </Button>
        <Button variant="outline" className="flex-1" onClick={onLoadPreset}>
          Load Preset
        </Button>
      </div>
    </div>
  );
};
