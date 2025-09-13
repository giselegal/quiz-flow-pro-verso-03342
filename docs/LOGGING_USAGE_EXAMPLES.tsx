// Example: Exemplo prático de como usar o novo sistema de logging
// src/components/examples/LoggingExampleComponent.tsx
import React from 'react';
import { useLogger } from '@/utils/logging';

interface User {
    id: string;
    name: string;
    email: string;
}

interface Props {
    userId: string;
}

/**
 * Componente exemplo que demonstra as melhores práticas
 * para usar o sistema de logging centralizado
 */
export function LoggingExampleComponent({ userId }: Props) {
    const logger = useLogger();
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Exemplo: Log de inicialização do componente
    React.useEffect(() => {
        logger.info('user-profile', 'Component initialized', { userId });

        // Cleanup log quando o componente for desmontado
        return () => {
            logger.debug('user-profile', 'Component unmounted', { userId });
        };
    }, [userId]);

    // Exemplo: Função com logging estruturado de performance
    const fetchUser = React.useCallback(async (id: string) => {
        const timer = logger.startTimer('user-fetch');
        setLoading(true);
        setError(null);

        try {
            logger.info('user-profile', 'Fetching user data', { userId: id });

            const response = await fetch(`/api/users/${id}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const userData = await response.json();

            // Log de sucesso com dados estruturados
            logger.info('user-profile', 'User data fetched successfully', {
                userId: id,
                userName: userData.name,
                responseSize: JSON.stringify(userData).length
            });

            setUser(userData);
            timer.end('User data loaded successfully');

        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));

            // Log de erro com contexto completo
            logger.error('user-profile', 'Failed to fetch user data', {
                userId: id,
                error: {
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                },
                httpStatus: error.message.includes('HTTP') ?
                    error.message.match(/HTTP (\d+)/)?.[1] :
                    undefined
            });

            setError(error.message);
            timer.end('User fetch failed');

        } finally {
            setLoading(false);
        }
    }, [logger]);

    // Exemplo: Handler de evento com logging contextual
    const handleRetry = React.useCallback(() => {
        logger.info('user-profile', 'User initiated retry', {
            userId,
            previousError: error
        });
        fetchUser(userId);
    }, [userId, error, fetchUser, logger]);

    // Exemplo: Log de interação do usuário
    const handleEdit = React.useCallback(() => {
        logger.info('user-interaction', 'Edit button clicked', {
            userId,
            component: 'LoggingExampleComponent',
            action: 'edit'
        });

        // Lógica de edição...
    }, [userId, logger]);

    // Exemplo: Log condicional baseado em estado
    React.useEffect(() => {
        if (user) {
            logger.debug('user-profile', 'User state updated', {
                userId: user.id,
                hasEmail: !!user.email,
                profileComplete: !!(user.name && user.email)
            });
        }
    }, [user, logger]);

    // Exemplo: Log de warning para estados inesperados
    React.useEffect(() => {
        if (!loading && !user && !error) {
            logger.warn('user-profile', 'Component in unexpected state', {
                userId,
                loading,
                hasUser: !!user,
                hasError: !!error
            });
        }
    }, [loading, user, error, userId, logger]);

    // Fetch inicial
    React.useEffect(() => {
        fetchUser(userId);
    }, [userId, fetchUser]);

    if (loading) {
        return <div>Carregando usuário...</div>;
    }

    if (error) {
        return (
            <div>
                <p>Erro ao carregar usuário: {error}</p>
                <button onClick={handleRetry}>Tentar Novamente</button>
            </div>
        );
    }

    if (!user) {
        return <div>Usuário não encontrado</div>;
    }

    return (
        <div>
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
            <button onClick={handleEdit}>Editar</button>
        </div>
    );
}

/**
 * Exemplo de Service Class com logging integrado
 */
export class UserService {
    private logger;

    constructor() {
        // Para services, use getLogger ao invés de useLogger
        this.logger = logger; // Será importado do arquivo principal
    }

    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        const timer = this.logger.startTimer('user-creation');

        try {
            this.logger.info('user-service', 'Creating new user', {
                email: userData.email,
                // Não logar dados sensíveis diretamente
                hasPassword: 'password' in userData
            });

            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error(`Failed to create user: ${response.status}`);
            }

            const newUser = await response.json();

            this.logger.info('user-service', 'User created successfully', {
                userId: newUser.id,
                email: newUser.email
            });

            timer.end('User creation completed');
            return newUser;

        } catch (error) {
            this.logger.error('user-service', 'User creation failed', {
                email: userData.email,
                error: error instanceof Error ? {
                    message: error.message,
                    name: error.name
                } : error
            });

            timer.end('User creation failed');
            throw error;
        }
    }

    async updateUser(userId: string, updates: Partial<User>): Promise<User> {
        this.logger.info('user-service', 'Updating user', {
            userId,
            fieldsToUpdate: Object.keys(updates)
        });

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error(`Failed to update user: ${response.status}`);
            }

            const updatedUser = await response.json();

            this.logger.info('user-service', 'User updated successfully', {
                userId,
                updatedFields: Object.keys(updates)
            });

            return updatedUser;

        } catch (error) {
            this.logger.error('user-service', 'User update failed', {
                userId,
                attemptedUpdates: Object.keys(updates),
                error
            });
            throw error;
        }
    }
}

// Exemplo de uso em páginas
export function ExamplePageUsage() {
    const logger = useLogger();

    React.useEffect(() => {
        // Log de navegação
        logger.info('navigation', 'Page loaded', {
            page: 'example-page',
            path: window.location.pathname,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });

        // Performance tracking da página
        if ('performance' in window) {
            const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

            logger.info('performance', 'Page load metrics', {
                page: 'example-page',
                loadTime: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
                domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
                firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
            });
        }
    }, [logger]);

    return (
        <div>
            <LoggingExampleComponent userId="user-123" />
        </div>
    );
}

/**
 * Exemplo de Error Boundary com logging
 */
export class LoggingErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    private logger;

    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
        // Para class components, use getLogger
        this.logger = logger;
    }

    static getDerivedStateFromError(): { hasError: boolean } {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.logger.error('error-boundary', 'React component error caught', {
            error: {
                message: error.message,
                name: error.name,
                stack: error.stack
            },
            errorInfo: {
                componentStack: errorInfo.componentStack
            },
            url: window.location.href,
            userAgent: navigator.userAgent
        });
    }

    render() {
        if (this.state.hasError) {
            return <div>Algo deu errado. Tente recarregar a página.</div>;
        }

        return this.props.children;
    }
}

// Para demonstração, exportar logger
import { getLogger } from '@/utils/logging';
const logger = getLogger();
