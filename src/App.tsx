
import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { EditorProvider } from '@/context/EditorContext';
import { FunnelsProvider } from '@/context/FunnelsContext';
import SchemaDrivenEditorResponsive from '@/components/editor/SchemaDrivenEditorResponsive';
import EditorPage from '@/pages/editor-fixed';
import ResultPage from './pages/ResultPage';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import FunnelsPage from './pages/FunnelsPage';
import QuizPageUser from './components/QuizPageUser';
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
              {/* Editor Routes - envolvidas com EditorProvider */}
              <Route path="/editor">
                {() => (
                  <EditorProvider>
                    <SchemaDrivenEditorResponsive />
                  </EditorProvider>
                )}
              </Route>
              <Route path="/editor/:id">
                {(params) => (
                  <EditorProvider>
                    <SchemaDrivenEditorResponsive funnelId={params.id} />
                  </EditorProvider>
                )}
              </Route>
              
              {/* Editor Fixed Route - nova rota ativada */}
              <Route path="/editor-fixed">
                {() => (
                  <EditorProvider>
                    <FunnelsProvider>
                      <EditorPage />
                    </FunnelsProvider>
                  </EditorProvider>
                )}
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" nest>
                <DashboardPage />
              </Route>
              
              {/* Public Routes */}
              <Route path="/" component={Home} />
              <Route path="/quiz/:id" component={QuizPageUser} />
              <Route path="/resultado/:resultId" component={ResultPage} />
              <Route path="/auth" component={AuthPage} />

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
