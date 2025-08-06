export interface StyleConfig {
  image: string;
  guideImage?: string;
  description: string;
  [key: string]: any; // Allow dynamic property access
}

export interface StyleConfigMap {
  [key: string]: StyleConfig;
}

export const styleConfig: StyleConfigMap = {
  Natural: {
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp",
    guideImage:
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp",
    description:
      "Você valoriza o conforto e a praticidade, com um visual descontraído e autêntico que reflete sua personalidade natural.",
  },
  Clássico: {
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/1_wzxvpz.webp",
    description:
      "Você aprecia a elegância e a sofisticação, com peças atemporais que nunca saem de moda.",
  },
  Moderno: {
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_zt8qpb.webp",
    description: "Você está sempre na vanguarda da moda, com um estilo contemporâneo e inovador.",
  },
  Romântico: {
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_hbwgzt.webp",
    description:
      "Você tem uma alma delicada e feminina, com preferência por peças suaves e detalhes encantadores.",
  },
  Criativo: {
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_vlvmgm.webp",
    description:
      "Você expressa sua individualidade através da moda, com combinações únicas e artísticas.",
  },
  Dramático: {
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/6_j7vddl.webp",
    description:
      "Você tem uma presença marcante e gosta de peças impactantes que chamam a atenção.",
  },
} as const;
