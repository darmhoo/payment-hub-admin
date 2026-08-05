"use client";

import { DataTable } from "@/components/table/app-table";
import React, { useEffect } from "react";
import { columns } from "./columns";

export default function Providers() {
  const [providers, setProviders] = React.useState([]);
  async function fetchProviders() {
    const response = await fetch("/api/providers/fetch-providers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch providers");
    }

    return response.json();
  }

  useEffect(() => {
    fetchProviders()
      .then((data) => {
        console.log("Fetched providers:", data.providers.data.data);
        setProviders(data.providers.data.data);
      })
      .catch((error) => {
        console.error("Error fetching providers:", error);
      });
  }, []);
  return (
    <div className="min-h-screen bg-slate-100">
      <DataTable columns={columns} data={providers} />
    </div>
  );
}
