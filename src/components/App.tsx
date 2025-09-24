/**
 * Main App Component with Security Integration
 * Integrando toda a arquitetura de segurança da Fase 5
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { EditorPage } from '@/pages/EditorPage';

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
                <Routes>
                  {/* Rotas principais */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/editor/*" element={<EditorPage />} />
                  
                  {/* Rotas de segurança */}
                  <Route path="/security" element={<SecurityDashboard />} />
                  <Route path="/security/settings" element={<SecuritySettingsPage />} />
                  
                  {/* Fallback */}
                  <Route path="*" element={<div>Página não encontrada</div>} />
                </Routes>
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