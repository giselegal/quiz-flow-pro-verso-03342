export const BRAND_COLORS = {
  // Gradiente dourado principal
  gold: {
    50: '#FFFBEB',
    100: '#FEF3C7', 
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Dourado principal
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F'
  },
  
  // Cores complementares
  primary: {
    50: '#FAF9F7',
    100: '#F5F2ED',
    200: '#E5DDD5',
    300: '#D4C4B0',
    400: '#B89B7A', // Cor atual mantida
    500: '#A0845C',
    600: '#8B6F47',
    700: '#6B4F43', // Cor atual mantida
    800: '#432818', // Cor atual mantida
    900: '#2D1B0F'
  },
  
  // Gradientes
  gradients: {
    gold: 'linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FF8C00 50%, #DAA520 75%, #B8860B 100%)',
    goldHover: 'linear-gradient(135deg, #FFED4E 0%, #FFB84D 25%, #FF9F40 50%, #E6B800 75%, #CC9900 100%)',
    primary: 'linear-gradient(135deg, #B89B7A 0%, #A0845C 50%, #8B6F47 100%)',
  }
};

export const BRAND_STYLES = {
  logoGradient: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent',
  buttonGold: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 hover:from-yellow-300 hover:via-orange-400 hover:to-yellow-500',
  cardGold: 'border-gradient-to-r from-yellow-400/20 via-orange-500/20 to-yellow-600/20'
};