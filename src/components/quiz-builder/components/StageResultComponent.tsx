// @ts-nocheck
import { QuizComponentData } from '@/types/quizBuilder';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StageResultComponentProps {
  data?: QuizComponentData['data'];
  style?: QuizComponentData['style'];
  isSelected?: boolean;
  onClick?: () => void;
}

const StageResultComponent: React.FC<StageResultComponentProps> = ({
  data = {},
  style = {},
  isSelected = false,
  onClick,
}) => {
  // Mock data for preview
  const mockPrimaryStyle = {
    category: 'Natural',
    percentage: 45.2,
  };

  const mockSecondaryStyles = [
    { category: 'Clássico', percentage: 32.1 },
    { category: 'Romântico', percentage: 22.7 },
  ];

  const {
    title = 'Seu Resultado de Estilo Pessoal',
    primaryStyleTitle = 'Seu estilo predominante é:',
    secondaryStylesTitle = 'Seus estilos complementares:',
    showPercentages = true,
    showDescriptions = true,
    callToActionText = 'Conhecer o Guia Completo',
    callToActionUrl = '#',
    backgroundColor = '#FFFAF0',
    textColor = '#432818',
  } = data;

  const resultStyle = {
    backgroundColor: backgroundColor || data.backgroundColor || '#FFFAF0',
    color: textColor || data.textColor || '#432818',
    ...style,
  };

  return (
    <Card
      className={`w-full min-h-[500px] p-6 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-[#B89B7A]' : ''
      }`}
      style={resultStyle}
      onClick={onClick}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-playfair font-bold mb-4">
            {title || data.title || 'Seu Resultado de Estilo Pessoal'}
          </h1>
        </div>

        {/* Primary Style */}
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4">
            {primaryStyleTitle || data.primaryStyleTitle || 'Seu estilo predominante é:'}
          </h2>

          <div className="inline-block bg-[#ffefec] px-6 py-4 rounded-lg">
            <h3 className="text-2xl font-playfair text-[#aa6b5d] mb-2">
              {mockPrimaryStyle.category.toUpperCase()}
            </h3>
            {(showPercentages || data.showPercentages) && (
              <p className="text-lg text-[#432818]/80">{mockPrimaryStyle.percentage}%</p>
            )}
            {(showDescriptions || data.showDescriptions) && (
              <p className="text-[#432818]/80 mt-2">
                Você valoriza o conforto e a praticidade, com um visual descontraído e autêntico.
              </p>
            )}
          </div>
        </div>

        {/* Secondary Styles */}
        <div>
          <h2 className="text-xl font-medium text-center mb-6">
            {secondaryStylesTitle || data.secondaryStylesTitle || 'Seus estilos complementares:'}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {mockSecondaryStyles.map((style, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-[#B89B7A]/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-[#432818]">{style.category}</span>
                  {(showPercentages || data.showPercentages) && (
                    <span className="text-[#B89B7A]">{Math.round(style.percentage)}%</span>
                  )}
                </div>
                {(showPercentages || data.showPercentages) && (
                  <div className="w-full h-2 bg-[#B89B7A]/20 rounded-full">
                    <div
                      className="h-full bg-[#B89B7A] rounded-full"
                      style={{ width: `${style.percentage}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button
            className="bg-[#B89B7A] hover:bg-[#A38A69] text-white px-8 py-3 text-lg"
            style={{
              backgroundColor: data.accentColor || '#B89B7A',
              color: data.buttonTextColor || 'white',
            }}
          >
            {callToActionText || data.callToActionText || 'Conhecer o Guia Completo'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StageResultComponent;
