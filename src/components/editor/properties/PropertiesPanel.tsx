import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { withPropertyEditor, pickPropertyEditor } from './core/propertyEditors';
import { useUnifiedProperties, PropertyCategory } from '@/hooks/useUnifiedProperties';
import type { Block } from '@/types/editor';
import {
  Copy,
  Eye,
  Info,
  Monitor,
  Palette,
  RotateCcw,
  Settings,
  Smartphone,
  Tablet,
  Trash2,
  Type,
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
  const [activeTab, setActiveTab] = useState<string>('content');
  const [searchTerm, setSearchTerm] = useState('');

  if (!selectedBlock) {
    return (
      <Card className="h-full border-[#B89B7A]/30">
        <CardHeader className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-[#B89B7A]/10 rounded-full flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-[#B89B7A]" />
          </div>
          <CardTitle className="text-[#432818]">Nenhum Bloco Selecionado</CardTitle>
          <CardDescription>Selecione um bloco no editor para ver suas propriedades</CardDescription>
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
      <Card className="h-full border-[#B89B7A]/30 flex flex-col">
        {/* Header com informações do bloco */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-[#B89B7A]/10 text-[#432818]">
                {selectedBlock.type}
              </Badge>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-[#B89B7A]" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>ID: {selectedBlock.id}</p>
                </TooltipContent>
              </Tooltip>
              {/* Estado de validação */}
              <Badge
                variant={validateProperties() ? 'secondary' : 'destructive'}
                className={validateProperties() ? 'bg-green-100 text-green-700' : ''}
              >
                {validateProperties() ? 'Válido' : 'Verifique valores'}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="secondary" size="sm" onClick={() => applyBrandColors?.()}>
                Cores da marca
              </Button>
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ✕
                </Button>
              )}
            </div>
          </div>

          <CardTitle className="text-lg text-[#432818]">Propriedades do Bloco</CardTitle>

          {/* Controles de preview e ações */}
          <div className="flex items-center gap-2 pt-2">
            <div style={{ backgroundColor: '#E5DDD5' }}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onPreviewModeChange?.('desktop')}
                      className="px-2"
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Desktop</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onPreviewModeChange?.('tablet')}
                      className="px-2"
                    >
                      <Tablet className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tablet</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onPreviewModeChange?.('mobile')}
                      className="px-2"
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mobile</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex gap-1 ml-auto">
              {onDuplicate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={onDuplicate}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicar</TooltipContent>
                </Tooltip>
              )}

              {onReset && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={onReset}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Resetar</TooltipContent>
                </Tooltip>
              )}

              {onDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onDelete}
                      style={{ color: '#432818' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Excluir</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Busca de propriedades */}
          <div className="pt-2">
            <Input
              placeholder="Buscar propriedades..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
            />
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto">
          {filteredProps ? (
            <div className="space-y-4">
              <p style={{ color: '#6B4F43' }}>{filteredProps.length} propriedades encontradas</p>
              {filteredProps.map(prop => {
                const Editor = pickPropertyEditor(prop as any);
                return <Editor key={prop.key} property={prop as any} onChange={updateProperty} />;
              })}
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                {categories.map(cat => {
                  const meta = CATEGORY_META[cat] || { icon: Settings, label: String(cat) };
                  const Icon = meta.icon;
                  const count = getPropertiesByCategory(cat).length;
                  return (
                    <TabsTrigger key={String(cat)} value={String(cat)} className="relative" disabled={count === 0}>
                      <Icon className="w-4 h-4" />
                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#B89B7A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {count}
                        </span>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {categories.map(cat => {
                const meta = CATEGORY_META[cat] || { icon: Settings, label: String(cat) };
                const Icon = meta.icon;
                const propsInCat = getPropertiesByCategory(cat);
                return (
                  <TabsContent key={String(cat)} value={String(cat)} className="space-y-4">
                    <div className="mb-4">
                      <h3 className="font-medium text-[#432818] flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {meta.label}
                      </h3>
                      {meta.description ? (
                        <p style={{ color: '#6B4F43' }}>{meta.description}</p>
                      ) : null}
                    </div>
                    <Separator className="bg-[#B89B7A]/20" />
                    {propsInCat.length ? (
                      <div className="space-y-4">
                        {propsInCat.map(prop => {
                          const Editor = pickPropertyEditor(prop as any);
                          return <Editor key={prop.key} property={prop as any} onChange={updateProperty} />;
                        })}
                      </div>
                    ) : (
                      <div style={{ color: '#8B7355' }}>
                        <Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Nenhuma propriedade nesta categoria</p>
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default EnhancedPropertiesPanel;
