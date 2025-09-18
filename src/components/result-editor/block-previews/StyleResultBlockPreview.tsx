import { StyleResult } from '@/types/quiz';

interface StyleResultBlockPreviewProps {
  content: {
    description?: string;
    customImage?: string;
  };
  primaryStyle: StyleResult;
}

const StyleResultBlockPreview: React.FC<StyleResultBlockPreviewProps> = ({
  content,
  primaryStyle,
}) => {
  const getStyleImage = (): string => {
    const defaultImage = 'https://placehold.co/600x400/png';
    return content.customImage || defaultImage;
  };

  return (
    <div className="p-6 bg-[#FAF9F7] rounded-lg">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-playfair text-[#432818]">
          Seu estilo predominante é <span className="font-bold">{primaryStyle.category}</span>
        </h3>
        <div className="inline-block bg-[#B89B7A] text-white px-4 py-1 rounded-full text-sm mt-2">
          {primaryStyle.percentage}% de compatibilidade
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <img
            src={getStyleImage()}
            alt={`Estilo ${primaryStyle.category}`}
            className="w-full h-auto object-cover rounded-lg shadow-sm"
          />
        </div>
        <div>
          <p className="text-[#5A5A5A] leading-relaxed">
            {content.description || `O estilo ${primaryStyle.category} é...`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StyleResultBlockPreview;
