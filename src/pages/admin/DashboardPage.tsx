
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy loading das páginas do dashboard
const DashboardOverview = lazy(() => import('./OverviewPage'));
const QuizPage = lazy(() => import('./QuizPage'));
const FunnelPanelPage = lazy(() => import('./FunnelPanelPage'));
const ABTestPage = lazy(() => import('./ABTestPage'));
const SettingsPage = lazy(() => import('./SettingsPage'));
const CreativesPage = lazy(() => import('./CreativesPage'));
const AnalyticsPage = lazy(() => import('./AnalyticsPage'));
const EditorPage = lazy(() => import('./EditorPage'));

// Componente de loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <LoadingSpinner size="lg" color="#B89B7A" className="mx-auto" />
      <p className="mt-4 text-gray-600">Carregando...</p>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-[#FAF9F7]">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Conteúdo principal */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Rota principal - Overview */}
              <Route index element={<DashboardOverview />} />
              
              {/* Rotas do dashboard conforme solicitado */}
              <Route path="quiz" element={<QuizPage />} />
              <Route path="funis" element={<FunnelPanelPage />} />
              <Route path="ab-tests" element={<ABTestPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="criativos" element={<CreativesPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="editor" element={<EditorPage />} />
              
              {/* Redirecionamento para rota não encontrada */}
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
