import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { Eye, Settings, X } from 'lucide-react';
import React, { useMemo } from 'react';
import { ButtonPropertyEditor } from './editors/ButtonPropertyEditor';
import { HeaderPropertyEditor } from './editors/HeaderPropertyEditor';
import { NavigationPropertyEditor } from './editors/NavigationPropertyEditor';
import { OptionsPropertyEditor } from './editors/OptionsPropertyEditor';
import { OptionsGridPropertyEditor } from './editors/OptionsGridPropertyEditor';
import { PricingPropertyEditor } from './editors/PricingPropertyEditor';
import { QuestionPropertyEditor } from './editors/QuestionPropertyEditor';
import { TestimonialPropertyEditor } from './editors/TestimonialPropertyEditor';
import { TextPropertyEditor } from './editors/TextPropertyEditor';
import { getBlockEditorConfig } from './PropertyEditorRegistry';
import { default as ImagePropertyEditor } from './editors/ImagePropertyEditor';

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
        return (
          <HeaderPropertyEditor
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
        if (blockType === 'options-grid') {
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

        // Mapeamento específico para testimonials com tipagem
        const isTestimonialType =
          blockType === 'testimonial' ||
          blockType === 'testimonials' ||
          blockType === 'testimonial-card-inline' ||
          blockType === 'testimonialsSection';

        if (isTestimonialType) {
          return (
            <TestimonialPropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdate}
              isPreviewMode={isPreviewMode}
            />
          );
        }

        // Mapeamento específico para pricing com tipagem
        const isPricingType = blockType === 'pricing' || blockType === 'pricing-card-inline';

        if (isPricingType) {
          return (
            <PricingPropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdate}
              isPreviewMode={isPreviewMode}
            />
          );
        }

        // Mapeamento flexível para tipos relacionados a botões
        const isButtonType =
          blockType === 'button' ||
          blockType.includes('button') ||
          blockType === 'cta' ||
          blockType.includes('cta');

        if (isButtonType) {
          return (
            <ButtonPropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdate}
              isPreviewMode={isPreviewMode}
            />
          );
        }

        // Mapeamento flexível para tipos relacionados a navegação
        const isNavigationType = blockType.includes('nav') || blockType.includes('menu');

        if (isNavigationType) {
          return (
            <NavigationPropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdate}
              isPreviewMode={isPreviewMode}
            />
          );
        }

        // Tipos conhecidos mas não implementados ainda
        const knownTypes = [
          'video',
          'spacer',
          'carousel',
          'testimonials',
          'pricing',
          'faq',
          'benefits',
          'guarantee',
          'products',
          'icon',
          'custom-code',
          'form-container',
          'form-input',
          'input-field',
        ];

        const isKnownType =
          knownTypes.includes(blockType) || knownTypes.some(type => blockType.includes(type));

        // Fallback final
        console.log('❌ No specific editor found for:', blockType, '- using fallback');
        if (isKnownType) {
          return (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#B89B7A]" />
                  Propriedades: {blockType}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Editor para <strong>{blockType}</strong> ainda não implementado.
                    <br />
                    <span className="text-xs text-yellow-600 mt-1 block">
                      Este tipo será implementado na próxima fase do desenvolvimento.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        } else {
          return (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#B89B7A]" />
                  Propriedades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    📋 Tipo de bloco <strong>"{blockType}"</strong> detectado.
                    <br />
                    <span className="text-xs text-blue-600 mt-1 block">
                      Editor genérico será implementado em breve. Por enquanto, use o painel
                      clássico.
                    </span>
                  </p>

                  {/* Debug info */}
                  <div className="mt-3 p-2 bg-blue-100 rounded text-xs">
                    <strong>Debug:</strong> Block ID: {selectedBlock.id}
                    <br />
                    <strong>Content keys:</strong>{' '}
                    {Object.keys(selectedBlock.content || {}).join(', ') || 'none'}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header do painel */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-[#B89B7A]" />
          <h2 className="font-semibold text-[#6B4F43]">Propriedades</h2>
          {blockConfig && (
            <span className="text-xs bg-[#E5DDD5] text-[#6B4F43] px-2 py-1 rounded">
              {selectedBlock.type}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onTogglePreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePreview}
              className={cn('h-8 w-8 p-0', isPreviewMode && 'bg-[#E5DDD5]')}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}

          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Conteúdo do editor */}
      <div className="flex-1 overflow-auto">{renderEditor()}</div>

      {/* Footer com ações */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#8B7355]">ID: {selectedBlock.id}</div>

          {onDelete && (
            <Button variant="destructive" size="sm" onClick={handleDelete} className="text-xs">
              Excluir Bloco
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
