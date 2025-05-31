import {
  natureSoundOptions,
  noiseSoundOptions,
  rainSoundOptions,
} from "@/components/shared/sounds/soundOptions";
import { SoundProvider } from "@/context/SoundContext";
import { Toaster } from "sonner";
import "../globals.css";

const allSounds = [
  ...noiseSoundOptions,
  ...rainSoundOptions,
  ...natureSoundOptions,
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <SoundProvider initialSounds={allSounds}>
          <main>{children}</main>
          <Toaster />
        </SoundProvider>
      </body>
    </html>
  );
}
