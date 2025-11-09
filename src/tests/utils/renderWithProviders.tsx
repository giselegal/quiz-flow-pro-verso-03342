import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuperUnifiedProvider } from '@/providers/SuperUnifiedProvider';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { HelmetProvider } from 'react-helmet-async';
// Providers reais (podem ser simplificados/mocados se necessário)
import { ThemeProvider as CustomThemeProvider } from '@/contexts';
import { AuthProvider } from '@/contexts';
import { UnifiedAppProvider } from '@/providers/UnifiedAppProvider';
import { SecurityProvider } from '@/providers/SecurityProvider';
import { MonitoringProvider } from '@/components/monitoring/MonitoringProvider';

interface Options { path?: string; }

export function renderWithProviders(ui: ReactElement, { path = '/' }: Options = {}) {
    const location = memoryLocation({ path });
    const qc = new QueryClient();
    return render(
        <HelmetProvider>
            <QueryClientProvider client={qc}>
                <SuperUnifiedProvider autoLoad={false} debugMode={false}>
                    <CustomThemeProvider defaultTheme="light">
                        <AuthProvider>
                            <SecurityProvider>
                                <MonitoringProvider enableAlerts={false} enableAnalytics={false}>
                                    <UnifiedAppProvider debugMode={false} autoLoad>
                                        <Router hook={location.hook}>
                                            {ui}
                                        </Router>
                                    </UnifiedAppProvider>
                                </MonitoringProvider>
                            </SecurityProvider>
                        </AuthProvider>
                    </CustomThemeProvider>
                </SuperUnifiedProvider>
            </QueryClientProvider>
        </HelmetProvider>,
    );
}

export function renderAppAt(path: string, app: ReactElement) {
    return renderWithProviders(app, { path });
}
