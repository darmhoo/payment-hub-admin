"use client";

import { DataTable } from "@/components/table/app-table";
import React, { useEffect } from "react";
import { columns } from "./columns";
import { useLoading } from "@/hooks/use-loading";
import { Loader } from "@/components/ui/loader";

export default function Providers() {
  const [providers, setProviders] = React.useState([]);
  const { loading, withLoading } = useLoading();

  async function fetchProviders() {
    const response = await fetch("/api/providers", {
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
    withLoading(fetchProviders)
      .then((data) => {
        setProviders(data.providers.data.data);
      })
      .catch((error) => {
        console.error("Error fetching providers:", error);
      });
  }, []);
  return (
    <div className="min-h-screen bg-slate-100 px-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Providers</h1>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader text="Fetching providers..." />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={providers}
          emptyMessage="No providers found."
        />
      )}
    </div>
  );
}
