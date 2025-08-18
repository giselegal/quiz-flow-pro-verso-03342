import { cn } from '@/lib/utils';
import { FunnelStepProps } from '@/types/funnel';
import { Button } from '@/components/ui/button';

/**
 * QuizIntroStep - Etapa 3: Introdução às perguntas do quiz
 *
 * Esta etapa apresenta uma introdução às perguntas que virão a seguir,
 * explicando o propósito do quiz e o que o usuário pode esperar.
 */
export const QuizIntroStep: React.FC<FunnelStepProps> = ({
  id,
  className = '',
  isEditable = false,
  onNext,
  stepNumber,
  totalSteps,
  data = {},
  onEdit,
}) => {
  const {
    title = 'Descubra seu estilo ideal',
    description = 'Responda as próximas perguntas com sinceridade para obtermos um resultado preciso e personalizado para você.',
    buttonText = 'Iniciar questionário',
    imageUrl,
    bullets = [
      'São apenas 10 perguntas rápidas',
      'Leva menos de 3 minutos',
      'Resultado personalizado imediato',
    ],
  } = data;

  return (
    <div
      className={cn('relative flex flex-col bg-white rounded-xl shadow-md p-6', className)}
      onClick={isEditable ? onEdit : undefined}
      data-funnel-step-id={id}
    >
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Lado esquerdo - Texto */}
        <div className="flex-1 space-y-6">
          <div style={{ color: '#8B7355' }}>
            Etapa {stepNumber} de {totalSteps}
          </div>

          <h2 style={{ color: '#432818' }}>{title}</h2>

          <p style={{ color: '#6B4F43' }}>{description}</p>

          {/* Lista de bullets */}
          <ul className="space-y-3">
            {bullets.map((item: string, index: number) => (
              <li key={index} className="flex items-center gap-2">
                <div className="bg-green-500 rounded-full p-1">
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={isEditable ? undefined : onNext}
            size="lg"
            className="mt-4 w-full md:w-auto"
          >
            {buttonText}
          </Button>
        </div>

        {/* Lado direito - Imagem */}
        {imageUrl && (
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64">
              <img
                src={imageUrl}
                alt="Quiz intro"
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Indicador de edição */}
      {isEditable && (
        <div className="absolute top-2 right-2 bg-[#B89B7A]/100 text-white text-xs px-2 py-1 rounded">
          Editar
        </div>
      )}
    </div>
  );
};

export default QuizIntroStep;
