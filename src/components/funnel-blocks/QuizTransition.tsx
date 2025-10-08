// @ts-nocheck
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { DeviceView, StyleProps } from './types';

interface QuizTransitionProps extends StyleProps {
  /** Título da transição */
  title?: string;
  /** Mensagem principal */
  message?: string;
  /** Submensagem */
  submessage?: string;
  /** Texto do corpo da transição (alias para message) */
  text?: string; // ✅ Alias para message
  /** Ícone da transição */
  icon?: React.ReactNode;
  /** Mostrar animação de carregamento */
  showLoading?: boolean;
  /** Duração da transição em ms */
  duration?: number;
  /** Configuração de viewport */
  /** Callback quando a transição completa */
  onComplete?: () => void;
  /** Callback para continuar manualmente */
  onContinue?: () => void;
  /** Mostrar botão para continuar */
  showContinueButton?: boolean;
  /** Texto do botão (alias para buttonText) */
  continueButtonText?: string; // ✅ NEW: Alias para buttonText
  /** Texto do botão */
  buttonText?: string;
}

/**
 * QuizTransition - Página de transição entre etapas do quiz
 * Especialmente para a transição entre questões normais e estratégicas
 */
export const QuizTransition: React.FC<QuizTransitionProps> = ({
  title = 'Enquanto calculamos o seu resultado...',
  message = 'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.',
  text, // ✅ Alias para message
  submessage = 'A ideia é simples: te ajudar a enxergar com mais clareza onde você está agora — e para onde pode ir com mais intenção, leveza e autenticidade.',
  icon,
  showLoading = true,
  duration = 5000,
  deviceView = 'desktop',
  onComplete,
  onContinue,
  showContinueButton = true,
  continueButtonText, // ✅ NEW: Alias para buttonText
  buttonText = 'Continuar',
  className,
  style,
  customStyles,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);

  // Use text alias if provided, otherwise fallback to message
  const displayMessage = text || message;
  // Use continueButtonText if provided, otherwise fallback to buttonText
  const displayButtonText = continueButtonText || buttonText;

  // Auto complete após duração
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsCompleted(true);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onComplete]);

  const handleContinue = () => {
    setIsCompleted(true);
    onContinue?.();
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-[#fffbf7] to-[#f9f4ef] ${className || ''}`}
      style={style}
    >
      {customStyles && <style dangerouslySetInnerHTML={{ __html: customStyles }} />}

      <div className="max-w-2xl mx-auto text-center">
        <AnimatedWrapper animation="fade" show={true} duration={600}>
          <Card className="p-8 md:p-12 bg-white shadow-lg border border-[#B89B7A]/20">
            {/* Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center mx-auto">
                {icon || <Clock className="w-10 h-10 text-white" />}
              </div>
            </div>

            {/* Loading animation */}
            {showLoading && (
              <div className="mb-8">
                <div className="flex justify-center space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 bg-[#B89B7A] rounded-full animate-pulse"
                      style={{
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: '1.5s',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-playfair text-[#432818] mb-6">{title}</h1>

            {/* Message */}
            <p className="text-lg text-[#6B4F43] mb-6 leading-relaxed">{displayMessage}</p>

            {/* Submessage */}
            {submessage && <p className="text-[#8B7355] mb-8 leading-relaxed">{submessage}</p>}

            {/* Special note */}
            <div className="bg-[#f9f4ef] p-6 rounded-lg border-l-4 border-[#B89B7A] mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-[#B89B7A]" />
                <span className="font-semibold text-[#432818]">💬 Importante</span>
              </div>
              <p className="text-[#432818] text-sm">
                Responda com sinceridade. Isso é só entre você e a sua nova versão.
              </p>
            </div>

            {/* Continue button */}
            {showContinueButton && (
              <Button
                onClick={handleContinue}
                className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-8 py-3 rounded-lg hover:scale-105 transition-transform duration-300"
              >
                <span className="flex items-center gap-2">
                  {displayButtonText}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            )}

            {/* Progress indicator */}
            <div className="mt-8 pt-6 border-t border-[#B89B7A]/20">
              <p className="text-xs text-[#8B7355]">
                Você está quase lá! Faltam apenas algumas perguntas.
              </p>
            </div>
          </Card>
        </AnimatedWrapper>
      </div>
    </div>
  );
};

export default QuizTransition;
