import { StyleResult } from '@/types/quiz';

interface SecondaryStylesSectionProps {
  secondaryStyles: StyleResult[];
}

const SecondaryStylesSection: React.FC<SecondaryStylesSectionProps> = ({ secondaryStyles }) => {
  // Animações removidas; usar apenas transições CSS leves

  return (
    <div className="space-y-3 p-5 bg-[#fffaf7] rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-[#432818] relative inline-block">
          <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-[#B89B7A] to-transparent rounded-full" />
          Estilos Complementares
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {secondaryStyles.slice(0, 2).map((style) => (
          <div
            key={style.category}
            className="p-3 bg-white rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md transform"
          >
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1.5">
                <h4 className="text-sm font-medium text-[#432818]">
                  {style.category}
                </h4>
                <span className="text-xs font-semibold text-[#aa6b5d] bg-[#fffaf7] px-2 py-0.5 rounded-full">
                  {style.percentage}%
                </span>
              </div>

              <div className="w-full bg-[#FAF9F7] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] h-2 rounded-full relative"
                  style={{ width: `${style.percentage}%` }}
                >
                  <div className="absolute top-0 right-0 h-full w-4 bg-white/30" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecondaryStylesSection;
