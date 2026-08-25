'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { DataTable } from '@/components/table/app-table';
import { Loader } from '@/components/ui/loader';

import PageContainer from '@/components/app-page-container';
import AppPageHeader from '@/components/app-page-header';

import CreateProviderDialog from '@/components/create-provider-dialog';
import EditProviderDialog from '@/components/edit-provider-dialog';
import ViewProviderDialog from '@/components/view-provider-dialogue';

import { useProviders } from '@/components/providers/providers-provider';

import { getColumns, type Provider } from './columns';

export default function ProvidersPage() {
  const { providers, loading, fetchProviders, reloadProviders } = useProviders();

  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  const [viewingProvider, setViewingProvider] = useState<Provider | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  /**
   * Fetch only when Providers page mounts.
   */
  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  /**
   * View provider.
   */
  const handleView = useCallback((provider: Provider) => {
    setViewingProvider(provider);
    setViewDialogOpen(true);
  }, []);

  /**
   * Edit provider.
   */
  const handleEdit = useCallback((provider: Provider) => {
    setEditingProvider(provider);
    setEditDialogOpen(true);
  }, []);

  /**
   * Table columns.
   */
  const providerColumns = useMemo(
    () =>
      getColumns({
        onView: handleView,
        onEdit: handleEdit,
      }),
    [handleView, handleEdit]
  );

  /**
   * Edit dialog.
   */
  const handleEditDialogChange = useCallback((open: boolean) => {
    setEditDialogOpen(open);

    if (!open) {
      setEditingProvider(null);
    }
  }, []);

  /**
   * View dialog.
   */
  const handleViewDialogChange = useCallback((open: boolean) => {
    setViewDialogOpen(open);

    if (!open) {
      setViewingProvider(null);
    }
  }, []);

  return (
    <PageContainer className="min-h-screen space-y-2 p-4">
      <AppPageHeader
        title="Providers"
        description="Manage payment, SMS, and email providers."
        action={<CreateProviderDialog onProviderCreated={reloadProviders} />}
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader text="Fetching providers..." />
        </div>
      ) : (
        <DataTable columns={providerColumns} data={providers} emptyMessage="No providers found." />
      )}

      <ViewProviderDialog
        provider={viewingProvider}
        open={viewDialogOpen}
        onOpenChange={handleViewDialogChange}
      />

      <EditProviderDialog
        provider={editingProvider}
        open={editDialogOpen}
        onOpenChange={handleEditDialogChange}
        onProviderUpdated={reloadProviders}
      />
    </PageContainer>
  );
}
