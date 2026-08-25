'use client';

import { useCallback, useEffect } from 'react';

import { Download } from 'lucide-react';

import { DataTable } from '@/components/table/app-table';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';

import PageContainer from '@/components/app-page-container';
import AppPageHeader from '@/components/app-page-header';

import { useTransactions } from '@/components/providers/transactions-provider';

import { columns } from './column';
import { exportToCSV } from '@/lib/cvs-export';

export default function TransactionPage() {
  const { transactions, loading, fetchTransactions, error } = useTransactions();

  /**
   * Fetch transactions only when
   * the Transactions page mounts.
   */
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleExport = useCallback(() => {
    if (!transactions.length) {
      return;
    }

    exportToCSV(
      transactions,
      {
        reference: 'Reference',
        provider: 'Provider',
        customer: 'Customer',
        amount: 'Amount',
        status: 'Status',
        date: 'Date',
      },
      'transactions'
    );
  }, [transactions]);

  return (
    <PageContainer className="min-h-screen space-y-2 p-4">
      <AppPageHeader
        title="Transactions"
        description="Monitor all payment transactions."
        action={
          <Button type="button" onClick={handleExport} disabled={!transactions.length}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        }
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader text="Fetching transactions..." />
        </div>
      ) : error ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      ) : (
        <DataTable columns={columns} data={transactions} emptyMessage="No transactions found." />
      )}
    </PageContainer>
  );
}
