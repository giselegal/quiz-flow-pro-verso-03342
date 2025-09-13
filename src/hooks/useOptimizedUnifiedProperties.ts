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

// Função para gerar propriedades baseadas no tipo de bloco (memoizada)
const generatePropertiesForBlockType = (blockType: string): UnifiedProperty[] => {
    // Verifica cache primeiro
    if (propertiesCache.has(blockType)) {
        return propertiesCache.get(blockType)!;
    }

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

        // Aplica valores atuais do bloco se existir
        if (currentBlock?.properties || currentBlock?.content) {
            return generated.map(prop => ({
                ...prop,
                value: currentBlock?.properties?.[prop.key] ??
                    currentBlock?.content?.[prop.key] ??
                    prop.value
            }));
        }

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