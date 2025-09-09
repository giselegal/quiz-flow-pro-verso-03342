// Versão INLINE sem dynamic imports para contornar problemas Lovable
import { useEffect } from 'react';
import { Route, Router, Switch } from 'wouter';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { performanceManager } from './utils/performanceManager';

// IMPORTAÇÕES DIRETAS (sem lazy) para contornar problemas de dynamic imports
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import QuizModularPage from './pages/QuizModularPage';

// FALLBACK para outras páginas que não são essenciais para funcionamento básico
const SimplePage = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="container mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-gray-600 mb-8">Esta página foi temporariamente simplificada devido a problemas de infraestrutura.</p>
      <a href="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
        Voltar ao Quiz
      </a>
    </div>
  </div>
);

/**
 * 🔧 VERSÃO SIMPLIFICADA PARA CONTORNAR PROBLEMAS LOVABLE
 * 
 * Esta versão remove:
 * - Dynamic imports (lazy loading)
 * - Páginas complexas que podem ter problemas de carregamento
 * - Dependências de assets externos
 * 
 * Mantém apenas o essencial:
 * - Quiz principal (QuizModularPage)
 * - Página home  
 * - Autenticação
 */
function App() {
  useEffect(() => {
    performanceManager.initialize();
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Switch>
            {/* Rota principal - Quiz */}
            <Route path="/" component={Home} />
            
            {/* Quiz modular - página principal de produção */}
            <Route path="/quiz" component={QuizModularPage} />
            <Route path="/quiz/:step" component={QuizModularPage} />
            
            {/* Autenticação */}
            <Route path="/auth" component={AuthPage} />
            
            {/* Páginas simplificadas temporárias */}
            <Route path="/editor" component={() => <SimplePage title="Editor" />} />
            <Route path="/dashboard" component={() => <SimplePage title="Dashboard" />} />
            
            {/* Fallback para qualquer outra rota */}
            <Route>
              <SimplePage title="Página não encontrada" />
            </Route>
          </Switch>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
