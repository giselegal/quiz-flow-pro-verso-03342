import { StyleResult } from '@/types/quiz';

interface ResultPreviewProps {
  result: {
    primaryStyle: StyleResult;
    secondaryStyles: StyleResult[];
  };
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ result }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#432818] mb-4">Seu Resultado</h2>
        <div className="bg-white rounded-lg p-6 border border-[#B89B7A]/20">
          <h3 className="text-xl font-semibold text-[#432818] mb-2">
            {result.primaryStyle.category}
          </h3>
          <p className="text-[#8F7A6A] mb-4">
            {result.primaryStyle.percentage.toFixed(1)}% de compatibilidade
          </p>
        </div>
      </div>

      {result.secondaryStyles.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-[#432818] mb-3">Estilos Secundários</h4>
          <div className="grid gap-3">
            {result.secondaryStyles.map((style, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-[#B89B7A]/20">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#432818]">{style.category}</span>
                  <span className="text-[#8F7A6A]">{style.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPreview;
