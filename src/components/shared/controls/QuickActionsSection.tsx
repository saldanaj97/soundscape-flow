"use client";

import { Button } from "@/components/ui/button";

interface QuickActionsSectionProps {
  onSavePreset?: () => void;
  onLoadPreset?: () => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onSavePreset,
  onLoadPreset,
}) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-sm text-neutral-500">Quick Actions</span>
      <div className="flex w-full gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onSavePreset}
          disabled={!onSavePreset}
        >
          Save Preset
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={onLoadPreset}
          disabled={!onLoadPreset}
        >
          Load Preset
        </Button>
      </div>
    </div>
  );
};
