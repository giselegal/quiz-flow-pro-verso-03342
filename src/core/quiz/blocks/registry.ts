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
import { BlockCategoryEnum, PropertyTypeEnum } from './types';
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
            type: 'text',
            name: 'Texto',
            description: 'Bloco de texto simples',
            category: BlockCategoryEnum.CONTENT,
            properties: [
                {
                    key: 'content',
                    type: PropertyTypeEnum.TEXTAREA,
                    label: 'Conteúdo',
                    description: 'Texto a ser exibido',
                    defaultValue: 'Digite o texto aqui',
                    required: true
                }
            ],
            defaultProperties: {
                content: 'Digite o texto aqui'
            }
        });

        this.register({
            type: 'heading',
            name: 'Título',
            description: 'Bloco de título/cabeçalho',
            category: BlockCategoryEnum.CONTENT,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto do título',
                    description: 'Texto do cabeçalho',
                    defaultValue: 'Título',
                    required: true
                },
                {
                    key: 'level',
                    type: PropertyTypeEnum.NUMBER,
                    label: 'Nível',
                    description: 'Nível hierárquico (1-6)',
                    defaultValue: 2,
                    validation: {
                        min: 1,
                        max: 6
                    }
                }
            ],
            defaultProperties: {
                text: 'Título',
                level: 2
            }
        });

        this.register({
            type: 'image',
            name: 'Imagem',
            description: 'Bloco de imagem',
            category: BlockCategoryEnum.MEDIA,
            properties: [
                {
                    key: 'src',
                    type: PropertyTypeEnum.URL,
                    label: 'URL da imagem',
                    description: 'Caminho ou URL da imagem',
                    defaultValue: '',
                    required: true
                },
                {
                    key: 'alt',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto alternativo',
                    description: 'Descrição da imagem para acessibilidade',
                    defaultValue: ''
                }
            ],
            defaultProperties: {
                src: '',
                alt: ''
            }
        });

        this.register({
            type: 'button',
            name: 'Botão',
            description: 'Botão de ação/CTA',
            category: BlockCategoryEnum.CONTENT,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto do botão',
                    description: 'Texto exibido no botão',
                    defaultValue: 'Clique aqui',
                    required: true
                },
                {
                    key: 'url',
                    type: PropertyTypeEnum.URL,
                    label: 'URL',
                    description: 'Link de destino',
                    defaultValue: ''
                }
            ],
            defaultProperties: {
                text: 'Clique aqui',
                url: ''
            }
        });

        this.register({
            type: 'question',
            name: 'Questão',
            description: 'Bloco de pergunta do quiz',
            category: BlockCategoryEnum.QUESTION,
            properties: [
                {
                    key: 'questionText',
                    type: PropertyTypeEnum.TEXTAREA,
                    label: 'Texto da questão',
                    description: 'Pergunta a ser exibida',
                    defaultValue: 'Qual é a sua pergunta?',
                    required: true
                },
                {
                    key: 'multiSelect',
                    type: PropertyTypeEnum.BOOLEAN,
                    label: 'Seleção múltipla',
                    description: 'Permitir selecionar múltiplas opções',
                    defaultValue: false
                }
            ],
            defaultProperties: {
                questionText: 'Qual é a sua pergunta?',
                multiSelect: false
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
        this.definitions.set(definition.type, definition);
        this.categoriesCache.clear(); // Invalida cache de categorias
        
        appLogger.debug(`Block registered: ${definition.type}`, { data: [definition] });
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
     * Obtém todos os aliases registrados
     */
    getAliases(): Map<string, string> {
        return new Map(this.aliases);
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
