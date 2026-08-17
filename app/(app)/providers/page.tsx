"use client";

import { DataTable } from "@/components/table/app-table";
import { Loader } from "@/components/ui/loader";
import PageContainer from "@/components/app-page-container";
import AppPageHeader from "@/components/app-page-header";
import CreateProviderDialog from "@/components/create-provider-dialog";
import { useProviders } from "@/components/providers/providers-provider";

import { columns } from "./columns";

export default function ProvidersPage() {
  const {
    providers,
    loading,
    reloadProviders,
  } = useProviders();

  return (
    <PageContainer className="min-h-screen space-y-2 p-4">
      <AppPageHeader
        title="Providers"
        description="Manage payment, SMS, and email providers."
        action={
          <CreateProviderDialog
            onProviderCreated={reloadProviders}
          />
        }
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
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