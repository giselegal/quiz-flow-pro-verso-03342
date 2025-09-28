/**
 * Main App Component with Security Integration
 * Integrando toda a arquitetura de segurança da Fase 5
 */

import React from 'react';
import { Route, Router, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

// Providers de Segurança
import { SecurityProvider } from '@/providers/SecurityProvider';
import SecurityMiddleware from '@/components/security/SecurityMiddleware';
import SecurityAlert from '@/components/security/SecurityAlert';

// Principais componentes e páginas
import { FunnelMasterProvider } from '@/providers/FunnelMasterProvider';
import { SecurityDashboard } from '@/components/security/SecurityDashboard';
import { SecuritySettingsPage } from '@/components/security/SecuritySettingsPage';

// Páginas existentes (exemplos)
import { HomePage } from '@/pages/HomePage';
import EditorPage from '@/pages/EditorPage';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="funnel-app-theme">
      <SecurityProvider>
        <SecurityMiddleware>
          <Router>
            <div className="min-h-screen bg-background">
              {/* Alert de segurança global */}
              <SecurityAlert />
              
              {/* Providers principais */}
              <FunnelMasterProvider>
                <Switch>
                  {/* Rotas principais */}
                  <Route path="/">
                    <HomePage />
                  </Route>
                  <Route path="/editor">
                    <EditorPage />
                  </Route>

                  {/* Rotas de segurança */}
                  <Route path="/security">
                    <SecurityDashboard />
                  </Route>
                  <Route path="/security/settings">
                    <SecuritySettingsPage />
                  </Route>

                  {/* Fallback */}
                  <Route>
                    <div>Página não encontrada</div>
                  </Route>
                </Switch>
              </FunnelMasterProvider>
              
              {/* Toast notifications */}
              <Toaster />
            </div>
          </Router>
        </SecurityMiddleware>
      </SecurityProvider>
    </ThemeProvider>
  );
};

export default App;