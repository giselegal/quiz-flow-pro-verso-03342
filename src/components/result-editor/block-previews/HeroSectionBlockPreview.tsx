import { StyleResult } from '@/types/quiz';

interface HeroSectionBlockPreviewProps {
  content: {
    title?: string;
    subtitle?: string;
    heroImage?: string;
    heroImage2?: string;
    style?: any;
  };
  primaryStyle: StyleResult;
}

const HeroSectionBlockPreview: React.FC<HeroSectionBlockPreviewProps> = ({
  content,
  primaryStyle,
}) => {
  return (
    <div className="bg-[#fff7f3] rounded-lg overflow-hidden" style={content.style}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="space-y-4 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-[#aa6b5d]">
            {content.title || 'VOCÊ DESCOBRIU SEU ESTILO'}
          </h2>

          <p className="text-[#1A1818]/80">
            {content.subtitle || 'Agora é hora de aplicar com clareza — e se vestir de você'}
          </p>

          <div className="bg-white p-4 rounded-lg inline-block">
            <p className="text-[#aa6b5d] font-medium">
              Seu estilo predominante é{' '}
              <span className="font-semibold">{primaryStyle.category}</span>
            </p>
          </div>
        </div>

        <div className="relative">
          {content.heroImage ? (
            <img src={content.heroImage} alt="Estilo" className="w-full h-auto rounded-lg" />
          ) : (
            <div style={{ backgroundColor: '#E5DDD5' }}>
              <p className="text-gray-400">Adicione uma imagem principal</p>
            </div>
          )}

          {content.heroImage2 && (
            <img
              src={content.heroImage2}
              alt="Gisele Galvão"
              className="absolute bottom-0 right-0 w-1/2 h-auto rounded-lg shadow-lg transform translate-x-1/4 translate-y-1/4"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionBlockPreview;
