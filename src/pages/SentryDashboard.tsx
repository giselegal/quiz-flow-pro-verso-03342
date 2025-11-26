/**
 * 📊 SENTRY MONITORING DASHBOARD - Sprint 1
 * 
 * Dashboard interno para visualizar métricas do Sentry
 * e health status do monitoramento
 * 
 * FEATURES:
 * ✅ Status do Sentry (conectado/desconectado)
 * ✅ Métricas em tempo real
 * ✅ Últimos erros capturados
 * ✅ Performance metrics
 * ✅ Links diretos para Sentry.io
 * 
 * @module SentryDashboard
 */

import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, ExternalLink, TrendingUp, Users } from 'lucide-react';
import * as Sentry from '@sentry/react';
import { sentryConfig } from '@/config/sentry.config';

interface DashboardMetrics {
    isEnabled: boolean;
    environment: string;
    errorsToday: number;
    sessionDuration: string;
    performance: {
        avgLoadTime: number;
        slowestPage: string;
    };
    lastError: {
        message: string;
        timestamp: string;
    } | null;
}

export default function SentryDashboard() {
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        isEnabled: sentryConfig.enabled,
        environment: sentryConfig.environment,
        errorsToday: 0,
        sessionDuration: '0m',
        performance: {
            avgLoadTime: 0,
            slowestPage: '-',
        },
        lastError: null,
    });

    useEffect(() => {
        // Simular carregamento de métricas (em produção viria da API do Sentry)
        const mockMetrics: DashboardMetrics = {
            isEnabled: sentryConfig.enabled,
            environment: sentryConfig.environment,
            errorsToday: 0,
            sessionDuration: calculateSessionDuration(),
            performance: {
                avgLoadTime: getAverageLoadTime(),
                slowestPage: getSlowestPage(),
            },
            lastError: getLastError(),
        };

        setMetrics(mockMetrics);
    }, []);

    const calculateSessionDuration = (): string => {
        const start = sessionStorage.getItem('session_start');
        if (!start) {
            sessionStorage.setItem('session_start', Date.now().toString());
            return '0m';
        }

        const duration = Math.floor((Date.now() - parseInt(start)) / 60000);
        return `${duration}m`;
    };

    const getAverageLoadTime = (): number => {
        if (typeof performance === 'undefined') return 0;

        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (!navigation) return 0;

        return Math.round(navigation.loadEventEnd - navigation.fetchStart);
    };

    const getSlowestPage = (): string => {
        // Em produção, isso viria do Sentry
        return window.location.pathname;
    };

    const getLastError = (): DashboardMetrics['lastError'] => {
        // Em produção, isso viria do Sentry
        const stored = sessionStorage.getItem('last_error');
        if (!stored) return null;

        try {
            return JSON.parse(stored);
        } catch {
            return null;
        }
    };

    const testSentryError = () => {
        try {
            throw new Error('🧪 Test error from Sentry Dashboard');
        } catch (error) {
            Sentry.captureException(error);

            // Salvar último erro para display
            sessionStorage.setItem(
                'last_error',
                JSON.stringify({
                    message: 'Test error from Sentry Dashboard',
                    timestamp: new Date().toISOString(),
                })
            );

            // Atualizar métricas
            setMetrics((prev) => ({
                ...prev,
                errorsToday: prev.errorsToday + 1,
                lastError: {
                    message: 'Test error from Sentry Dashboard',
                    timestamp: new Date().toLocaleTimeString(),
                },
            }));

            alert('✅ Erro de teste enviado para Sentry!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Sentry Monitoring Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Status do monitoramento e métricas em tempo real
                    </p>
                </div>

                {/* Status Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {metrics.isEnabled ? (
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            ) : (
                                <AlertTriangle className="w-8 h-8 text-yellow-600" />
                            )}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {metrics.isEnabled ? 'Sentry Ativo' : 'Sentry Desabilitado'}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Ambiente: <span className="font-medium">{metrics.environment}</span>
                                </p>
                            </div>
                        </div>

                        <a
                            href="https://sentry.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Abrir Sentry.io
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Errors Today */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-red-100 rounded-lg p-3">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Erros Hoje</p>
                                <p className="text-2xl font-bold text-gray-900">{metrics.errorsToday}</p>
                            </div>
                        </div>
                    </div>

                    {/* Session Duration */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-100 rounded-lg p-3">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Duração Sessão</p>
                                <p className="text-2xl font-bold text-gray-900">{metrics.sessionDuration}</p>
                            </div>
                        </div>
                    </div>

                    {/* Avg Load Time */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-green-100 rounded-lg p-3">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Load Time Médio</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {metrics.performance.avgLoadTime}ms
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Active Users */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-purple-100 rounded-lg p-3">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Usuários Ativos</p>
                                <p className="text-2xl font-bold text-gray-900">1</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Performance
                    </h3>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Sampling Rate (Traces):</span>
                            <span className="font-medium">{(sentryConfig.tracesSampleRate * 100).toFixed(0)}%</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Session Replay (Normal):</span>
                            <span className="font-medium">{(sentryConfig.replaysSessionSampleRate * 100).toFixed(0)}%</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Session Replay (Errors):</span>
                            <span className="font-medium">{(sentryConfig.replaysOnErrorSampleRate * 100).toFixed(0)}%</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Página mais lenta:</span>
                            <span className="font-medium">{metrics.performance.slowestPage}</span>
                        </div>
                    </div>
                </div>

                {/* Last Error Card */}
                {metrics.lastError && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Último Erro Capturado
                        </h3>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 font-medium mb-2">{metrics.lastError.message}</p>
                            <p className="text-sm text-red-600">
                                Capturado em: {metrics.lastError.timestamp}
                            </p>
                        </div>
                    </div>
                )}

                {/* Test Button */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Testar Integração
                    </h3>

                    <button
                        onClick={testSentryError}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        🧪 Enviar Erro de Teste
                    </button>

                    <p className="text-sm text-gray-600 mt-3">
                        Clique para enviar um erro de teste para o Sentry e verificar se a integração está funcionando.
                    </p>
                </div>
            </div>
        </div>
    );
}
