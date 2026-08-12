"use client";

import SideBar from "@/components/app-sidebar";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bell} from "lucide-react";
import { useRouter } from "next/navigation";
import AppToolbar from "./app-toolbar";
import { useState } from "react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "./theme-toggle";

export function AppShellClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [search, setSearch] = useState("");

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <SidebarProvider defaultOpen>
      <SideBar />

      <SidebarInset>
        <header className="flex justify-between items-center border-b bg-background px-4 py-3">
          <SidebarTrigger />
          
          <AppToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search users, transactions, providers..."
      />

      <ThemeToggle />

          <div className="flex gap-4">
          <div className="relative flex items-center gap-2 rounded-lg border bg-white px-2 py-2">
            <Bell className="h-5 w-5 text-gray-400" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="rounded-full focus:outline-none">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage
                    src={user?.name} alt={user?.email}
                  />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}