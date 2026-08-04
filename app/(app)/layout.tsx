import type { Metadata } from "next";
import "../globals.css";

import { AppShellClient } from "@/components/app-shell-client";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

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

  return <AppShellClient>{children}</AppShellClient>;
}
