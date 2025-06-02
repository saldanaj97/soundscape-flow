import { useSoundContext } from "@/context/SoundContext";
import { SoundOption } from "@/types/sounds.types";

export const useSoundControls = (sound: SoundOption) => {
  const { sounds, dispatch } = useSoundContext();
  const soundState = sounds.find((s) => s.id === sound.id);
  const playing = soundState?.isPlaying ?? false;
  const volume = soundState?.volume ?? 50;
  const selected = soundState?.selected ?? false;

  const handlePlayPause = (isPlaying: boolean) => {
    if (isPlaying) {
      dispatch({ type: "STOP_SOUND", id: sound.id });
    } else {
      dispatch({ type: "PLAY_SOUND", id: sound.id });
    }
  };

  const handleVolumeChange = (value: number[]) => {
    dispatch({ type: "SET_VOLUME", id: sound.id, volume: value[0] });
  };

  const handleMuteVolume = () => {
    dispatch({ type: "SET_VOLUME", id: sound.id, volume: 0 });
  };

  const handleMaxVolume = () => {
    dispatch({ type: "SET_VOLUME", id: sound.id, volume: 100 });
  };

  const handleSelectToggle = () => {
    if (selected) {
      dispatch({ type: "DESELECT_SOUND", id: sound.id });
    } else {
      dispatch({ type: "SELECT_SOUND", id: sound.id });
    }
  };

  return {
    playing,
    volume,
    selected,
    handlePlayPause,
    handleVolumeChange,
    handleMuteVolume,
    handleMaxVolume,
    handleSelectToggle,
  };
};
