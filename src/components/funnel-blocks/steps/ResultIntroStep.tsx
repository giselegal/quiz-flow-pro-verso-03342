import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { FunnelStepProps } from '@/types/funnel';
import { Button } from '@/components/ui/button';
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
        "relative rounded-xl shadow-md p-6",
        backgroundColor,
        animateIn ? "animate-fade-in-up" : "",
        className
      )}
      onClick={isEditable ? onEdit : undefined}
      data-funnel-step-id={id}
    >
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Categoria do resultado */}
        <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium">
          {result.category}
        </div>
        
        {/* Título */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          {title}
        </h2>
        
        {/* Subtítulo */}
        <p className="text-xl text-gray-600">
          {subtitle}
        </p>
        
        {/* Prévia da imagem */}
        {result.imageUrl && (
          <div className="mt-6 relative">
            <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden border-4 border-indigo-200">
              <img 
                src={result.imageUrl} 
                alt={result.category}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <ChevronRight size={24} className="text-indigo-600" />
              </div>
            </div>
          </div>
        )}
        
        {/* Botão CTA */}
        <Button
          onClick={isEditable ? undefined : onNext}
          size="lg"
          className="mt-8 px-8"
        >
          {buttonText}
        </Button>
      </div>
      
      {/* Indicador de edição */}
      {isEditable && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Editar
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ResultIntroStep;
