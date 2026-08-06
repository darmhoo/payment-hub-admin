import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

import { AuthProvider } from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: {
    default: "PayHub Admin",
    template: "%s | PayHub Admin",
  },
  description: "Manage integrations, providers, and system settings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen flex flex-col antialiased"
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
