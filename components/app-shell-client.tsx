"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

import SideBar from "@/components/app-sidebar";
import AppToolbar from "./app-toolbar";

import { useAuth } from "@/components/providers/auth-provider";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppShellClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout, user } = useAuth();

  const [search, setSearch] = useState("");

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  const userInitial =
    user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <SidebarProvider defaultOpen>
      <SideBar />

      <SidebarInset>
        <header className="flex items-center justify-between border-b bg-background px-4 py-3">
          <SidebarTrigger />

          <AppToolbar
            search={search}
            onSearch={setSearch}
            placeholder="Search users, transactions, providers..."
          />

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button
              type="button"
              className="relative flex items-center gap-2 rounded-lg border bg-white px-2 py-2"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-400" />

              <span
                className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"
                aria-hidden="true"
              />
            </button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Open account menu"
              >
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback>
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    My Account
                  </DropdownMenuLabel>

                  <DropdownMenuItem>
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}