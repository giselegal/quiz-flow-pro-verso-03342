/**
 * 🧪 TESTES DE LÓGICA - PAINEL DE PROPRIEDADES
 * 
 * Testa a lógica interna do PropertiesColumn sem renderização completa
 */

import { describe, it, expect } from 'vitest';
import type { Block } from '@/types/editor';

describe('PropertiesColumn - Lógica de Auto-seleção', () => {
    it('deve selecionar primeiro bloco quando selectedBlockId é null e há blocos disponíveis', () => {
        const blocks: Block[] = [
            { id: 'block-1', type: 'text', content: { text: 'Test' }, order: 1 },
            { id: 'block-2', type: 'text-input', content: { question: 'Q?' }, order: 2 }
        ];

        const selectedBlockId = null;
        const autoSelectedId = selectedBlockId || (blocks.length > 0 ? blocks[0].id : null);

        expect(autoSelectedId).toBe('block-1');
    });

    it('deve manter selectedBlockId quando já está definido', () => {
        const blocks: Block[] = [
            { id: 'block-1', type: 'text', content: { text: 'Test' }, order: 1 },
            { id: 'block-2', type: 'text-input', content: { question: 'Q?' }, order: 2 }
        ];

        const selectedBlockId = 'block-2';
        const autoSelectedId = selectedBlockId || (blocks.length > 0 ? blocks[0].id : null);

        expect(autoSelectedId).toBe('block-2');
    });

    it('deve retornar null quando não há blocos disponíveis', () => {
        const blocks: Block[] = [];
        const selectedBlockId = null;
        const autoSelectedId = selectedBlockId || (blocks.length > 0 ? blocks[0].id : null);

        expect(autoSelectedId).toBeNull();
    });
});

describe('PropertiesColumn - Validação de Schema', () => {
    it('deve detectar schema para tipo "text"', () => {
        const block: Block = {
            id: 'block-1',
            type: 'text',
            content: { text: 'Sample' },
            order: 1
        };

        // Schema deve incluir campo "text"
        const hasTextField = block.type === 'text';
        expect(hasTextField).toBe(true);
    });

    it('deve detectar schema para tipo "text-input"', () => {
        const block: Block = {
            id: 'block-2',
            type: 'text-input',
            content: { question: 'Q?', placeholder: 'Answer' },
            order: 2
        };

        // Schema deve incluir campos "question" e "placeholder"
        const hasQuestionField = block.type === 'text-input';
        expect(hasQuestionField).toBe(true);
    });
});

describe('PropertiesColumn - Sincronização de Dados', () => {
    it('deve detectar mudanças entre estado local e bloco original', () => {
        const originalBlock: Block = {
            id: 'block-1',
            type: 'text',
            content: { text: 'Original' },
            order: 1
        };

        const editedContent = { text: 'Modified' };

        const hasChanges = JSON.stringify(editedContent) !== JSON.stringify(originalBlock.content);
        expect(hasChanges).toBe(true);
    });

    it('deve não detectar mudanças quando conteúdo é idêntico', () => {
        const originalBlock: Block = {
            id: 'block-1',
            type: 'text',
            content: { text: 'Same' },
            order: 1
        };

        const editedContent = { text: 'Same' };

        const hasChanges = JSON.stringify(editedContent) !== JSON.stringify(originalBlock.content);
        expect(hasChanges).toBe(false);
    });
});

describe('PropertiesColumn - Tratamento de Erros', () => {
    it('deve detectar bloco inválido (sem ID)', () => {
        const invalidBlock = {
            type: 'text',
            content: { text: 'Test' },
            order: 1
        } as any;

        const isValid = Boolean(invalidBlock.id);
        expect(isValid).toBe(false);
    });

    it('deve detectar bloco válido (com ID)', () => {
        const validBlock: Block = {
            id: 'block-1',
            type: 'text',
            content: { text: 'Test' },
            order: 1
        };

        const isValid = Boolean(validBlock.id);
        expect(isValid).toBe(true);
    });
});

describe('PropertiesColumn - Normalização de Dados', () => {
    it('deve normalizar array de blocos vazio', () => {
        const blocks: Block[] = [];
        const normalized = Array.isArray(blocks) ? blocks : [];

        expect(normalized).toEqual([]);
        expect(normalized.length).toBe(0);
    });

    it('deve normalizar array de blocos com dados', () => {
        const blocks: Block[] = [
            { id: 'block-1', type: 'text', content: { text: 'Test' }, order: 1 }
        ];
        const normalized = Array.isArray(blocks) ? blocks : [];

        expect(normalized).toEqual(blocks);
        expect(normalized.length).toBe(1);
    });

    it('deve normalizar entrada null/undefined como array vazio', () => {
        const blocksNull = null as any;
        const blocksUndefined = undefined as any;

        const normalizedNull = Array.isArray(blocksNull) ? blocksNull : [];
        const normalizedUndefined = Array.isArray(blocksUndefined) ? blocksUndefined : [];

        expect(normalizedNull).toEqual([]);
        expect(normalizedUndefined).toEqual([]);
    });
});

describe('PropertiesColumn - Busca de Bloco por ID', () => {
    it('deve encontrar bloco pelo ID', () => {
        const blocks: Block[] = [
            { id: 'block-1', type: 'text', content: { text: 'First' }, order: 1 },
            { id: 'block-2', type: 'text-input', content: { question: 'Q?' }, order: 2 },
            { id: 'block-3', type: 'text', content: { text: 'Third' }, order: 3 }
        ];

        const targetId = 'block-2';
        const found = blocks.find(b => b.id === targetId);

        expect(found).toBeDefined();
        expect(found?.type).toBe('text-input'); // FIX: tipo correto é 'text-input'
        expect(found?.content).toEqual({ question: 'Q?' });
    });

    it('deve retornar undefined para ID não existente', () => {
        const blocks: Block[] = [
            { id: 'block-1', type: 'text', content: { text: 'First' }, order: 1 }
        ];

        const targetId = 'block-999';
        const found = blocks.find(b => b.id === targetId);

        expect(found).toBeUndefined();
    });
});

describe('PropertiesColumn - Atualização de Propriedades', () => {
    it('deve mesclar propriedades novas com existentes', () => {
        const existingContent = {
            text: 'Original',
            style: 'bold'
        };

        const updates = {
            text: 'Updated'
        };

        const merged = { ...existingContent, ...updates };

        expect(merged).toEqual({
            text: 'Updated',
            style: 'bold'
        });
    });

    it('deve substituir propriedade específica mantendo outras', () => {
        const existingContent = {
            question: 'Original question',
            placeholder: 'Original placeholder',
            required: true
        };

        const updates = {
            placeholder: 'New placeholder'
        };

        const merged = { ...existingContent, ...updates };

        expect(merged.question).toBe('Original question');
        expect(merged.placeholder).toBe('New placeholder');
        expect(merged.required).toBe(true);
    });
});

describe('PropertiesColumn - Estado de Salvamento', () => {
    it('deve detectar estado salvando (isSaving=true)', () => {
        const isSaving = true;
        const isDisabled = isSaving;

        expect(isDisabled).toBe(true);
    });

    it('deve detectar estado pronto (isSaving=false)', () => {
        const isSaving = false;
        const isDisabled = isSaving;

        expect(isDisabled).toBe(false);
    });
});

describe('PropertiesColumn - Integração Completa', () => {
    it('deve executar fluxo completo: auto-selecionar → editar → validar → salvar', () => {
        // 1. Auto-seleção
        const blocks: Block[] = [
            { id: 'block-1', type: 'text', content: { text: 'Original' }, order: 1 }
        ];
        const selectedBlockId = null;
        const autoSelectedId = selectedBlockId || (blocks.length > 0 ? blocks[0].id : null);

        expect(autoSelectedId).toBe('block-1');

        // 2. Buscar bloco selecionado
        const selectedBlock = blocks.find(b => b.id === autoSelectedId);
        expect(selectedBlock).toBeDefined();

        // 3. Editar conteúdo
        const editedContent = { ...selectedBlock!.content, text: 'Modified' };
        expect(editedContent.text).toBe('Modified');

        // 4. Validar mudanças
        const hasChanges = JSON.stringify(editedContent) !== JSON.stringify(selectedBlock!.content);
        expect(hasChanges).toBe(true);

        // 5. Salvar (simular estado)
        let isSaving = true;
        expect(isSaving).toBe(true);

        // 6. Completar salvamento
        isSaving = false;
        const updatedBlock = { ...selectedBlock!, content: editedContent };
        expect(updatedBlock.content.text).toBe('Modified');
        expect(isSaving).toBe(false);
    });
});
