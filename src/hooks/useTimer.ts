// hooks/useTimer.ts
import { useSoundContext } from "@/context/SoundContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UseTimerReturn {
  remainingSeconds: number;
  isRunning: boolean;
  isActive: boolean;
  selectedSeconds: number;
  startTimer: (totalSeconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  setPreviewTime: (seconds: number) => void;
}

export const useTimer = (): UseTimerReturn => {
  const { dispatch } = useSoundContext();
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selectedSeconds, setSelectedSeconds] = useState(0);
  const [initialDuration, setInitialDuration] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer tick effect
  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            dispatch({ type: "SET_ALL_PAUSED" });
            toast.success("Timer completed!", {
              duration: 3000,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, remainingSeconds]);

  const startTimer = useCallback((totalSeconds: number) => {
    if (totalSeconds <= 0) {
      throw new Error("Timer duration must be greater than 0");
    }

    setRemainingSeconds(totalSeconds);
    setInitialDuration(totalSeconds);
    setIsRunning(true);
    setIsActive(true);
    setSelectedSeconds(0);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    if (remainingSeconds > 0) {
      setIsRunning(true);
    }
  }, [remainingSeconds]);

  const resetTimer = useCallback(() => {
    setRemainingSeconds(initialDuration);
    setIsRunning(false);
    setIsActive(false);
    setSelectedSeconds(0);
  }, [initialDuration]);

  const setPreviewTime = useCallback((seconds: number) => {
    setSelectedSeconds(seconds);
  }, []);

  return {
    remainingSeconds,
    isRunning,
    isActive,
    selectedSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setPreviewTime,
  };
};
