import React from 'react';
import { LovableClientProvider } from './LovableClientProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const qc = new QueryClient();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <QueryClientProvider client={qc}>
        <LovableClientProvider>{children}</LovableClientProvider>
      </QueryClientProvider>
    </React.Suspense>
  );
}
