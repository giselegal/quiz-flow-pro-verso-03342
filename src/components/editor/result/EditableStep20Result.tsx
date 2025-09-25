/**
 * 🎯 FASE 3 - EDITABLE STEP 20 RESULT
 * 
 * Versão editável do Step20Result para o editor
 * Permite customização completa da página de resultado
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Trophy, 
  Star, 
  Check, 
  Palette, 
  Eye, 
  Edit3,
  RefreshCw,
  ArrowRight,
  Share2
} from 'lucide-react';
import { useQuizResultEditor } from '@/hooks/useQuizResultEditor';
import { EditableText } from './EditableText';
import { EditableColor } from './EditableColor';
import { StyleSelector } from './StyleSelector';

interface EditableStep20ResultProps {
  className?: string;
  isPreview?: boolean;
  enableEditing?: boolean;
}

/**
 * Componente Step 20 editável
 */
export const EditableStep20Result: React.FC<EditableStep20ResultProps> = ({
  className = "",
  isPreview = false,
  enableEditing = true
}) => {
  const {
    currentResult,
    availableStyles,
    isEditing,
    previewMode,
    switchPrimaryStyle,
    updateText,
    updateColor,
    setPreviewMode,
    toggleEditMode,
    resetCustomizations,
    getCustomText,
    getCustomColor
  } = useQuizResultEditor();

  // Ícones dos estilos
  const getStyleIcon = (style: string) => {
    switch (style?.toLowerCase()) {
      case 'clássico': case 'classic': return <Trophy className="w-8 h-8 text-amber-600" />;
      case 'romântico': case 'romantic': return <Heart className="w-8 h-8 text-rose-500" />;
      case 'dramático': case 'dramatic': return <Star className="w-8 h-8 text-purple-600" />;
      case 'natural': return <Check className="w-8 h-8 text-green-600" />;
      case 'criativo': return <Palette className="w-8 h-8 text-orange-500" />;
      default: return <Trophy className="w-8 h-8 text-amber-600" />;
    }
  };

  // Cores do estilo
  const getStyleColors = (style: string) => {
    const customBg = getCustomColor(`${style}-bg`, '');
    const customBorder = getCustomColor(`${style}-border`, '');
    const customText = getCustomColor(`${style}-text`, '');

    if (customBg && customBorder && customText) {
      return { 
        bg: `bg-[${customBg}]`, 
        border: `border-[${customBorder}]`, 
        text: `text-[${customText}]` 
      };
    }

    switch (style?.toLowerCase()) {
      case 'clássico': case 'classic': 
        return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' };
      case 'romântico': case 'romantic': 
        return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800' };
      case 'dramático': case 'dramatic': 
        return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' };
      case 'natural': 
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' };
      case 'criativo':
        return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800' };
      default: 
        return { bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-800' };
    }
  };

  const styleColors = getStyleColors(currentResult.primaryStyle.style);

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200", className)}>
      {/* Toolbar do editor (apenas no modo editor) */}
      {enableEditing && !isPreview && (
        <div className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-stone-800">Editor Step 20</h3>
            
            {/* Seletor de modo de preview */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode('single')}
                className={cn(
                  'px-3 py-1 rounded text-sm transition-colors',
                  previewMode === 'single' ? 'bg-primary text-white' : 'bg-stone-100 hover:bg-stone-200'
                )}
              >
                Único
              </button>
              <button
                onClick={() => setPreviewMode('multiple')}
                className={cn(
                  'px-3 py-1 rounded text-sm transition-colors',
                  previewMode === 'multiple' ? 'bg-primary text-white' : 'bg-stone-100 hover:bg-stone-200'
                )}
              >
                Múltiplos
              </button>
              <button
                onClick={() => setPreviewMode('comparison')}
                className={cn(
                  'px-3 py-1 rounded text-sm transition-colors',
                  previewMode === 'comparison' ? 'bg-primary text-white' : 'bg-stone-100 hover:bg-stone-200'
                )}
              >
                Comparação
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleEditMode}
              className="gap-2"
            >
              {isEditing ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              {isEditing ? 'Preview' : 'Editar'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetCustomizations}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* Seletor de estilo (apenas em modo edição) */}
        {enableEditing && isEditing && (
          <StyleSelector
            availableStyles={availableStyles}
            currentStyle={currentResult.primaryStyle}
            onStyleChange={switchPrimaryStyle}
            className="mb-8"
          />
        )}

        {/* Header com saudação */}
        <div className="text-center mb-12">
          <EditableText
            value={getCustomText('greeting', `Parabéns, ${currentResult.userName}! 🎉`)}
            onChange={(value) => updateText('greeting', value)}
            isEditing={isEditing && enableEditing}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            placeholder="Parabéns, [Nome]! 🎉"
          />
          
          <EditableText
            value={getCustomText('subtitle', 'Descobrimos seu estilo único e preparamos recomendações especiais para você')}
            onChange={(value) => updateText('subtitle', value)}
            isEditing={isEditing && enableEditing}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            placeholder="Subtítulo da página de resultado..."
          />
        </div>

        {/* Card principal do resultado */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardContent className="p-8">
            {/* Estilo principal */}
            <div className={cn(
              styleColors.bg, 
              styleColors.border, 
              'border-2 rounded-2xl p-8 mb-8'
            )}>
              <div className="flex items-center justify-center mb-6">
                {getStyleIcon(currentResult.primaryStyle.style)}
              </div>
              
              <EditableText
                value={getCustomText('primary-title', `Seu Estilo: ${currentResult.primaryStyle.category}`)}
                onChange={(value) => updateText('primary-title', value)}
                isEditing={isEditing && enableEditing}
                className={cn('text-3xl md:text-4xl font-bold text-center mb-4', styleColors.text)}
                placeholder="Seu Estilo: [Categoria]"
              />
              
              <div className="text-center mb-6">
                <div className={cn(
                  'inline-flex items-center px-4 py-2 rounded-full border',
                  styleColors.bg,
                  styleColors.border
                )}>
                  <span className={cn('text-lg font-medium', styleColors.text)}>
                    {currentResult.primaryStyle.percentage?.toFixed(0)}% de compatibilidade
                  </span>
                </div>
              </div>

              <EditableText
                value={getCustomText('primary-description', currentResult.primaryStyle.description)}
                onChange={(value) => updateText('primary-description', value)}
                isEditing={isEditing && enableEditing}
                className="text-center text-muted-foreground text-lg leading-relaxed"
                placeholder="Descrição do estilo principal..."
              />

              {/* Editor de cores (apenas em modo edição) */}
              {isEditing && enableEditing && (
                <div className="mt-6 pt-6 border-t border-stone-200">
                  <div className="text-sm font-medium text-stone-700 mb-3">Personalizar cores:</div>
                  <div className="flex gap-4 justify-center">
                    <EditableColor
                      label="Fundo"
                      value={getCustomColor(`${currentResult.primaryStyle.style}-bg`, '#fef3c7')}
                      onChange={(value) => updateColor(`${currentResult.primaryStyle.style}-bg`, value)}
                    />
                    <EditableColor
                      label="Borda"
                      value={getCustomColor(`${currentResult.primaryStyle.style}-border`, '#f59e0b')}
                      onChange={(value) => updateColor(`${currentResult.primaryStyle.style}-border`, value)}
                    />
                    <EditableColor
                      label="Texto"
                      value={getCustomColor(`${currentResult.primaryStyle.style}-text`, '#92400e')}
                      onChange={(value) => updateColor(`${currentResult.primaryStyle.style}-text`, value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Estilos secundários */}
            {currentResult.secondaryStyles && currentResult.secondaryStyles.length > 0 && (
              <div className="mb-8">
                <EditableText
                  value={getCustomText('secondary-title', 'Estilos Complementares')}
                  onChange={(value) => updateText('secondary-title', value)}
                  isEditing={isEditing && enableEditing}
                  className="text-2xl font-semibold text-foreground mb-6 text-center"
                  placeholder="Título dos estilos complementares"
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                  {currentResult.secondaryStyles.slice(0, 2).map((style, index) => {
                    const colors = getStyleColors(style.style);
                    return (
                      <div key={index} className={cn(colors.bg, colors.border, 'border rounded-xl p-6')}>
                        <div className="flex items-center justify-between">
                          <span className={cn('font-semibold', colors.text)}>
                            {style.category || style.style}
                          </span>
                          <span className="text-muted-foreground">
                            {style.percentage?.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="text-center">
              <EditableText
                value={getCustomText('cta-primary', 'Ver Minha Consultoria Personalizada')}
                onChange={(value) => updateText('cta-primary', value)}
                isEditing={isEditing && enableEditing}
                className="mb-4"
                placeholder="Texto do CTA principal"
                renderAs={(text, className) => (
                  <Button size="lg" className={cn("px-8 py-4 text-lg font-semibold", className)}>
                    <ArrowRight className="w-5 h-5 mr-2" />
                    {text}
                  </Button>
                )}
              />
              
              <div className="mt-6">
                <EditableText
                  value={getCustomText('cta-secondary', 'Compartilhar Resultado')}
                  onChange={(value) => updateText('cta-secondary', value)}
                  isEditing={isEditing && enableEditing}
                  className=""
                  placeholder="Texto do CTA secundário"
                  renderAs={(text, className) => (
                    <Button variant="outline" size="lg" className={cn("mr-4", className)}>
                      <Share2 className="w-4 h-4 mr-2" />
                      {text}
                    </Button>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos passos */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <EditableText
              value={getCustomText('next-steps-title', 'Próximos Passos')}
              onChange={(value) => updateText('next-steps-title', value)}
              isEditing={isEditing && enableEditing}
              className="text-xl font-semibold text-foreground mb-3"
              placeholder="Título da seção próximos passos"
            />
            
            <EditableText
              value={getCustomText('next-steps-description', 'Agora você pode acessar sua consultoria personalizada com recomendações exclusivas baseadas no seu estilo!')}
              onChange={(value) => updateText('next-steps-description', value)}
              isEditing={isEditing && enableEditing}
              className="text-muted-foreground mb-4"
              placeholder="Descrição dos próximos passos..."
            />
            
            <div className="flex justify-center space-x-4">
              <Button variant="outline">
                Refazer Quiz
              </Button>
              <Button>
                Recalcular
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditableStep20Result;