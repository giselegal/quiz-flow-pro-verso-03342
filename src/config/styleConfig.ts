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
  specialTips: string[]; // ✅ Perguntas persuasivas que geram desejo pela solução
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
      'Você já se perguntou quais tecidos realmente refletem seu estilo?',
      'Quais cores comunicam a sua essência de forma mais autêntica?',
      'O que torna um acessório verdadeiramente marcante em um look?',
      'E se o seu guarda‑roupa fosse tão versátil que funcionasse em qualquer ocasião?',
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
      'Como criar um guarda-roupa que nunca sai de moda?',
      'Quais peças de alfaiataria realmente fazem a diferença no seu visual?',
      'Qual o segredo de uma paleta de cores verdadeiramente sofisticada?',
      'E se você pudesse dominar a arte da elegância discreta?',
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
      'Como equilibrar perfeitamente o clássico e o moderno no seu visual?',
      'Quais cortes minimalistas realmente valorizam a sua silhueta?',
      'Quando adicionar um toque de cor estratégico faz toda a diferença?',
      'E se o seu estilo se adaptasse perfeitamente a qualquer ambiente?',
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
      'Qual o segredo dos tecidos nobres que transformam completamente um look?',
      'Como identificar peças de verdadeira qualidade e investimento?',
      'Quais detalhes sutis comunicam refinamento instantâneo?',
      'E se você dominasse a arte de se vestir com distinção natural?',
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
      'Como realçar sua feminilidade com delicadeza e sofisticação?',
      'Quais cores suaves realmente valorizam sua suavidade natural?',
      'Quando rendas e detalhes românticos elevam o seu visual?',
      'E se você pudesse expressar sua essência feminina com confiança?',
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
      'Como valorizar suas curvas com elegância e confiança?',
      'Qual o equilíbrio perfeito entre sensualidade e sofisticação?',
      'Quais cores intensificam seu poder de atração?',
      'E se você pudesse dominar a arte da sensualidade empoderada?',
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
      'Como criar looks que causam impacto memorável?',
      'Quais peças estruturadas realmente comandam atenção?',
      'Quando o contraste visual comunica poder e presença?',
      'E se você pudesse dominar a arte de nunca passar despercebida?',
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
      'Como expressar sua individualidade através do seu visual?',
      'Quais combinações inusitadas realmente funcionam com estilo?',
      'Quando ousar com estampas e cores cria looks memoráveis?',
      'E se você pudesse liberar toda a sua criatividade sem medo de errar?',
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
