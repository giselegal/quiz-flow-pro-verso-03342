/**
 * 🎨 CONFIGURAÇÃO DE CORES DA MARCA - PRETTIER
 *
 * PALETA OFICIAL:
 * - Principal: #B89B7A (Dourado elegante)
 * - Secundária: #D4C2A8 (Bege claro)
 * - Texto: #432818 (Marrom escuro)
 * - Neutros: Tons de stone/slate para interface
 *
 * CORES ESTRATÉGICAS:
 * - Verde: Apenas para CTAs de sucesso
 * - Vermelho: Apenas para CTAs de urgência/erro
 */

// ✅ CORES PRINCIPAIS DA MARCA
export const BRAND_COLORS = {
  // Cores primárias
  primary: '#B89B7A', // Dourado elegante
  primaryLight: '#D4C2A8', // Bege claro
  primaryDark: '#A38A69', // Dourado escuro

  // Cores de texto
  textPrimary: '#432818', // Marrom escuro
  textSecondary: '#6B7280', // Cinza médio
  textMuted: '#9CA3AF', // Cinza claro

  // Cores neutras (interface)
  neutral: {
    50: '#FAFAF9', // stone-50
    100: '#F5F5F4', // stone-100
    200: '#E7E5E4', // stone-200
    300: '#D6D3D1', // stone-300
    400: '#A8A29E', // stone-400
    500: '#78716C', // stone-500
    600: '#57534E', // stone-600
    700: '#44403C', // stone-700
    800: '#292524', // stone-800
    900: '#1C1917', // stone-900
  },

  // Cores de fundo
  background: {
    primary: '#FFFFFF', // Branco
    secondary: '#FAFAF9', // stone-50
    accent: '#F5F5F4', // stone-100
    brandLight: '#FAF9F7', // Bege muito claro
  },

  // Cores de borda
  border: {
    light: '#E7E5E4', // stone-200
    medium: '#D6D3D1', // stone-300
    brand: '#B89B7A', // Primary
    brandLight: '#D4C2A8', // Primary light
  },
};

// ✅ CORES ESTRATÉGICAS (uso limitado)
export const STRATEGIC_COLORS = {
  // Verde - apenas para CTAs de sucesso
  success: {
    primary: '#10B981', // emerald-500
    light: '#D1FAE5', // emerald-100
    dark: '#047857', // emerald-700
  },

  // Vermelho - apenas para CTAs de urgência/erro
  urgency: {
    primary: '#aa6b5d', // red-500
    light: '#FEE2E2', // red-100
    dark: '#432818', // red-600
  },

  // Amarelo - apenas para avisos
  warning: {
    primary: '#F59E0B', // amber-500
    light: '#FEF3C7', // amber-100
    dark: '#D97706', // amber-600
  },
};

// ✅ CLASSES TAILWIND DA MARCA
export const BRAND_CLASSES = {
  // Texto
  text: {
    primary: 'text-[#432818]',
    secondary: 'text-stone-600',
    muted: 'text-stone-500',
    brand: 'text-[#B89B7A]',
  },

  // Background
  bg: {
    primary: 'bg-white',
    secondary: 'bg-stone-50',
    accent: 'bg-stone-100',
    brand: 'bg-[#B89B7A]',
    brandLight: 'bg-[#B89B7A]/10',
    brandLighter: 'bg-[#FAF9F7]',
  },

  // Bordas
  border: {
    light: 'border-stone-200',
    medium: 'border-stone-300',
    brand: 'border-[#B89B7A]',
    brandLight: 'border-[#B89B7A]/30',
  },

  // Anéis (focus)
  ring: {
    brand: 'ring-[#B89B7A]',
    brandLight: 'ring-[#B89B7A]/30',
  },

  // Hover states
  hover: {
    brand: 'hover:bg-[#A38A69]',
    brandLight: 'hover:bg-[#B89B7A]/20',
    secondary: 'hover:bg-stone-100',
  },
};

// ✅ MAPEAMENTO DE CORES ANTIGAS PARA NOVAS
export const COLOR_MIGRATION = {
  // Azul → Brand
  'bg-blue-50': 'bg-[#B89B7A]/10',
  'bg-blue-100': 'bg-[#B89B7A]/20',
  'bg-blue-500': 'bg-[#B89B7A]',
  'bg-blue-600': 'bg-[#A38A69]',
  'text-blue-600': 'text-[#B89B7A]',
  'text-blue-700': 'text-[#A38A69]',
  'text-blue-900': 'text-[#432818]',
  'border-blue-200': 'border-[#B89B7A]/30',
  'border-blue-300': 'border-[#B89B7A]/40',
  'border-blue-500': 'border-[#B89B7A]',
  'ring-blue-500': 'ring-[#B89B7A]',

  // Cores da marca já corretas (mantém)
  'bg-[#B89B7A]/10': 'bg-[#B89B7A]/10',
  'bg-[#B89B7A]/20': 'bg-[#B89B7A]/20',
  'bg-[#B89B7A]': 'bg-[#B89B7A]',
  'bg-[#A38A69]': 'bg-[#A38A69]',
  'text-[#B89B7A]': 'text-[#B89B7A]',
  'text-[#A38A69]': 'text-[#A38A69]',
  'text-[#432818]': 'text-[#432818]',
  'border-[#B89B7A]/30': 'border-[#B89B7A]/30',
  'border-[#B89B7A]/40': 'border-[#B89B7A]/40',
  'border-[#B89B7A]': 'border-[#B89B7A]',
  'ring-[#B89B7A]': 'ring-[#B89B7A]',

  // Amarelo → Neutro (exceto warning)
  'bg-yellow-100': 'bg-stone-100',
  'text-yellow-800': 'text-stone-700',

  // Laranja → Brand
  'bg-orange-100': 'bg-[#B89B7A]/10',
  'border-orange-400': 'border-[#B89B7A]/40',
  'text-orange-600': 'text-[#B89B7A]',

  // Roxo → Brand
  'text-purple-600': 'text-[#B89B7A]',

  // Verde → Manter para sucesso
  'bg-green-100': 'bg-green-100',
  'text-green-800': 'text-green-800',

  // Vermelho → Manter para erro
  'bg-red-100': 'bg-red-100',
  'text-red-800': 'text-red-800',
};

// ✅ FUNÇÃO PARA MIGRAR CORES
export const migrateColor = (oldColor: string): string => {
  return (COLOR_MIGRATION as Record<string, string>)[oldColor] || oldColor;
};

// ✅ VALIDADOR DE CORES DA MARCA
export const validateBrandColor = (color: string): boolean => {
  const allowedColors = [
    ...Object.values(BRAND_COLORS).flat(),
    ...Object.values(STRATEGIC_COLORS).flat(),
    '#FFFFFF',
    '#000000', // Branco e preto sempre permitidos
  ];

  return allowedColors.includes(color);
};
