import { useAuth } from '@/context/AuthContext';
import { Route } from 'wouter';

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ path, component: Component }) => {
  const { user } = useAuth();

  // Allow access during development (multiple checks for robustness)
  const isDevelopment = import.meta.env.DEV || 
                       import.meta.env.NODE_ENV === 'development' ||
                       process.env.NODE_ENV === 'development' ||
                       window.location.hostname === 'localhost';
  
  const shouldAllowAccess = user || isDevelopment;

  // Debug log to help identify the issue
  console.log('🔒 ProtectedRoute Debug:', {
    path,
    user: !!user,
    isDevelopment,
    shouldAllowAccess,
    hostname: window.location.hostname,
    env: import.meta.env.MODE
  });

  return <Route path={path}>{shouldAllowAccess ? <Component /> : <div>Acesso negado. Faça login.</div>}</Route>;
};
