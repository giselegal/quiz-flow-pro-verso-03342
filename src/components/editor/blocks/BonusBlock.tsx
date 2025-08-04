import React from 'react';
import { cn } from '@/lib/utils';
import { Gift } from 'lucide-react';

interface BonusBlockProps {
  title?: string;
  showImages?: boolean;
  className?: string;
}

const BonusBlock: React.FC<BonusBlockProps> = ({
  title = 'Bônus Exclusivos para Você',
  showImages = true,
  className,
}) => {
  // Dados reais dos bônus da ResultPage
  const bonuses = [
    {
      title: 'Peças-chave do Guarda-roupa',
      description:
        'Lista completa das peças essenciais que toda mulher deve ter no guarda-roupa, organizadas por estilo e ocasião.',
      image:
        'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp',
      value: 'R$ 79,00',
    },
    {
      title: 'Visagismo Facial',
      description: 'Guia completo de maquiagem e penteados ideais para o formato do seu rosto e estilo pessoal.',
      image:
        'https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp',
      value: 'R$ 29,00',
    },
  ];

  return (
    <div className={cn('py-10', className)}>
      <h2 className="text-2xl md:text-3xl font-bold text-[#aa6b5d] text-center mb-2">{title}</h2>
      <p className="text-center text-[#432818] mb-6 max-w-md mx-auto">
        Além do guia principal, você receberá estas ferramentas complementares para potencializar sua jornada de
        transformação:
      </p>
      <div className="w-32 h-1 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] mx-auto rounded-full mb-8"></div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {bonuses.map((bonus, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-[#B89B7A]/10 transform hover:scale-[1.02]"
            >
              {showImages && (
                <div className="flex justify-center mb-4">
                  <img
                    src={`${bonus.image}?q=auto:best&f=auto&w=300`}
                    alt={bonus.title}
                    className="w-full max-w-xs sm:max-w-sm h-auto rounded-lg shadow-sm hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    width={300}
                    height={420}
                  />
                </div>
              )}

              <h3 className="text-lg font-medium text-[#aa6b5d] mb-2 flex items-center">
                <Gift className="w-5 h-5 mr-2 text-[#B89B7A]" />
                {bonus.title}
              </h3>

              <p className="text-[#432818] text-sm leading-relaxed mb-3">{bonus.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-xs text-[#8F7A6A] bg-[#f9f4ef] px-3 py-1 rounded-full">Valor: {bonus.value}</span>
                <span className="text-[#B89B7A] font-semibold text-sm">🎁 GRÁTIS</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BonusBlock;
