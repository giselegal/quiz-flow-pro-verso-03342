import { cn } from '@/lib/utils';

interface QuizResultComponentProps {
  data: {
    primaryStyleTitle?: string;
    secondaryStylesTitle?: string;
    showPercentages?: boolean;
    showDescriptions?: boolean;
    resultLayout?: 'classic' | 'modern' | 'minimal';
    [key: string]: any;
  };
  style?: {
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    [key: string]: any;
  };
  isSelected?: boolean;
}

const QuizResultComponent: React.FC<QuizResultComponentProps> = ({ data, style, isSelected }) => {
  const accentColor = style?.accentColor || '#B89B7A';

  return (
    <div
      className={cn('p-4', isSelected && 'outline-dashed outline-1 outline-blue-400')}
      style={{
        backgroundColor: style?.backgroundColor || 'transparent',
        color: style?.textColor || 'inherit',
      }}
    >
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-medium mb-1">
          {data.primaryStyleTitle || 'Seu estilo predominante é'}
        </h2>
        <div className="text-3xl font-bold mt-2" style={{ color: accentColor }}>
          Elegante
        </div>
        {data.showPercentages && <div className="mt-1 font-medium">65%</div>}

        {data.showDescriptions && (
          <p style={{ color: '#6B4F43' }}>
            Você se destaca pela sofisticação e refinamento em suas escolhas.
          </p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4 text-center">
          {data.secondaryStylesTitle || 'Seus estilos secundários'}
        </h3>

        <div className="space-y-3">
          {['Clássico', 'Natural', 'Contemporâneo'].map((style, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="font-medium">{style}</span>
              {data.showPercentages && <span style={{ color: '#6B4F43' }}>{30 - index * 5}%</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizResultComponent;
