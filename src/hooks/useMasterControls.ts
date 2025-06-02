import { useSoundContext } from "@/context/SoundContext";
import { useMemo } from "react";

const VOLUME_STEPS = {
  MIN: 0,
  MAX: 100,
  STEP: 1,
} as const;

export const useMasterControls = () => {
  const { sounds, dispatch } = useSoundContext();

  const masterVolume = useMemo(() => {
    return sounds.length > 0
      ? Math.min(...sounds.map((s) => s.volume))
      : VOLUME_STEPS.MAX;
  }, [sounds]);

  const selectedSounds = useMemo(() => {
    return sounds.filter((s) => s.selected);
  }, [sounds]);

  const isPlaying = useMemo(() => {
    return sounds.some((s) => s.isPlaying);
  }, [sounds]);

  const activeSelectedCount = useMemo(() => {
    return selectedSounds.filter((s) => s.isPlaying).length;
  }, [selectedSounds]);

  const hasSelectedSounds = selectedSounds.length > 0;
  const hasPlayingSounds = selectedSounds.some((sound) => sound.isPlaying);

  const handleVolumeChange = (value: number[]) => {
    dispatch({ type: "SET_MASTER_VOLUME", volume: value[0] });
  };

  const handleMuteVolume = () => {
    dispatch({ type: "SET_MASTER_VOLUME", volume: VOLUME_STEPS.MIN });
  };

  const handleMaxVolume = () => {
    dispatch({ type: "SET_MASTER_VOLUME", volume: VOLUME_STEPS.MAX });
  };

  const handlePlayPauseToggle = () => {
    if (!hasSelectedSounds) return;

    if (hasPlayingSounds) {
      dispatch({ type: "SET_ALL_PAUSED" });
    } else {
      selectedSounds.forEach((sound) => {
        dispatch({ type: "PLAY_SOUND", id: sound.id });
      });
    }
  };

  const handleClearSelection = () => {
    dispatch({ type: "DESELECT_ALL_SOUNDS" });
  };

  return {
    masterVolume,
    selectedSounds,
    isPlaying,
    activeSelectedCount,
    hasSelectedSounds,
    hasPlayingSounds,
    volumeConfig: VOLUME_STEPS,
    handlers: {
      handleVolumeChange,
      handleMuteVolume,
      handleMaxVolume,
      handlePlayPauseToggle,
      handleClearSelection,
    },
  };
};
