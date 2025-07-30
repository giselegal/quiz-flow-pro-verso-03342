import React from 'react';
import { Block } from '@/types/editor';
import { StyleResult } from '@/types/quiz';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit, Copy, Trash } from 'lucide-react';

interface EditableBlockProps {
  block: Block;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  isPreviewMode: boolean;
  onReorderBlocks: (sourceIndex: number, destinationIndex: number) => void;
  primaryStyle?: StyleResult;
}

const EditableBlock: React.FC<EditableBlockProps> = ({
  block,
  index,
  isSelected,
  onClick,
  isPreviewMode,
  onReorderBlocks,
  primaryStyle
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: block.id,
    data: {
      index,
      type: 'BLOCK'
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isPreviewMode ? 'default' : 'pointer',
    border: isSelected && !isPreviewMode ? '2px solid hsl(var(--primary))' : isPreviewMode ? 'none' : '2px dashed hsl(var(--border))',
    borderRadius: '0.5rem',
    backgroundColor: isPreviewMode ? 'transparent' : isDragging ? 'hsl(var(--accent))' : 'hsl(var(--background))',
    position: 'relative' as const,
    zIndex: isSelected ? 1 : 0
  };
  
  // Render the appropriate block preview based on type
  const renderBlockPreview = () => {
    const content = block.content || {};
    const blockStyle = content.style || {};
    
    switch (block.type) {
      case 'header':
        return (
          <div style={blockStyle} className="text-center p-4">
            {content.logo && (
              <img
                src={content.logo}
                alt={content.logoAlt || 'Logo'}
                className="mx-auto mb-4 max-w-24 h-auto"
              />
            )}
            {content.title && (
              <h1 className="text-xl md:text-2xl font-playfair font-semibold text-primary mb-2">
                {content.title}
              </h1>
            )}
            {content.subtitle && (
              <p className="text-muted-foreground">{content.subtitle}</p>
            )}
          </div>
        );
        
      case 'headline':
        return (
          <div style={blockStyle} className="p-4">
            {content.title && (
              <h2 className="text-lg md:text-xl font-playfair font-semibold text-primary mb-2" style={{ textAlign: content.alignment || 'left' }}>
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-muted-foreground" style={{ textAlign: content.alignment || 'left' }}>
                {content.subtitle}
              </p>
            )}
          </div>
        );
        
      case 'text':
        return (
          <div style={blockStyle} className="p-4">
            <p className="text-foreground leading-relaxed" style={{ textAlign: content.alignment || 'left' }}>
              {content.text || 'Este é um bloco de texto. Clique para editar.'}
            </p>
          </div>
        );
        
      case 'image':
        return (
          <div style={blockStyle} className="p-4" style={{ textAlign: content.alignment || 'center' }}>
            {content.imageUrl ? (
              <img
                src={content.imageUrl}
                alt={content.imageAlt || 'Imagem'}
                className="max-w-full h-auto rounded-md"
              />
            ) : (
              <div className="bg-muted h-40 w-full flex items-center justify-center rounded-md border-2 border-dashed border-border">
                <p className="text-muted-foreground">Clique para adicionar uma imagem</p>
              </div>
            )}
            {content.caption && (
              <p className="text-sm text-muted-foreground mt-2">{content.caption}</p>
            )}
          </div>
        );
        
      case 'benefits':
        return (
          <div style={blockStyle} className="p-4">
            {content.title && (
              <h3 className="text-lg font-playfair font-semibold text-primary mb-4" style={{ textAlign: content.alignment || 'left' }}>
                {content.title}
              </h3>
            )}
            <div className="space-y-2">
              {content.benefits && content.benefits.length > 0 ? (
                content.benefits.map((benefit: string, index: number) => (
                  <div key={`benefit-${benefit.slice(0, 20)}-${index}`} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-foreground">{benefit}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Adicione benefícios para exibir aqui</p>
              )}
            </div>
          </div>
        );
        
      case 'pricing':
        return (
          <div style={blockStyle} className="p-6 bg-card border border-border rounded-lg" style={{ textAlign: content.alignment || 'center' }}>
            {content.title && (
              <h3 className="text-lg font-playfair font-semibold text-primary mb-4">
                {content.title}
              </h3>
            )}
            <div className="mb-4">
              {content.price && (
                <div className="text-2xl font-bold text-primary">
                  {content.price}
                </div>
              )}
              {content.regularPrice && (
                <div className="text-muted-foreground line-through">
                  {content.regularPrice}
                </div>
              )}
            </div>
            {content.ctaText && (
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
                {content.ctaText}
              </button>
            )}
          </div>
        );
        
      case 'testimonials':
        return (
          <div style={blockStyle} className="p-4">
            {content.title && (
              <h3 className="text-lg font-playfair font-semibold text-primary mb-4" style={{ textAlign: content.alignment || 'center' }}>
                {content.title}
              </h3>
            )}
            <div className="space-y-4">
              {content.testimonials && content.testimonials.length > 0 ? (
                content.testimonials.map((testimonial: any, index: number) => (
                  <div key={`testimonial-${testimonial.name || 'anonymous'}-${index}`} className="bg-card border border-border rounded-lg p-4">
                    <p className="text-foreground mb-3">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      {testimonial.image && (
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-primary">{testimonial.name}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Adicione depoimentos para exibir aqui</p>
              )}
            </div>
          </div>
        );
        
      case 'guarantee':
        return (
          <div style={blockStyle} className="p-6 bg-card border border-border rounded-lg" style={{ textAlign: content.alignment || 'center' }}>
            {content.imageUrl && (
              <img 
                src={content.imageUrl}
                alt="Garantia"
                className="mx-auto mb-4 max-w-32 h-auto"
              />
            )}
            {content.title && (
              <h3 className="text-lg font-playfair font-semibold text-primary mb-3">
                {content.title}
              </h3>
            )}
            {content.text && (
              <p className="text-foreground">
                {content.text}
              </p>
            )}
          </div>
        );
        
      case 'cta':
        return (
          <div style={blockStyle} className="p-6 bg-accent rounded-lg" style={{ textAlign: content.alignment || 'center' }}>
            {content.title && (
              <h3 className="text-lg font-playfair font-semibold text-primary mb-3">
                {content.title}
              </h3>
            )}
            {content.text && (
              <p className="text-foreground mb-4">
                {content.text}
              </p>
            )}
            {content.buttonText && (
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
                {content.buttonText}
              </button>
            )}
          </div>
        );
        
      case 'style-result':
        return (
          <div style={blockStyle} className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <div className="text-center">
              <h2 className="text-2xl font-playfair font-bold text-primary mb-2">
                Seu Estilo Principal
              </h2>
              <div className="text-3xl font-bold text-primary mb-4">
                {primaryStyle?.category || 'Natural'}
              </div>
              <div className="w-full bg-border rounded-full h-3 mb-4">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${primaryStyle?.percentage || 85}%` }}
                ></div>
              </div>
              <p className="text-muted-foreground">
                {primaryStyle?.percentage || 85}% de compatibilidade
              </p>
            </div>
          </div>
        );
        
      case 'secondary-styles':
        return (
          <div style={blockStyle} className="p-4">
            <h3 className="text-lg font-playfair font-semibold text-primary mb-4 text-center">
              Estilos Secundários
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['Clássico', 'Moderno', 'Romântico'].map((style, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-3 text-center">
                  <div className="text-sm font-medium text-primary">{style}</div>
                  <div className="text-xs text-muted-foreground">{15 + index * 5}%</div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'spacer':
        return (
          <div style={blockStyle} className="flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg" style={{ height: content.height || '60px' }}>
            <span className="text-sm">Espaçador ({content.height || '60px'})</span>
          </div>
        );
        
      case 'video':
        return (
          <div style={blockStyle} className="p-4" style={{ textAlign: content.alignment || 'center' }}>
            {content.videoUrl ? (
              <div className="aspect-video bg-muted rounded-lg border-2 border-border flex items-center justify-center">
                <p className="text-muted-foreground">Vídeo: {content.videoUrl}</p>
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                <p className="text-muted-foreground">Clique para adicionar um vídeo</p>
              </div>
            )}
          </div>
        );
        
      case 'two-column':
        return (
          <div style={blockStyle} className="p-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">Coluna 1</h4>
                <p className="text-sm text-muted-foreground">
                  {content.leftContent || 'Conteúdo da primeira coluna'}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">Coluna 2</h4>
                <p className="text-sm text-muted-foreground">
                  {content.rightContent || 'Conteúdo da segunda coluna'}
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'quiz-question':
        return (
          <div style={blockStyle} className="p-6">
            <div className="mb-4">
              {content.progressPercent && (
                <div className="w-full bg-border rounded-full h-2 mb-4">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${content.progressPercent}%` }}
                  ></div>
                </div>
              )}
            </div>
            
            {content.question && (
              <h3 className="text-lg font-playfair font-semibold text-primary mb-6" style={{ textAlign: content.alignment || 'center' }}>
                {content.question}
              </h3>
            )}
            
            <div className={`grid gap-3 ${content.optionLayout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {content.options && content.options.length > 0 ? (
                content.options.map((option: any, index: number) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer">
                    {option.imageUrl && (
                      <img 
                        src={option.imageUrl}
                        alt={option.text}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <p className="text-foreground font-medium">{option.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground col-span-full text-center">
                  Configure as opções da pergunta
                </p>
              )}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-4 bg-muted border-2 border-dashed border-border rounded-lg">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Tipo de bloco: <span className="font-mono">{block.type}</span></p>
              <p className="text-sm text-muted-foreground">Clique para configurar este componente</p>
            </div>
          </div>
        );
    }
  };
  
  if (isPreviewMode) {
    return (
      <div style={{ opacity: isDragging ? 0.5 : 1 }}>
        {renderBlockPreview()}
      </div>
    );
  }
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className="p-3 group transition-all duration-200 hover:shadow-sm"
      {...attributes}
    >
      {!isPreviewMode && (
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-accent">
            <Edit className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-accent">
            <Copy className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
            <Trash className="h-4 w-4" />
          </Button>
          <div
            className="h-8 w-8 flex items-center justify-center cursor-move hover:bg-accent rounded-md"
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
      
      {renderBlockPreview()}
    </div>
  );
};

export default EditableBlock;