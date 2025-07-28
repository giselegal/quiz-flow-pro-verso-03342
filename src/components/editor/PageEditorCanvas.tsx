import React, { useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, Trash2, Move, Eye, EyeOff, 
  MoreVertical
} from 'lucide-react';
import { SimplePage, SimpleComponent } from '@/interfaces/quiz';
import styles from '@/styles/editor/editor-modular.module.css';

// Import component renderers - Using modern inline blocks
import {
  QuizTitle, QuizSubtitle, QuizParagraph, QuizImage, QuizButton,
  QuizSpacer, QuizProgress, QuizInput, QuizOptions, QuizVideo,
  QuizTestimonial, QuizPrice, QuizGuarantee,
  QuizBonus, QuizFAQ, QuizSocialProof, QuizEmail, QuizPhone
} from '@/components/quiz/components';

// Import modern inline blocks
import { UniversalBlockRenderer } from '@/components/editor/blocks/UniversalBlockRenderer';
import { 
  TextInlineBlock,
  BadgeInlineBlock,
  StatInlineBlock,
  CountdownInlineBlock,
  ResultCardInlineBlock,
  QuizOfferPricingInlineBlock,
  StyleCardInlineBlock,
  ProgressInlineBlock,
  ImageDisplayInlineBlock,
  PricingCardInlineBlock,
  TestimonialCardInlineBlock
} from '@/components/editor/blocks/inline';

interface PageEditorCanvasProps {
  currentPage: SimplePage | null;
  deviceView: 'desktop' | 'tablet' | 'mobile';
  selectedComponent: string | null;
  setSelectedComponent: (componentId: string | null) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDrop: (e: React.DragEvent, index: number) => void;
  dragOverIndex: number | null;
  deleteComponent: (componentId: string) => void;
  duplicateComponent: (componentId: string) => void;
}

// Component renderer mapping - Including modern inline blocks
const ComponentRenderers: Record<string, React.ComponentType<any>> = {
  // Componentes básicos tradicionais
  title: QuizTitle,
  subtitle: QuizSubtitle,
  text: QuizParagraph,
  paragraph: QuizParagraph,
  image: QuizImage,
  button: QuizButton,
  spacer: QuizSpacer,
  progress: QuizProgress,
  input: QuizInput,
  email: QuizEmail,
  phone: QuizPhone,
  options: QuizOptions,
  video: QuizVideo,
  testimonial: QuizTestimonial,
  price: QuizPrice,
  guarantee: QuizGuarantee,
  bonus: QuizBonus,
  faq: QuizFAQ,
  'social-proof': QuizSocialProof,
  
  // Componentes inline modernos
  'text-inline': TextInlineBlock,
  'badge-inline': BadgeInlineBlock,
  'stat-inline': StatInlineBlock,
  'countdown': CountdownInlineBlock,
  'countdown-inline': CountdownInlineBlock,
  'result-card': ResultCardInlineBlock,
  'result-card-inline': ResultCardInlineBlock,
  'pricing-inline': QuizOfferPricingInlineBlock,
  'pricing-card': PricingCardInlineBlock,
  'style-card': StyleCardInlineBlock,
  'progress-inline': ProgressInlineBlock,
  'image-display': ImageDisplayInlineBlock,
  'testimonial-card': TestimonialCardInlineBlock,
};

const PageEditorCanvas: React.FC<PageEditorCanvasProps> = ({
  currentPage,
  deviceView,
  selectedComponent,
  setSelectedComponent,
  handleDragOver,
  handleDrop,
  dragOverIndex,
  deleteComponent,
  duplicateComponent,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Get device-specific classes
  const getDeviceClasses = () => {
    switch (deviceView) {
      case 'mobile':
        return styles.mobilePreview;
      case 'tablet':
        return styles.tabletPreview;
      default:
        return styles.desktopPreview;
    }
  };

  const renderComponentPreview = useCallback((component: SimpleComponent, index: number) => {
    const isSelected = component.id === selectedComponent;
    
    return (
      <div 
        key={component.id}
        className={`${styles.componentContainer} ${isSelected ? styles.selected : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponent(component.id);
        }}
      >
        <div 
          className={styles.dropZone}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          style={{
            height: dragOverIndex === index ? '60px' : '0px',
            opacity: dragOverIndex === index ? 1 : 0
          }}
        />

        <div className={styles.componentWrapper}>
          {/* Componente Preview */}
          <div className={styles.componentPreview}>
            {(() => {
              // Primeiro, tentar usar o UniversalBlockRenderer para componentes inline modernos
              try {
                const blockData = {
                  id: component.id,
                  type: component.type,
                  properties: {
                    ...component.data,
                    style: component.style || {}
                  }
                };
                return <UniversalBlockRenderer block={blockData} />;
              } catch (error) {
                // Fallback para ComponentRenderers tradicionais
                const ComponentRenderer = ComponentRenderers[component.type];
                if (ComponentRenderer) {
                  return <ComponentRenderer {...component.data} style={component.style} />;
                }
                // Última opção: placeholder
                return (
                  <div className={styles.componentPlaceholder}>
                    {`Componente ${component.type} não disponível`}
                  </div>
                );
              }
            })()}
          </div>
          
          {/* Componente Actions */}
          {isSelected && (
            <div className={styles.componentActions}>
              <Button 
                variant="ghost" 
                size="icon" 
                className={styles.actionButton}
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateComponent(component.id);
                }}
              >
                <Copy className={styles.actionIcon} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={styles.actionButton}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteComponent(component.id);
                }}
              >
                <Trash2 className={styles.actionIcon} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={styles.actionButton}
                title="Mover"
              >
                <Move className={styles.actionIcon} />
              </Button>
            </div>
          )}
        </div>
        
        {/* Última dropzone para adicionar ao final */}
        {index === (currentPage?.components.length ?? 0) - 1 && (
          <div 
            className={styles.dropZone}
            onDragOver={(e) => handleDragOver(e, (currentPage?.components.length ?? 0))}
            onDrop={(e) => handleDrop(e, (currentPage?.components.length ?? 0))}
            style={{
              height: dragOverIndex === (currentPage?.components.length ?? 0) ? '60px' : '0px',
              opacity: dragOverIndex === (currentPage?.components.length ?? 0) ? 1 : 0
            }}
          />
        )}
      </div>
    );
  }, [selectedComponent, dragOverIndex, setSelectedComponent, handleDragOver, handleDrop, duplicateComponent, deleteComponent]);

  return (
    <div className={styles.canvasContainer}>
      <div className={styles.canvasHeader}>
        <h2 className="text-sm font-semibold">Canvas</h2>
        <Badge variant="outline" className={styles.deviceBadge}>
          {deviceView.charAt(0).toUpperCase() + deviceView.slice(1)}
        </Badge>
      </div>
      
      <div 
        className={`${styles.canvasPreview} ${getDeviceClasses()}`}
        ref={canvasRef}
        onClick={() => setSelectedComponent(null)}
      >
        <Card className={styles.pageCard}>
          <ScrollArea className={styles.pageScrollArea}>
            <div className={styles.pageContent}>
              {/* Page Title */}
              {currentPage?.showHeader && (
                <div className={styles.pageHeader}>
                  <h1 className={styles.pageTitle}>
                    {currentPage?.title || 'Página sem título'}
                  </h1>
                </div>
              )}
              
              {/* Page Components */}
              {currentPage?.components.length === 0 ? (
                <div 
                  className={styles.emptyCanvas}
                  onDragOver={(e) => handleDragOver(e, 0)}
                  onDrop={(e) => handleDrop(e, 0)}
                >
                  <p className={styles.emptyCanvasText}>
                    Arraste componentes para esta área
                  </p>
                </div>
              ) : (
                <div className={styles.componentsContainer}>
                  {currentPage?.components.map((component, index) => renderComponentPreview(component, index))}
                </div>
              )}
              
              {/* Page Progress */}
              {currentPage?.showProgress && (
                <div className={styles.pageProgress}>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${currentPage?.progress || 0}%` }} 
                    />
                  </div>
                  <span className={styles.progressText}>
                    {currentPage?.progress || 0}% concluído
                  </span>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default PageEditorCanvas;
