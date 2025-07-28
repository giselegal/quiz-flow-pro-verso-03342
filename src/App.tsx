
import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { EditorProvider } from '@/contexts/EditorContext';

// Páginas
import HomePage from '@/pages/HomePage';
import QuizPage from '@/pages/QuizPage';
import AdminPage from '@/pages/AdminPage';
import SchemaDrivenEditorPage from '@/pages/SchemaDrivenEditorPage';
import CraftEditorPage from '@/pages/CraftEditorPage';

// Componentes
import { Navigation } from '@/components/Navigation';

function App() {
  return (
    <AuthProvider>
      <EditorProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/quiz" component={QuizPage} />
                <Route path="/admin" component={AdminPage} />
                <Route path="/editor/:id?" component={SchemaDrivenEditorPage} />
                <Route path="/craft-editor/:id?" component={CraftEditorPage} />
                <Route>
                  <div className="text-center py-20">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-xl text-gray-600">Página não encontrada</p>
                  </div>
                </Route>
              </Switch>
            </main>
            <Toaster />
          </div>
        </Router>
      </EditorProvider>
    </AuthProvider>
  );
}

export default App;
