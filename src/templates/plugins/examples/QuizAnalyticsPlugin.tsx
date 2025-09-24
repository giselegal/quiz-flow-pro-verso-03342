/**
 * 🧩 EXEMPLO DE PLUGIN - QUIZ ANALYTICS
 * Baseado nos insights dos projetos pesquisados
 */

import React from 'react';
import { TemplatePlugin, PluginContext } from '../PluginSystem';
import { TemplateEventType } from '../../events/TemplateEventSystem';

// Componentes React definidos primeiro
const AnalyticsDashboard: React.FC = () => (
    <div className="p-4 bg-white border rounded-lg">
        <h3 className="text-lg font-semibold mb-3">📊 Analytics Dashboard</h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">85%</div>
                <div className="text-sm text-gray-600">Taxa de Conclusão</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">3.2s</div>
                <div className="text-sm text-gray-600">Tempo Médio/Pergunta</div>
            </div>
        </div>
    </div>
);

const ClickHeatmap: React.FC = () => (
    <div className="p-4 bg-white border rounded-lg">
        <h3 className="text-lg font-semibold mb-3">🔥 Click Heatmap</h3>
        <div className="h-32 bg-gradient-to-r from-blue-200 to-red-200 rounded flex items-center justify-center">
            <span className="text-gray-600">Mapa de calor de cliques</span>
        </div>
    </div>
);

const ProgressAnalytics: React.FC = () => (
    <div className="p-4 bg-white border rounded-lg">
        <h3 className="text-lg font-semibold mb-3">📈 Progress Analytics</h3>
        <div className="space-y-2">
            <div className="flex justify-between">
                <span>Pergunta 1</span>
                <span className="text-green-600">95% concluíram</span>
            </div>
            <div className="flex justify-between">
                <span>Pergunta 2</span>
                <span className="text-yellow-600">78% concluíram</span>
            </div>
        </div>
    </div>
);

/**
 * 📊 Plugin de Analytics para Quiz
 */
export const QuizAnalyticsPlugin: TemplatePlugin = {
    id: 'quiz-analytics',
    name: 'Quiz Analytics Pro',
    version: '1.0.0',
    description: 'Sistema avançado de analytics para quiz com tracking em tempo real',
    author: 'QuizQuest Enhanced Team',

    // Hook de instalação
    onInstall: (context: PluginContext) => {
        console.log('📊 Instalando Quiz Analytics Plugin...');

        if (typeof window !== 'undefined') {
            (window as any).quizAnalytics = {
                sessions: new Map(),
                events: [],
                config: {
                    trackClicks: true,
                    trackTime: true,
                    trackAnswers: true,
                    trackProgress: true
                }
            };
        }

        context.api.showNotification('Quiz Analytics instalado com sucesso!', 'success');
    },

    // Hook de ativação
    onActivate: (context: PluginContext) => {
        console.log('✅ Ativando Quiz Analytics Plugin...');

        // Registrar listeners de eventos
        context.eventSystem.addEventListener('quiz_answer_selected' as TemplateEventType, (event: any) => {
            trackQuizEvent('answer_selected', event.detail);
        });

        context.eventSystem.addEventListener('quiz_step_completed' as TemplateEventType, (event: any) => {
            trackQuizEvent('step_completed', event.detail);
        });

        context.eventSystem.addEventListener('quiz_completed' as TemplateEventType, (event: any) => {
            trackQuizEvent('quiz_completed', event.detail);
        });

        context.api.showNotification('Quiz Analytics ativado!', 'info');
    },

    // Componentes do plugin
    components: [
        {
            id: 'analytics-dashboard',
            name: 'Analytics Dashboard',
            category: 'custom',
            component: AnalyticsDashboard
        },
        {
            id: 'click-heatmap',
            name: 'Click Heatmap',
            category: 'custom',
            component: ClickHeatmap
        },
        {
            id: 'progress-analytics',
            name: 'Progress Analytics',
            category: 'custom',
            component: ProgressAnalytics
        }
    ],

    // Validadores customizados
    validators: [
        {
            id: 'analytics-completion',
            name: 'Analytics Completion Validator',
            validator: async (_data: any) => true
        },
        {
            id: 'tracking-setup',
            name: 'Tracking Setup Validator',
            validator: async (_data: any) => true
        }
    ],

    // Hook de desinstalação
    onUninstall: (context: PluginContext) => {
        console.log('🗑️ Desinstalando Quiz Analytics Plugin...');

        if (typeof window !== 'undefined') {
            delete (window as any).quizAnalytics;
        }

        context.api.showNotification('Quiz Analytics desinstalado', 'info');
    }
};

// Funções auxiliares
function trackQuizEvent(eventType: string, data: any) {
    if (typeof window === 'undefined') return;

    const analytics = (window as any).quizAnalytics;
    if (!analytics) return;

    const event = {
        type: eventType,
        timestamp: Date.now(),
        data,
        sessionId: getOrCreateSessionId()
    };

    analytics.events.push(event);

    // Limite de eventos para não sobrecarregar a memória
    if (analytics.events.length > 1000) {
        analytics.events = analytics.events.slice(-500);
    }
}

function getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'server-session';

    let sessionId = sessionStorage.getItem('quiz-session-id');
    if (!sessionId) {
        sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('quiz-session-id', sessionId);
    }
    return sessionId;
}

export default QuizAnalyticsPlugin;
