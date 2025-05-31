import { ControlSection } from "@/components/shared/controls/ControlSection";
import Header from "@/components/shared/Header";
import { SoundSelectionSection } from "@/components/shared/SoundSelectionSection";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-4 p-8">
      <Header />
      <div className="flex w-full gap-4">
        <SoundSelectionSection />
        <ControlSection />
      </div>
    </div>
  );
}
