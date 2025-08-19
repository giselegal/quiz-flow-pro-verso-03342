/**
 * 🚀 PropertiesPanel - Painel de Propriedades Consolidado v3.0
 *
 * CONSOLIDAÇÃO ESTRATÉGICA:
 * - Mantém arquitetura modular (editores especializados)
 * - Adiciona interface moderna com abas
 * - Performance otimizada quando disponível
 * - Compatibilidade total com sistema existente
 */

import React, { useMemo, useState } from 'react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Icons
import { Paintbrush, Settings, Trash2, Type, X } from 'lucide-react';

// Editores Especializados (sistema original mantido)
import { ButtonPropertyEditor } from './editors/ButtonPropertyEditor';
import { FormContainerPropertyEditor } from './editors/FormContainerPropertyEditor';
import { HeaderPropertyEditor } from './editors/HeaderPropertyEditor';
import { default as ImagePropertyEditor } from './editors/ImagePropertyEditor';
import { NavigationPropertyEditor } from './editors/NavigationPropertyEditor';
import { OptionsGridPropertyEditor } from './editors/OptionsGridPropertyEditor';
import { OptionsPropertyEditor } from './editors/OptionsPropertyEditor';
import { PricingPropertyEditor } from './editors/PricingPropertyEditor';
import { QuestionPropertyEditor } from './editors/QuestionPropertyEditor';
import { TestimonialPropertyEditor } from './editors/TestimonialPropertyEditor';
import { TextPropertyEditor } from './editors/TextPropertyEditor';
import { getBlockEditorConfig } from './PropertyEditorRegistry';

// Types
import { Block } from '@/types/editor';

interface PropertiesPanelProps {
  /** Bloco atualmente selecionado */
  selectedBlock?: Block | null;
  /** Callback para atualizar propriedades do bloco */
  onUpdate?: (blockId: string, updates: Record<string, any>) => void;
  /** Callback para fechar o painel */
  onClose?: () => void;
  /** Callback para deletar o bloco */
  onDelete?: (blockId: string) => void;
  /** Se está em modo preview */
  isPreviewMode?: boolean;
  /** Callback para alternar preview */
  onTogglePreview?: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onClose,
  onDelete,
  isPreviewMode = false,
  onTogglePreview,
}) => {
  // Estado para abas (nova funcionalidade)
  const [activeTab, setActiveTab] = useState<string>('properties');

  const blockConfig = useMemo(() => {
    return selectedBlock ? getBlockEditorConfig(selectedBlock.type) : null;
  }, [selectedBlock?.type]);

  const handleUpdate = (updates: Record<string, any>) => {
    if (selectedBlock && onUpdate) {
      onUpdate(selectedBlock.id, updates);
    }
  };

  const handleDelete = () => {
    if (selectedBlock && onDelete) {
      onDelete(selectedBlock.id);
    }
  };

  // Estado vazio - nenhum bloco selecionado
  if (!selectedBlock) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <Settings className="h-12 w-12 text-[#B89B7A] mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-[#6B4F43]">Propriedades</h3>
              <p className="text-sm text-[#8B7355] mt-1">
                Selecione um bloco no editor para configurar suas propriedades
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Renderizar editor específico baseado no tipo
  const renderEditor = () => {
    const blockType = selectedBlock.type;
    console.log('🔧 PropertiesPanel - Block type:', blockType);

    // Editores já implementados - mapeamento direto
    switch (blockType) {
      case 'header':
      case 'quiz-intro-header':
      case 'quiz-header':
        return (
          <HeaderPropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdate}
            isPreviewMode={isPreviewMode}
          />
        );

      case 'form-container':
      case 'form-input':
      case 'lead-form':
        return (
          <FormContainerPropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdate}
            isPreviewMode={isPreviewMode}
          />
        );

      case 'image':
      case 'image-display-inline':
        return (
          <ImagePropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdate}
            isPreviewMode={isPreviewMode}
          />
        );

      case 'button':
      case 'cta-button':
        return (
          <ButtonPropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdate}
            isPreviewMode={isPreviewMode}
          />
        );

      case 'navigation':
      case 'step-navigation':
        return (
          <NavigationPropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdate}
            isPreviewMode={isPreviewMode}
          />
        );

      case 'pricing':
      case 'pricing-table':
        return (
          <PricingPropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdate}
            isPreviewMode={isPreviewMode}
          />
        );

      case 'testimonial':
      case 'testimonials':
        return (
          <TestimonialPropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdate}
            isPreviewMode={isPreviewMode}
          />
        );

      default:
        // Mapeamento flexível para tipos relacionados a questões
        const isQuestionType =
          blockType.includes('question') || blockType === 'quiz-question-inline';

        if (isQuestionType) {
          return (
            <QuestionPropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdate}
              isPreviewMode={isPreviewMode}
            />
          );
        }

        // Mapeamento específico para options-grid
        if (blockType === 'options-grid' || blockType === 'options-grid-inline') {
          console.log('✅ Using OptionsGridPropertyEditor for:', blockType);
          return (
            <OptionsGridPropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdate}
              isPreviewMode={isPreviewMode}
            />
          );
        }

        // Mapeamento flexível para tipos relacionados a opções (outros)
        const isOptionsType =
          blockType.includes('options') ||
          blockType.includes('result') ||
          blockType.includes('cta');

        if (isOptionsType) {
          return (
            <OptionsPropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdate}
              isPreviewMode={isPreviewMode}
            />
          );
        }

        // Mapeamento flexível para tipos relacionados a texto
        const isTextType =
          blockType === 'text' ||
          blockType === 'headline' ||
          blockType.includes('text') ||
          blockType.includes('heading') ||
          blockType.includes('title');

        if (isTextType) {
          return (
            <TextPropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdate}
              isPreviewMode={isPreviewMode}
            />
          );
        }

        // Fallback para tipos não mapeados
        return (
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Editor de propriedades não disponível para o tipo: <code>{blockType}</code>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Use a aba "Avançado" para editar propriedades manualmente
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* ✨ HEADER MELHORADO COM INTERFACE MODERNA */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-background to-background/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Propriedades</h3>
            <p className="text-xs text-muted-foreground">
              {selectedBlock.type} • {selectedBlock.id.slice(0, 8)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* ✨ SISTEMA DE ABAS MODERNO */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="px-4 pt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="properties" className="gap-2">
                <Type className="h-4 w-4" />
                Propriedades
              </TabsTrigger>
              <TabsTrigger value="advanced" className="gap-2">
                <Paintbrush className="h-4 w-4" />
                Avançado
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-4">
            <TabsContent value="properties" className="mt-0">
              {/* 🎯 EDITOR ESPECIALIZADO (SISTEMA ORIGINAL) */}
              {renderEditor()}
            </TabsContent>

            <TabsContent value="advanced" className="mt-0 space-y-4">
              {/* 🔧 PROPRIEDADES AVANÇADAS */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Configurações Avançadas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Tipo do Bloco
                    </label>
                    <div className="p-2 bg-muted rounded font-mono text-xs">
                      {selectedBlock.type}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">ID do Bloco</label>
                    <div className="p-2 bg-muted rounded font-mono text-xs">{selectedBlock.id}</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Debug - Properties JSON
                    </label>
                    <div className="p-2 bg-muted rounded text-xs max-h-40 overflow-auto">
                      <pre className="whitespace-pre-wrap font-mono">
                        {JSON.stringify(selectedBlock.properties || {}, null, 2)}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertiesPanel;
