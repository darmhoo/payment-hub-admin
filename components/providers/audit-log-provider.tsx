'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { notify } from '@/lib/toast';

export type AuditLog = {
  action: string;
  actorName: string;
  actorType: string;
  entityType: string;
  IpAddress: boolean;
  SessionId: boolean;
 
};

type AuditLogContextType = {
  auditlogs: AuditLog[];
  loading: boolean;
  error: string | null;
  fetchAuditLogs: () => Promise<void>;
  reloadAuditLogs: () => Promise<void>;
};

const AuditLogContext = createContext<AuditLogContextType | null>(null);

export function AuditLogProvider({ children }: { children: ReactNode }) {
  const [auditlogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/audit-logs', {
        method: 'GET',
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error ?? result?.message ?? 'Failed to fetch providers');
      }

      const auditlogsData = result?.audit_logs?.data?.data?.auditLogs ?? [];

      setAuditLogs(Array.isArray(auditlogsData) ? auditlogsData : []);
      notify.success('Audit logs fetched successfully');
    } catch (error) {
      console.error('Error fetching logs:', error);

      setAuditLogs([]);

      setError(error instanceof Error ? error.message : 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, []);

  const reloadAuditLogs = useCallback(async () => {
    await fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <AuditLogContext.Provider
      value={{
        auditlogs,
        loading,
        error,
        fetchAuditLogs,
        reloadAuditLogs,
      }}
    >
      {children}
    </AuditLogContext.Provider>
  );
}

export function useAuditLogs() {
  const context = useContext(AuditLogContext);

  if (!context) {
    throw new Error('useAuthLogs must be used within AuthlogsProvider');
  }

  return context;
}
