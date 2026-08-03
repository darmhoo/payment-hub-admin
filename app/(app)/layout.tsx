import type { Metadata } from "next";
import "../globals.css";

import SideBar from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Payment Gateway",
  description: "Payment Gateway Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider defaultOpen>
          <SideBar />

          <SidebarInset>
            <header className="flex h-16 items-center border-b bg-background px-4">
              <SidebarTrigger />
            </header>

            <main className="flex-1">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}