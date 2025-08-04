import ErrorBoundary from "@/components/common/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { AuthProvider } from "@/context/AuthContext";
import { EditorProvider } from "@/context/EditorContext";
import { ScrollSyncProvider } from "@/context/ScrollSyncContext";
import DebugEditorContext from "@/pages/debug-editor";
import EditorPage from "@/pages/editor-fixed";
import { Route, Router, Switch } from "wouter";
import MigrationPanel from "./components/admin/MigrationPanel";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import QuizPageUser from "./components/QuizPageUser";
import DashboardPage from "./pages/admin/DashboardPage";
import AuthPage from "./pages/AuthPage";
import FunnelsPage from "./pages/FunnelsPage";
import Home from "./pages/Home";
import { ResultConfigPage } from "./pages/ResultConfigPage";
import ResultPage from "./pages/ResultPage";

function App() {
  console.log("🔧 DEBUG: App component iniciado");
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("🚨 App Error:", error);
        console.error("🔍 Error Info:", errorInfo);
      }}
    >
      <AuthProvider>
        <AdminAuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Switch>
                {/* Redirect /editor para /editor-fixed */}
                <Route path="/editor">
                  {() => {
                    window.location.href = "/editor-fixed";
                    return null;
                  }}
                </Route>
                <Route path="/editor/:id">
                  {() => {
                    window.location.href = "/editor-fixed";
                    return null;
                  }}
                </Route>

                {/* Editor Fixed Route - rota principal do editor */}
                <Route path="/editor-fixed">
                  {() => (
                    <ErrorBoundary>
                      <EditorProvider>
                        <ScrollSyncProvider>
                          <EditorPage />
                        </ScrollSyncProvider>
                      </EditorProvider>
                    </ErrorBoundary>
                  )}
                </Route>

                {/* Debug Editor Route */}
                <Route path="/debug-editor">
                  {() => (
                    <ErrorBoundary>
                      <EditorProvider>
                        <DebugEditorContext />
                      </EditorProvider>
                    </ErrorBoundary>
                  )}
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" nest>
                  <DashboardPage />
                </Route>
                <Route path="/admin/migrate" component={MigrationPanel} />

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
    </ErrorBoundary>
  );
}

export default App;
