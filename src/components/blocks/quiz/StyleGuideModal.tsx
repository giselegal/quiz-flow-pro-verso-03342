import { Button } from '@/components/ui/button';
import { styleConfig } from '@/data/styleConfig';
import { XIcon } from 'lucide-react';

interface StyleGuideModalProps {
  style: keyof typeof styleConfig;
  onClose: () => void;
}

const StyleGuideModal: React.FC<StyleGuideModalProps> = ({ style, onClose }) => {
  // Obter dados do estilo
  const styleData = styleConfig[style];

  if (!styleData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 bg-[#432818] text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Guia de Estilo {style}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-opacity-30"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow p-1">
          <img src={styleData.guideImage} alt={`Guia ${style}`} className="w-full h-auto" />
        </div>

        <div style={{ borderColor: '#E5DDD5' }}>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div>
              <h3 className="font-semibold text-[#432818]">{style}</h3>
              <p style={{ color: '#6B4F43' }}>{styleData.description}</p>
            </div>
            <Button onClick={onClose} className="bg-[#B89B7A] hover:bg-[#A08766] min-w-[120px]">
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleGuideModal;
