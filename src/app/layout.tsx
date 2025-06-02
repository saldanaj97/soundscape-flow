import { Providers } from "@/providers/providers";
import { Toaster } from "sonner";
import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans backdrop-blur-3xl">
        <Providers>
          <main className="backdrop-blur-3xl">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
