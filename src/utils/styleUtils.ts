import { StyleResult } from '@/types/quiz';

// Define StyleCategory to match existing types
export type StyleCategory =
  | 'Natural'
  | 'Clássico'
  | 'Contemporâneo'
  | 'Elegante'
  | 'Romântico'
  | 'Sexy'
  | 'Dramático'
  | 'Criativo';

export const getStyleColor = (category: StyleCategory): string => {
  const colorMap: Record<StyleCategory, string> = {
    Natural: '#8F7A6A',
    Contemporâneo: '#B89B7A',
    Clássico: '#432818',
    Elegante: '#AA6B5D',
    Romântico: '#D4A5A5',
    Sexy: '#9E2B2B',
    Dramático: '#2B2B2B',
    Criativo: '#F0A500',
  };

  return colorMap[category] || '#B89B7A';
};

export const getStyleConfig = (category: StyleCategory) => {
  return (
    {
      Natural: {
        name: 'Natural',
        description: 'Seu estilo é caracterizado pela simplicidade e conforto.',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/1_srgjwx.webp',
      },
      Contemporâneo: {
        name: 'Contemporâneo',
        description: 'Você combina modernidade com praticidade.',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
      },
      Clássico: {
        name: 'Clássico',
        description: 'Seu estilo é atemporal e elegante.',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
      },
      Elegante: {
        name: 'Elegante',
        description: 'Você valoriza sofisticação e refinamento.',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
      },
      Romântico: {
        name: 'Romântico',
        description: 'Seu estilo é delicado e feminino.',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp',
      },
      Sexy: {
        name: 'Sexy',
        description: 'Você valoriza a sensualidade e confiança.',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp',
      },
      Dramático: {
        name: 'Dramático',
        description: 'Seu estilo é marcante e impactante.',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp',
      },
      Criativo: {
        name: 'Criativo',
        description: 'Você expressa originalidade e experimentação.',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp',
      },
    }[category] || {
      name: category,
      description: 'Seu estilo único e pessoal.',
      image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/1_srgjwx.webp',
    }
  );
};

// Add the missing getFallbackStyle function
export const getFallbackStyle = (styleCategory: string): React.CSSProperties => {
  const backgroundColor = getStyleColor(styleCategory as StyleCategory);

  return {
    backgroundColor,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    padding: '10px',
  };
};

// Add the getDefaultStyle function needed by EditorPage
export const getDefaultStyle = (): StyleResult => {
  return {
    category: 'Natural' as StyleCategory,
    score: 100,
    percentage: 100,
    style: 'natural',
    points: 100,
    rank: 1,
  };
};

export const createStyleResult = (category: string, score: number): StyleResult => {
  // Validate category is one of the allowed values
  const validCategories: StyleCategory[] = [
    'Natural',
    'Clássico',
    'Contemporâneo',
    'Elegante',
    'Romântico',
    'Sexy',
    'Dramático',
    'Criativo',
  ];
  const validatedCategory = validCategories.includes(category as StyleCategory)
    ? (category as StyleCategory)
    : 'Natural';

  return {
    category: validatedCategory,
    score,
    percentage: Math.round((score / 10) * 100),
    style: validatedCategory.toLowerCase(),
    points: score,
    rank: 1,
  };
};
