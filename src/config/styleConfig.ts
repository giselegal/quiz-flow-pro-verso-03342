/**
 * 🎨 CONFIGURAÇÃO DOS ESTILOS PREDOMINANTES
 *
 * Cada estilo possui:
 * - image: Imagem representativa do estilo
 * - guideImage: Guia/tutorial específico do estilo
 * - description: Descrição personalizada do estilo
 * - category: Categoria do estilo para agrupamento
 * - keywords: Palavras-chave para busca e matching
 */

export interface StyleConfig {
  image: string;
  guideImage: string; // ✅ Obrigatório - Guia sempre necessário
  description: string;
  category: string;
  keywords: string[];
  specialTips: string[]; // ✅ Novo campo para dicas especiais
  [key: string]: any; // Allow dynamic property access
}

export interface StyleConfigMap {
  [key: string]: StyleConfig;
}

export const styleConfig: StyleConfigMap = {
  Natural: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
    guideImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp',
    description:
      'Você valoriza o conforto e a praticidade, com um visual descontraído e autêntico que reflete sua personalidade natural.',
    category: 'Conforto & Praticidade',
    keywords: ['conforto', 'praticidade', 'descontraído', 'autêntico', 'natural', 'casual'],
    specialTips: [
      'Invista em peças de algodão, linho e malha.',
      'Prefira cores neutras e terrosas.',
      'Aposte em acessórios discretos e funcionais.',
      'Mantenha um guarda-roupa versátil e confortável.',
    ],
  },
  Clássico: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
    guideImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_CL%C3%81SSICO_ux1yhf.webp',
    description: 'Você aprecia a elegância atemporal, com peças de qualidade e caimento perfeito.',
    category: 'Elegância Atemporal',
    keywords: ['elegância', 'sofisticação', 'atemporal', 'clássico', 'refinado', 'tradicional'],
    specialTips: [
      'Invista em peças de alfaiataria e camisas bem cortadas.',
      'Prefira cores sóbrias como azul-marinho, branco e preto.',
      'Aposte em acessórios discretos e clássicos.',
      'Mantenha um guarda-roupa organizado e atemporal.',
    ],
  },
  Contemporâneo: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp',
    guideImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_CONTEMPOR%C3%82NEO_vcklxe.webp',
    description:
      'Você busca um equilíbrio entre o clássico e o moderno, com peças práticas e atuais.',
    category: 'Equilíbrio & Modernidade',
    keywords: ['contemporâneo', 'equilibrado', 'prático', 'atual', 'versátil', 'funcional'],
    specialTips: [
      'Invista em peças minimalistas com cortes modernos.',
      'Prefira cores neutras com pontos de cor.',
      'Aposte em acessórios geométricos e sofisticados.',
      'Mantenha um guarda-roupa versátil e atualizado.',
    ],
  },
  Elegante: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
    guideImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071342/GUIA_ELEGANTE_asez1q.webp',
    description: 'Você tem um olhar refinado para detalhes sofisticados e peças de alta qualidade.',
    category: 'Refinamento & Qualidade',
    keywords: ['elegante', 'refinado', 'sofisticado', 'qualidade', 'luxo', 'distinto'],
    specialTips: [
      'Invista em peças de tecidos nobres como seda e crepe.',
      'Prefira cores clássicas como branco, preto, bege e off-white.',
      'Aposte em acessórios finos e discretos.',
      'Mantenha um guarda-roupa sofisticado e impecável.',
    ],
  },
  Romântico: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp',
    guideImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_ROM%C3%82NTICO_ci4hgk.webp',
    description: 'Você valoriza a delicadeza e os detalhes femininos, com muita suavidade.',
    category: 'Delicadeza & Feminilidade',
    keywords: ['romântico', 'delicado', 'feminino', 'suave', 'encantador', 'doce'],
    specialTips: [
      'Invista em peças com rendas, laços e babados.',
      'Prefira cores suaves e pastéis.',
      'Aposte em acessórios delicados e femininos.',
      'Mantenha um guarda-roupa leve e encantador.',
    ],
  },
  Sexy: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp',
    guideImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071349/GUIA_SEXY_t5x2ov.webp',
    description: 'Você gosta de valorizar suas curvas e exibir sua sensualidade com confiança.',
    category: 'Sensualidade & Confiança',
    keywords: ['sexy', 'sensual', 'confiante', 'ousado', 'sedutor', 'empoderado'],
    specialTips: [
      'Invista em peças justas e decotadas na medida certa.',
      'Prefira cores intensas como vermelho e preto.',
      'Aposte em acessórios marcantes e sedutores.',
      'Mantenha um guarda-roupa ousado e poderoso.',
    ],
  },
  Dramático: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp',
    guideImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1745073346/GUIA_DRAM%C3%81TICO_mpn60d.webp',
    description: 'Você tem personalidade forte e gosta de causar impacto com seu visual.',
    category: 'Impacto & Presença',
    keywords: ['dramático', 'marcante', 'impactante', 'presença', 'ousado', 'statement'],
    specialTips: [
      'Invista em peças estruturadas e de design arrojado.',
      'Prefira cores contrastantes e vibrantes.',
      'Aposte em acessórios grandes e de impacto.',
      'Mantenha um guarda-roupa ousado e marcante.',
    ],
  },
  Criativo: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp',
    guideImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071342/GUIA_CRIATIVO_ntbzph.webp',
    description: 'Você aprecia a originalidade e não tem medo de ousar em combinações únicas.',
    category: 'Expressão & Individualidade',
    keywords: ['criativo', 'único', 'artístico', 'individual', 'expressivo', 'original'],
    specialTips: [
      'Invista em peças diferentes e estampadas.',
      'Prefira cores contrastantes e combinações inusitadas.',
      'Aposte em acessórios criativos e divertidos.',
      'Mantenha um guarda-roupa original e cheio de personalidade.',
    ],
  },
} as const;

/**
 * 🔧 UTILITÁRIOS PARA TRABALHAR COM ESTILOS
 */

// Obter estilo por palavra-chave
export const getStyleByKeyword = (keyword: string): string | null => {
  const lowercaseKeyword = keyword.toLowerCase();
  for (const [styleName, config] of Object.entries(styleConfig)) {
    if (config.keywords.some(k => k.toLowerCase().includes(lowercaseKeyword))) {
      return styleName;
    }
  }
  return null;
};

// Obter todos os estilos por categoria
export const getStylesByCategory = (category: string): string[] => {
  return Object.entries(styleConfig)
    .filter(([, config]) => config.category === category)
    .map(([styleName]) => styleName);
};

// Obter configuração completa de um estilo
export const getStyleConfig = (styleName: string): StyleConfig | null => {
  const config = styleConfig[styleName];
  if (!config) return null;

  return {
    ...config,
    specialTips: config.specialTips ?? [], // ✅ garante que sempre exista
  };
};

// Lista de todos os estilos disponíveis
export const availableStyles = Object.keys(styleConfig) as Array<keyof typeof styleConfig>;
