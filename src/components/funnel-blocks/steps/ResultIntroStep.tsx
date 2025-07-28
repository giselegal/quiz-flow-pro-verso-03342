import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { FunnelStepProps } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

/**
 * ResultIntroStep - Etapa 17: Introdução ao resultado
 * 
 * Este componente exibe uma introdução aos resultados do quiz,
 * com animação de entrada e informações preliminares.
 */
export const ResultIntroStep: React.FC<FunnelStepProps> = ({
  id,
  className = '',
  isEditable = false,
  onNext,
  stepNumber,
  totalSteps,
  data = {},
  onEdit
}) => {
  const {
    title = 'Seu resultado está pronto!',
    subtitle = 'Analisamos suas respostas e temos um resultado personalizado para você.',
    buttonText = 'Ver meu resultado',
    backgroundColor = 'bg-white',
    result = {
      category: 'Estilo Moderno',
      imageUrl: '/placeholder-result.jpg'
    },
    animateIn = true,
    showConfetti = true
  } = data;

  // Efeito para confetti no carregamento
  useEffect(() => {
    if (isEditable || !showConfetti) return;
    
    // Aqui seria a implementação do confetti
    // Por simplicidade, apenas deixamos um comentário
    // Pode ser implementado com biblioteca como canvas-confetti
    
    // Para exemplo:
    // import confetti from 'canvas-confetti';
    // confetti({
    //   particleCount: 100,
    //   spread: 70,
    //   origin: { y: 0.6 }
    // });
    
  }, [isEditable, showConfetti]);

  return (
    <div 
      className={cn(
        "min-h-screen flex items-center justify-center p-6",
        backgroundColor,
        animateIn ? "animate-in slide-in-from-bottom-4 duration-700" : "",
        className
      )}
      onClick={isEditable ? onEdit : undefined}
      data-funnel-step-id={id}
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center space-y-4">
          {/* Categoria do resultado */}
          <Badge variant="secondary" className="w-fit mx-auto text-sm">
            {result.category}
          </Badge>
          
          {/* Título */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {title}
          </h2>
          
          {/* Subtítulo */}
          <p className="text-xl text-gray-600">
            {subtitle}
          </p>
        </CardHeader>
        
        <CardContent className="text-center space-y-8">
          {/* Prévia da imagem */}
          {result.imageUrl && (
            <div className="relative">
              <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden border-4 border-[#B89B7A]/30 shadow-lg">
                <img 
                  src={result.imageUrl} 
                  alt={result.category}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                  <ChevronRight size={24} className="text-[#B89B7A]" />
                </div>
              </div>
            </div>
          )}
          
          {/* Botão CTA */}
          <Button
            onClick={isEditable ? undefined : onNext}
            size="lg"
            className="px-8 bg-[#B89B7A] hover:bg-[#A38967]"
            disabled={isEditable}
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>
      
      {/* Indicador de edição */}
      {isEditable && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">
          Modo de Edição
        </div>
      )}
    </div>
  );
};

export default ResultIntroStep;
