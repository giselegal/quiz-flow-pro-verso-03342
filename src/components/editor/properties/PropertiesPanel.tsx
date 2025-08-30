import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { pickPropertyEditor } from './core/propertyEditors';
import { useUnifiedProperties, PropertyCategory } from '@/hooks/useUnifiedProperties';
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
  const [expandedItems, setExpandedItems] = useState<string[]>(['content']);

  if (!selectedBlock) {
    return (
      <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="text-center py-16">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#B89B7A]/20 to-[#B89B7A]/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Eye className="w-10 h-10 text-[#B89B7A]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#432818] mb-2">Nenhum Bloco Selecionado</CardTitle>
          <CardDescription className="text-base text-gray-600">Selecione um bloco no editor para começar a personalizar</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  // Conectar ao schema unificado
  const { properties, updateProperty, getPropertiesByCategory, validateProperties, applyBrandColors } = useUnifiedProperties(
    selectedBlock.type,
    selectedBlock.id,
    selectedBlock as any,
    (_blockId, updates) => onUpdate?.(updates as any)
  );

  // Categorias disponíveis dinamicamente no schema
  const categoryOrder: string[] = [
    PropertyCategory.CONTENT,
    PropertyCategory.STYLE,
    PropertyCategory.LAYOUT,
    PropertyCategory.BEHAVIOR,
    PropertyCategory.ADVANCED,
    PropertyCategory.ACCESSIBILITY,
    PropertyCategory.ANIMATION,
    PropertyCategory.SEO,
  ];
  const presentCategories = Array.from(new Set(properties.map(p => p.category)));
  const categories = categoryOrder.filter(c => presentCategories.includes(c)).concat(
    presentCategories.filter(c => !categoryOrder.includes(c as any))
  );

  // Filtro de busca
  const filteredProps = searchTerm
    ? properties.filter(
      p =>
        p.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.key.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : null;

  return (
    <TooltipProvider>
      <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 flex flex-col transition-all duration-300">
        {/* Header modernizado */}
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#B89B7A]/20 to-[#B89B7A]/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#B89B7A]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#432818]">Personalizar Bloco</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-[#B89B7A]/10 text-[#432818] text-xs">
                    {selectedBlock.type}
                  </Badge>
                  {validateProperties() ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Válido
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Verificar
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
                ✕
              </Button>
            )}
          </div>

          {/* Barra de ferramentas moderna */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
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

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => applyBrandColors?.()}
                    className="h-8 px-2 rounded-md"
                  >
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
                  <TooltipContent>Resetar para padrão</TooltipContent>
                </Tooltip>
              )}

              {onDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 px-2 rounded-md text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Excluir bloco</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Busca moderna */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar propriedades..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20 rounded-lg"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
              >
                Limpar
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto px-0">
          {filteredProps ? (
            <div className="px-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  {filteredProps.length} {filteredProps.length === 1 ? 'propriedade encontrada' : 'propriedades encontradas'}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="text-xs"
                >
                  Limpar busca
                </Button>
              </div>
              {filteredProps.length > 0 ? (
                <div className="space-y-4">
                  {filteredProps.map(prop => {
                    const Editor = pickPropertyEditor(prop as any);
                    return (
                      <div key={prop.key} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                        <Editor property={prop as any} onChange={updateProperty} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Nenhuma propriedade encontrada</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="mt-2 text-xs"
                  >
                    Limpar busca
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Accordion
              type="multiple"
              value={expandedItems}
              onValueChange={setExpandedItems}
              className="w-full"
            >
              {categories.map(cat => {
                const meta = CATEGORY_META[cat] || { icon: Settings, label: String(cat) };
                const Icon = meta.icon;
                const propsInCat = getPropertiesByCategory(cat);

                if (propsInCat.length === 0) return null;

                return (
                  <AccordionItem
                    key={String(cat)}
                    value={String(cat)}
                    className="border-b border-gray-100"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#B89B7A]/10 to-[#B89B7A]/5 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#B89B7A]" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-[#432818]">{meta.label}</h3>
                          {meta.description && (
                            <p className="text-xs text-gray-500">{meta.description}</p>
                          )}
                        </div>
                        <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">
                          {propsInCat.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <Separator className="mb-4 bg-gray-200" />
                      <div className="space-y-4">
                        {propsInCat.map(prop => {
                          const Editor = pickPropertyEditor(prop as any);
                          return (
                            <div key={prop.key} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                              <Editor property={prop as any} onChange={updateProperty} />
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default EnhancedPropertiesPanel;
