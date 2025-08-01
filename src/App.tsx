
import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { SchemaDrivenEditorClean } from '@/components/editor/SchemaDrivenEditorClean';
import { ResultPage } from './pages/ResultPage';
import { Home } from './pages/Home';
import { FunnelsPage } from './pages/FunnelsPage';
import { QuizPage } from './pages/QuizPage';
import { ResultConfigPage } from './pages/ResultConfigPage';
import { Auth } from './components/auth/Auth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Switch>
            {/* Editor Routes - usando SchemaDrivenEditorClean */}
            <Route path="/editor">
              {() => <SchemaDrivenEditorClean />}
            </Route>
            <Route path="/editor/:id">
              {(params) => <SchemaDrivenEditorClean funnelId={params.id} />}
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
    </AuthProvider>
  );
}

export default App;
