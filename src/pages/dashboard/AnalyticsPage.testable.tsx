// Versão testável da página Analytics para ambiente de testes Vitest sem depender de aliases.
// Mantém a mesma lógica condicional e estrutura textual usada nos asserts.
import React from 'react';
import { useFunnelAnalytics } from '../../hooks/useFunnelAnalytics';

// Componentes de UI serão fornecidos via mocks no teste; aqui usamos elementos simples
const Card: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const CardHeader: React.FC<any> = ({ children }) => <div>{children}</div>;
const CardTitle: React.FC<any> = ({ children }) => <h2>{children}</h2>;
const CardDescription: React.FC<any> = ({ children }) => <p>{children}</p>;
const CardContent: React.FC<any> = ({ children }) => <div>{children}</div>;
const Button: React.FC<any> = ({ children, ...p }) => <button {...p}>{children}</button>;
const Badge: React.FC<any> = ({ children }) => <span>{children}</span>;
const Alert: React.FC<any> = ({ children }) => <div>{children}</div>;
const AlertDescription: React.FC<any> = ({ children }) => <div>{children}</div>;

const AnalyticsPageTestable: React.FC = () => {
    const {
        funnelMetrics,
        stepMetrics,
        conversionFunnel,
        loading,
        error,
        refresh
    } = useFunnelAnalytics({
        funnelId: 'quiz-21-steps-integrated',
        autoRefresh: true,
        refreshInterval: 60000,
    });

    if (loading && !funnelMetrics) {
        return (
            <div>
                <h3>Carregando Analytics</h3>
                <p>Processando dados do Supabase...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Alert>
                    <AlertDescription>
                        <span>Erro ao carregar analytics: {error.message}</span>
                        <Button onClick={refresh}>Tentar Novamente</Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div>
            <div>
                <h1>Analytics Avançado</h1>
                <Badge>{loading ? 'Atualizando...' : 'Atualizado'}</Badge>
                <Button onClick={refresh}>Atualizar</Button>
            </div>

            {funnelMetrics && (
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total de Sessões</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>{funnelMetrics.totalSessions}</div>
                            <p>{funnelMetrics.completedSessions} concluídas</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Taxa de Conversão</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>{funnelMetrics.conversionRate}%</div>
                            <p>{funnelMetrics.dropoffRate}% dropoff</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Tempo Médio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>{funnelMetrics.averageCompletionTime.toFixed(1)}min</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Score Médio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>{funnelMetrics.averageScore.toFixed(1)}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {conversionFunnel && (
                <Card>
                    <CardHeader>
                        <CardTitle>Funil de Conversão</CardTitle>
                        <CardDescription>Visualização do fluxo de usuários através dos 21 steps</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {conversionFunnel.steps.slice(0, 10).map(step => (
                            <div key={step.stepNumber}>Step {step.stepNumber} - {step.users} usuários ({step.percentage.toFixed(1)}%)</div>
                        ))}
                        {conversionFunnel.steps.length > 10 && (
                            <div>... e mais {conversionFunnel.steps.length - 10} steps</div>
                        )}
                        <div>Taxa de Conversão Geral {conversionFunnel.overallConversionRate.toFixed(1)}%</div>
                    </CardContent>
                </Card>
            )}

            {stepMetrics.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Steps com Maior Dropoff</CardTitle>
                        <CardDescription>Identifique onde os usuários estão abandonando o funil</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stepMetrics.filter(s => s.dropoffRate > 0).sort((a, b) => b.dropoffRate - a.dropoffRate).slice(0, 5).map(step => (
                            <div key={step.stepNumber}>
                                <div>Step {step.stepNumber}</div>
                                <div>{step.dropoffRate.toFixed(1)}% dropoff</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {stepMetrics.some(s => s.mostCommonAnswers && s.mostCommonAnswers.length > 0) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Respostas Mais Comuns por Step</CardTitle>
                        <CardDescription>Análise das escolhas mais frequentes dos usuários</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stepMetrics.filter(s => s.mostCommonAnswers && s.mostCommonAnswers.length > 0).slice(0, 6).map(step => (
                            <div key={step.stepNumber}>
                                <div>Step {step.stepNumber}</div>
                                {step.mostCommonAnswers?.map((a, i) => (
                                    <div key={i}>{a.value}</div>
                                ))}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AnalyticsPageTestable;
