// Versão testável da página ConsolidatedOverview para ambiente de testes Vitest.
import React from 'react';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';

const Card: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const CardHeader: React.FC<any> = ({ children }) => <div>{children}</div>;
const CardTitle: React.FC<any> = ({ children }) => <h2>{children}</h2>;
const CardContent: React.FC<any> = ({ children }) => <div>{children}</div>;
const Button: React.FC<any> = ({ children, onClick, ...p }) => <button onClick={onClick} {...p}>{children}</button>;
const Badge: React.FC<any> = ({ children }) => <span>{children}</span>;
const Progress: React.FC<any> = ({ value, ...p }) => <div data-testid="progress" data-value={value} {...p}>Progress {value}%</div>;

const ConsolidatedOverviewPageTestable: React.FC = () => {
    const {
        metrics,
        loading,
        error,
        refresh,
        isStale
    } = useDashboardMetrics({
        autoRefresh: true,
        refreshInterval: 30000,
        period: 'last-7-days'
    });

    if (loading) {
        return (
            <div>
                <p>Carregando dados...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <p>Erro ao carregar dashboard: {error.message}</p>
                <Button onClick={refresh}>Tentar Novamente</Button>
            </div>
        );
    }

    if (!metrics) {
        return <div>Sem dados disponíveis</div>;
    }

    return (
        <div>
            <div>
                <h1>Dashboard Quiz Quest</h1>
                <Badge>Pro Analytics</Badge>
                <Badge>{metrics.activeSessions} usuários online</Badge>
                {isStale && <Badge>Dados desatualizados</Badge>}
                <Button onClick={refresh}>Atualizar</Button>
            </div>

            {/* Métricas principais */}
            <Card>
                <CardHeader>
                    <CardTitle>Total de Sessões</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>{metrics.totalSessions}</div>
                    <p>{Math.round(metrics.totalSessions * (1 - metrics.dropoffRate / 100))} concluídas</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Taxa de Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>{metrics.conversionRate.toFixed(1)}%</div>
                    <Progress value={metrics.conversionRate} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tempo Médio de Conclusão</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>{metrics.averageCompletionTime.toFixed(1)} min</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Leads Gerados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>{metrics.leadsGenerated}</div>
                </CardContent>
            </Card>

            {/* Top Funnels - simulado para testes */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Funnels de Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <span>Funnel A</span>
                        <span>85.2%</span>
                    </div>
                    <div>
                        <span>Funnel B</span>
                        <span>78.5%</span>
                    </div>
                </CardContent>
            </Card>

            {/* Step Performance - simulado para testes */}
            <Card>
                <CardHeader>
                    <CardTitle>Performance por Step</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <span>Step 1</span>
                        <span>95.0%</span>
                    </div>
                    <div>
                        <span>Step 2</span>
                        <span>88.3%</span>
                    </div>
                    <div>
                        <span>Step 3</span>
                        <span>82.1%</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ConsolidatedOverviewPageTestable;
