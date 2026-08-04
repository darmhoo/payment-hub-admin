"use client";

import { DataTable } from "@/components/app-table";
import { useEffect } from "react";

export default function Providers() {
  async function fetchProviders() {
    const response = await fetch("/api/providers/fetch-providers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response from fetchProviders:", response);

    if (!response.ok) {
      throw new Error("Failed to fetch providers");
    }

    return response.json();
  }

  useEffect(() => {
    fetchProviders()
      .then((data) => {
        console.log("Fetched providers:", data);
      })
      .catch((error) => {
        console.error("Error fetching providers:", error);
      });
  }, []);
  return (
    <div className="min-h-screen bg-slate-100">
      <DataTable columns={[]} data={[]} />
    </div>
  );
}
