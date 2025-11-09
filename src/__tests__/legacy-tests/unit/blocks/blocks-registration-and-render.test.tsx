import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { getBlockComponent } from '@/config/enhancedBlockRegistry';
import { UniversalBlockRenderer } from '@/components/core/renderers/UniversalBlockRenderer';
import type { Block } from '@/types/editor';
import { SchemaAPI, initializeSchemaRegistry } from '@/config/schemas';

// Pequena fábrica de blocos mínimos para smoke tests de renderização
function mkBlock(type: string, patch?: Partial<Block>): Block {
    return {
        id: `${type}-smoke-1`,
        type: type as any,
        order: 0,
        content: {},
        properties: {},
        ...patch,
    } as Block;
}

describe('Blocos por etapa - registro e renderização', () => {
    beforeAll(() => {
        // Inicializa o registry de schemas modulares (para checagens SchemaAPI)
        initializeSchemaRegistry();
    });

    it('resolve componentes essenciais do registry aprimorado (EnhancedBlockRegistry)', () => {
        const essentialTypes = [
            // Step 01 (Intro)
            'intro-title', 'quiz-intro-header', 'decorative-bar-inline',
            // Steps de Perguntas
            'options-grid', 'question-hero',
            // Step 12 (Transição)
            'transition-title',
            // Step 20 (Resultado)
            'result-main',
            // Step 21 (Oferta)
            'urgency-timer-inline', 'offer-hero',
        ];

        for (const type of essentialTypes) {
            const Cmp = getBlockComponent(type);
            expect(Cmp, `componente não registrado para ${type}`).toBeTruthy();
        }
    });

    it('schemas modulares básicos estão registrados no SchemaAPI', async () => {
        const types = ['headline', 'button', 'image', 'options-grid', 'urgency-timer-inline'];
        for (const t of types) {
            // has() verifica registro; get() valida carregamento sob demanda sem exceção
            expect(SchemaAPI.has(t), `schema não registrado: ${t}`).toBe(true);
            const s = await SchemaAPI.get(t);
            expect(s, `schema não carregou: ${t}`).not.toBeNull();
            expect(Array.isArray(s?.properties)).toBe(true);
        }
    });

    it('smoke render - intro-title', async () => {
        const block = mkBlock('intro-title');
        render(<UniversalBlockRenderer block={block} isPreviewing />);
        // Fallback padrão do componente
        expect(await screen.findByText(/título do quiz/i)).toBeTruthy();
    });

    it('smoke render - transition-title', async () => {
        const block = mkBlock('transition-title');
        render(<UniversalBlockRenderer block={block} isPreviewing />);
        expect(await screen.findByText(/preparando/i)).toBeTruthy();
    });

    it('smoke render - result-main', async () => {
        const block = mkBlock('result-main');
        render(<UniversalBlockRenderer block={block} isPreviewing />);
        // O componente exibe frases padrão quando não há contexto
        expect(await screen.findByText(/seu estilo é/i)).toBeTruthy();
        expect(await screen.findByText(/compatibilidade/i)).toBeTruthy();
    });

    it('smoke render - urgency-timer-inline', async () => {
        const block = mkBlock('urgency-timer-inline', { properties: { initialMinutes: 0 } });
        render(<UniversalBlockRenderer block={block} isPreviewing />);
        expect(await screen.findByText(/oferta expira em/i)).toBeTruthy();
    });
});
