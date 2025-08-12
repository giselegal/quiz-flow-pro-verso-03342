/* @ts-nocheck */
// @ts-nocheck
import { getOptimizedContainerClasses } from '@/config/containerConfig';
import { cn } from '@/lib/utils';
import { StyleResult } from '@/types/quiz';

interface PrimaryStyleDisplayProps {
  primaryStyle: StyleResult;
  onClick?: () => void;
  className?: string;
}

const PrimaryStyleDisplay: React.FC<PrimaryStyleDisplayProps> = ({
  primaryStyle,
  onClick,
  className,
}) => {
  const getStyleConfig = (category: string) => {
    const configs = {
      natural: {
        title: 'Natural',
        description: 'Você valoriza o conforto e a praticidade no seu dia a dia.',
        colors: ['#8B7355', '#A0956C', '#6B5B73'],
        image:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp',
      },
      classico: {
        title: 'Clássico',
        description: 'Você aprecia elegância atemporal e sofisticação.',
        colors: ['#2C3E50', '#34495E', '#7F8C8D'],
        image:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp',
      },
      contemporaneo: {
        title: 'Contemporâneo',
        description: 'Você gosta de estar atualizado e seguir as tendências.',
        colors: ['#3498DB', '#2980B9', '#1ABC9C'],
        image:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp',
      },
      elegante: {
        title: 'Elegante',
        description: 'Você valoriza a sofisticação e o requinte.',
        colors: ['#8E44AD', '#9B59B6', '#6C3483'],
        image:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp',
      },
      romantico: {
        title: 'Romântico',
        description: 'Você aprecia detalhes delicados e femininos.',
        colors: ['#E91E63', '#F06292', '#EC407A'],
        image:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp',
      },
      sexy: {
        title: 'Sexy',
        description: 'Você gosta de valorizar suas curvas.',
        colors: ['#E74C3C', '#C0392B', '#922B21'],
        image:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp',
      },
      dramatico: {
        title: 'Dramático',
        description: 'Você busca impactar e chamar atenção.',
        colors: ['#2C3E50', '#34495E', '#17202A'],
        image:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp',
      },
      criativo: {
        title: 'Criativo',
        description: 'Você adora expressar sua individualidade.',
        colors: ['#F39C12', '#E67E22', '#D35400'],
        image:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp',
      },
    };

    return configs[category.toLowerCase() as keyof typeof configs] || configs.natural;
  };

  const config = getStyleConfig(primaryStyle.category);

  return (
    <div
      className={cn(
        'bg-gradient-to-br from-[#FAF9F7] via-[#F5F2ED] to-[#F0EDE6] p-8 rounded-2xl shadow-lg transition-all duration-300',
        onClick && 'cursor-pointer hover:shadow-xl hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#B89B7A] to-[#aa6b5d] rounded-full mb-6 shadow-lg">
          <span className="text-2xl font-bold text-white">
            {Math.round(primaryStyle.percentage)}%
          </span>
        </div>

        <h2 className="text-3xl font-bold text-[#432818] mb-3">{config.title}</h2>

        <div className="w-16 h-1 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] mx-auto rounded-full mb-4" />

        <p className="text-lg text-[#6B5B4D] leading-relaxed max-w-md mx-auto">
          {config.description}
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <img
          src={config.image}
          alt={`Estilo ${config.title}`}
          className="max-w-full h-auto rounded-xl shadow-md transition-transform duration-300 hover:scale-105"
          loading="eager"
          fetchPriority="high"
          width="400"
          height="300"
          onClick={onClick}
        />
      </div>

      <div className="flex justify-center space-x-3 mb-6">
        {config.colors.map((color, index) => (
          <div
            key={index}
            className="w-8 h-8 rounded-full shadow-md border-2 border-white"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="text-center">
        <div className="inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full border border-[#B89B7A]/20 shadow-sm">
          <span className="text-sm font-medium text-[#432818]">
            Compatibilidade:{' '}
            <span className="font-bold">{Math.round(primaryStyle.percentage)}%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PrimaryStyleDisplay;
