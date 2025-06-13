import Sounds from "@/components/shared/sounds/Sounds";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CloudDrizzleIcon, TreePine, Volume2 } from "lucide-react";
import {
  natureSoundOptions,
  noiseSoundOptions,
  rainSoundOptions,
} from "./sounds/soundOptions";

export const SoundSelectionSection = () => {
  return (
    <section>
      <Tabs defaultValue="noise" className="flex w-full flex-col gap-4">
        <TabsList className="grid w-full grid-cols-3 inset-shadow-sm dark:inset-shadow-black/20">
          <TabsTrigger value="noise">
            <Volume2 className="mr-2" /> Noise
          </TabsTrigger>
          <TabsTrigger value="rain">
            <CloudDrizzleIcon className="mr-2" /> Rain
          </TabsTrigger>
          <TabsTrigger value="nature">
            <TreePine className="mr-2" /> Nature
          </TabsTrigger>
        </TabsList>
        <div>
          <TabsContent value="noise">
            <Sounds soundOptions={noiseSoundOptions} />
          </TabsContent>
          <TabsContent value="rain">
            <Sounds soundOptions={rainSoundOptions} />
          </TabsContent>
          <TabsContent value="nature">
            <Sounds soundOptions={natureSoundOptions} />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
};

export default SoundSelectionSection;
