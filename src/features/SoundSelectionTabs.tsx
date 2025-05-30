import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SoundSelectionTabs = () => {
  return (
    <Tabs defaultValue="tab1" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tab1"> 🎨 Noise </TabsTrigger>
        <TabsTrigger value="tab2"> 🌧️ Rain </TabsTrigger>
        <TabsTrigger value="tab3"> 🌳 Nature </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SoundSelectionTabs;
