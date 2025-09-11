import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { pickPropertyEditor } from './core/propertyEditors';
import { useUnifiedProperties, PropertyCategory } from '@/hooks/useUnifiedProperties';
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuestionPropertyEditor } from "./editors/QuestionPropertyEditor";
import { CanvasContainerPropertyEditor } from "./editors/CanvasContainerPropertyEditor";
import { useCanvasContainerStyles } from "@/hooks/useCanvasContainerStyles";
import type { Block } from '@/types/editor';
import {
  Copy,
  Eye,
  Monitor,
  Palette,
  RotateCcw,
  Settings,
  Smartphone,
  Tablet,
  Trash2,
  Type,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import React, { useState } from 'react';

interface EnhancedPropertiesPanelProps {
  selectedBlock?: Block | null;
  onUpdate?: (updates: Record<string, any>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onReset?: () => void;
  onClose?: () => void;
  previewMode?: 'desktop' | 'tablet' | 'mobile';
  onPreviewModeChange?: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

// Metadados de categorias do schema unificado → UI
const CATEGORY_META: Record<string, { icon: any; label: string; description?: string }> = {
  [PropertyCategory.CONTENT]: { icon: Type, label: 'Conteúdo', description: 'Texto e mídia' },
  [PropertyCategory.STYLE]: { icon: Palette, label: 'Estilo', description: 'Cores e tipografia' },
  [PropertyCategory.LAYOUT]: { icon: Settings, label: 'Layout', description: 'Tamanho e espaçamento' },
  [PropertyCategory.BEHAVIOR]: { icon: Settings, label: 'Comportamento', description: 'Interações e regras' },
  [PropertyCategory.ADVANCED]: { icon: Settings, label: 'Avançado', description: 'Configurações avançadas' },
  [PropertyCategory.ANIMATION]: { icon: Settings, label: 'Animação', description: 'Transições e efeitos' },
  [PropertyCategory.ACCESSIBILITY]: { icon: Settings, label: 'Acessibilidade' },
  [PropertyCategory.SEO]: { icon: Settings, label: 'SEO' },
};

const EnhancedPropertiesPanel: React.FC<EnhancedPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onDelete,
  onDuplicate,
  onReset,
  onClose,
  previewMode = 'desktop',
  onPreviewModeChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!selectedBlock) {
    return (
      <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800">
        <CardHeader className="text-center py-16">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Eye className="w-10 h-10 text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white mb-2">Nenhum Bloco Selecionado</CardTitle>
          <CardDescription className="text-base text-gray-300">Selecione um bloco no editor para começar a personalizar</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // 🎯 ROTEAMENTO CONDICIONAL: Usar QuestionPropertyEditor para blocos de questão
  const isQuestionBlock = selectedBlock.type === 'quiz-question-inline' ||
    selectedBlock.type === 'options-grid' ||
    selectedBlock.type === 'form-input' ||
    selectedBlock.type === 'quiz-header' ||
    selectedBlock.type === 'quiz-navigation';

  if (isQuestionBlock) {
    // Adaptar Block para o formato esperado pelo QuestionPropertyEditor
    const questionBlock = {
      id: selectedBlock.id,
      type: selectedBlock.type,
      properties: {
        question: selectedBlock.properties?.question || selectedBlock.properties?.text || '',
        title: selectedBlock.properties?.title || '',
        text: selectedBlock.properties?.text || selectedBlock.properties?.question || '',
        description: selectedBlock.properties?.description || '',
        options: selectedBlock.properties?.options || [],
        multipleSelection: selectedBlock.properties?.multipleSelection || false,
        requiredSelections: selectedBlock.properties?.requiredSelections || 1,
        maxSelections: selectedBlock.properties?.maxSelections || 1,
        showImages: selectedBlock.properties?.showImages || false,
        columns: selectedBlock.properties?.columns || 2,
        backgroundColor: selectedBlock.properties?.backgroundColor || '',
        textAlign: selectedBlock.properties?.textAlign || 'left',
        fontSize: selectedBlock.properties?.fontSize || '',
        color: selectedBlock.properties?.color || '',
        scoreValues: selectedBlock.properties?.scoreValues || {},
        ...selectedBlock.properties
      },
      content: selectedBlock.content
    };

    return (
      <QuestionPropertyEditor
        block={questionBlock}
        onUpdate={(updates) => {
          if (onUpdate) {
            // Converter de volta para formato Block
            onUpdate(updates);
          }
        }}
        onDelete={onDelete}
        isPreviewMode={false}
      />
    );
  }

  // Conectar ao schema unificado
  const { properties, updateProperty, getPropertiesByCategory, validateProperties, applyBrandColors } = useUnifiedProperties(
    selectedBlock.type,
    selectedBlock.id,
    selectedBlock as any,
    onUpdate ? (_blockId: string, updates: any) => onUpdate(updates) : undefined
  );

  const categories = [
    PropertyCategory.CONTENT,
    PropertyCategory.LAYOUT,
    PropertyCategory.STYLE,
    PropertyCategory.BEHAVIOR,
    PropertyCategory.ANIMATION,
    PropertyCategory.ADVANCED,
    PropertyCategory.ACCESSIBILITY,
    PropertyCategory.SEO,
  ];

  const filteredProps = searchTerm
    ? properties.filter(
      p =>
        p.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.key.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : null;

  return (
    <TooltipProvider>
      <Card className="properties-panel h-full border-0 shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col transition-all duration-300">
        {/* Header modernizado */}
        <CardHeader className="pb-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Personalizar Bloco</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-300 text-xs">
                    {selectedBlock.type}
                  </Badge>
                  {validateProperties() ? (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400 text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Válido
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Verificar
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full text-gray-400 hover:text-white">
                ✕
              </Button>
            )}
          </div>

          {/* Barra de ferramentas moderna */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onPreviewModeChange?.('desktop')}
                    className="h-8 px-2 rounded-md"
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Desktop</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onPreviewModeChange?.('tablet')}
                    className="h-8 px-2 rounded-md"
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Tablet</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onPreviewModeChange?.('mobile')}
                    className="h-8 px-2 rounded-md"
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mobile</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => applyBrandColors?.()} className="h-8 px-2 rounded-md">
                    <Palette className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Aplicar cores da marca</TooltipContent>
              </Tooltip>

              {onDuplicate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={onDuplicate} className="h-8 px-2 rounded-md">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicar bloco</TooltipContent>
                </Tooltip>
              )}

              {onReset && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={onReset} className="h-8 px-2 rounded-md">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Resetar propriedades</TooltipContent>
                </Tooltip>
              )}

              {onDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onDelete}
                      className="h-8 px-2 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Excluir bloco</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Barra de pesquisa aprimorada */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar propriedade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-600 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs text-gray-400 hover:text-white"
              >
                Limpar
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Conteúdo com scroll otimizado e fontes claras */}
        <CardContent className="flex-1 px-0 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
            {filteredProps ? (
              <div className="px-4 space-y-4 pb-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-200">
                    {filteredProps.length} {filteredProps.length === 1 ? 'propriedade encontrada' : 'propriedades encontradas'}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="text-xs text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    Limpar busca
                  </Button>
                </div>
                {filteredProps.length > 0 ? (
                  <div className="space-y-4">
                    {filteredProps.map(prop => {
                      const Editor = pickPropertyEditor(prop as any);
                      return (
                        <div key={prop.key} className="bg-gray-800/80 rounded-lg p-3 shadow-sm border border-gray-700 hover:border-gray-600 transition-colors backdrop-blur-sm">
                          <Editor property={prop as any} onChange={updateProperty} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-300 text-sm">Nenhuma propriedade encontrada</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchTerm('')}
                      className="mt-2 text-xs text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      Limpar busca
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 pb-6">
                {categories.map(cat => {
                  const meta = CATEGORY_META[cat] || { icon: Settings, label: String(cat) };
                  const Icon = meta.icon;
                  const propsInCat = getPropertiesByCategory(cat);

                  if (propsInCat.length === 0) return null;

                  return (
                    <div
                      key={String(cat)}
                      className="border-b border-gray-700/50 last:border-b-0"
                    >
                      <div className="px-4 py-3 bg-gradient-to-r from-gray-800/60 to-gray-800/30 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500/15 to-blue-600/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                            <Icon className="w-4 h-4 text-blue-300" />
                          </div>
                          <div className="text-left flex-1">
                            <h3 className="font-semibold text-gray-100 text-sm">{meta.label}</h3>
                            {meta.description && (
                              <p className="text-xs text-gray-300 mt-0.5">{meta.description}</p>
                            )}
                          </div>
                          <Badge variant="secondary" className="bg-blue-500/15 text-blue-200 border-blue-500/25 text-xs">
                            {propsInCat.length}
                          </Badge>
                        </div>
                      </div>
                      <div className="px-4 pb-4 pt-4">
                        <div className="space-y-4">
                          {propsInCat.map(prop => {
                            const Editor = pickPropertyEditor(prop as any);
                            return (
                              <div key={prop.key} className="bg-gray-800/80 rounded-lg p-3 shadow-sm border border-gray-700/80 hover:border-gray-600 transition-all duration-200 backdrop-blur-sm hover:bg-gray-800/90">
                                <Editor property={prop as any} onChange={updateProperty} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default EnhancedPropertiesPanel;

// PropertiesPanel simples para integração rápida
export const PropertiesPanel: React.FC<{ selectedBlock?: any; onUpdate?: (updates: any) => void }> = ({
  selectedBlock,
  onUpdate
}) => {
  // Hook para gerenciar estilos do canvas/container
  const { styles, updateStyles, resetStyles } = useCanvasContainerStyles();

  // Usa o hook unified properties apenas se tivermos um bloco selecionado
  const unifiedProps = selectedBlock
    ? useUnifiedProperties(selectedBlock.type, selectedBlock.id, selectedBlock, onUpdate)
    : null;

  // Determina se é um bloco de questão (quiz)
  const isQuestionBlock = selectedBlock &&
    ['single_choice_question', 'multiple_choice_question', 'open_question', 'scale_question']
      .includes(selectedBlock.type);

  // Handler para atualização das propriedades do container/canvas usando dados reais
  const handleContainerUpdate = (updates: { [key: string]: any }) => {
    updateStyles(updates); // Salva no localStorage e aplica estilos
  };

  // Se não há bloco selecionado, mostra editor de canvas/container
  if (!selectedBlock) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-700 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-slate-200">Canvas & Container</h2>
          <p className="text-xs text-slate-400 mt-1">Editar cores e estilos do canvas</p>
        </div>

        <ScrollArea className="flex-1 p-4 overflow-auto">
          <CanvasContainerPropertyEditor
            properties={styles as any}
            onUpdate={handleContainerUpdate}
            onReset={resetStyles}
          />
        </ScrollArea>
      </div>
    );
  }

  // Para blocos de questão, usa o QuestionPropertyEditor
  if (isQuestionBlock && unifiedProps?.properties && unifiedProps.properties.length > 0) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-700 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-slate-200">{selectedBlock.type.replace('_', ' ').toUpperCase()}</h2>
          <p className="text-xs text-slate-400 mt-1">Propriedades da questão</p>
        </div>

        <ScrollArea className="flex-1 p-4 overflow-auto">
          <QuestionPropertyEditor
            block={selectedBlock as any}
            onChange={(key: string, value: any) => unifiedProps?.updateProperty(key, value)}
          />
        </ScrollArea>
      </div>
    );
  }  // Fallback para outros blocos usando editor padrão
  return (
    <div className="w-80 bg-slate-900 border-l border-slate-700 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-200">
          {selectedBlock?.type || 'Propriedades'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">Configure o elemento</p>
      </div>

      <ScrollArea className="flex-1 p-4 overflow-auto">
        <EnhancedPropertiesPanel
          selectedBlock={selectedBlock as any}
          onUpdate={onUpdate}
          previewMode="desktop"
        />
      </ScrollArea>
    </div>
  );
};
