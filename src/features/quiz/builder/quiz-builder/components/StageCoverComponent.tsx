import { QuizComponentData } from '@/types/quizBuilder';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StageCoverComponentProps {
  data?: QuizComponentData['data'];
  style?: QuizComponentData['style'];
  isSelected?: boolean;
  onClick?: () => void;
}

const StageCoverComponent: React.FC<StageCoverComponentProps> = ({
  data = {},
  style = {},
  isSelected = false,
  onClick,
}) => {
  const {
    title = 'Título da Capa',
    subtitle = 'Subtítulo da capa',
    buttonText = 'Iniciar Quiz',
    backgroundColor = '#FFFAF0',
    textColor = '#432818',
  } = data;

  const backgroundStyle = {
    backgroundColor: backgroundColor || data.backgroundColor || '#FFFAF0',
    color: textColor || data.textColor || '#432818',
    ...style,
  };

  return (
    <Card
      className={`w-full min-h-[400px] flex items-center justify-center cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-[#B89B7A]' : ''
      }`}
      style={backgroundStyle}
      onClick={onClick}
    >
      <div className="text-center space-y-6 p-8">
        <h1
          className="text-3xl md:text-4xl font-playfair font-bold"
          style={{ color: textColor || data.textColor || '#432818' }}
        >
          {title || data.title || 'Título da Capa'}
        </h1>

        <p
          className="text-lg md:text-xl"
          style={{ color: textColor || data.textColor || '#432818' }}
        >
          {subtitle || data.subtitle || 'Subtítulo da capa'}
        </p>

        <Button
          className="bg-[#B89B7A] hover:bg-[#A38A69] text-white px-8 py-3 text-lg"
          style={{
            backgroundColor: data.buttonColor || '#B89B7A',
            color: data.buttonTextColor || 'white',
          }}
        >
          {buttonText || data.buttonText || 'Iniciar Quiz'}
        </Button>
      </div>
    </Card>
  );
};

export default StageCoverComponent;
