/**
 * 🎯 BLOCK REGISTRY - Core Quiz System
 * 
 * Registry central para definições de blocos do quiz.
 * Fornece API para registro, busca e validação de tipos de blocos.
 * 
 * @version 1.0.0
 * @status PRODUCTION
 */

import type { BlockDefinition } from './types';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Registry singleton para gerenciar definições de blocos
 */
class BlockRegistryClass {
    private definitions: Map<string, BlockDefinition> = new Map();
    private aliases: Map<string, string> = new Map();
    private categoriesCache: Map<string, BlockDefinition[]> = new Map();

    constructor() {
        appLogger.info('BlockRegistry initialized');
        this.registerDefaultBlocks();
    }

    /**
     * Registra blocos padrão do sistema
     */
    private registerDefaultBlocks(): void {
        // Blocos básicos
        this.register({
            id: 'text',
            name: 'Texto',
            category: 'content',
            properties: {
                content: {
                    type: 'string',
                    label: 'Conteúdo',
                    required: true,
                    default: 'Digite o texto aqui'
                }
            }
        });

        this.register({
            id: 'heading',
            name: 'Título',
            category: 'content',
            properties: {
                text: {
                    type: 'string',
                    label: 'Texto do título',
                    required: true,
                    default: 'Título'
                },
                level: {
                    type: 'number',
                    label: 'Nível',
                    default: 2,
                    min: 1,
                    max: 6
                }
            }
        });

        this.register({
            id: 'image',
            name: 'Imagem',
            category: 'visual',
            properties: {
                src: {
                    type: 'image',
                    label: 'URL da imagem',
                    required: true,
                    default: ''
                },
                alt: {
                    type: 'string',
                    label: 'Texto alternativo',
                    default: ''
                }
            }
        });

        this.register({
            id: 'button',
            name: 'Botão',
            category: 'interactive',
            properties: {
                text: {
                    type: 'string',
                    label: 'Texto do botão',
                    required: true,
                    default: 'Clique aqui'
                },
                url: {
                    type: 'url',
                    label: 'URL',
                    default: ''
                }
            }
        });

        this.register({
            id: 'question',
            name: 'Questão',
            category: 'question',
            properties: {
                questionText: {
                    type: 'string',
                    label: 'Texto da questão',
                    required: true,
                    default: 'Qual é a sua pergunta?'
                },
                multiSelect: {
                    type: 'boolean',
                    label: 'Seleção múltipla',
                    default: false
                }
            }
        });

        // Aliases comuns
        this.addAlias('headline', 'heading');
        this.addAlias('title', 'heading');
        this.addAlias('img', 'image');
        this.addAlias('btn', 'button');
        this.addAlias('cta', 'button');
    }

    /**
     * Registra uma nova definição de bloco
     */
    register(definition: BlockDefinition): void {
        this.definitions.set(definition.id, definition);
        this.categoriesCache.clear(); // Invalida cache de categorias
        
        appLogger.debug(`Block registered: ${definition.id}`, { data: [definition] });
    }

    /**
     * Adiciona um alias para um tipo de bloco
     */
    addAlias(alias: string, targetType: string): void {
        this.aliases.set(alias, targetType);
        appLogger.debug(`Alias registered: ${alias} -> ${targetType}`);
    }

    /**
     * Obtém definição de um bloco por tipo
     */
    getDefinition(type: string): BlockDefinition | undefined {
        // Tenta buscar diretamente
        const direct = this.definitions.get(type);
        if (direct) return direct;

        // Tenta resolver via alias
        const aliasTarget = this.aliases.get(type);
        if (aliasTarget) {
            return this.definitions.get(aliasTarget);
        }

        return undefined;
    }

    /**
     * Obtém todas as definições de uma categoria
     */
    getByCategory(category: string): BlockDefinition[] {
        // Verifica cache primeiro
        if (this.categoriesCache.has(category)) {
            return this.categoriesCache.get(category)!;
        }

        // Filtra por categoria
        const blocks = Array.from(this.definitions.values())
            .filter(def => def.category === category);

        // Armazena no cache
        this.categoriesCache.set(category, blocks);

        return blocks;
    }

    /**
     * Obtém todos os tipos registrados
     */
    getAllTypes(): string[] {
        return Array.from(this.definitions.keys());
    }

    /**
     * Resolve tipo oficial a partir de alias
     */
    resolveType(type: string): string {
        // Se existe definição direta, retorna o próprio tipo
        if (this.definitions.has(type)) {
            return type;
        }

        // Tenta resolver via alias
        const aliasTarget = this.aliases.get(type);
        if (aliasTarget) {
            return aliasTarget;
        }

        // Retorna o tipo original se não encontrar
        return type;
    }

    /**
     * Verifica se um tipo está registrado
     */
    hasType(type: string): boolean {
        return this.definitions.has(type) || this.aliases.has(type);
    }

    /**
     * Obtém todas as definições
     */
    getAllDefinitions(): BlockDefinition[] {
        return Array.from(this.definitions.values());
    }

    /**
     * Limpa todas as definições (útil para testes)
     */
    clear(): void {
        this.definitions.clear();
        this.aliases.clear();
        this.categoriesCache.clear();
        appLogger.debug('BlockRegistry cleared');
    }

    /**
     * Obtém estatísticas do registry
     */
    getStats() {
        return {
            totalDefinitions: this.definitions.size,
            totalAliases: this.aliases.size,
            categories: Array.from(
                new Set(
                    Array.from(this.definitions.values()).map(d => d.category)
                )
            ).length
        };
    }
}

/**
 * Instância singleton do registry
 */
export const BlockRegistry = new BlockRegistryClass();

/**
 * Export default para compatibilidade
 */
export default BlockRegistry;
