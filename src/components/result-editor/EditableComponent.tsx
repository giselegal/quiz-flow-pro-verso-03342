// @ts-nocheck
import { StyleResult } from '@/types/quiz';
import { Card } from '@/components/ui/card';

interface EditableComponentProps {
  components: {
    primaryStyle: StyleResult;
    secondaryStyles: StyleResult[];
    config: any;
  };
  onUpdate: (section: string, data: any) => void;
}

const EditableComponent: React.FC<EditableComponentProps> = ({ components, onUpdate }) => {
  const { primaryStyle, secondaryStyles, config } = components;

  return (
    <div className="min-h-screen bg-[#FAF9F7] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="p-6">
          <div className="text-center">
            <h1 className="text-3xl font-playfair text-[#432818] mb-4">
              {config?.header?.content?.title || `Seu estilo é ${primaryStyle.category}`}
            </h1>
            <p className="text-lg text-[#1A1818]/80">
              Descubra as características únicas do seu estilo pessoal
            </p>
          </div>
        </Card>

        {/* Primary Style Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-medium text-[#432818] mb-4">
            Estilo Principal: {primaryStyle.category}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-[#1A1818]/70 mb-4">
                {config?.mainContent?.content?.description ||
                  `Você tem um estilo ${primaryStyle.category.toLowerCase()} único e autêntico.`}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-medium">{primaryStyle.score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Percentual:</span>
                  <span className="font-medium">{primaryStyle.percentage}%</span>
                </div>
              </div>
            </div>
            <div className="bg-[#FAF9F7] p-4 rounded-lg">
              <h3 className="font-medium mb-2">Características principais</h3>
              <ul className="text-sm text-[#1A1818]/70 space-y-1">
                <li>• Autenticidade no visual</li>
                <li>• Preferência por conforto</li>
                <li>• Estilo descontraído</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Secondary Styles */}
        {secondaryStyles.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-medium text-[#432818] mb-4">Estilos Secundários</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {secondaryStyles.map((style, index) => (
                <div key={index} className="bg-[#FAF9F7] p-4 rounded-lg">
                  <h3 className="font-medium mb-2">{style.category}</h3>
                  <div className="flex justify-between text-sm">
                    <span>Score:</span>
                    <span>{style.score}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Percentual:</span>
                    <span>{style.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Offer Section */}
        {config?.offer?.hero?.visible && (
          <Card className="p-6 bg-[#B89B7A]/10">
            <div className="text-center">
              <h2 className="text-2xl font-medium text-[#432818] mb-4">
                {config.offer.hero.content.title || 'Oferta Especial'}
              </h2>
              <p className="text-lg text-[#1A1818]/80 mb-6">
                {config.offer.hero.content.subtitle || 'Descubra mais sobre seu estilo'}
              </p>
              <button className="bg-[#B89B7A] text-white px-8 py-3 rounded-lg hover:bg-[#A38A69] transition-colors">
                Saiba Mais
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EditableComponent;
