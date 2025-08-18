// @ts-nocheck
import { getOptimizedContainerClasses } from '@/config/containerConfig';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlockComponentProps, Alignment, InteractionCallbacks } from './types';

/**
 * StyleResultDisplay - Componente para exibição do resultado do estilo personalizado
 *
 * Mostra o resultado do quiz de estilo com imagem, nome do estilo, descrição,
 * porcentagem de compatibilidade e características do estilo.
 *
 * @example
 * <StyleResultDisplay
 *   styleName="Elegante Clássica"
 *   styleImage="https://example.com/style.jpg"
 *   styleDescription="Seu estilo combina elegância atemporal..."
 *   percentMatch={92}
 *   characteristics={['Sofisticada', 'Atemporal', 'Refinada']}
 *   onContinue={() => console.log('Continuar para oferta')}
 * />
 */

export interface StyleResultDisplayProps extends BlockComponentProps, InteractionCallbacks {
  // Conteúdo do resultado
  styleName: string;
  styleImage: string;
  styleDescription: string;
  percentMatch?: number; // 0-100

  // Características do estilo
  characteristics?: string[];
  styleKeywords?: string[];

  // Configurações visuais
  showPercentage?: boolean;
  showCharacteristics?: boolean;
  imageSize?: 'small' | 'medium' | 'large';

  // Conteúdo adicional
  congratulationsText?: string;
  subtitleText?: string;

  // Botão de ação
  showContinueButton?: boolean;
  continueButtonText?: string;

  // Callbacks
  onContinue?: () => void;
}

export const StyleResultDisplay: React.FC<StyleResultDisplayProps> = props => {
  const {
    // Conteúdo
    styleName,
    styleImage,
    styleDescription,
    percentMatch = 92,

    // Características
    characteristics = [],
    styleKeywords = [],

    // Configurações
    alignment = 'center',
    showPercentage = true,
    showCharacteristics = true,
    imageSize = 'large',

    // Textos
    congratulationsText = 'Parabéns! Descobrimos seu estilo único:',
    subtitleText = 'Baseado nas suas respostas, criamos um perfil personalizado para você',

    // Botão
    showContinueButton = true,
    continueButtonText = 'Ver Minha Transformação',

    // Callbacks
    onContinue,

    // Props base
    deviceView = 'desktop',
    className = '',
    style = {},
    testId = 'style-result-display',
  } = props;
  // Classes de tamanho da imagem
  const imageSizeClasses = {
    small: 'w-48 h-48 md:w-56 md:h-56',
    medium: 'w-64 h-64 md:w-80 md:h-80',
    large: 'w-80 h-80 md:w-96 md:h-96',
  };

  // Classes de alinhamento
  const alignmentClasses: Record<Alignment, string> = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  // Cores baseadas na porcentagem
  const getPercentageColor = (percent: number) => {
    if (percent >= 90) return 'text-green-600 bg-green-100';
    if (percent >= 80) return 'text-[#B89B7A] bg-[#B89B7A]/20';
    if (percent >= 70) return 'text-stone-600 bg-stone-100';
    return 'text-gray-600 bg-gray-100';
  };

  const containerClasses = getOptimizedContainerClasses(
    deviceView || 'desktop',
    'tight',
    'full',
    className
  );

  return (
    <div className={containerClasses} style={style} data-testid={testId}>
      <div className="max-w-full mx-auto w-full">
        {/* Texto de Congratulações */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#432818] mb-4">
            {congratulationsText}
          </h1>

          {subtitleText && <p style={{ color: '#6B4F43' }}>{subtitleText}</p>}
        </div>

        {/* Card Principal do Resultado */}
        <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-0">
            <div
              className={`
              flex flex-col 
              ${deviceView === 'desktop' ? 'lg:flex-row' : ''}
              items-center
            `}
            >
              {/* Imagem do Estilo */}
              <div
                className={`
                flex-shrink-0 p-8
                ${deviceView === 'desktop' ? 'lg:w-1/2' : 'w-full'}
              `}
              >
                <div className="relative">
                  <img
                    src={styleImage}
                    alt={`Estilo ${styleName}`}
                    className={`
                      ${imageSizeClasses[imageSize]}
                      mx-auto object-cover rounded-2xl shadow-lg
                    `}
                  />

                  {/* Badge de Porcentagem */}
                  {showPercentage && (
                    <div className="absolute -top-4 -right-4">
                      <div
                        className={`
                        px-4 py-2 rounded-full font-bold text-lg shadow-lg
                        ${getPercentageColor(percentMatch)}
                      `}
                      >
                        {percentMatch}% Match
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Conteúdo do Resultado */}
              <div
                className={`
                flex-1 p-8
                ${deviceView === 'desktop' ? 'lg:w-1/2' : 'w-full'}
              `}
              >
                {/* Nome do Estilo */}
                <h2 className="text-4xl md:text-5xl font-bold text-[#B89B7A] mb-6">{styleName}</h2>

                {/* Descrição */}
                <p style={{ color: '#6B4F43' }}>{styleDescription}</p>

                {/* Características */}
                {showCharacteristics && characteristics.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-[#432818] mb-4">
                      Suas características de estilo:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {characteristics.map((characteristic, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-4 py-2 text-sm bg-[#B89B7A]/10 text-[#432818] border border-[#B89B7A]/20"
                        >
                          {characteristic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Palavras-chave do Estilo */}
                {styleKeywords.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-[#432818] mb-3">
                      Palavras que definem seu estilo:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {styleKeywords.map((keyword, index) => (
                        <span key={index} style={{ color: '#6B4F43' }}>
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Indicador de Compatibilidade Detalhado */}
                {showPercentage && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span style={{ color: '#6B4F43' }}>Compatibilidade</span>
                      <span className="text-sm font-bold text-[#B89B7A]">{percentMatch}%</span>
                    </div>
                    <div style={{ backgroundColor: '#E5DDD5' }}>
                      <div
                        className="bg-gradient-to-r from-[#B89B7A] to-[#D4B896] h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${percentMatch}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão de Continuar */}
        {showContinueButton && (
          <div className="mt-12 text-center">
            <button
              onClick={onContinue}
              className={`
                px-12 py-6 text-xl font-bold rounded-xl
                bg-gradient-to-r from-[#B89B7A] to-[#D4B896]
                hover:from-[#A08766] hover:to-[#C4A886]
                text-white shadow-lg hover:shadow-xl
                transform hover:scale-105 transition-all duration-200
                ${deviceView === 'mobile' ? 'w-full text-lg px-8 py-4' : ''}
              `}
              data-testid="continue-button"
            >
              {continueButtonText}
            </button>

            <p style={{ color: '#8B7355' }}>
              Veja como transformar seu guarda-roupa com esse estilo
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleResultDisplay;
