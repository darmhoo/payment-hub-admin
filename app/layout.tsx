import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/components/providers/auth-provider';
import { UsersProvider } from '@/components/providers/users-provider';
import { TransactionsProvider } from '@/components/providers/transactions-provider';
import { ProvidersProvider } from '@/components/providers/providers-provider';
import { ProductsProvider } from '@/components/providers/loan-product-provider';
import { AuditLogProvider } from '@/components/providers/audit-log-provider';

export const metadata: Metadata = {
  title: {
    default: 'PayHub Admin',
    template: '%s | PayHub Admin',
  },
  description: 'Manage integrations, providers, and system settings.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <UsersProvider>
            <TransactionsProvider>
              <ProvidersProvider>
                <ProductsProvider>
                  <AuditLogProvider>{children}</AuditLogProvider>
                </ProductsProvider>
              </ProvidersProvider>
            </TransactionsProvider>
          </UsersProvider>
        </AuthProvider>

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
