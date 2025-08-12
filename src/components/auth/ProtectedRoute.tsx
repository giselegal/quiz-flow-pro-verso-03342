import { useAuth } from '@/context/AuthContext';
import { Route } from 'wouter';

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ path, component: Component }) => {
  const { user } = useAuth();

  return <Route path={path}>{user ? <Component /> : <div>Acesso negado. Faça login.</div>}</Route>;
};
