/**
 * 🎯 UTILITÁRIOS PARA TESTES DE RENDERIZAÇÃO
 * 
 * Funções auxiliares e mocks para facilitar os testes
 */

import React from 'react';

// 🎭 Mocks personalizados para componentes complexos
export const mockEditorComponents = {
    // Mock do EditorProUnified
    EditorProUnified: React.forwardRef((props, ref) => (
        <div
            ref={ref}
            data-testid="editor-pro-unified-mock"
            data-funnel-id={props.funnelId}
            data-template-id={props.templateId}
            data-mode={props.mode}
        >
            <h2>Editor Pro Unified (Mock)</h2>
            <div>Funnel ID: {props.funnelId || 'auto'}</div>
            <div>Template ID: {props.templateId || 'none'}</div>
            <div>Mode: {props.mode || 'visual'}</div>
            {props.children}
        </div>
    )),

    // Mock do Canvas
    Canvas: ({ children, ...props }) => (
        <div
            data-testid="canvas-mock"
            {...props}
        >
            <div>Canvas Mock - Ready to render</div>
            {children}
        </div>
    ),

    // Mock do PropertiesPanel
    PropertiesPanel: ({ selectedBlock, ...props }) => (
        <div
            data-testid="properties-panel-mock"
            {...props}
        >
            <div>Properties Panel Mock</div>
            <div>Selected: {selectedBlock?.id || 'none'}</div>
        </div>
    )
};

// 🔧 Helper para simular diferentes estados de loading
export const createLoadingStates = () => ({
    idle: { loading: false, error: null, data: null },
    loading: { loading: true, error: null, data: null },
    success: { loading: false, error: null, data: { id: 'test', name: 'Test Data' } },
    error: { loading: false, error: new Error('Test error'), data: null }
});

// 🌐 Mock do UnifiedTemplateService com diferentes cenários
export const mockUnifiedTemplateService = {
    // Cenário de sucesso
    success: {
        getTemplate: jest.fn().mockResolvedValue({
            id: 'test-template',
            name: 'Template de Teste',
            blocks: [
                { id: 'block-1', type: 'text', properties: { text: 'Conteúdo teste' } },
                { id: 'block-2', type: 'button', properties: { label: 'Clique aqui' } }
            ],
            metadata: { version: '1.0.0', generated: false }
        }),
        preloadCriticalTemplates: jest.fn().mockResolvedValue(undefined)
    },

    // Cenário de template não encontrado
    notFound: {
        getTemplate: jest.fn().mockResolvedValue({
            id: 'fallback-template',
            name: 'Template Gerado Automaticamente',
            blocks: [
                { id: 'fallback-1', type: 'text', properties: { text: 'Template padrão' } }
            ],
            metadata: { version: '1.0.0', generated: true }
        }),
        preloadCriticalTemplates: jest.fn().mockResolvedValue(undefined)
    },

    // Cenário de erro
    error: {
        getTemplate: jest.fn().mockRejectedValue(new Error('Erro ao carregar template')),
        preloadCriticalTemplates: jest.fn().mockRejectedValue(new Error('Erro no preload'))
    }
};

// 📊 Helper para testar performance
export const measureRenderPerformance = async (renderFunction) => {
    const startTime = performance.now();

    const result = await renderFunction();

    const endTime = performance.now();
    const duration = endTime - startTime;

    return {
        result,
        duration,
        isOptimal: duration < 100, // Considera ótimo se renderizar em menos de 100ms
        performance: {
            excellent: duration < 50,
            good: duration < 100,
            acceptable: duration < 200,
            slow: duration >= 200
        }
    };
};

// 🎨 Mock de diferentes tipos de funis para teste
export const mockFunnelTypes = {
    quiz: {
        id: 'quiz-personalizado',
        type: 'quiz',
        name: 'Quiz Personalizado',
        steps: 3,
        blocks: [
            { id: 'q1', type: 'question', properties: { title: 'Pergunta 1' } },
            { id: 'q2', type: 'question', properties: { title: 'Pergunta 2' } },
            { id: 'result', type: 'result', properties: { title: 'Resultado' } }
        ]
    },

    landing: {
        id: 'landing-page-produto',
        type: 'landing',
        name: 'Landing Page Produto',
        steps: 1,
        blocks: [
            { id: 'hero', type: 'hero', properties: { title: 'Produto Incrível' } },
            { id: 'features', type: 'features', properties: { items: ['Feature 1', 'Feature 2'] } },
            { id: 'cta', type: 'button', properties: { label: 'Comprar Agora' } }
        ]
    },

    email: {
        id: 'campanha-email',
        type: 'email',
        name: 'Campanha de Email',
        steps: 2,
        blocks: [
            { id: 'form', type: 'form', properties: { fields: ['email', 'name'] } },
            { id: 'thanks', type: 'text', properties: { text: 'Obrigado pela inscrição!' } }
        ]
    }
};

// 🔍 Helper para validar estrutura de componentes
export const validateComponentStructure = (component) => {
    const checks = {
        hasTestId: !!component.getAttribute('data-testid'),
        hasRole: !!component.getAttribute('role'),
        hasAriaLabel: !!component.getAttribute('aria-label'),
        isAccessible: true,
        hasChildren: component.children.length > 0
    };

    checks.isAccessible = checks.hasRole || checks.hasAriaLabel || checks.hasTestId;

    return {
        ...checks,
        score: Object.values(checks).filter(Boolean).length,
        maxScore: Object.keys(checks).length,
        isValid: checks.hasTestId // Mínimo necessário
    };
};

// 🎯 Mock de diferentes viewports para testes responsivos
export const mockViewports = {
    mobile: { width: 375, height: 667, name: 'iPhone SE' },
    tablet: { width: 768, height: 1024, name: 'iPad' },
    laptop: { width: 1366, height: 768, name: 'Laptop' },
    desktop: { width: 1920, height: 1080, name: 'Desktop HD' },
    ultrawide: { width: 2560, height: 1440, name: 'Ultrawide' }
};

// 🎮 Simulador de interações do usuário
export const userInteractionSimulator = {
    click: (element) => {
        element.click();
        element.dispatchEvent(new Event('click', { bubbles: true }));
    },

    hover: (element) => {
        element.dispatchEvent(new Event('mouseenter', { bubbles: true }));
        element.dispatchEvent(new Event('mouseover', { bubbles: true }));
    },

    type: (element, text) => {
        element.focus();
        element.value = text;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    },

    keyPress: (element, key) => {
        element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
    }
};

// 📈 Coletor de métricas de teste
export class TestMetricsCollector {
    constructor() {
        this.metrics = {
            renderTimes: [],
            errorCount: 0,
            successCount: 0,
            componentsCounted: 0,
            interactionsTested: 0
        };
    }

    recordRenderTime(time) {
        this.metrics.renderTimes.push(time);
    }

    recordError() {
        this.metrics.errorCount++;
    }

    recordSuccess() {
        this.metrics.successCount++;
    }

    recordComponent() {
        this.metrics.componentsCounted++;
    }

    recordInteraction() {
        this.metrics.interactionsTested++;
    }

    getReport() {
        const { renderTimes } = this.metrics;
        const avgRenderTime = renderTimes.length ?
            renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length : 0;

        return {
            ...this.metrics,
            averageRenderTime: avgRenderTime,
            maxRenderTime: Math.max(...renderTimes, 0),
            minRenderTime: Math.min(...renderTimes, 0),
            successRate: this.metrics.successCount / (this.metrics.successCount + this.metrics.errorCount) * 100
        };
    }
}

// 🧪 Factory de testes parametrizados
export const createParametrizedTests = (testConfigs) => {
    return testConfigs.map(config => ({
        ...config,
        run: async (testFunction) => {
            try {
                const result = await testFunction(config);
                return { success: true, result, config };
            } catch (error) {
                return { success: false, error, config };
            }
        }
    }));
};

export default {
    mockEditorComponents,
    createLoadingStates,
    mockUnifiedTemplateService,
    measureRenderPerformance,
    mockFunnelTypes,
    validateComponentStructure,
    mockViewports,
    userInteractionSimulator,
    TestMetricsCollector,
    createParametrizedTests
};