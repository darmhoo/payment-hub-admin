import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "../globals.css";

import SideBar from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { isAuthenticated } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Payment Gateway",
  description: "Payment Gateway Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login");
  }

  return (
    <SidebarProvider defaultOpen>
      <SideBar />

      <SidebarInset>
        <header className="flex h-16 items-center border-b bg-background px-4">
          <SidebarTrigger />
        </header>

        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
