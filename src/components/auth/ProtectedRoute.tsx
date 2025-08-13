import { useAuth } from '@/context/AuthContext';
import { Route } from 'wouter';

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ path, component: Component }) => {
  const { user } = useAuth();

  // Allow access during development (when NODE_ENV is not production)
  const isDevelopment = import.meta.env.DEV;
  const shouldAllowAccess = user || isDevelopment;

  return <Route path={path}>{shouldAllowAccess ? <Component /> : <div>Acesso negado. Faça login.</div>}</Route>;
};
