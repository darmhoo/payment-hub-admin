'use client';

import { useCallback, useEffect, useMemo } from 'react';

import { DataTable } from '@/components/table/app-table';
import { Loader } from '@/components/ui/loader';

import AppPageHeader from '@/components/app-page-header';
import PageContainer from '@/components/app-page-container';
import { useAppUsers } from '@/components/providers/app-user-provider';
import { AppUsers, getColumns } from './columns';

export default function AppUsersPage() {
  const {
    appUsers,
    loading,
    fetchAppUsers,
  } = useAppUsers();

  const handleView = useCallback((appUser: AppUsers) => {
    console.log(appUser);
  }, []);

  const appUsersColumns = useMemo(
    () =>
      getColumns({
        onView: handleView,
      }),
    [handleView]
  );

  useEffect(() => {
    fetchAppUsers();
  }, [fetchAppUsers]);

  return (
    <PageContainer className="min-h-screen space-y-2 p-4">
      <AppPageHeader
        title="App Users"
        description="All app users"
      />

      {loading ? (
        <div className="flex min-h-75 items-center justify-center">
          <Loader text="Fetching users..." />
        </div>
      ) : (
        <DataTable
          columns={appUsersColumns}
          data={appUsers}
          emptyMessage="No users found."
        />
      )}
    </PageContainer>
  );
}