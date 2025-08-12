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
  },
  Clássico: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
    guideImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_CL%C3%81SSICO_ux1yhf.webp',
    description: 'Você aprecia a elegância atemporal, com peças de qualidade e caimento perfeito.',
    category: 'Elegância Atemporal',
    keywords: ['elegância', 'sofisticação', 'atemporal', 'clássico', 'refinado', 'tradicional'],
  },
  Contemporâneo: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp',
    guideImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_CONTEMPOR%C3%82NEO_vcklxe.webp',
    description:
      'Você busca um equilíbrio entre o clássico e o moderno, com peças práticas e atuais.',
    category: 'Equilíbrio & Modernidade',
    keywords: ['contemporâneo', 'equilibrado', 'prático', 'atual', 'versátil', 'funcional'],
  },
  Elegante: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
    guideImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071342/GUIA_ELEGANTE_asez1q.webp',
    description: 'Você tem um olhar refinado para detalhes sofisticados e peças de alta qualidade.',
    category: 'Refinamento & Qualidade',
    keywords: ['elegante', 'refinado', 'sofisticado', 'qualidade', 'luxo', 'distinto'],
  },
  Romântico: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp',
    guideImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_ROM%C3%82NTICO_ci4hgk.webp',
    description: 'Você valoriza a delicadeza e os detalhes femininos, com muita suavidade.',
    category: 'Delicadeza & Feminilidade',
    keywords: ['romântico', 'delicado', 'feminino', 'suave', 'encantador', 'doce'],
  },
  Sexy: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp',
    guideImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071349/GUIA_SEXY_t5x2ov.webp',
    description: 'Você gosta de valorizar suas curvas e exibir sua sensualidade com confiança.',
    category: 'Sensualidade & Confiança',
    keywords: ['sexy', 'sensual', 'confiante', 'ousado', 'sedutor', 'empoderado'],
  },
  Dramático: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp',
    guideImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1745073346/GUIA_DRAM%C3%81TICO_mpn60d.webp',
    description: 'Você tem personalidade forte e gosta de causar impacto com seu visual.',
    category: 'Impacto & Presença',
    keywords: ['dramático', 'marcante', 'impactante', 'presença', 'ousado', 'statement'],
  },
  Criativo: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp',
    guideImage:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071342/GUIA_CRIATIVO_ntbzph.webp',
    description: 'Você aprecia a originalidade e não tem medo de ousar em combinações únicas.',
    category: 'Expressão & Individualidade',
    keywords: ['criativo', 'único', 'artístico', 'individual', 'expressivo', 'original'],
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
  return styleConfig[styleName] || null;
};

// Lista de todos os estilos disponíveis
export const availableStyles = Object.keys(styleConfig) as Array<keyof typeof styleConfig>;
