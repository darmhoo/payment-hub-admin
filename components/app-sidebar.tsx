"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  CreditCard,
  ArrowRightLeft,
  Receipt,
  FolderKanban,
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
    title: "Transactions",
    href: "/transactions",
    icon: ArrowRightLeft,
  },
  {
    title: "Users",
    href: "/users",
    icon: Receipt,
  },
  {
    title: "Loan Products",
    href: "/loan-products",
    icon: FolderKanban,
  },
];

export default function SideBar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <h2 className="text-xl font-bold group-data-[collapsible=icon]:hidden">
          PayHub
        </h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  tooltip={item.title}
                  render={<Link href={item.href} />}
                >
                  <Icon className="size-5" />

                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 text-sm text-muted-foreground">
        © 2026 PayHub
      </SidebarFooter>
    </Sidebar>
  );
}