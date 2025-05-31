import Sounds from "@/components/shared/sounds/Sounds";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  natureSoundOptions,
  noiseSoundOptions,
  rainSoundOptions,
} from "./sounds/soundOptions";

export const SoundSelectionSection = () => {
  return (
    <section>
      <Tabs defaultValue="noise" className="flex w-full flex-col gap-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="noise"> 🎨 Noise </TabsTrigger>
          <TabsTrigger value="rain"> 🌧️ Rain </TabsTrigger>
          <TabsTrigger value="nature"> 🌳 Nature </TabsTrigger>
        </TabsList>
        <div className="">
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
