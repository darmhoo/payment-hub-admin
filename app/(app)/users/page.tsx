"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const stats = [
  {
    title: "Volume Today",
    value: "₦2,438,900",
    change: "+12.4% vs yesterday",
    color: "bg-emerald-500",
  },
  {
    title: "Success Rate",
    value: "96.2%",
    change: "+0.8pt",
    color: "bg-emerald-500",
  },
  {
    title: "SMS Sent Today",
    value: "4,812",
    change: "98.7% delivered",
    color: "bg-amber-500",
  },
  {
    title: "Avg Settlement",
    value: "1.8s",
    change: "0.3s faster",
    color: "bg-teal-500",
  },
];

export default function Users() {
  const router = useRouter();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">this is the users page</div>
  );
}
