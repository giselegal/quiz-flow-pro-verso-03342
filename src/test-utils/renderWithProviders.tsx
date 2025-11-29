import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { AuthStorageProvider } from '@/contexts/consolidated/AuthStorageProvider';
import { RealTimeProvider } from '@/contexts/consolidated/RealTimeProvider';

// Cria um QueryClient isolado para cada render, evitando estados compartilhados entre testes
function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
}

export function renderWithProviders(ui: React.ReactElement) {
    const client = createTestQueryClient();
    return render(
        <QueryClientProvider client={client}>
            <AuthStorageProvider>
                <RealTimeProvider value={{
                    connected: false,
                    subscribe: () => () => { },
                    publish: () => { },
                    presence: { onlineUsers: 0 },
                } as any}>
                    {ui}
                </RealTimeProvider>
            </AuthStorageProvider>
        </QueryClientProvider>
    );
}

export { QueryClientProvider };