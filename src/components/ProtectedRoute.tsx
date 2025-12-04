import React from 'react';
import { Redirect } from 'wouter';
import { PageLoadingFallback } from '@/components/LoadingSpinner';
import { useAuthStorage } from '@/hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthStorage();

    if (isLoading) {
        return <PageLoadingFallback message="Verificando autenticação..." />;
    }

    if (!isAuthenticated) {
        return <Redirect to="/auth" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
