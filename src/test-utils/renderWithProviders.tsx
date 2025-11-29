import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { AuthStorageProvider } from '@/contexts/consolidated/AuthStorageProvider';
import { RealTimeProvider } from '@/contexts/consolidated/RealTimeProvider';
import { ValidationResultProvider } from '@/contexts/consolidated/ValidationResultProvider';
import { EditorStateProvider } from '@/core/contexts/EditorContext/EditorStateProvider';
import { UXProvider } from '@/contexts/consolidated/UXProvider';
import { FunnelDataProvider } from '@/contexts/funnel/FunnelDataProvider';
import { QuizStateProvider } from '@/contexts/quiz/QuizStateProvider';
import { VersioningProvider } from '@/contexts/versioning/VersioningProvider';

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
                <RealTimeProvider>
                    <UXProvider>
                        <FunnelDataProvider>
                            <VersioningProvider>
                                <QuizStateProvider>
                                    <EditorStateProvider>
                                        <ValidationResultProvider>
                                            {ui}
                                        </ValidationResultProvider>
                                    </EditorStateProvider>
                                </QuizStateProvider>
                            </VersioningProvider>
                        </FunnelDataProvider>
                    </UXProvider>
                </RealTimeProvider>
            </AuthStorageProvider>
        </QueryClientProvider>
    );
}

export { QueryClientProvider };