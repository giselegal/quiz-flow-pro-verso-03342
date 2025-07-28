import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FunnelStepProps } from '@/types/funnel';
import { useFunnelNavigation } from '../hooks/useFunnelNavigation';
import { FunnelProgressBar } from '../shared/FunnelProgressBar';

/**
 * FunnelIntroStep - Componente para a página de introdução do funil
 * 
 * Este componente é a primeira etapa do funil, apresentando
 * uma introdução ao usuário com título, subtítulo, 
 * imagem de fundo e um botão para começar.
 */
interface FunnelIntroStepProps extends FunnelStepProps {
  data?: {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    backgroundImage?: string;
    logoUrl?: string;
    showProgressBar?: boolean;
  };
}

const FunnelIntroStep: React.FC<FunnelIntroStepProps> = ({
  id,
  className = "",
  style,
  stepNumber = 1,
  totalSteps = 21,
  isEditable = false,
  onNext,
  data = {},
  onEdit
}) => {
  const {
    title = "Descubra seu estilo ideal",
    subtitle = "Responda nosso quiz e receba um guia personalizado",
    buttonText = "Começar agora",
    backgroundImage = "",
    logoUrl = "",
    showProgressBar = true
  } = data;

  // Se estiver no modo de edição, use a navegação do funil
  const { goToNextStep } = useFunnelNavigation();
  
  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      goToNextStep();
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center text-center p-6 bg-cover bg-center transition-all",
        backgroundImage ? "bg-gradient-to-b from-[rgba(0,0,0,0.4)] to-[rgba(0,0,0,0.7)]" : "bg-[#F9F6F2]",
        className
      )}
      style={{
        ...(backgroundImage && { backgroundImage: `url(${backgroundImage})` }),
        ...style
      }}
      onClick={isEditable ? onEdit : undefined}
      data-funnel-step="intro"
    >
      {/* Container para conteúdo */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center">
        {/* Logo se fornecido */}
        {logoUrl && (
          <div className="mb-8">
            <img
              src={logoUrl}
              alt="Logo"
              className="h-16 w-auto mx-auto"
            />
          </div>
        )}
        
        {/* Título principal */}
        <h1 
          className={cn(
            "text-4xl md:text-5xl font-bold mb-4", 
            backgroundImage ? "text-white" : "text-[#403C34]"
          )}
        >
          {title}
        </h1>
        
        {/* Subtítulo */}
        <p 
          className={cn(
            "text-lg mb-10 max-w-xl", 
            backgroundImage ? "text-gray-200" : "text-gray-700"
          )}
        >
          {subtitle}
        </p>
        
        {/* Botão de ação */}
        <Button
          onClick={!isEditable ? handleNext : undefined}
          className="px-8 py-6 text-lg font-medium rounded-lg bg-[#B89B7A] hover:bg-[#A38967] text-white"
        >
          {buttonText}
        </Button>
        
        {/* Barra de progresso */}
        {showProgressBar && (
          <div className="w-full mt-12 max-w-lg">
            <FunnelProgressBar 
              currentStep={stepNumber} 
              totalSteps={totalSteps}
              showText
            />
          </div>
        )}
        
        {/* Indicador de edição */}
        {isEditable && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Modo de Edição
          </div>
        )}
      </div>
    </div>
  );
};

export default FunnelIntroStep;
