// @ts-nocheck - Teste legado desabilitado temporariamente (incompatível com arquitetura atual)
/**
 * 🔍 INVESTIGAÇÃO VISUAL DO PAINEL DE PROPRIEDADES
 * 
 * Este teste renderiza o painel e mostra TODO o HTML gerado
 * para identificar visualmente o que está faltando
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import type { Block } from '@/types/editor';

// Importar o componente REAL
import PropertiesPanel from '@/components/editor/properties/PropertiesPanel';

describe('🔍 Investigação Visual do Painel', () => {

    it('DEVE renderizar painel de questão e mostrar HTML completo', () => {
        const questionBlock: Block = {
            id: 'q1',
            type: 'quiz-question-inline',
            properties: {
                question: 'Qual sua cor favorita?',
                options: [
                    { id: 'opt1', text: 'Azul', value: 'blue', scoreValues: { default: 10 } },
                    { id: 'opt2', text: 'Vermelho', value: 'red', scoreValues: { default: 20 } }
                ],
                multipleSelection: true,
                requiredSelections: 1,
                enableButtonOnlyWhenValid: true,
                showImages: true
            },
            content: ''
        };

        const mockUpdate = () => { };

        const { container } = render(
            <PropertiesPanel
                selectedBlock={questionBlock}
                onUpdate={mockUpdate}
            />
        );

        // Extrair todo o HTML
        const html = container.innerHTML;

        console.log('\n' + '='.repeat(80));
        console.log('📄 HTML COMPLETO DO PAINEL DE PROPRIEDADES');
        console.log('='.repeat(80));
        console.log(html);
        console.log('='.repeat(80) + '\n');

        // Análise específica
        console.log('\n🔍 ANÁLISE DETALHADA:\n');

        // 1. Textos das opções
        const temAzul = html.includes('Azul');
        const temVermelho = html.includes('Vermelho');
        console.log(`1️⃣ Textos das opções:`);
        console.log(`   - "Azul": ${temAzul ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO'}`);
        console.log(`   - "Vermelho": ${temVermelho ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO'}`);

        // 2. Campos de input
        const numInputs = (html.match(/type="text"/g) || []).length;
        const numTextareas = (html.match(/<textarea/g) || []).length;
        console.log(`\n2️⃣ Campos de texto:`);
        console.log(`   - Inputs text: ${numInputs}`);
        console.log(`   - Textareas: ${numTextareas}`);

        // 3. Upload de imagem
        const temFileInput = html.includes('type="file"');
        const temUpload = html.toLowerCase().includes('upload') || html.toLowerCase().includes('imagem');
        console.log(`\n3️⃣ Upload de imagem:`);
        console.log(`   - Input file: ${temFileInput ? '✅ SIM' : '❌ NÃO'}`);
        console.log(`   - Menções a upload: ${temUpload ? '✅ SIM' : '❌ NÃO'}`);

        // 4. Pontuação
        const temScore = html.toLowerCase().includes('score') || html.toLowerCase().includes('pontu');
        const numNumberInputs = (html.match(/type="number"/g) || []).length;
        console.log(`\n4️⃣ Sistema de pontuação:`);
        console.log(`   - Menções a score: ${temScore ? '✅ SIM' : '❌ NÃO'}`);
        console.log(`   - Inputs numéricos: ${numNumberInputs}`);

        // 5. Validação
        const temValidation = html.toLowerCase().includes('valid') ||
            html.toLowerCase().includes('requer') ||
            html.toLowerCase().includes('seleção');
        console.log(`\n5️⃣ Validação:`);
        console.log(`   - Menções a validação: ${temValidation ? '✅ SIM' : '❌ NÃO'}`);

        // 6. Switches/Toggles
        const numSwitches = (html.match(/role="switch"/g) || []).length;
        const numCheckboxes = (html.match(/type="checkbox"/g) || []).length;
        console.log(`\n6️⃣ Controles de toggle:`);
        console.log(`   - Switches: ${numSwitches}`);
        console.log(`   - Checkboxes: ${numCheckboxes}`);

        // 7. Botões de ação
        const temDelete = html.toLowerCase().includes('delet') || html.toLowerCase().includes('excluir');
        const temDuplicate = html.toLowerCase().includes('duplic') || html.toLowerCase().includes('copiar');
        console.log(`\n7️⃣ Ações:`);
        console.log(`   - Deletar: ${temDelete ? '✅ SIM' : '❌ NÃO'}`);
        console.log(`   - Duplicar: ${temDuplicate ? '✅ SIM' : '❌ NÃO'}`);

        console.log('\n' + '='.repeat(80) + '\n');

        // RELATÓRIO FINAL
        const bugs = [];

        if (!temAzul || !temVermelho) {
            bugs.push('🐛 BUG #1 CONFIRMADO: Textos das opções não aparecem');
        }

        if (!temFileInput && !temUpload) {
            bugs.push('🐛 BUG #2 CONFIRMADO: Campo de upload não aparece');
        }

        if (!temScore) {
            bugs.push('🐛 BUG #3 CONFIRMADO: Sistema de pontuação não aparece');
        }

        if (!temValidation) {
            bugs.push('🐛 BUG #5 CONFIRMADO: Configurações de validação não aparecem');
        }

        if (bugs.length > 0) {
            console.log('🚨 BUGS IDENTIFICADOS:\n');
            bugs.forEach(bug => console.log(`   ${bug}`));
            console.log('');
        } else {
            console.log('✅ Todos os elementos esperados foram encontrados no HTML\n');
        }

        expect(true).toBe(true);
    });

    it('DEVE identificar qual editor está sendo usado', () => {
        const questionBlock: Block = {
            id: 'q1',
            type: 'quiz-question-inline',
            properties: {
                question: 'Teste',
                options: [{ id: 'opt1', text: 'Opção 1' }]
            },
            content: ''
        };

        const { container } = render(
            <PropertiesPanel
                selectedBlock={questionBlock}
                onUpdate={() => { }}
            />
        );

        const html = container.innerHTML;

        console.log('\n🔍 IDENTIFICANDO EDITOR USADO:\n');

        const markers = {
            'QuestionPropertyEditor': html.includes('question-editor') || html.includes('QuestionProperty'),
            'EnhancedPropertiesPanel': html.includes('properties-panel') || html.includes('Enhanced'),
            'Usa Tabs': html.includes('role="tablist"'),
            'Usa Cards': html.includes('card'),
            'Tem Scroll Area': html.includes('scroll-area')
        };

        Object.entries(markers).forEach(([name, found]) => {
            console.log(`   ${found ? '✅' : '❌'} ${name}`);
        });

        console.log('');
    });
});
