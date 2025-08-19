/**
 * 🚀 PropertiesPanel - Painel de Propriedades Consolidado v3.0
 *
 * CONSOLIDAÇÃO ESTRATÉGICA:
 * - Mantém arquitetura modular (editores especializados)
 * - Adiciona interface moderna com abas
 * - Performance otimizada quando disponível
 * - Compatibilidade total com sistema existente
 */

import React, { useState, useEffect } from 'react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Icons
import { Eye, EyeOff, Paintbrush, Settings, Trash2, Type, X } from 'lucide-react';

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
  /** Callback para alternar preview - agora aceita estado do preview */
  onTogglePreview?: (previewState?: boolean) => void;
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
  // Estado para preview interno do PropertiesPanel
  const [internalPreview, setInternalPreview] = useState<boolean>(false);

  // 🎯 SINCRONIZAR PREVIEW INTERNO COM MODO EXTERNO
  useEffect(() => {
    // Se o preview externo estiver ativo e o interno não, sincronizar
    if (isPreviewMode && !internalPreview) {
      setInternalPreview(true);
      console.log('✅ Preview interno sincronizado com preview externo (ativado)');
    }
    // Se o preview externo estiver inativo e o interno ativo, sincronizar
    else if (!isPreviewMode && internalPreview) {
      setInternalPreview(false);
      console.log('✅ Preview interno sincronizado com preview externo (desativado)');
    }
  }, [isPreviewMode, internalPreview]);

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

  // Função para alternar preview interno e comunicar ao pai
  const handleToggleInternalPreview = () => {
    const newPreviewState = !internalPreview;
    setInternalPreview(newPreviewState);

    // Comunicar mudança ao componente pai se disponível
    if (onTogglePreview) {
      onTogglePreview(newPreviewState);
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

    // Usar preview interno se ativado, senão usar o preview global
    const effectivePreview = internalPreview || isPreviewMode;

    // Editores já implementados - mapeamento direto
    switch (blockType) {
      case 'header':
      case 'quiz-intro-header':
      case 'quiz-header':
        return (
          <HeaderPropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdate}
            isPreviewMode={effectivePreview}
          />
        );

      case 'form-container':
      case 'form-input':
      case 'lead-form':
        return (
          <FormContainerPropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdate}
            isPreviewMode={effectivePreview}
          />
        );

      case 'image':
      case 'image-display-inline':
        return (
          <ImagePropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdate}
            isPreviewMode={effectivePreview}
          />
        );

      case 'button':
        return (
          <ButtonPropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdate}
            isPreviewMode={effectivePreview}
          />
        );

      case 'pricing':
        return (
          <PricingPropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdate}
            isPreviewMode={effectivePreview}
          />
        );

      case 'testimonial':
      case 'testimonials':
        return (
          <TestimonialPropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdate}
            isPreviewMode={effectivePreview}
          />
        );

      default:
        // Mapeamento flexível para tipos similares usando includes
        if (blockType.includes('cta') || blockType.includes('button')) {
          return (
            <ButtonPropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdate}
              isPreviewMode={effectivePreview}
            />
          );
        }

        if (blockType.includes('navigation') || blockType.includes('step')) {
          return (
            <NavigationPropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdate}
              isPreviewMode={effectivePreview}
            />
          );
        }

        if (blockType.includes('pricing') || blockType.includes('table')) {
          return (
            <PricingPropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdate}
              isPreviewMode={effectivePreview}
            />
          );
        }

        // Mapeamento flexível para tipos relacionados a questões
        if (blockType.includes('question') || blockType === 'quiz-question-inline') {
          return (
            <QuestionPropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdate}
              isPreviewMode={effectivePreview}
            />
          );
        }

        // Mapeamento específico para options-grid
        if (blockType.includes('options-grid')) {
          console.log('✅ Using OptionsGridPropertyEditor for:', blockType);
          return (
            <OptionsGridPropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdate}
              isPreviewMode={effectivePreview}
            />
          );
        }

        // Mapeamento flexível para tipos relacionados a opções (outros)
        if (
          blockType.includes('options') ||
          blockType.includes('result') ||
          blockType.includes('cta')
        ) {
          return (
            <OptionsPropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdate}
              isPreviewMode={effectivePreview}
            />
          );
        }

        // Mapeamento flexível para tipos relacionados a texto
        if (
          blockType === 'text' ||
          blockType === 'headline' ||
          blockType.includes('text') ||
          blockType.includes('heading') ||
          blockType.includes('title')
        ) {
          return (
            <TextPropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdate}
              isPreviewMode={effectivePreview}
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
      <div
        className={`flex items-center justify-between p-4 border-b ${internalPreview ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' : 'bg-gradient-to-r from-background to-background/50'}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${internalPreview ? 'bg-green-600' : 'bg-primary/10'}`}>
            {internalPreview ? (
              <Eye className="h-4 w-4 text-white" />
            ) : (
              <Settings className="h-4 w-4 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm">
              {internalPreview ? 'Preview Ativo' : 'Propriedades'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {selectedBlock.type} • {selectedBlock.id.slice(0, 8)}
              {internalPreview && ' • Preview no Canvas'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Botão de Preview Interno */}
          <Button
            variant={internalPreview ? 'default' : 'ghost'}
            size="sm"
            onClick={handleToggleInternalPreview}
            className={`h-8 px-2 ${internalPreview ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
            title={internalPreview ? 'Desativar Preview' : 'Ativar Preview'}
          >
            {internalPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
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
