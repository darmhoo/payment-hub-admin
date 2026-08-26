'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { DataTable } from '@/components/table/app-table';
import { Loader } from '@/components/ui/loader';

import AppPageHeader from '@/components/app-page-header';
import PageContainer from '@/components/app-page-container';
import { AuditLog, useAuditLogs } from '@/components/providers/audit-log-provider';
import { getColumns } from './columns';

export default function AppUsers() {
  const { auditlogs, loading, fetchAuditLogs, reloadAuditLogs, error } = useAuditLogs();


   const handleView = useCallback((auditLog: AuditLog) => {
      
    }, []);
  
    /**
     * Edit provider.
     */
 
  const auditLogColumns = useMemo(
      () =>
        getColumns({
          onView: handleView
          
        }),
      [handleView]
    );

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <PageContainer className="min-h-screen space-y-2 p-4">
      <AppPageHeader title="Audit Logs" description="View Audit Logs" />

      {loading ? (
        <div className="flex min-h-75 items-center justify-center">
          <Loader text="Fetching logs..." />
        </div>
      ) : (
        <DataTable columns={auditLogColumns} data={auditlogs} emptyMessage="No logs found." />
      )}
    </PageContainer>
  );
}
