import React from 'react';
import { LovableClientProvider } from './LovableClientProvider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LovableClientProvider>{children}</LovableClientProvider>
    </React.Suspense>
  );
}
