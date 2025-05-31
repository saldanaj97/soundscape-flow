import { Toaster } from "sonner";
import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
