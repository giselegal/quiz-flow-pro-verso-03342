#!/bin/bash

# 🔧 PADRONIZAÇÃO AUTOMÁTICA EM MASSA DE COMPONENTES

echo "🔧 INICIANDO PADRONIZAÇÃO AUTOMÁTICA EM MASSA..."
echo "================================================"

# 1. APLICAR CORES DA MARCA EM TODOS OS 803 COMPONENTES
echo ""
echo "🎨 1. APLICANDO CORES DA MARCA EM MASSA..."

# Função para processar um arquivo
process_file() {
    local file="$1"
    local filename=$(basename "$file")
    
    # Backup do arquivo
    cp "$file" "${file}.backup"
    
    # Aplicar todas as substituições de cores em uma só passada
    sed -i \
        -e 's/bg-blue-50/bg-[#B89B7A]\/10/g' \
        -e 's/bg-blue-100/bg-[#B89B7A]\/20/g' \
        -e 's/bg-blue-200/bg-[#B89B7A]\/30/g' \
        -e 's/bg-blue-300/bg-[#B89B7A]\/40/g' \
        -e 's/bg-blue-400/bg-[#B89B7A]\/60/g' \
        -e 's/bg-blue-500/bg-[#B89B7A]/g' \
        -e 's/bg-blue-600/bg-[#B89B7A]/g' \
        -e 's/bg-blue-700/bg-[#A38A69]/g' \
        -e 's/bg-blue-800/bg-[#A38A69]/g' \
        -e 's/bg-blue-900/bg-[#432818]/g' \
        \
        -e 's/text-blue-300/text-[#B89B7A]/g' \
        -e 's/text-blue-400/text-[#B89B7A]/g' \
        -e 's/text-blue-500/text-[#B89B7A]/g' \
        -e 's/text-blue-600/text-[#B89B7A]/g' \
        -e 's/text-blue-700/text-[#A38A69]/g' \
        -e 's/text-blue-800/text-[#432818]/g' \
        -e 's/text-blue-900/text-[#432818]/g' \
        \
        -e 's/border-blue-200/border-[#B89B7A]\/30/g' \
        -e 's/border-blue-300/border-[#B89B7A]\/40/g' \
        -e 's/border-blue-400/border-[#B89B7A]/g' \
        -e 's/border-blue-500/border-[#B89B7A]/g' \
        -e 's/border-blue-600/border-[#B89B7A]/g' \
        \
        -e 's/ring-blue-300/ring-[#B89B7A]\/40/g' \
        -e 's/ring-blue-400/ring-[#B89B7A]/g' \
        -e 's/ring-blue-500/ring-[#B89B7A]/g' \
        -e 's/focus:ring-blue-500/focus:ring-[#B89B7A]/g' \
        \
        -e 's/bg-yellow-50/bg-stone-50/g' \
        -e 's/bg-yellow-100/bg-stone-100/g' \
        -e 's/bg-yellow-200/bg-stone-200/g' \
        -e 's/text-yellow-600/text-stone-600/g' \
        -e 's/text-yellow-700/text-stone-700/g' \
        -e 's/text-yellow-800/text-stone-800/g' \
        -e 's/border-yellow-300/border-stone-300/g' \
        \
        -e 's/bg-orange-50/bg-[#B89B7A]\/10/g' \
        -e 's/bg-orange-100/bg-[#B89B7A]\/20/g' \
        -e 's/bg-orange-500/bg-[#B89B7A]/g' \
        -e 's/text-orange-600/text-[#B89B7A]/g' \
        -e 's/text-orange-700/text-[#A38A69]/g' \
        -e 's/border-orange-300/border-[#B89B7A]\/40/g' \
        \
        -e 's/bg-purple-50/bg-[#B89B7A]\/10/g' \
        -e 's/bg-purple-100/bg-[#B89B7A]\/20/g' \
        -e 's/bg-purple-500/bg-[#B89B7A]/g' \
        -e 's/text-purple-600/text-[#B89B7A]/g' \
        -e 's/text-purple-700/text-[#A38A69]/g' \
        \
        -e 's/bg-indigo-50/bg-[#B89B7A]\/10/g' \
        -e 's/bg-indigo-100/bg-[#B89B7A]\/20/g' \
        -e 's/bg-indigo-500/bg-[#B89B7A]/g' \
        -e 's/bg-indigo-600/bg-[#B89B7A]/g' \
        -e 's/text-indigo-600/text-[#B89B7A]/g' \
        -e 's/border-indigo-500/border-[#B89B7A]/g' \
        "$file"
    
    # Verificar se houve mudanças
    if ! cmp -s "$file" "${file}.backup"; then
        echo "   ✅ $filename - Cores atualizadas"
        return 0
    else
        rm "${file}.backup"
        return 1
    fi
}

# Processar todos os arquivos TSX/TS em paralelo
echo "   📁 Processando todos os componentes TSX/TS..."
updated_count=0
total_count=0

find /workspaces/quiz-quest-challenge-verse/src -name "*.tsx" -o -name "*.ts" | while read file; do
    ((total_count++))
    if process_file "$file"; then
        ((updated_count++))
    fi
    
    # Progresso a cada 50 arquivos
    if (( total_count % 50 == 0 )); then
        echo "   📊 Processados: $total_count arquivos"
    fi
done

echo "   ✅ Processamento de cores concluído!"
echo ""

# 2. CRIAR HOOK UNIFICADO PARA PROPRIEDADES
echo "🔗 2. CRIANDO HOOK UNIFICADO PARA PROPRIEDADES..."

cat > /workspaces/quiz-quest-challenge-verse/src/hooks/useUnifiedProperties.ts << 'EOF'
import { useState, useCallback, useEffect } from 'react';
import { BRAND_COLORS } from '@/config/brandColors';

export interface UnifiedProperty {
  key: string;
  value: any;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'color' | 'select' | 'range';
  label: string;
  category: 'content' | 'style' | 'layout' | 'advanced';
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export interface UnifiedBlock {
  id: string;
  type: string;
  properties: Record<string, any>;
  brandColors?: typeof BRAND_COLORS;
}

export interface UseUnifiedPropertiesReturn {
  properties: UnifiedProperty[];
  updateProperty: (key: string, value: any) => void;
  resetProperties: () => void;
  validateProperties: () => boolean;
  getPropertyByKey: (key: string) => UnifiedProperty | undefined;
  getPropertiesByCategory: (category: string) => UnifiedProperty[];
  exportProperties: () => Record<string, any>;
  applyBrandColors: () => void;
}

export const useUnifiedProperties = (
  block: UnifiedBlock | null,
  onUpdate?: (blockId: string, updates: Record<string, any>) => void
): UseUnifiedPropertiesReturn => {
  const [properties, setProperties] = useState<UnifiedProperty[]>([]);

  // Gerar propriedades padrão baseadas no tipo do bloco
  const generateDefaultProperties = useCallback((blockType: string): UnifiedProperty[] => {
    const baseProperties: UnifiedProperty[] = [
      {
        key: 'id',
        value: block?.id || '',
        type: 'text',
        label: 'ID do Componente',
        category: 'advanced',
        required: true,
      },
      {
        key: 'visible',
        value: true,
        type: 'boolean',
        label: 'Visível',
        category: 'layout',
      },
    ];

    // Propriedades específicas por tipo
    switch (blockType) {
      case 'text':
      case 'text-inline':
        return [
          ...baseProperties,
          {
            key: 'content',
            value: block?.properties?.content || 'Texto exemplo',
            type: 'textarea',
            label: 'Conteúdo',
            category: 'content',
            required: true,
          },
          {
            key: 'fontSize',
            value: block?.properties?.fontSize || 16,
            type: 'range',
            label: 'Tamanho da Fonte',
            category: 'style',
            min: 12,
            max: 48,
            step: 1,
          },
          {
            key: 'textColor',
            value: block?.properties?.textColor || BRAND_COLORS.brand.text,
            type: 'color',
            label: 'Cor do Texto',
            category: 'style',
          },
        ];

      case 'heading':
      case 'heading-inline':
        return [
          ...baseProperties,
          {
            key: 'content',
            value: block?.properties?.content || 'Título Principal',
            type: 'text',
            label: 'Título',
            category: 'content',
            required: true,
          },
          {
            key: 'level',
            value: block?.properties?.level || 'h2',
            type: 'select',
            label: 'Nível do Título',
            category: 'content',
            options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
          },
          {
            key: 'textAlign',
            value: block?.properties?.textAlign || 'left',
            type: 'select',
            label: 'Alinhamento',
            category: 'style',
            options: ['left', 'center', 'right', 'justify'],
          },
        ];

      case 'button':
      case 'button-inline':
        return [
          ...baseProperties,
          {
            key: 'text',
            value: block?.properties?.text || 'Clique Aqui',
            type: 'text',
            label: 'Texto do Botão',
            category: 'content',
            required: true,
          },
          {
            key: 'variant',
            value: block?.properties?.variant || 'primary',
            type: 'select',
            label: 'Estilo',
            category: 'style',
            options: ['primary', 'secondary', 'outline', 'ghost'],
          },
          {
            key: 'backgroundColor',
            value: block?.properties?.backgroundColor || BRAND_COLORS.brand.primary,
            type: 'color',
            label: 'Cor de Fundo',
            category: 'style',
          },
        ];

      case 'image':
      case 'image-inline':
        return [
          ...baseProperties,
          {
            key: 'src',
            value: block?.properties?.src || '',
            type: 'text',
            label: 'URL da Imagem',
            category: 'content',
            required: true,
          },
          {
            key: 'alt',
            value: block?.properties?.alt || 'Descrição da imagem',
            type: 'text',
            label: 'Texto Alternativo',
            category: 'content',
          },
          {
            key: 'width',
            value: block?.properties?.width || 300,
            type: 'range',
            label: 'Largura',
            category: 'layout',
            min: 50,
            max: 800,
            step: 10,
          },
        ];

      default:
        return baseProperties;
    }
  }, [block]);

  // Atualizar propriedades quando o bloco mudar
  useEffect(() => {
    if (block) {
      const newProperties = generateDefaultProperties(block.type);
      setProperties(newProperties);
    } else {
      setProperties([]);
    }
  }, [block, generateDefaultProperties]);

  // Função para atualizar uma propriedade
  const updateProperty = useCallback((key: string, value: any) => {
    setProperties(prev => 
      prev.map(prop => 
        prop.key === key ? { ...prop, value } : prop
      )
    );

    // Notificar mudança externa
    if (block && onUpdate) {
      onUpdate(block.id, { [key]: value });
    }
  }, [block, onUpdate]);

  // Resetar propriedades
  const resetProperties = useCallback(() => {
    if (block) {
      const defaultProperties = generateDefaultProperties(block.type);
      setProperties(defaultProperties);
    }
  }, [block, generateDefaultProperties]);

  // Validar propriedades
  const validateProperties = useCallback(() => {
    return properties.every(prop => {
      if (prop.required && (!prop.value || prop.value === '')) {
        return false;
      }
      return true;
    });
  }, [properties]);

  // Obter propriedade por chave
  const getPropertyByKey = useCallback((key: string) => {
    return properties.find(prop => prop.key === key);
  }, [properties]);

  // Obter propriedades por categoria
  const getPropertiesByCategory = useCallback((category: string) => {
    return properties.filter(prop => prop.category === category);
  }, [properties]);

  // Exportar propriedades como objeto
  const exportProperties = useCallback(() => {
    return properties.reduce((acc, prop) => {
      acc[prop.key] = prop.value;
      return acc;
    }, {} as Record<string, any>);
  }, [properties]);

  // Aplicar cores da marca automaticamente
  const applyBrandColors = useCallback(() => {
    setProperties(prev => 
      prev.map(prop => {
        if (prop.type === 'color') {
          if (prop.key.includes('text') || prop.key.includes('Text')) {
            return { ...prop, value: BRAND_COLORS.brand.text };
          }
          if (prop.key.includes('background') || prop.key.includes('Background')) {
            return { ...prop, value: BRAND_COLORS.brand.primary };
          }
          if (prop.key.includes('border') || prop.key.includes('Border')) {
            return { ...prop, value: BRAND_COLORS.brand.primary };
          }
        }
        return prop;
      })
    );
  }, []);

  return {
    properties,
    updateProperty,
    resetProperties,
    validateProperties,
    getPropertyByKey,
    getPropertiesByCategory,
    exportProperties,
    applyBrandColors,
  };
};

export default useUnifiedProperties;
EOF

echo "   ✅ Hook unificado criado!"
echo ""

# 3. CRIAR PAINEL UNIVERSAL
echo "🎛️ 3. CRIANDO PAINEL DE PROPRIEDADES UNIVERSAL..."

cat > /workspaces/quiz-quest-challenge-verse/src/components/universal/UniversalPropertiesPanel.tsx << 'EOF'
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  Palette, 
  Layout, 
  Settings, 
  Trash2, 
  RotateCcw,
  Paintbrush,
  Eye,
  EyeOff
} from 'lucide-react';
import { useUnifiedProperties, UnifiedBlock } from '@/hooks/useUnifiedProperties';
import { BRAND_COLORS } from '@/config/brandColors';

interface UniversalPropertiesPanelProps {
  selectedBlock: UnifiedBlock | null;
  onUpdate?: (blockId: string, updates: Record<string, any>) => void;
  onDelete?: (blockId: string) => void;
  onClose?: () => void;
}

const UniversalPropertiesPanel: React.FC<UniversalPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const {
    properties,
    updateProperty,
    resetProperties,
    validateProperties,
    getPropertiesByCategory,
    applyBrandColors,
  } = useUnifiedProperties(selectedBlock, onUpdate);

  // Categorizar propriedades
  const categorizedProperties = useMemo(() => ({
    content: getPropertiesByCategory('content'),
    style: getPropertiesByCategory('style'),
    layout: getPropertiesByCategory('layout'),
    advanced: getPropertiesByCategory('advanced'),
  }), [getPropertiesByCategory]);

  // Renderizar campo de propriedade
  const renderPropertyField = (property: any) => {
    const { key, value, type, label, required, options, min, max, step } = property;

    switch (type) {
      case 'text':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={key}
              value={value || ''}
              onChange={(e) => updateProperty(key, e.target.value)}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={key}
              value={value || ''}
              onChange={(e) => updateProperty(key, e.target.value)}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20 min-h-[80px]"
            />
          </div>
        );

      case 'number':
      case 'range':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
              {type === 'range' && <span className="text-[#B89B7A] ml-2">({value})</span>}
            </Label>
            {type === 'range' ? (
              <Slider
                value={[value || 0]}
                onValueChange={(values) => updateProperty(key, values[0])}
                min={min || 0}
                max={max || 100}
                step={step || 1}
                className="w-full"
              />
            ) : (
              <Input
                id={key}
                type="number"
                value={value || ''}
                onChange={(e) => updateProperty(key, Number(e.target.value))}
                min={min}
                max={max}
                step={step}
                className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
              />
            )}
          </div>
        );

      case 'boolean':
        return (
          <div key={key} className="flex items-center justify-between space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label}
            </Label>
            <Switch
              id={key}
              checked={value || false}
              onCheckedChange={(checked) => updateProperty(key, checked)}
            />
          </div>
        );

      case 'color':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label}
            </Label>
            <div className="flex gap-2">
              <Input
                id={key}
                type="color"
                value={value || '#000000'}
                onChange={(e) => updateProperty(key, e.target.value)}
                className="w-12 h-10 border-[#B89B7A]/30"
              />
              <Input
                value={value || '#000000'}
                onChange={(e) => updateProperty(key, e.target.value)}
                className="flex-1 border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
                placeholder="#000000"
              />
            </div>
          </div>
        );

      case 'select':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Select value={value} onValueChange={(newValue) => updateProperty(key, newValue)}>
              <SelectTrigger className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20">
                <SelectValue placeholder="Selecionar..." />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  if (!selectedBlock) {
    return (
      <Card className="w-80 h-full border-[#B89B7A]/30">
        <CardHeader className="bg-[#B89B7A]/10 border-b border-[#B89B7A]/30">
          <CardTitle className="text-[#432818] flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Propriedades
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-stone-500">
            <Settings className="w-12 h-12 mx-auto mb-4 text-stone-400" />
            <p>Selecione um componente para editar suas propriedades</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isValid = validateProperties();

  return (
    <Card className="w-80 h-full border-[#B89B7A]/30 flex flex-col">
      {/* Header */}
      <CardHeader className="bg-[#B89B7A]/10 border-b border-[#B89B7A]/30 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#432818] flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Propriedades
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={applyBrandColors}
              className="text-[#B89B7A] hover:bg-[#B89B7A]/20"
            >
              <Paintbrush className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetProperties}
              className="text-[#B89B7A] hover:bg-[#B89B7A]/20"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-stone-500 hover:bg-stone-100"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Info do componente */}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="border-[#B89B7A] text-[#B89B7A]">
            {selectedBlock.type}
          </Badge>
          <Badge variant={isValid ? "default" : "destructive"}>
            {isValid ? "Válido" : "Inválido"}
          </Badge>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 overflow-y-auto p-0">
        <Tabs defaultValue="content" className="h-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#B89B7A]/10 rounded-none border-b border-[#B89B7A]/30">
            <TabsTrigger value="content" className="data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white">
              <Type className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="style" className="data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white">
              <Palette className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="layout" className="data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white">
              <Layout className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white">
              <Settings className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="p-4 space-y-4">
            {categorizedProperties.content.length > 0 ? (
              categorizedProperties.content.map(renderPropertyField)
            ) : (
              <p className="text-stone-500 text-sm">Nenhuma propriedade de conteúdo disponível</p>
            )}
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-4">
            {categorizedProperties.style.length > 0 ? (
              categorizedProperties.style.map(renderPropertyField)
            ) : (
              <p className="text-stone-500 text-sm">Nenhuma propriedade de estilo disponível</p>
            )}
          </TabsContent>

          <TabsContent value="layout" className="p-4 space-y-4">
            {categorizedProperties.layout.length > 0 ? (
              categorizedProperties.layout.map(renderPropertyField)
            ) : (
              <p className="text-stone-500 text-sm">Nenhuma propriedade de layout disponível</p>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="p-4 space-y-4">
            {categorizedProperties.advanced.length > 0 ? (
              categorizedProperties.advanced.map(renderPropertyField)
            ) : (
              <p className="text-stone-500 text-sm">Nenhuma propriedade avançada disponível</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Footer com ações */}
      {onDelete && (
        <div className="border-t border-[#B89B7A]/30 p-4 flex-shrink-0">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(selectedBlock.id)}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir Componente
          </Button>
        </div>
      )}
    </Card>
  );
};

export default UniversalPropertiesPanel;
EOF

echo "   ✅ Painel universal criado!"
echo ""

# 4. APLICAR VALIDAÇÃO AUTOMÁTICA
echo "🔍 4. CRIANDO SISTEMA DE VALIDAÇÃO AUTOMÁTICA..."

cat > /workspaces/quiz-quest-challenge-verse/validacao-automatica-componentes.sh << 'EOF'
#!/bin/bash

# Sistema de validação automática de componentes

echo "🔍 VALIDAÇÃO AUTOMÁTICA DE COMPONENTES"
echo "====================================="

# Verificar cores da marca
check_brand_colors() {
    local file="$1"
    local brand_colors=0
    local old_colors=0
    
    # Contar cores da marca
    brand_colors=$(grep -c "#B89B7A\|#D4C2A8\|#432818" "$file" 2>/dev/null || echo 0)
    
    # Contar cores antigas
    old_colors=$(grep -c "bg-blue-\|bg-yellow-\|bg-orange-\|text-blue-" "$file" 2>/dev/null || echo 0)
    
    if [ $old_colors -gt 0 ]; then
        echo "❌ $(basename $file) - $old_colors cores antigas encontradas"
        return 1
    elif [ $brand_colors -gt 0 ]; then
        echo "✅ $(basename $file) - $brand_colors cores da marca"
        return 0
    else
        echo "⚪ $(basename $file) - sem cores específicas"
        return 0
    fi
}

# Verificar propriedades padrão
check_properties() {
    local file="$1"
    
    if grep -q "useUnifiedProperties\|UniversalPropertiesPanel" "$file" 2>/dev/null; then
        echo "✅ $(basename $file) - usando sistema unificado"
        return 0
    elif grep -q "PropertiesPanel\|PropertyPanel" "$file" 2>/dev/null; then
        echo "⚠️  $(basename $file) - usando painel antigo"
        return 1
    else
        return 0
    fi
}

# Executar validação
echo "🎨 Validando cores da marca..."
colors_ok=0
colors_total=0

echo "🎛️ Validando painéis de propriedades..."
panels_ok=0
panels_total=0

find /workspaces/quiz-quest-challenge-verse/src/components -name "*.tsx" | while read file; do
    if check_brand_colors "$file"; then
        ((colors_ok++))
    fi
    ((colors_total++))
    
    if check_properties "$file"; then
        ((panels_ok++))
    fi
    ((panels_total++))
done

echo ""
echo "📊 RESULTADO DA VALIDAÇÃO:"
echo "   🎨 Cores: $colors_ok/$colors_total componentes em conformidade"
echo "   🎛️ Painéis: $panels_ok/$panels_total componentes modernizados"
EOF

chmod +x /workspaces/quiz-quest-challenge-verse/validacao-automatica-componentes.sh

echo "   ✅ Sistema de validação criado!"
echo ""

echo "🎯 5. RESUMO DA PADRONIZAÇÃO AUTOMÁTICA..."
echo ""
echo "✅ IMPLEMENTADO:"
echo "   1. 🎨 Aplicação de cores da marca em MASSA (803 componentes)"
echo "   2. 🔗 Hook unificado useUnifiedProperties"
echo "   3. 🎛️ Painel universal UniversalPropertiesPanel"
echo "   4. 🔍 Sistema de validação automática"
echo ""
echo "🚀 PRÓXIMOS PASSOS:"
echo "   1. Substituir painéis antigos pelo UniversalPropertiesPanel"
echo "   2. Executar validação: ./validacao-automatica-componentes.sh"
echo "   3. Aplicar hooks unificados nos editores principais"
echo "   4. Configurar CI/CD para manter padrões"
echo ""
echo "✨ PADRONIZAÇÃO AUTOMÁTICA CONCLUÍDA!"
