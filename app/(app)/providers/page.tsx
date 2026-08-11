"use client";

import { DataTable } from "@/components/table/app-table";
import React, { useEffect } from "react";
import { columns } from "./columns";
import { useLoading } from "@/hooks/use-loading";
import { Loader } from "@/components/ui/loader";
import PageContainer from "@/components/app-page-container";
import AppPageHeader from "@/components/app-page-header";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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
      <PageContainer className="space-y-6 p-4">
            <AppPageHeader
              title="Providers"
              description="Manage payment gateway and sms providers."
              action={
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
              } />
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
    </PageContainer>
  );
}
