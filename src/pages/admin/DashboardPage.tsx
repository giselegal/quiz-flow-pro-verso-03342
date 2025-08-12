import { LoadingSpinner } from "@/components/ui/loading-spinner";
import React, { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
import { AdminSidebar } from "../../components/admin/AdminSidebar";

// Lazy loading das páginas do dashboard
const DashboardOverview = lazy(() => import("./OverviewPage"));
const QuizPage = lazy(() => import("./QuizPage"));
const FunnelPanelPage = lazy(() => import("./FunnelPanelPage"));
const ABTestPage = lazy(() => import("./ABTestPage"));
const SettingsPage = lazy(() => import("./SettingsPage"));
const CreativesPage = lazy(() => import("./CreativesPage"));
const AnalyticsPage = lazy(() => import("./AnalyticsPage"));
const EditorPage = lazy(() => import("./EditorPage"));

// Componente de loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <LoadingSpinner size="lg" color="#B89B7A" className="mx-auto" />
      <p style={{ color: "#6B4F43" }}>Carregando...</p>
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
            <Switch>
              {/* Rota principal - Overview */}
              <Route path="/admin" component={DashboardOverview} />
              <Route path="/admin/" component={DashboardOverview} />

              {/* Rotas do dashboard */}
              <Route path="/admin/quiz" component={QuizPage} />
              <Route path="/admin/funis" component={FunnelPanelPage} />
              <Route path="/admin/ab-tests" component={ABTestPage} />
              <Route path="/admin/settings" component={SettingsPage} />
              <Route path="/admin/criativos" component={CreativesPage} />
              <Route path="/admin/analytics" component={AnalyticsPage} />
              <Route path="/admin/editor" component={EditorPage} />
            </Switch>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
