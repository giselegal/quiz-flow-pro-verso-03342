
import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import SchemaDrivenEditorResponsive from '@/components/editor/SchemaDrivenEditorResponsive';
import { ResultPage } from './pages/ResultPage';
import { Home } from './pages/Home';
import { FunnelsPage } from './pages/FunnelsPage';
import { QuizPage } from './pages/QuizPage';
import { ResultConfigPage } from './pages/ResultConfigPage';
import { Auth } from './components/auth/Auth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import DashboardPage from './pages/admin/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Switch>
              {/* Editor Routes - usando SchemaDrivenEditorResponsive */}
              <Route path="/editor">
                {() => <SchemaDrivenEditorResponsive />}
              </Route>
              <Route path="/editor/:id">
                {(params) => <SchemaDrivenEditorResponsive funnelId={params.id} />}
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" nest>
                <DashboardPage />
              </Route>
              
              {/* Public Routes */}
              <Route path="/" component={Home} />
              <Route path="/quiz/:id" component={QuizPage} />
              <Route path="/resultado/:resultId" component={ResultPage} />
              <Route path="/auth" component={Auth} />

              {/* Protected Routes */}
              <ProtectedRoute path="/admin/funis" component={FunnelsPage} />
              <ProtectedRoute path="/admin/resultados" component={ResultConfigPage} />
            </Switch>
            <Toaster />
          </div>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
