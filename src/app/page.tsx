import Header from "@/features/Header";
import MasterControls from "@/features/MasterControls";
import Sounds from "@/features/sounds/Sounds";
import SoundSelectionTabs from "@/features/SoundSelectionTabs";
import Timer from "@/features/Timer";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-4 p-8">
      <Header />
      <SoundSelectionTabs />
      <section className="flex w-full items-start gap-4">
        <div className="flex w-full flex-col">
          <div className="flex w-full">
            <h1 className="text-xl font-bold text-neutral-800">Sounds</h1>
          </div>
          <Sounds />
        </div>
        <div className="mt-11 flex w-full max-w-xs min-w-xs flex-col gap-4">
          <Timer />
          <MasterControls />
        </div>
      </section>
    </div>
  );
}
