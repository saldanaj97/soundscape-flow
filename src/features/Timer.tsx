import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClockFading } from "lucide-react";

export const Timer = () => {
  return (
    <Card className="flex items-center justify-center gap-4 rounded-lg shadow-md">
      <CardHeader className="flex w-full items-center justify-start">
        <ClockFading size={24} className="text-blue-500" />
        <p className="text-xl font-bold text-neutral-800">Timer</p>
      </CardHeader>

      <CardContent className="flex w-full items-center justify-center">
        <Select>
          <SelectTrigger id="framework" className="w-full">
            <SelectValue placeholder="No Timer" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="next">Next.js</SelectItem>
            <SelectItem value="sveltekit">SvelteKit</SelectItem>
            <SelectItem value="astro">Astro</SelectItem>
            <SelectItem value="nuxt">Nuxt.js</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default Timer;
