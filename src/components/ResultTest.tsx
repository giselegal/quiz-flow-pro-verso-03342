import { styleConfig } from '@/config/styleConfig';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Dados mock para teste
const mockResult = {
  primaryStyle: {
    category: 'Elegante',
    score: 25,
    percentage: 45,
  },
  secondaryStyles: [
    {
      category: 'Clássico',
      score: 15,
      percentage: 27,
    },
    {
      category: 'Contemporâneo',
      score: 10,
      percentage: 18,
    },
  ],
};

const ResultTest: React.FC = () => {
  const { category, percentage } = mockResult.primaryStyle;
  const styleData = styleConfig[category as keyof typeof styleConfig];

  if (!styleData) {
    return <div>Estilo não encontrado: {category}</div>;
  }

  const { image, guideImage, description } = styleData;

  return (
    <div className="min-h-screen bg-[#fffaf7] p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="p-6 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#432818] mb-4">
              Teste do Componente de Resultado
            </h1>
            <h2 className="text-xl text-[#aa6b5d] mb-4">Seu Estilo Predominante: {category}</h2>

            {/* Barra de progresso */}
            <div className="max-w-md mx-auto mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#8F7A6A]">Seu estilo predominante</span>
                <span className="text-[#aa6b5d] font-medium">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2 bg-[#F3E8E6]" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {/* Descrição do estilo */}
              <p className="text-[#432818] leading-relaxed">{description}</p>

              {/* Estilos secundários */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-[#B89B7A]/10">
                <h3 className="text-lg font-medium text-[#432818] mb-2">
                  Estilos que Também Influenciam Você
                </h3>
                <div className="space-y-2">
                  {mockResult.secondaryStyles.map((style, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-[#432818]">{style.category}</span>
                      <span className="text-sm font-semibold text-[#aa6b5d]">
                        {style.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Imagem do estilo */}
            <div className="max-w-[238px] mx-auto relative">
              <img
                src={`${image}?q=auto:best&f=auto&w=238`}
                alt={`Estilo ${category}`}
                className="w-full h-auto rounded-lg shadow-md"
                onError={e => {
                  console.error('Erro ao carregar imagem:', e);
                  console.log('URL:', `${image}?q=auto:best&f=auto&w=238`);
                }}
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#B89B7A]"></div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#B89B7A]"></div>
            </div>
          </div>

          {/* Imagem do guia */}
          <div className="mt-8 max-w-[540px] mx-auto relative">
            <img
              src={`${guideImage}?q=auto:best&f=auto&w=540`}
              alt={`Guia de Estilo ${category}`}
              className="w-full h-auto rounded-lg shadow-md"
              onError={e => {
                console.error('Erro ao carregar imagem do guia:', e);
                console.log('URL do guia:', `${guideImage}?q=auto:best&f=auto&w=540`);
              }}
            />
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium transform rotate-12">
              Exclusivo
            </div>
          </div>
        </Card>

        {/* Debug info */}
        <Card style={{ backgroundColor: '#E5DDD5' }}>
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(
              {
                category,
                percentage,
                image,
                guideImage,
                description,
                secondaryStyles: mockResult.secondaryStyles,
              },
              null,
              2
            )}
          </pre>
        </Card>
      </div>
    </div>
  );
};

export default ResultTest;
