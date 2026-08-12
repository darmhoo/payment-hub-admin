"use client";

import {
  Info,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Provider {
  name: string;
  volume: number;
  percentage: number;
  icon?: React.ReactNode;
}

const periods = [
  {
    label: "This Week",
    value: "this-week",
  },
  {
    label: "Last Week",
    value: "last-week",
  },
  {
    label: "This Month",
    value: "this-month",
  },
  {
    label: "Last Month",
    value: "last-month",
  },
];

const providers: Provider[] = [
  {
    name: "Paystack",
    volume: 87620000,
    percentage: 35.7,
    icon: (
      <span className="text-blue-500 font-bold">
        ▤
      </span>
    ),
  },
  {
    name: "Flutterwave",
    volume: 63540000,
    percentage: 25.9,
    icon: (
      <span className="text-orange-500 font-bold">
        ✺
      </span>
    ),
  },
  {
    name: "Interswitch",
    volume: 39850000,
    percentage: 16.2,
    icon: (
      <span className="text-red-500 font-bold">
        ⚡
      </span>
    ),
  },
  {
    name: "Stripe",
    volume: 28500000,
    percentage: 11.6,
    icon: (
      <span className="text-indigo-600 font-bold">
        S
      </span>
    ),
  },
  {
    name: "Others",
    volume: 26170000,
    percentage: 10.6,
    icon: (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
        <MoreHorizontal className="h-3 w-3 text-slate-400" />
      </div>
    ),
  },
];

const formatCurrency = (value: number) => { 
  return `Ksh${value.toLocaleString("en-NG")}`;
};

export default function DashboardModal() {
    const router = useRouter()


  return (
    <Card className="w-full max-w-md rounded-xl border-zinc-200 shadow-sm">
      <CardContent>

        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-semibold text-zinc-800">
              Top Providers by Volume
            </h3>

            <Info className="h-3.5 w-3.5 text-zinc-400" />
          </div>

          {/* Period Select */}
          <Select defaultValue="this-week">
            <SelectTrigger className="h-7 w-27.5 px-2.5 text-xs">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>

            <SelectContent>
              {periods.map((period) => (
                <SelectItem
                  key={period.value}
                  value={period.value}
                >
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>

        {/* Table headings */}
        <div className="mb-2 grid grid-cols-[1fr_auto_auto] items-center gap-10 px-1 text-[9px] font-semibold uppercase tracking-wide text-zinc-400">
          <span>Provider</span>
          <span>VolumEEe</span>
          <span>%</span>
        </div>

        {/* Providers */}
        <div className="space-y-3">

          {providers.map((provider) => (
            <div key={provider.name}>

              {/* Provider row */}
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4">

                {/* Provider */}
                <div className="flex min-w-0 items-center gap-2">

                  <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                    {provider.icon}
                  </div>

                  <span className="truncate text-xs font-semibold text-zinc-700">
                    {provider.name}
                  </span>

                </div>

                {/* Volume */}
                <span className="text-[10px] font-semibold text-zinc-600">
                  {formatCurrency(provider.volume)}
                </span>

                {/* Percentage */}
                <span className="w-7 text-right text-[10px] text-zinc-400">
                  {provider.percentage}%
                </span>

              </div>

              {/* Progress bar */}
              <div className="ml-7 mt-1 h-1 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${provider.percentage}%`,
                  }}
                />
              </div>

            </div>
          ))}

        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-zinc-100 pt-3">

          <button
            type="button"
            onClick={() => router.push("/providers")}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            View all providers

            <ArrowRight className="h-3.5 w-3.5" />
          </button>

        </div>

      </CardContent>
    </Card>
  );
}