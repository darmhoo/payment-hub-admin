import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@base-ui/react";
import { ArrowUpRight, Search} from "lucide-react";

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

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-8 py-4">
        <div>
          <p className="text-xs text-gray-500">Gateway</p>
          <h1 className="text-xl font-bold text-slate-900">
            Transactions
          </h1>
        </div>

<div className="flex gap-3">
        <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            placeholder="Search transactions, logs..."
            className="w-fit border-none bg-transparent text-sm outline-none"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button />} className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-200 font-semibold text-amber-800">
            OA
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </header>

      {/* Dashboard */}
      <main className="p-8">
        
      </main>
    </div>
  );
}