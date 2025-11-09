/**
 * 🧪 TESTE DE RENDERIZAÇÃO - question-hero-05
 * 
 * Valida que o componente question-hero está:
 * 1. Registrado no UnifiedBlockRegistry
 * 2. Carrega dados corretos do template
 * 3. Renderiza sem erros
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { blockRegistry } from '@/registry/UnifiedBlockRegistry';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

describe('question-hero-05 - Teste Completo', () => {

    it('deve estar registrado no UnifiedBlockRegistry', async () => {
        const componentLoader = blockRegistry.getComponent('question-hero');

        expect(componentLoader).toBeDefined();
        expect(typeof componentLoader).toBe('object'); // É uma Promise/lazy loader

        // Aguardar carregamento
        const Component = await (componentLoader as any);
        expect(Component).toBeDefined();

        console.log('✅ Componente question-hero registrado no registry (lazy loaded)');
    }); it('deve carregar block question-hero-05 do template', () => {
        const step05Blocks = QUIZ_STYLE_21_STEPS_TEMPLATE['step-05'];
        const block = step05Blocks.find(b => b.id === 'question-hero-05');

        expect(block).toBeDefined();
        expect(block?.type).toBe('question-hero');
        expect(block?.content?.questionText).toBe('QUAIS DETALHES VOCÊ GOSTA?');

        console.log('✅ Block carregado:', {
            id: block?.id,
            type: block?.type,
            questionText: block?.content?.questionText,
            progressValue: block?.content?.progressValue
        });
    });

    it('deve renderizar question-hero-05 sem erros', async () => {
        const step05Blocks = QUIZ_STYLE_21_STEPS_TEMPLATE['step-05'];
        const block = step05Blocks.find(b => b.id === 'question-hero-05');

        expect(block).toBeDefined();

        // Pegar componente do registry (lazy loading)
        const componentPromise = blockRegistry.getComponent('question-hero');
        expect(componentPromise).toBeDefined();

        // Aguardar lazy load
        const Component = await (componentPromise as any);
        expect(Component?.default).toBeDefined();

        // Tentar renderizar
        const { container } = render(
            React.createElement(Component.default, { block })
        );

        expect(container).toBeDefined();

        // Aguardar renderização
        await new Promise(resolve => setTimeout(resolve, 100));

        console.log('✅ Componente renderizado sem erros');
        console.log('📦 HTML gerado tem conteúdo:', container.innerHTML.length > 0);
    }); it('deve exibir texto da pergunta no DOM', async () => {
        const step05Blocks = QUIZ_STYLE_21_STEPS_TEMPLATE['step-05'];
        const block = step05Blocks.find(b => b.id === 'question-hero-05');

        const Component = blockRegistry.getComponent('question-hero');
        const { container, findByText } = render(
            React.createElement(Component!, { block })
        );

        // Verificar se o texto da pergunta está no DOM
        const questionText = await findByText(/QUAIS DETALHES VOCÊ GOSTA/i);
        expect(questionText).toBeDefined();

        console.log('✅ Texto da pergunta encontrado no DOM');
    });

    it('deve exibir barra de progresso', async () => {
        const step05Blocks = QUIZ_STYLE_21_STEPS_TEMPLATE['step-05'];
        const block = step05Blocks.find(b => b.id === 'question-hero-05');

        const Component = blockRegistry.getComponent('question-hero');
        const { container } = render(
            React.createElement(Component!, { block })
        );

        // Verificar se há elemento com role="progressbar"
        const progressBar = container.querySelector('[role="progressbar"]');
        expect(progressBar).toBeDefined();

        // Verificar aria-valuenow (deve ser 24 - valor do progressValue)
        const ariaValue = progressBar?.getAttribute('aria-valuenow');
        expect(ariaValue).toBe('24');

        console.log('✅ Barra de progresso renderizada com valor correto: 24%');
    });

    it('deve exibir logo se fornecido', async () => {
        const step05Blocks = QUIZ_STYLE_21_STEPS_TEMPLATE['step-05'];
        const block = step05Blocks.find(b => b.id === 'question-hero-05');

        const Component = blockRegistry.getComponent('question-hero');
        const { container } = render(
            React.createElement(Component!, { block })
        );

        // Verificar se há imagem (logo)
        const img = container.querySelector('img');
        expect(img).toBeDefined();

        const logoUrl = img?.getAttribute('src');
        expect(logoUrl).toContain('cloudinary');

        const logoAlt = img?.getAttribute('alt');
        expect(logoAlt).toBe('Logo Gisele Galvão');

        console.log('✅ Logo renderizado:', logoUrl?.substring(0, 50) + '...');
    });

    it('deve exibir contador de questão', async () => {
        const step05Blocks = QUIZ_STYLE_21_STEPS_TEMPLATE['step-05'];
        const block = step05Blocks.find(b => b.id === 'question-hero-05');

        const Component = blockRegistry.getComponent('question-hero');
        const { findByText } = render(
            React.createElement(Component!, { block })
        );

        // Verificar "Questão 4 de 13"
        const counter = await findByText(/Questão 4 de 13/i);
        expect(counter).toBeDefined();

        console.log('✅ Contador de questão exibido corretamente');
    });
});

describe('question-hero - Todos os blocos do template', () => {

    it('deve listar e renderizar todos os question-hero encontrados', async () => {
        const allQuestionHeros: any[] = [];

        // Encontrar todos os question-hero no template
        Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(([stepId, blocks]) => {
            blocks.forEach(block => {
                if (block.type === 'question-hero') {
                    allQuestionHeros.push({ stepId, block });
                }
            });
        });

        expect(allQuestionHeros.length).toBeGreaterThan(0);

        console.log(`📋 Total de question-hero encontrados: ${allQuestionHeros.length}`);

        const Component = blockRegistry.getComponent('question-hero');

        // Tentar renderizar cada um
        for (const { stepId, block } of allQuestionHeros) {
            const { container } = render(
                React.createElement(Component!, { block })
            );

            expect(container.innerHTML).not.toBe('');

            console.log(`  ✅ ${stepId}: ${block.id} → "${block.content?.questionText?.substring(0, 30)}..."`);
        }

        console.log(`✅ Todos os ${allQuestionHeros.length} question-hero renderizados com sucesso!`);
    });
});
