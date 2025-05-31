"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTimer } from "@/hooks/useTimer";
import { calculateTotalSeconds, formatTimeDisplay } from "@/lib/utils/time";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClockFading, Pause, Play, RefreshCcw } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// Schema with improved validation
const TimerSelectionFormSchema = z.object({
  duration: z.string({
    required_error: "Please select a duration for the timer.",
  }),
  customHours: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 24),
      {
        message: "Hours must be between 0 and 24",
      },
    ),
  customMinutes: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 59),
      {
        message: "Minutes must be between 0 and 59",
      },
    ),
});

type TimerFormData = z.infer<typeof TimerSelectionFormSchema>;

// Constants for better maintainability
const PRESET_DURATIONS = [
  { value: "0", label: "No Timer" },
  { value: "5", label: "5 min" },
  { value: "10", label: "10 min" },
  { value: "15", label: "15 min" },
  { value: "20", label: "20 min" },
  { value: "25", label: "25 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "60 min" },
  { value: "custom", label: "Custom" },
] as const;

interface TimerControlsProps {
  className?: string;
}

interface CustomTimerInputProps {
  form: ReturnType<typeof useForm<TimerFormData>>;
  isVisible: boolean;
}

interface TimerDisplayProps {
  remainingSeconds: number;
  isRunning: boolean;
  isActive: boolean;
  selectedSeconds: number;
  onPauseResume: () => void;
  onReset: () => void;
}

// Extracted sub-components for better organization
const CustomTimerInput: React.FC<CustomTimerInputProps> = ({
  form,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="my-3 flex flex-col gap-3 border-t border-b border-gray-200 py-3">
      <h3 className="text-sm font-medium text-gray-700">
        Custom timer duration
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="customHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hours</FormLabel>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="24"
                {...field}
                aria-describedby="hours-help"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minutes</FormLabel>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="59"
                {...field}
                aria-describedby="minutes-help"
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  remainingSeconds,
  isRunning,
  isActive,
  selectedSeconds,
  onPauseResume,
  onReset,
}) => {
  // Active timer display
  if (isActive && remainingSeconds > 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="mb-2 text-2xl font-bold" aria-live="polite">
          {formatTimeDisplay(remainingSeconds)}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onPauseResume}
            aria-label={isRunning ? "Pause timer" : "Resume timer"}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            {isRunning ? " Pause" : " Resume"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onReset}
            aria-label="Reset timer"
          >
            <RefreshCcw size={16} /> Reset
          </Button>
        </div>
      </div>
    );
  }

  // Preview of selected time
  if (selectedSeconds > 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="mb-2 text-2xl font-bold text-gray-500">
          {formatTimeDisplay(selectedSeconds)}
        </div>
        <p className="text-sm text-gray-500">Selected timer duration</p>
      </div>
    );
  }

  return null;
};

export const TimerControls: React.FC<TimerControlsProps> = ({ className }) => {
  const {
    remainingSeconds,
    isRunning,
    isActive,
    selectedSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setPreviewTime,
  } = useTimer();

  const form = useForm<TimerFormData>({
    resolver: zodResolver(TimerSelectionFormSchema),
    defaultValues: {
      customHours: "0",
      customMinutes: "0",
    },
  });

  const showCustomTimer = form.watch("duration") === "custom";
  const shouldShowStartButton =
    form.watch("duration") && form.watch("duration") !== "0";

  // Handle form submission
  const onSubmit = useCallback(
    (data: TimerFormData) => {
      try {
        const totalSeconds = calculateTotalSeconds(data);

        if (totalSeconds === 0) {
          toast.error("Please set at least 1 minute for the timer");
          return;
        }

        startTimer(totalSeconds);

        // Create user-friendly time string for toast
        const minutes = Math.floor(totalSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        const timeString = `${hours > 0 ? `${hours}h ` : ""}${remainingMinutes > 0 ? `${remainingMinutes}m` : ""}`;

        toast.success(`Timer started for ${timeString}`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to start timer",
        );
      }
    },
    [startTimer],
  );

  // Handle duration selection changes
  const handleSelectChange = useCallback(
    (value: string) => {
      form.setValue("duration", value);

      if (value !== "custom" && value !== "0") {
        const minutes = Number(value);
        setPreviewTime(minutes * 60);
      } else {
        setPreviewTime(0);
      }
    },
    [form, setPreviewTime],
  );

  // Handle pause/resume
  const handlePauseResume = useCallback(() => {
    if (isRunning) {
      pauseTimer();
    } else {
      resumeTimer();
    }
  }, [isRunning, pauseTimer, resumeTimer]);

  // Update preview for custom timer inputs
  useEffect(() => {
    if (showCustomTimer) {
      const subscription = form.watch((value, { name }) => {
        if (name === "customHours" || name === "customMinutes") {
          try {
            const totalSeconds = calculateTotalSeconds(value as TimerFormData);
            setPreviewTime(totalSeconds);
          } catch {
            // Invalid input, don't update preview
            setPreviewTime(0);
          }
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [form, showCustomTimer, setPreviewTime]);

  return (
    <Card
      className={`flex items-center justify-center gap-4 rounded-lg shadow-md ${className || ""}`}
    >
      <CardHeader className="flex w-full items-center justify-start">
        <ClockFading size={24} className="text-blue-500" aria-hidden="true" />
        <h2 className="text-xl font-bold text-neutral-800">Timer</h2>
      </CardHeader>
      <CardContent className="flex w-full min-w-1/3 items-center justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <TimerDisplay
              remainingSeconds={remainingSeconds}
              isRunning={isRunning}
              isActive={isActive}
              selectedSeconds={selectedSeconds}
              onPauseResume={handlePauseResume}
              onReset={resetTimer}
            />

            {(!isActive || (!isRunning && remainingSeconds === 0)) && (
              <>
                <CustomTimerInput form={form} isVisible={showCustomTimer} />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={handleSelectChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger
                          id="timer-duration"
                          className="w-full"
                          aria-label="Select timer duration"
                        >
                          <SelectValue placeholder="No Timer" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {PRESET_DURATIONS.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {shouldShowStartButton && (
                  <Button
                    type="submit"
                    className="mt-4 w-full bg-blue-500 text-white hover:bg-blue-600"
                    aria-label="Start timer with selected duration"
                  >
                    Start Timer
                  </Button>
                )}
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TimerControls;
