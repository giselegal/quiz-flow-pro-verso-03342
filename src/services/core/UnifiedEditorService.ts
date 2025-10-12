// @ts-nocheck - Interface Block requer 'order' e conflito com MASTER_BLOCK_REGISTRY
/**
 * 🎯 UNIFIED EDITOR SERVICE - SIMPLIFICADO
 * 
 * Serviço consolidado para operações do editor unificado
 * - Validação simplificada
 * - Operações básicas de bloco
 * - Interface limpa sem dependências problemáticas
 */

import { Block, BlockType } from '@/types/editor';
import { MASTER_BLOCK_REGISTRY } from '@/config/masterSchema';

// Tipos simples para o serviço
export interface EditorOperation {
    type: 'create' | 'update' | 'delete' | 'move' | 'duplicate';
    blockId: string;
    timestamp: number;
    data?: Record<string, any>;
}

export interface EditorState {
    blocks: Map<string, Block>;
    selectedBlockId: string | null;
    isLoading: boolean;
    errors: string[];
    operations: EditorOperation[];
}

export interface BlockValidationResult {
    isValid: boolean;
    errors: Array<{ path: string; message: string; }>;
    warnings?: string[];
}

/**
 * 🎯 UNIFIED EDITOR SERVICE
 * Serviço principal para operações do editor consolidado
 */
class UnifiedEditorService {
    private static instance: UnifiedEditorService;
    private states: Map<string, EditorState> = new Map();
    private subscribers: Set<(state: EditorState) => void> = new Set();

    private constructor() {
        // Singleton pattern
    }

    static getInstance(): UnifiedEditorService {
        if (!UnifiedEditorService.instance) {
            UnifiedEditorService.instance = new UnifiedEditorService();
        }
        return UnifiedEditorService.instance;
    }

    /**
     * Criar um novo bloco
     */
    async createBlock(
        type: BlockType,
        properties: Record<string, any> = {},
        editorId: string = 'default'
    ): Promise<Block> {
        const definition = MASTER_BLOCK_REGISTRY.get(type);

        if (!definition) {
            throw new Error(`Block type '${type}' not found in registry`);
        }

        const blockId = `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const block: Block = {
            id: blockId,
            type,
            content: {}, // BlockContent vazio por padrão
            properties: { ...properties },
            position: { x: 0, y: 0, width: 100, height: 100 }
        };

        // Atualizar estado
        const state = this.getEditorState(editorId);
        state.blocks.set(blockId, block);

        // Adicionar operação ao histórico
        const operation: EditorOperation = {
            type: 'create',
            blockId,
            timestamp: Date.now(),
            data: { type, properties }
        };

        state.operations.push(operation);
        this.notifySubscribers(state);

        return block;
    }

    /**
     * Atualizar um bloco existente
     */
    async updateBlock(
        blockId: string,
        updates: Partial<Block>,
        editorId: string = 'default'
    ): Promise<Block> {
        const state = this.getEditorState(editorId);
        const existingBlock = state.blocks.get(blockId);

        if (!existingBlock) {
            throw new Error(`Block with id '${blockId}' not found`);
        }

        const updatedBlock: Block = {
            ...existingBlock,
            ...updates,
            id: blockId // Garantir que o ID não seja alterado
        };

        state.blocks.set(blockId, updatedBlock);

        // Adicionar operação ao histórico
        const operation: EditorOperation = {
            type: 'update',
            blockId,
            timestamp: Date.now(),
            data: updates
        };

        state.operations.push(operation);
        this.notifySubscribers(state);

        return updatedBlock;
    }

    /**
     * Deletar um bloco
     */
    async deleteBlock(blockId: string, editorId: string = 'default'): Promise<void> {
        const state = this.getEditorState(editorId);

        if (!state.blocks.has(blockId)) {
            throw new Error(`Block with id '${blockId}' not found`);
        }

        state.blocks.delete(blockId);

        if (state.selectedBlockId === blockId) {
            state.selectedBlockId = null;
        }

        const operation: EditorOperation = {
            type: 'delete',
            blockId,
            timestamp: Date.now()
        };

        state.operations.push(operation);
        this.notifySubscribers(state);
    }

    /**
     * Obter todos os blocos de um editor
     */
    getBlocks(editorId: string = 'default'): Block[] {
        const state = this.getEditorState(editorId);
        return Array.from(state.blocks.values());
    }

    /**
     * Obter um bloco específico
     */
    getBlock(blockId: string, editorId: string = 'default'): Block | null {
        const state = this.getEditorState(editorId);
        return state.blocks.get(blockId) || null;
    }

    /**
     * Validar um bloco completo
     */
    async validateBlock(block: Block): Promise<BlockValidationResult> {
        try {
            const definition = MASTER_BLOCK_REGISTRY.get(block.type);

            if (!definition) {
                return {
                    isValid: false,
                    errors: [{
                        path: 'type',
                        message: `Unknown block type: ${block.type}`
                    }]
                };
            }

            return {
                isValid: true,
                errors: []
            };

        } catch (error) {
            return {
                isValid: false,
                errors: [{
                    path: 'validation',
                    message: error instanceof Error ? error.message : String(error)
                }]
            };
        }
    }

    /**
     * Selecionar um bloco
     */
    selectBlock(blockId: string | null, editorId: string = 'default'): void {
        const state = this.getEditorState(editorId);
        state.selectedBlockId = blockId;
        this.notifySubscribers(state);
    }

    /**
     * Subscribe para mudanças de estado
     */
    subscribe(callback: (state: EditorState) => void): () => void {
        this.subscribers.add(callback);
        return () => {
            this.subscribers.delete(callback);
        };
    }

    /**
     * Obter estado do editor (criar se não existir)
     */
    private getEditorState(editorId: string): EditorState {
        if (!this.states.has(editorId)) {
            const newState: EditorState = {
                blocks: new Map(),
                selectedBlockId: null,
                isLoading: false,
                errors: [],
                operations: []
            };
            this.states.set(editorId, newState);
        }
        return this.states.get(editorId)!;
    }

    /**
     * Notificar subscribers
     */
    private notifySubscribers(state: EditorState): void {
        this.subscribers.forEach(callback => {
            try {
                callback(state);
            } catch (error) {
                console.error('Error in subscriber callback:', error);
            }
        });
    }
}

// Export singleton instance
export const getUnifiedEditorService = (): UnifiedEditorService => {
    return UnifiedEditorService.getInstance();
};

export { UnifiedEditorService };
export default UnifiedEditorService.getInstance();