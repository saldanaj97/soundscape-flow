import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export const Header = () => {
  return (
    <section className="flex w-full items-center justify-between text-neutral-800">
      <div className="flex items-center gap-2">
        {/* Logo */}
        <div className="flex h-10 w-10 items-center justify-center rounded bg-neutral-200">
          Logo
        </div>
        {/* Header Text */}
        <div className="flex flex-col items-start">
          <h1 className="text-left text-2xl font-bold">Soundscape Flow</h1>
          <h2 className="text-left text-xs font-medium text-neutral-500">
            Ambient sound mixer for focus and relaxation
          </h2>
        </div>
      </div>

      {/* Settings button */}
      <Button variant="ghost">
        <Settings size={16} />
      </Button>
    </section>
  );
};

export default Header;
