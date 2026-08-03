"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  CreditCard,
  MessageSquare,
  Receipt,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Providers",
    href: "/providers",
    icon: CreditCard,
  },
  {
    title: "Users",
    href: "/users",
    icon: Receipt,
  },

  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const SideBar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <h2 className="text-xl font-bold group-data-[collapsible=icon]:hidden">
          PayHub
        </h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="size-7" />
                  <span className="text-sm group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 text-sm text-muted-foreground">
        © 2026 PayHub
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
