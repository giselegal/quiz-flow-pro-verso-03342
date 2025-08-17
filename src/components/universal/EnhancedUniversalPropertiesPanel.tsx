// @ts-nocheck
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
// ✅ Importa controles visuais NO-CODE
import AlignmentButtons from '@/components/visual-controls/AlignmentButtons';
import ColorPicker from '@/components/visual-controls/ColorPicker';
import SizeSlider from '@/components/visual-controls/SizeSlider';
// ✅ Importa componentes de feedback melhorados
import { EnhancedPropertyInput } from './EnhancedPropertyInput';
import { PropertyChangeIndicator } from './PropertyChangeIndicator';
// ✅ Importa painel específico do quiz
import { OptionsGridPropertiesPanel } from '@/components/editor/quiz/OptionsGridPropertiesPanel';
import { QuizConfigurationPanel } from '@/components/editor/quiz/QuizConfigurationPanel';
import { QuizHeaderPropertiesPanel } from '@/components/editor/quiz/QuizHeaderPropertiesPanel';
import { IntroPropertiesPanel } from '@/components/steps/step01/IntroPropertiesPanel';
// ✅ Importa UnifiedBlock, useUnifiedProperties e PropertyType do hook
import {
  PropertyType,
  UnifiedBlock,
  UnifiedProperty,
  useUnifiedProperties,
} from '@/hooks/useUnifiedProperties';
import { BlockDefinition } from '@/types/editor'; // Mantido para compatibilidade da interface
// ✅ Importa hook de sincronização de scroll
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
import {
  EyeOff,
  Layout,
  Paintbrush,
  Palette,
  RotateCcw,
  Settings,
  Trash2,
  Type,
} from 'lucide-react';

// A interface UnifiedBlock é importada do hook, garantindo consistência
interface EnhancedUniversalPropertiesPanelProps {
  selectedBlock: UnifiedBlock | null;
  onUpdate?: (blockId: string, updates: Record<string, any>) => void;
  onDelete?: (blockId: string) => void;
  onClose?: () => void;

  // Propriedades adicionadas para compatibilidade (o hook agora lida com `selectedBlock`)
  block?: any; // Compatibilidade com OptimizedPropertiesPanel (agora será `selectedBlock`)
  blockDefinition?: BlockDefinition; // Compatibilidade com novo sistema (não usado diretamente pelo hook)
  onUpdateBlock?: (blockId: string, updates: Partial<any>) => void; // Compatibilidade com novo sistema (agora será `onUpdate`)
}

// Componente principal com compatibilidade dupla
const EnhancedUniversalPropertiesPanel: React.FC<EnhancedUniversalPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate, // Este é o `onUpdateExternal` para o hook
  onDelete,
  onClose,
  blockDefinition, // ✅ CORREÇÃO: Usar blockDefinition passado pelo editor
  // As props `block`, `onUpdateBlock` são agora redundantes
  // pois o `selectedBlock` e `onUpdate` são as fontes de verdade para o hook.
}) => {
  // ✅ Hook de sincronização de scroll conectado ao painel de propriedades
  const { scrollRef } = useSyncedScroll({ source: 'properties' });

  // ✅ Normaliza `selectedBlock` para ser a única fonte de verdade para o hook.
  const actualBlock = selectedBlock;

  // ✅ Usa o hook useUnifiedProperties para gerenciar as propriedades do bloco selecionado.
  // O `onUpdate` passado aqui é o `onUpdateExternal` para o hook, que por sua vez,
  // chamará o `onUpdate` do `EditorProvider`.
  const { properties, updateProperty, resetProperties, getPropertiesByCategory } =
    useUnifiedProperties(
      actualBlock?.type || '',
      actualBlock?.id,
      actualBlock,
      onUpdate // Passa o `onUpdate` do painel diretamente para o hook
    );

  // ✅ OTIMIZAÇÃO: Logs de debug removidos para melhor performance
  const debugInfo =
    actualBlock && process.env.NODE_ENV === 'development'
      ? {
          id: actualBlock.id,
          type: actualBlock.type,
          propertiesCount: properties?.length || 0,
        }
      : null;

  if (debugInfo) {
    console.log('🎯 EnhancedUniversalPropertiesPanel:', debugInfo);
  }

  // Log específico para quiz-intro-header
  if (actualBlock?.type === 'quiz-intro-header') {
    console.log('🏠 [quiz-intro-header] Debug específico:', {
      blockId: actualBlock.id,
      blockType: actualBlock.type,
      blockProperties: actualBlock.properties,
      hookPropertiesGenerated: properties?.length || 0,
      hookPropertiesPreview: properties?.slice(0, 5)?.map(p => ({ key: p.key, value: p.value })),
    });
  }

  // Se nenhum bloco estiver selecionado, exibe uma mensagem
  if (!actualBlock) {
    return (
      <Card className="h-full flex flex-col border-[#B89B7A]/30 bg-white/95 backdrop-blur-sm">
        <CardContent className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center text-[#B89B7A]">
            <Layout className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Selecione um componente para editar suas propriedades</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ✅ NO-CODE: Categorias visuais e amigáveis (abas)
  const categoryOrder = [
    'logo',
    'style',
    'layout',
    'content',
    'alignment',
    'behavior',
    'scoring',
    'advanced',
  ];

  const categoryIcons = {
    logo: Type,
    content: Type,
    style: Paintbrush,
    layout: Layout,
    alignment: Layout,
    behavior: Settings,
    scoring: Palette,
    advanced: Settings,
  };

  const categoryLabels = {
    logo: '🏷️ Logo',
    content: '📝 Conteúdo',
    style: '🎨 Estilo',
    layout: '📐 Layout',
    alignment: '📐 Alinhamento',
    behavior: '⚙️ Comportamento',
    scoring: '🏆 Pontuação',
    advanced: '🔧 Avançado',
  };

  // ✅ NO-CODE: Renderizar campo baseado no tipo com controles visuais
  const renderField = (property: UnifiedProperty, idx: number) => {
    const { key, label, type, value, required, options, rows, min, max, step, unit } = property;

    // `options` já vem no formato correto ({ value, label }) do `useUnifiedProperties`
    const formattedOptions = options;

    switch (type) {
      // ✅ NO-CODE: Campo de texto simples com feedback melhorado
      case PropertyType.TEXT:
        return (
          <EnhancedPropertyInput
            key={`${key}-${idx}`}
            label={label}
            value={value || ''}
            placeholder={`Digite ${label.toLowerCase()}`}
            onChange={newValue => updateProperty(key, newValue)}
            type="text"
            className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
          />
        );

      // ✅ NO-CODE: Área de texto simples com feedback melhorado
      case PropertyType.TEXTAREA:
        return (
          <EnhancedPropertyInput
            key={key}
            label={label}
            value={value || ''}
            placeholder={`Digite ${label.toLowerCase()}`}
            onChange={newValue => updateProperty(key, newValue)}
            type="textarea"
            rows={rows || 3}
            className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
          />
        );

      // ✅ NO-CODE: Seletor de cores visual com feedback
      case PropertyType.COLOR:
        return (
          <PropertyChangeIndicator key={`${key}-${idx}`}>
            <ColorPicker
              value={value || '#432818'}
              onChange={color => updateProperty(key, color)}
              label={label}
              allowTransparent={true}
            />
          </PropertyChangeIndicator>
        );

      // ✅ NO-CODE: Slider visual com feedback
      case PropertyType.RANGE:
        return (
          <PropertyChangeIndicator key={`${key}-${idx}`}>
            <SizeSlider
              value={value || 0}
              onChange={val => updateProperty(key, val)}
              min={min || 0}
              max={max || 100}
              step={step || 1}
              unit={unit || 'px'}
              label={label}
              showValue={true}
            />
          </PropertyChangeIndicator>
        );

      // ✅ NO-CODE: Botões de alinhamento visual
      case PropertyType.ALIGNMENT:
        return (
          <PropertyChangeIndicator key={`${key}-${idx}`}>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#432818]">{label}</Label>
              <AlignmentButtons
                value={value || 'left'}
                onChange={(alignment: string) => updateProperty(key, alignment)}
              />
            </div>
          </PropertyChangeIndicator>
        );

      case PropertyType.NUMBER:
        return (
          <EnhancedPropertyInput
            key={`${key}-${idx}`}
            label={label}
            value={value || ''}
            placeholder={`Digite ${label.toLowerCase()}`}
            onChange={newValue => updateProperty(key, newValue)}
            type="number"
            className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
          />
        );

      case PropertyType.SWITCH:
        return (
          <PropertyChangeIndicator key={`${key}-${idx}`}>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-[#432818]">{label}</Label>
              <Switch
                checked={!!value}
                onCheckedChange={checked => {
                  console.log('🎯 EnhancedPanel SWITCH mudou:', { key, checked, label });
                  updateProperty(key, checked);
                }}
              />
            </div>
          </PropertyChangeIndicator>
        );

      case PropertyType.IMAGE:
        return (
          <PropertyChangeIndicator key={`${key}-${idx}`}>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#432818]">{label}</Label>
              <Input
                value={value || ''}
                onChange={e => updateProperty(key, e.target.value)}
                placeholder="Cole o link da imagem aqui"
                className="border-[#B89B7A]/30 focus:border-[#B89B7A]"
              />
              {value && (
                <div className="mt-2">
                  <img
                    src={value}
                    alt="Preview"
                    className="w-full max-w-32 h-auto rounded border"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </PropertyChangeIndicator>
        );

      case PropertyType.OPTION_SCORE:
        return (
          <PropertyChangeIndicator key={`${key}-${idx}`}>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#432818]">{label}</Label>
              <Input
                type="number"
                value={value || 0}
                onChange={e => updateProperty(key, Number(e.target.value))}
                placeholder="Pontos para esta opção"
                className="border-[#B89B7A]/30 focus:border-[#B89B7A]"
              />
            </div>
          </PropertyChangeIndicator>
        );

      // ✅ NO-CODE: Dropdown com opções visuais
      case PropertyType.SELECT:
        return (
          <PropertyChangeIndicator key={`${key}-${idx}`}>
            <Select
              value={value || options?.find(opt => opt.value !== '')?.value || ''}
              onValueChange={newValue => updateProperty(key, newValue)}
            >
              <SelectTrigger className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20">
                <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option, optionIdx) =>
                  option.value !== '' ? (
                    <SelectItem key={`${option.value}-${optionIdx}`} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ) : null
                )}
              </SelectContent>
            </Select>
          </PropertyChangeIndicator>
        );

      // ✅ NO-CODE: Switch visual (liga/desliga)
      case PropertyType.SWITCH:
        return (
          <div key={key} className="flex items-center justify-between py-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818] cursor-pointer">
              {label} {required && <span style={{ color: '#432818' }}>*</span>}
            </Label>
            <Switch
              id={key}
              checked={!!value} // Garante que o valor é booleano
              onCheckedChange={checked => updateProperty(key, checked)}
              className="data-[state=checked]:bg-[#B89B7A]"
            />
          </div>
        );

      // ✅ NO-CODE: Upload de imagem visual
      case PropertyType.IMAGE:
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span style={{ color: '#432818' }}>*</span>}
            </Label>
            <Input
              id={key}
              type="text"
              value={value || ''}
              onChange={e => updateProperty(key, e.target.value)}
              placeholder="Cole o link da imagem aqui"
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
            />
            {value && (
              <div className="mt-2">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full max-w-32 h-auto rounded border"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );

      // ✅ NO-CODE: Pontuação de opção (para quiz)
      case PropertyType.OPTION_SCORE:
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span style={{ color: '#432818' }}>*</span>}
            </Label>
            <Input
              id={key}
              type="number"
              value={value || 0}
              onChange={e => updateProperty(key, Number(e.target.value))}
              min={min}
              max={max}
              step={step}
              placeholder="Pontos para esta opção"
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
            />
          </div>
        );

      // ✅ NO-CODE: Categoria de opção (para quiz)
      case PropertyType.OPTION_CATEGORY:
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-[#432818]">
              {label} {required && <span style={{ color: '#432818' }}>*</span>}
            </Label>
            <Input
              id={key}
              type="text"
              value={value || ''}
              onChange={e => updateProperty(key, e.target.value)}
              placeholder="Ex: Clássico, Moderno, Casual"
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
            />
          </div>
        );

      // ✅ NO-CODE: Array de opções (para quiz)
      case PropertyType.ARRAY:
        const arrayValue = Array.isArray(value) ? value : [];
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium text-[#432818]">
              {label} {required && <span style={{ color: '#432818' }}>*</span>}
            </Label>
            <div className="border border-[#B89B7A]/30 rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
              {arrayValue.length > 0 ? (
                arrayValue.map((item, index) => (
                  <div key={index} className="text-xs bg-[#F8F6F3] p-2 rounded border">
                    {typeof item === 'object' ? (
                      <div className="space-y-1">
                        {Object.entries(item).map(([k, v]) => (
                          <div key={k} className="flex gap-2">
                            <span className="font-medium text-[#432818]">{k}:</span>
                            <span className="text-[#666]">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span>{String(item)}</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-[#666] italic text-center py-2">
                  Nenhum item no array
                </div>
              )}
            </div>
            <div className="text-xs text-[#666]">
              Total: {arrayValue.length} {arrayValue.length === 1 ? 'item' : 'itens'}
            </div>
          </div>
        );

      default:
        return (
          <div key={key} style={{ color: '#432818' }}>
            ⚠️ Tipo não suportado: {type}
          </div>
        );
    }
  };

  // Normalizar o tipo e ID para exibição
  const displayType = actualBlock.type; // Ou blockDefinition?.name || actualBlock.type; se blockDefinition for relevante
  const displayId = actualBlock.id;

  // Verificar se é um bloco de quiz
  const isQuizBlock =
    actualBlock?.type?.startsWith('quiz-') || actualBlock?.component === 'QuizQuestionBlock';
  const isQuizHeader =
    actualBlock?.type === 'quiz-intro-header' || actualBlock?.component === 'QuizIntroHeaderBlock';
  const isOptionsGrid =
    actualBlock?.type === 'options-grid' || actualBlock?.component === 'OptionsGridBlock';
  const isIntroBlock =
    actualBlock?.type === 'step01-intro' || actualBlock?.component === 'IntroBlock';

  // Se for um bloco de introdução, mostrar o painel específico
  if (isIntroBlock) {
    return (
      <div className="h-full flex flex-col">
        <IntroPropertiesPanel selectedBlock={actualBlock} onUpdate={onUpdate} />
      </div>
    );
  }

  // Se for um cabeçalho do quiz, mostrar o painel específico do cabeçalho
  if (isQuizHeader) {
    return (
      <div className="h-full flex flex-col">
        <QuizHeaderPropertiesPanel selectedBlock={actualBlock} onUpdate={onUpdate} />
      </div>
    );
  }

  // Se for um options-grid, mostrar o painel específico
  if (isOptionsGrid) {
    return (
      <div className="h-full flex flex-col">
        <OptionsGridPropertiesPanel
          properties={actualBlock?.properties || {}}
          onPropertyChange={(property, value) => {
            if (onUpdate && actualBlock?.id) {
              onUpdate(actualBlock.id, { [property]: value });
            }
          }}
          onValidationError={errors => {
            console.warn('⚠️ Erros de validação no OptionsGrid:', errors);
          }}
        />
      </div>
    );
  }

  // Se for um bloco de quiz, mostrar o painel específico do quiz
  if (isQuizBlock) {
    return (
      <div className="h-full flex flex-col">
        <QuizConfigurationPanel selectedBlock={actualBlock} onUpdate={onUpdate} />
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-col border-[#B89B7A]/30 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b border-[#B89B7A]/20 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-[#432818]">Propriedades</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs border-[#B89B7A]/50 text-[#432818]">
                {displayType}
              </Badge>
              <Badge variant="outline" className="text-xs border-[#B89B7A]/50 text-[#432818]">
                {displayId}
              </Badge>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <EyeOff className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent
        ref={scrollRef}
        className="flex-1 p-4 space-y-6 overflow-y-auto [scrollbar-gutter:stable]"
      >
        {/* Seções organizadas por categoria */}
        {categoryOrder.map(categoryKey => {
          // ✅ Usando `getPropertiesByCategory` do hook
          const categorizedProps = getPropertiesByCategory(categoryKey);
          if (!categorizedProps || categorizedProps.length === 0) return null;

          const Icon = categoryIcons[categoryKey as keyof typeof categoryIcons];
          const categoryLabel = categoryLabels[categoryKey as keyof typeof categoryLabels];

          return (
            <div key={categoryKey} className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#B89B7A]/20">
                {Icon && <Icon className="w-4 h-4 text-[#B89B7A]" />}
                <h3 className="font-medium text-[#432818]">{categoryLabel}</h3>
              </div>
              <div className="space-y-3">
                {categorizedProps.map((prop, idx) => renderField(prop, idx))}
              </div>
            </div>
          );
        })}

        {/* Ações */}
        <div className="pt-4 border-t border-[#B89B7A]/20 space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetProperties} // ✅ Usando `resetProperties` do hook
            className="w-full border-[#B89B7A]/30 text-[#432818] hover:bg-[#B89B7A]/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Redefinir Propriedades
          </Button>

          {onDelete && ( // Simplificado, já que `onUpdateBlock` não é mais a principal forma de atualização aqui
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(actualBlock.id)}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Componente
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { EnhancedUniversalPropertiesPanel };
export default EnhancedUniversalPropertiesPanel;
