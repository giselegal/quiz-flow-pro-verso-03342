import React from 'react';

/**
 * QuizProgressBlock - Componente de progresso do quiz 100% reutilizável e editável
 * 
 * Props editáveis via editor visual:
 * - currentQuestion: number - Questão atual
 * - totalQuestions: number - Total de questões
 * - showPercentage?: boolean - Exibir porcentagem
 * - showNumbers?: boolean - Exibir números (X de Y)
 * - progressBarStyle?: 'linear' | 'circular' | 'steps' - Estilo da barra
 * - color?: string - Cor principal
 * - backgroundColor?: string - Cor de fundo
 * - height?: string - Altura da barra
 * - animated?: boolean - Animação suave
 * 
 * @example
 * <QuizProgressBlock
 *   blockId="quiz-progress-1"
 *   currentQuestion={3}
 *   totalQuestions={10}
 *   showPercentage={true}
 *   showNumbers={true}
 *   progressBarStyle="linear"
 *   color="#B89B7A"
 *   animated={true}
 * />
 */

export interface QuizProgressBlockProps {
  // Identificação
  blockId: string;
  className?: string;
  style?: React.CSSProperties;

  // Conteúdo editável
  currentQuestion: number;
  totalQuestions: number;
  
  // Configurações de exibição
  showPercentage?: boolean;
  showNumbers?: boolean;
  showTitle?: boolean;
  title?: string;

  // Estilos da barra de progresso
  progressBarStyle?: 'linear' | 'circular' | 'steps';
  color?: string;
  backgroundColor?: string;
  height?: string;
  borderRadius?: string;
  animated?: boolean;

  // Layout
  alignment?: 'left' | 'center' | 'right';
}

const QuizProgressBlock: React.FC<QuizProgressBlockProps> = ({
  blockId,
  className = '',
  style = {},
  currentQuestion,
  totalQuestions,
  showPercentage = true,
  showNumbers = true,
  showTitle = false,
  title = 'Progresso do Quiz',
  progressBarStyle = 'linear',
  color = '#B89B7A',
  backgroundColor = '#F3E8E6',
  height = '8px',
  borderRadius = '9999px',
  animated = true,
  alignment = 'center'
}) => {
  // Calcular porcentagem
  const percentage = Math.round((currentQuestion / totalQuestions) * 100);
  const progressWidth = `${percentage}%`;

  const renderLinearProgress = () => (
    <div className="w-full space-y-3">
      {/* Números e porcentagem */}
      <div className={`flex justify-between items-center text-sm text-[#6B5B73] text-${alignment}`}>
        {showNumbers && (
          <span className="font-medium">
            Questão {currentQuestion} de {totalQuestions}
          </span>
        )}
        {showPercentage && (
          <span className="font-medium">
            {percentage}%
          </span>
        )}
      </div>

      {/* Barra de progresso */}
      <div 
        className="w-full overflow-hidden"
        style={{ 
          backgroundColor,
          height,
          borderRadius
        }}
      >
        <div
          className={`h-full ${animated ? 'transition-all duration-500 ease-out' : ''}`}
          style={{
            width: progressWidth,
            backgroundColor: color,
            borderRadius
          }}
        />
      </div>
    </div>
  );

  const renderStepsProgress = () => (
    <div className="w-full">
      {/* Números e porcentagem */}
      {(showNumbers || showPercentage) && (
        <div className={`flex justify-between items-center text-sm text-[#6B5B73] mb-4 text-${alignment}`}>
          {showNumbers && (
            <span className="font-medium">
              Questão {currentQuestion} de {totalQuestions}
            </span>
          )}
          {showPercentage && (
            <span className="font-medium">
              {percentage}%
            </span>
          )}
        </div>
      )}

      {/* Steps */}
      <div className="flex justify-between items-center">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const step = index + 1;
          const isActive = step <= currentQuestion;
          const isCurrent = step === currentQuestion;

          return (
            <div key={step} className="flex flex-col items-center">
              {/* Círculo do step */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${isActive 
                    ? 'text-white shadow-md' 
                    : 'text-[#6B5B73] border-2'
                  }
                  ${isCurrent ? 'ring-2 ring-offset-2' : ''}
                  ${animated ? 'transition-all duration-300' : ''}
                `}
                style={{
                  backgroundColor: isActive ? color : 'transparent',
                  borderColor: isActive ? color : backgroundColor,
                  ringColor: isCurrent ? color : 'transparent'
                }}
              >
                {step}
              </div>

              {/* Linha conectora (exceto último) */}
              {index < totalQuestions - 1 && (
                <div 
                  className={`w-full h-0.5 mt-4 ${animated ? 'transition-all duration-300' : ''}`}
                  style={{
                    backgroundColor: step < currentQuestion ? color : backgroundColor
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCircularProgress = () => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`flex flex-col items-center space-y-3 text-${alignment}`}>
        {/* Círculo SVG */}
        <div className="relative">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Círculo de fundo */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={backgroundColor}
              strokeWidth="8"
              fill="transparent"
            />
            {/* Círculo de progresso */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={color}
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={animated ? 'transition-all duration-500 ease-out' : ''}
            />
          </svg>
          
          {/* Porcentagem no centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-[#432818]">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Números */}
        {showNumbers && (
          <span className="text-sm font-medium text-[#6B5B73]">
            Questão {currentQuestion} de {totalQuestions}
          </span>
        )}
      </div>
    );
  };

  const renderProgress = () => {
    switch (progressBarStyle) {
      case 'circular':
        return renderCircularProgress();
      case 'steps':
        return renderStepsProgress();
      case 'linear':
      default:
        return renderLinearProgress();
    }
  };

  return (
    <div 
      className={`quiz-progress-block ${className}`}
      style={style}
      data-block-id={blockId}
    >
      <div className="py-4">
        {/* Título opcional */}
        {showTitle && title && (
          <h4 className={`text-lg font-semibold text-[#432818] mb-4 text-${alignment}`}>
            {title}
          </h4>
        )}
        
        {/* Progresso */}
        {renderProgress()}
      </div>
    </div>
  );
};

export default QuizProgressBlock;
