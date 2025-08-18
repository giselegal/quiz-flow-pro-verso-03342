import { useAuth } from '@/context/AuthContext';
import { Route } from 'wouter';

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ path, component: Component }) => {
  console.log('🔒 ProtectedRoute: INICIANDO para path:', path);

  const { user } = useAuth();

  // Allow access during development (multiple checks for robustness)
  const isDevelopment =
    import.meta.env.DEV ||
    import.meta.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'development' ||
    window.location.hostname === 'localhost';

  const shouldAllowAccess = user || isDevelopment;

  // Enhanced debug log
  console.log('🔒 ProtectedRoute Debug DETALHADO:', {
    path,
    user: !!user,
    userDetails: user ? 'Logado' : 'Não logado',
    isDevelopment,
    shouldAllowAccess,
    hostname: window.location.hostname,
    env: import.meta.env.MODE,
    devCheck: import.meta.env.DEV,
    nodeEnv: process.env.NODE_ENV,
    componentName: Component.name || 'Unknown',
  });

  if (!shouldAllowAccess) {
    console.log('❌ ProtectedRoute: ACESSO NEGADO para', path);
    return (
      <Route path={path}>
        <div>Acesso negado. Faça login.</div>
      </Route>
    );
  }

  console.log('✅ ProtectedRoute: ACESSO PERMITIDO para', path, '- Carregando componente');
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
};
