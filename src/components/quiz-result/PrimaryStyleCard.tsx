
import React from 'react';
import { StyleResult } from '@/types/quiz';

interface StyleConfig {
  image: string;
  guideImage: string;
  description: string;
}

const STYLE_CONFIGS: Record<string, StyleConfig> = {
  'Natural': {
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp",
    guideImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp",
    description: "Você valoriza o conforto e a praticidade, com um visual descontraído e autêntico."
  },
  'Clássico': {
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/1_jvqxub.webp",
    guideImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_CLASSICO_kpqzqx.webp",
    description: "Você aprecia a elegância atemporal, com peças de qualidade e caimento perfeito."
  },
  'Romântico': {
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_nvwnol.webp",
    guideImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_ROMANTICO_qjz8ld.webp",
    description: "Você valoriza a delicadeza e os detalhes femininos, com muita suavidade."
  }
} as const;

interface PrimaryStyleCardProps {
  primaryStyle: StyleResult;
}

export const PrimaryStyleCard: React.FC<PrimaryStyleCardProps> = ({ primaryStyle }) => {
  const styleConfig = STYLE_CONFIGS[primaryStyle.category] || STYLE_CONFIGS['Natural'];
  const guideImage = styleConfig.guideImage;

  return (
    <div className="bg-[#ffefec] p-6 rounded-lg text-center">
      <h3 className="text-2xl font-playfair text-[#aa6b5d] mb-4">
        {primaryStyle.category.toUpperCase()}
      </h3>
      
      <p className="text-[#432818]/80 mb-6">
        {styleConfig.description}
      </p>
      
      {guideImage && (
        <img
          src={guideImage}
          alt={`Guia do estilo ${primaryStyle.category}`}
          className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};
