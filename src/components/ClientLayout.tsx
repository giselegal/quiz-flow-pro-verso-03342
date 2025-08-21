import React from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  console.log('🔧 ClientLayout: CARREGANDO SEM LOVABLE PROVIDER...');

  return (
    <React.Suspense
      fallback={
        <div
          style={{
            background: '#f093fb',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          🚀 Carregando App Limpo...
        </div>
      }
    >
      {children}
    </React.Suspense>
  );
}
