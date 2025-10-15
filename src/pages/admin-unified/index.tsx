/**
 * 🎯 ADMIN DASHBOARD UNIFICADO - Entry Point
 * Dashboard consolidado com todas as funcionalidades e dados reais do Supabase
 */

import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'wouter';
import { AdminLayout } from './AdminLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load pages
const OverviewPage = lazy(() => import('./OverviewPage'));
const AnalyticsPage = lazy(() => import('./AnalyticsPage'));
const ParticipantsPage = lazy(() => import('./ParticipantsPage'));
const FunnelsPage = lazy(() => import('./FunnelsPage'));
const TemplatesPage = lazy(() => import('./TemplatesPage'));
const ABTestsPage = lazy(() => import('./ABTestsPage'));
const CreativesPage = lazy(() => import('./CreativesPage'));
const IntegrationsPage = lazy(() => import('./IntegrationsPage'));
const SettingsPage = lazy(() => import('./SettingsPage'));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner size="lg" />
  </div>
);

export default function AdminDashboardUnified() {
  return (
    <AdminLayout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          {/* Principal */}
          <Route path="/admin" component={OverviewPage} />
          <Route path="/admin/" component={OverviewPage} />
          
          {/* Analytics */}
          <Route path="/admin/analytics" component={AnalyticsPage} />
          
          {/* Conteúdo */}
          <Route path="/admin/funnels" component={FunnelsPage} />
          <Route path="/admin/templates" component={TemplatesPage} />
          <Route path="/admin/participants" component={ParticipantsPage} />
          
          {/* Ferramentas */}
          <Route path="/admin/ab-tests" component={ABTestsPage} />
          <Route path="/admin/creatives" component={CreativesPage} />
          <Route path="/admin/integrations" component={IntegrationsPage} />
          
          {/* Sistema */}
          <Route path="/admin/settings" component={SettingsPage} />
          
          {/* Fallback */}
          <Route component={OverviewPage} />
        </Switch>
      </Suspense>
    </AdminLayout>
  );
}
