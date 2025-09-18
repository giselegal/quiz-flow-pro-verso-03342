import { useCallback, useMemo } from 'react';
import { PropertyType, PropertyCategory, UnifiedProperty, UnifiedBlock } from './useUnifiedProperties';

/**
 * 🚀 Hook otimizado para propriedades unificadas
 * 
 * Melhorias implementadas:
 * - ✅ Sem useState + useEffect desnecessários
 * - ✅ Memoização eficiente
 * - ✅ Dependências mínimas
 * - ✅ Performance otimizada
 */

interface UseOptimizedUnifiedPropertiesOptions {
    blockType: string;
    blockId?: string;
    currentBlock?: UnifiedBlock | null;
    onUpdate?: (blockId: string, updates: any) => void;
}

// Cache de propriedades por tipo de bloco para evitar recálculos
const propertiesCache = new Map<string, UnifiedProperty[]>();

// Função para carregar configurações NoCode do localStorage
const loadNoCodeConfiguration = () => {
    try {
        // Configurações gerais NoCode
        const noCodeConfig = localStorage.getItem('quiz-nocode-config');
        const globalConfig = localStorage.getItem('quiz-global-config');

        // Configurações específicas por tipo de bloco/resultado
        const resultConfig = localStorage.getItem('quiz-result-config');
        const step20Config = localStorage.getItem('step20-configuration');

        // Configurações específicas por estilo (para blocos de resultado)
        const styleConfigs: Record<string, any> = {};
        ['Elegante', 'Moderno', 'Natural', 'Clássico', 'Boho', 'Minimalista'].forEach(style => {
            const key = `result_config_${style}`;
            const config = localStorage.getItem(key);
            if (config) {
                try {
                    styleConfigs[style] = JSON.parse(config);
                } catch { /* ignore */ }
            }
        });

        return {
            noCode: noCodeConfig ? JSON.parse(noCodeConfig) : null,
            global: globalConfig ? JSON.parse(globalConfig) : null,
            result: resultConfig ? JSON.parse(resultConfig) : null,
            step20: step20Config ? JSON.parse(step20Config) : null,
            styles: styleConfigs
        };
    } catch (error) {
        console.warn('Erro ao carregar configurações NoCode:', error);
        return { noCode: null, global: null, result: null, step20: null, styles: {} };
    }
};

// Função para gerar propriedades baseadas no tipo de bloco (memoizada) + NoCode
const generatePropertiesForBlockType = (blockType: string): UnifiedProperty[] => {
    // Verifica cache primeiro
    if (propertiesCache.has(blockType)) {
        return propertiesCache.get(blockType)!;
    }

    // 🎯 CORREÇÃO CRÍTICA: Carregar configurações NoCode
    const noCodeConfigs = loadNoCodeConfiguration();

    let properties: UnifiedProperty[] = [];

    // Propriedades básicas para todos os tipos
    const baseProperties: UnifiedProperty[] = [
        {
            key: 'id',
            value: '',
            type: PropertyType.TEXT,
            label: 'ID',
            category: PropertyCategory.ADVANCED
        }
    ];    // Propriedades específicas por tipo
    switch (blockType) {
        case 'header':
        case 'heading':
            properties = [
                ...baseProperties,
                {
                    key: 'text',
                    value: '',
                    type: PropertyType.TEXT,
                    label: 'Texto do Título',
                    category: PropertyCategory.CONTENT,
                    placeholder: 'Digite o título...'
                },
                {
                    key: 'level',
                    value: 1,
                    type: PropertyType.SELECT,
                    label: 'Nível do Título',
                    category: PropertyCategory.CONTENT,
                    options: [
                        { value: 1, label: 'H1 - Título Principal' },
                        { value: 2, label: 'H2 - Subtítulo' },
                        { value: 3, label: 'H3 - Seção' },
                        { value: 4, label: 'H4 - Subseção' },
                        { value: 5, label: 'H5 - Pequeno' },
                        { value: 6, label: 'H6 - Menor' }
                    ]
                },
                {
                    key: 'fontSize',
                    value: 24,
                    type: PropertyType.RANGE,
                    label: 'Tamanho da Fonte',
                    category: PropertyCategory.STYLE,
                    min: 12,
                    max: 72,
                    step: 1
                },
                {
                    key: 'textColor',
                    value: '#000000',
                    type: PropertyType.COLOR,
                    label: 'Cor do Texto',
                    category: PropertyCategory.STYLE
                },
                {
                    key: 'textAlign',
                    value: 'left',
                    type: PropertyType.SELECT,
                    label: 'Alinhamento',
                    category: PropertyCategory.STYLE,
                    options: [
                        { value: 'left', label: 'Esquerda' },
                        { value: 'center', label: 'Centro' },
                        { value: 'right', label: 'Direita' }
                    ]
                }
            ];
            break;

        case 'text':
        case 'paragraph':
            properties = [
                ...baseProperties,
                {
                    key: 'text',
                    value: '',
                    type: PropertyType.TEXTAREA,
                    label: 'Texto',
                    category: PropertyCategory.CONTENT,
                    placeholder: 'Digite o texto...'
                },
                {
                    key: 'fontSize',
                    value: 16,
                    type: PropertyType.RANGE,
                    label: 'Tamanho da Fonte',
                    category: PropertyCategory.STYLE,
                    min: 10,
                    max: 36,
                    step: 1
                },
                {
                    key: 'textColor',
                    value: '#000000',
                    type: PropertyType.COLOR,
                    label: 'Cor do Texto',
                    category: PropertyCategory.STYLE
                }
            ];
            break;

        case 'button':
            properties = [
                ...baseProperties,
                {
                    key: 'text',
                    value: 'Clique aqui',
                    type: PropertyType.TEXT,
                    label: 'Texto do Botão',
                    category: PropertyCategory.CONTENT
                },
                {
                    key: 'variant',
                    value: 'primary',
                    type: PropertyType.SELECT,
                    label: 'Variação',
                    category: PropertyCategory.STYLE,
                    options: [
                        { value: 'primary', label: 'Primário' },
                        { value: 'secondary', label: 'Secundário' },
                        { value: 'outline', label: 'Contorno' }
                    ]
                },
                {
                    key: 'size',
                    value: 'md',
                    type: PropertyType.SELECT,
                    label: 'Tamanho',
                    category: PropertyCategory.STYLE,
                    options: [
                        { value: 'sm', label: 'Pequeno' },
                        { value: 'md', label: 'Médio' },
                        { value: 'lg', label: 'Grande' }
                    ]
                },
                {
                    key: 'backgroundColor',
                    value: '#0066cc',
                    type: PropertyType.COLOR,
                    label: 'Cor de Fundo',
                    category: PropertyCategory.STYLE
                }
            ];
            break;

        case 'result':
        case 'quiz-result':
        case 'step20-result':
            // 🎯 CORREÇÃO CRÍTICA: Propriedades de resultado integradas com NoCode
            properties = [
                ...baseProperties,
                {
                    key: 'resultTitle',
                    value: noCodeConfigs.result?.title || noCodeConfigs.step20?.title || 'Seu Resultado',
                    type: PropertyType.TEXT,
                    label: 'Título do Resultado',
                    category: PropertyCategory.CONTENT
                },
                {
                    key: 'resultDescription',
                    value: noCodeConfigs.result?.description || noCodeConfigs.step20?.description || '',
                    type: PropertyType.TEXTAREA,
                    label: 'Descrição do Resultado',
                    category: PropertyCategory.CONTENT
                },
                {
                    key: 'resultStyle',
                    value: 'Elegante',
                    type: PropertyType.SELECT,
                    label: 'Estilo do Resultado',
                    category: PropertyCategory.STYLE,
                    options: [
                        { value: 'Elegante', label: 'Elegante' },
                        { value: 'Moderno', label: 'Moderno' },
                        { value: 'Natural', label: 'Natural' },
                        { value: 'Clássico', label: 'Clássico' },
                        { value: 'Boho', label: 'Boho' },
                        { value: 'Minimalista', label: 'Minimalista' }
                    ]
                }
            ];

            // Adicionar configurações específicas por estilo se existirem
            Object.entries(noCodeConfigs.styles).forEach(([style, config]: [string, any]) => {
                if (config && typeof config === 'object') {
                    properties.push({
                        key: `style_${style.toLowerCase()}_config`,
                        value: JSON.stringify(config, null, 2),
                        type: PropertyType.TEXTAREA,
                        label: `Config. ${style}`,
                        category: PropertyCategory.ADVANCED
                    });
                }
            });
            break;

        default:
            properties = baseProperties;
    }

    // Armazena no cache
    propertiesCache.set(blockType, properties);
    return properties;
};

export const useOptimizedUnifiedProperties = ({
    blockType,
    blockId,
    currentBlock,
    onUpdate
}: UseOptimizedUnifiedPropertiesOptions) => {

    // Gera propriedades baseadas no tipo (memoizado e cacheado)
    const properties = useMemo(() => {
        const generated = generatePropertiesForBlockType(blockType);

        // 🔍 DEBUG CRÍTICO - Hook processamento
        console.log('🚀 useOptimizedUnifiedProperties - processando:', {
            blockType,
            currentBlockExists: !!currentBlock,
            currentBlockId: currentBlock?.id,
            hasProperties: !!currentBlock?.properties,
            hasContent: !!currentBlock?.content,
            propertiesData: currentBlock?.properties,
            contentData: currentBlock?.content,
            basePropsCount: generated.length
        });

        // Aplica valores atuais do bloco se existir
        if (currentBlock?.properties || currentBlock?.content) {
            const result = generated.map(prop => ({
                ...prop,
                value: currentBlock?.properties?.[prop.key] ??
                    currentBlock?.content?.[prop.key] ??
                    prop.value
            }));

            console.log('✅ useOptimizedUnifiedProperties - propriedades hidratadas:', result);
            return result;
        }

        console.log('⚠️ useOptimizedUnifiedProperties - usando propriedades base (sem dados do currentBlock)');
        return generated;
    }, [blockType, currentBlock?.properties, currentBlock?.content]);

    // Função para atualizar propriedade (otimizada)
    const updateProperty = useCallback((key: string, value: any) => {
        if (!onUpdate || !blockId) return;

        console.log('🚀 useOptimizedUnifiedProperties updateProperty:', {
            blockId,
            key,
            value
        });

        onUpdate(blockId, { properties: { [key]: value } });
    }, [onUpdate, blockId]);

    // Função para obter propriedades por categoria
    const getPropertiesByCategory = useCallback((category: string) => {
        return properties.filter(prop => prop.category === category);
    }, [properties]);

    // Função para obter propriedade por chave
    const getPropertyByKey = useCallback((key: string) => {
        return properties.find(prop => prop.key === key);
    }, [properties]);

    // Função para resetar propriedades
    const resetProperties = useCallback(() => {
        if (!onUpdate || !blockId) return;

        const resetValues: Record<string, any> = {};
        properties.forEach(prop => {
            if (prop.defaultValue !== undefined) {
                resetValues[prop.key] = prop.defaultValue;
            }
        });

        onUpdate(blockId, { properties: resetValues });
    }, [onUpdate, blockId, properties]);

    return {
        properties,
        updateProperty,
        getPropertiesByCategory,
        getPropertyByKey,
        resetProperties
    };
};

export default useOptimizedUnifiedProperties;