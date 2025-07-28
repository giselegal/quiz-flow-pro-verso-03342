import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

// Tipo para as propriedades do cabeçalho
interface VerticalCanvasHeaderProps extends BlockComponentProps {
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
}

export const VerticalCanvasHeaderBlock: React.FC<VerticalCanvasHeaderProps> = ({
  logoSrc = "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.png",
  logoAlt = "Logo",
  logoWidth = 96,
  logoHeight = 96,
  progressValue = 7.14, // Baseado no HTML (100 - 92.86)
  progressMax = 100,
  showProgress = true,
  showBackButton = true,
  onBackClick,
  containerWidth = "w-full",
  gap = "gap-4",
  className = "",
  isSelected = false,
  onClick
}) => {
  const progressPercentage = (progressValue / progressMax) * 100;
  const translateX = 100 - progressPercentage;

  return (
    <div 
      className={`grid ${gap} opacity-100 transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      } ${className}`}
      onClick={onClick}
      data-component="VerticalCanvasHeader"
    >
      <div className="flex flex-row w-full h-auto justify-center relative">
        {/* Botão de Voltar */}
        {showBackButton && (
          <button 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary hover:text-foreground h-10 w-10 absolute left-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              onBackClick?.();
            }}
            type="button"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}

        {/* Container Principal */}
        <div className={`flex flex-col ${containerWidth} justify-start items-center ${gap}`}>
          {/* Logo */}
          <img
            width={logoWidth}
            height={logoHeight}
            className="max-w-24 object-cover rounded-lg shadow-sm"
            alt={logoAlt}
            src={logoSrc}
            loading="lazy"
          />

          {/* Barra de Progresso */}
          {showProgress && (
            <div
              aria-valuemax={progressMax}
              aria-valuemin={0}
              aria-valuenow={progressValue}
              role="progressbar"
              className="relative w-full overflow-hidden rounded-full bg-zinc-300 h-2 max-w-md"
            >
              <div
                className="progress h-full flex-1 bg-primary transition-all duration-500 ease-out rounded-full"
                style={{
                  width: `${progressPercentage}%`,
                  transform: `translateX(-${translateX}%)`
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente wrapper para integração com o sistema de blocos
interface VerticalCanvasHeaderBlockProps {
  block: {
    id: string;
    type: string;
    properties: {
      logoSrc?: string;
      logoAlt?: string;
      logoWidth?: number;
      logoHeight?: number;
      progressValue?: number;
      progressMax?: number;
      showProgress?: boolean;
      showBackButton?: boolean;
      containerWidth?: string;
      gap?: string;
      [key: string]: any;
    };
  };
  isSelected?: boolean;
  onClick?: () => void;
  onSaveInline?: (blockId: string, updates: any) => void;
  className?: string;
}

const VerticalCanvasHeaderBlockWrapper: React.FC<VerticalCanvasHeaderBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onSaveInline,
  className = ""
}) => {
  const handleBackClick = () => {
    // Lógica personalizada para voltar etapa
    console.log('Back button clicked for block:', block.id);
    // Pode disparar evento customizado ou callback
  };

  const handlePropertyChange = (property: string, value: any) => {
    if (onSaveInline) {
      onSaveInline(block.id, {
        properties: {
          ...block.properties,
          [property]: value
        }
      });
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <VerticalCanvasHeaderBlock
        logoSrc={block.properties.logoSrc}
        logoAlt={block.properties.logoAlt}
        logoWidth={block.properties.logoWidth}
        logoHeight={block.properties.logoHeight}
        progressValue={block.properties.progressValue}
        progressMax={block.properties.progressMax}
        showProgress={block.properties.showProgress}
        showBackButton={block.properties.showBackButton}
        containerWidth={block.properties.containerWidth}
        gap={block.properties.gap}
        isSelected={isSelected}
        onClick={onClick}
        onBackClick={handleBackClick}
      />

      {/* Overlay de edição quando selecionado */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 border-dashed rounded-lg pointer-events-none" />
      )}
    </div>
  );
};

export default VerticalCanvasHeaderBlockWrapper;
