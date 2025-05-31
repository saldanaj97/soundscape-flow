import MasterControls from "./controls/MasterControls";
import TimerControls from "./controls/TimerControls";

export const ControlSection = () => {
  return (
    <section className="flex w-full max-w-xs min-w-xs flex-col gap-4">
      <TimerControls />
      <MasterControls />
    </section>
  );
};
