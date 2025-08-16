import { Router, Route, Switch } from 'wouter';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/context/AuthContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { EditorProvider } from '@/context/EditorContext';
import { ScrollSyncProvider } from '@/context/ScrollSyncContext';
import { PreviewProvider } from '@/contexts/PreviewContext';
import { ThemeProvider } from '@/components/theme-provider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Import only existing pages
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import AuthPage from '@/pages/AuthPage';
// Placeholder quiz page - create if needed
const ModernQuizPage = () => <div className="p-8">Quiz page placeholder</div>;
import ResultPage from '@/pages/ResultPage';
import LandingPage from '@/pages/LandingPage';
import EditorFixedPageWithDragDrop from '@/pages/editor-fixed-dragdrop';


export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <ErrorBoundary>
          <AuthProvider>
            <AdminAuthProvider>
              <Router>
                <div className="min-h-screen bg-background">
                  <Switch>
                    {/* Public routes */}
                    <Route path="/" component={Home} />
                    <Route path="/auth" component={AuthPage} />
                    <Route path="/landing" component={LandingPage} />
                    <Route path="/quiz" component={ModernQuizPage} />
                    <Route path="/result" component={ResultPage} />
                    
                    {/* Protected editor route */}
                    <ProtectedRoute
                      path="/editor-fixed"
                      component={() => (
                        <ErrorBoundary>
                          <EditorProvider>
                            <ScrollSyncProvider>
                              <PreviewProvider>
                                <EditorFixedPageWithDragDrop />
                              </PreviewProvider>
                            </ScrollSyncProvider>
                          </EditorProvider>
                        </ErrorBoundary>
                      )}
                    />

                    {/* Catch-all route */}
                    <Route component={NotFound} />
                  </Switch>
                </div>
              </Router>
              <Toaster />
              <SonnerToaster />
            </AdminAuthProvider>
          </AuthProvider>
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  );
}