"use client";

import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/tabs";
import Sounds from "@/components/shared/sounds/Sounds";
import { Brain, CloudDrizzleIcon, TreePine, Volume2 } from "lucide-react";
import { useState } from "react";
import {
  natureSoundOptions,
  noiseSoundOptions,
  rainSoundOptions,
} from "./sounds/soundOptions";

export const SoundSelectionSection = () => {
  const [selectedTab, setSelectedTab] = useState("noise");

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  return (
    <section className="flex w-full min-w-lg flex-col gap-4">
      <Tabs defaultValue="noise">
        <TabsList className="grid w-full grid-cols-4 inset-shadow-sm dark:inset-shadow-black/30">
          <button onClick={() => handleTabChange("noise")}>
            <TabsTrigger value="noise">
              <span
                className="inline-flex w-full items-center justify-center"
                onClick={() => handleTabChange("noise")}
              >
                <Volume2
                  className={`mr-2 ${selectedTab === "noise" ? "text-yellow-300" : "text-gray-500"}`}
                  size={20}
                />
                <p>Noise</p>
              </span>
            </TabsTrigger>
          </button>
          <button onClick={() => handleTabChange("rain")}>
            <TabsTrigger value="rain">
              <span
                className="inline-flex w-full items-center justify-center"
                onClick={() => handleTabChange("rain")}
              >
                <CloudDrizzleIcon
                  className={`mr-2 ${selectedTab === "rain" ? "text-blue-500" : "text-gray-500"}`}
                  size={20}
                />
                <p>Rain</p>
              </span>
            </TabsTrigger>
          </button>
          <button onClick={() => handleTabChange("nature")}>
            <TabsTrigger value="nature">
              <span className="inline-flex w-full items-center justify-center">
                <TreePine
                  className={`mr-2 ${selectedTab === "nature" ? "text-green-700" : "text-gray-500"}`}
                  size={20}
                />
                <p>Nature</p>
              </span>
            </TabsTrigger>
          </button>
          <button onClick={() => handleTabChange("brainwaves")}>
            <TabsTrigger value="brainwaves">
              <span className="inline-flex w-full items-center justify-center">
                <Brain
                  className={`mr-2 ${selectedTab === "brainwaves" ? "text-pink-300" : "text-gray-500"}`}
                  size={20}
                />
                <p>Brain Waves</p>
              </span>
            </TabsTrigger>
          </button>
        </TabsList>
        <TabsContents>
          <TabsContent value="noise">
            <Sounds soundOptions={noiseSoundOptions} />
          </TabsContent>
          <TabsContent value="rain">
            <Sounds soundOptions={rainSoundOptions} />
          </TabsContent>
          <TabsContent value="nature">
            <Sounds soundOptions={natureSoundOptions} />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </section>
  );
};

export default SoundSelectionSection;
