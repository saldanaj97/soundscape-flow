/**
 * Format seconds into HH:MM:SS display format
 */
export const formatTimeDisplay = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Calculate total seconds from form data
 */
export const calculateTotalSeconds = (data: {
  duration?: string;
  customHours?: string;
  customMinutes?: string;
}): number => {
  if (data.duration === "custom") {
    // Validate custom inputs
    if (!data.customHours?.trim() && !data.customMinutes?.trim()) {
      throw new Error("Please enter a value for hours or minutes");
    }

    const hours = Number(data.customHours || 0);
    const minutes = Number(data.customMinutes || 0);

    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error("Please enter valid numbers for hours and minutes");
    }

    if (hours < 0 || minutes < 0) {
      throw new Error("Hours and minutes must be positive numbers");
    }

    if (hours > 24 || minutes > 59) {
      throw new Error("Invalid time range");
    }

    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes === 0) {
      throw new Error("Please set at least 1 minute for the timer");
    }

    return totalMinutes * 60;
  } else {
    const minutes = Number(data.duration || 0);
    if (isNaN(minutes) || minutes < 0) {
      throw new Error("Invalid timer duration");
    }
    return minutes * 60;
  }
};

/**
 * Convert seconds to human-readable duration string
 */
export const formatDurationString = (totalSeconds: number): string => {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(" ") || "0m";
};
