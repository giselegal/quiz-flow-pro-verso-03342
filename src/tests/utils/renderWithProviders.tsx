import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { HelmetProvider } from 'react-helmet-async';
// Providers reais (podem ser simplificados/mocados se necessário)
import { ThemeProvider as CustomThemeProvider } from '@/contexts';
import { AuthProvider } from '@/contexts';
import OptimizedProviderStack from '@/providers/OptimizedProviderStack';
import { SecurityProvider } from '@/providers/SecurityProvider';
import { MonitoringProvider } from '@/components/monitoring/MonitoringProvider';

interface Options { path?: string; }

export function renderWithProviders(ui: ReactElement, { path = '/' }: Options = {}) {
    const location = memoryLocation({ path });
    return render(
        <HelmetProvider>
            <CustomThemeProvider defaultTheme="light">
                <AuthProvider>
                    <SecurityProvider>
                        <MonitoringProvider enableAlerts={false} enableAnalytics={false}>
                            <OptimizedProviderStack enableLazyLoading={false} enableComponentCaching={false} debugMode={false}>
                                <Router hook={location.hook}>
                                    {ui}
                                </Router>
                            </OptimizedProviderStack>
                        </MonitoringProvider>
                    </SecurityProvider>
                </AuthProvider>
            </CustomThemeProvider>
        </HelmetProvider>
    );
}

export function renderAppAt(path: string, app: ReactElement) {
    return renderWithProviders(app, { path });
}
