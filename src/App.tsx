
import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import SchemaDrivenEditorResponsive from './components/editor/SchemaDrivenEditorResponsive';
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
            {/* Editor Routes - usando EditorPage correto */}
            <Route path="/editor">
              {() => <SchemaDrivenEditorResponsive />}
            </Route>
            <Route path="/editor/:id">
              {(params) => <SchemaDrivenEditorResponsive />}
            </Route>
            
            {/* Public Routes */}
            <Route path="/" component={Home} />
            <Route path="/quiz/:id" component={QuizPage} />
            <Route path="/resultado/:resultId" component={ResultPage} />
            <Route path="/auth" component={Auth} />

            {/* Protected Routes */}
            {/* Rotas temporariamente públicas para desenvolvimento */}
            <Route path="/admin/funis" component={FunnelsPage} />
            <Route path="/admin/resultados" component={ResultConfigPage} />
          </Switch>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
