import { Suspense, lazy } from 'react';
import { Route, Router, Switch } from 'wouter';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './context/AuthContext';

// Lazy loading apenas das páginas essenciais
const Home = lazy(() => import('./pages/Home'));
const QuizModularPage = lazy(() => import('./pages/QuizModularPage'));
const ConfigurationTest = lazy(() => import('./pages/ConfigurationTest'));

// Loading component simples
const PageLoading = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
);

/**
 * 🎯 APLICAÇÃO SIMPLIFICADA PARA LOVABLE
 * 
 * Versão otimizada para funcionar no ambiente Lovable
 */
function AppSimple() {
    return (
        <AuthProvider>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <Router>
                    <Suspense fallback={<PageLoading />}>
                        <Switch>
                            {/* Rota principal - Home */}
                            <Route path="/" component={() =>
                                <Suspense fallback={<PageLoading />}>
                                    <Home />
                                </Suspense>
                            } />

                            {/* Quiz modular - página principal de produção */}
                            <Route path="/quiz" component={() =>
                                <Suspense fallback={<PageLoading />}>
                                    <QuizModularPage />
                                </Suspense>
                            } />

                            {/* Teste do sistema de configuração */}
                            <Route path="/config-test" component={() =>
                                <Suspense fallback={<PageLoading />}>
                                    <ConfigurationTest />
                                </Suspense>
                            } />

                            {/* Fallback para rotas não encontradas */}
                            <Route>
                                <div className="min-h-screen flex items-center justify-center">
                                    <div className="container mx-auto text-center">
                                        <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
                                        <p className="text-lg text-gray-600 mb-8">A página que você está procurando não existe.</p>
                                        <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                                            Voltar ao Quiz
                                        </a>
                                    </div>
                                </div>
                            </Route>
                        </Switch>
                    </Suspense>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default AppSimple;
