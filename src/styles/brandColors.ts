export const BRAND_COLORS = {
  // Cores baseadas na imagem
  darkBlue: '#1A0F3D',
  mediumBlue: '#2E1A6B',
  lightBlue: '#4A2E9F',
  brightBlue: '#00BFFF',
  brightPink: '#FF00FF',

  // Gradientes
  gradients: {
    primary: 'linear-gradient(135deg, #4A2E9F 0%, #2E1A6B 100%)',
    accent: 'linear-gradient(135deg, #00BFFF 0%, #FF00FF 100%)',
  }
};

export const BRAND_STYLES = {
  logoGradient: 'bg-gradient-to-r from-brightBlue via-brightPink to-brightBlue bg-clip-text text-transparent',
  buttonPrimary: 'bg-gradient-to-r from-brightBlue to-brightPink hover:from-brightPink hover:to-brightBlue',
  cardPrimary: 'border-gradient-to-r from-brightBlue/20 via-brightPink/20 to-brightBlue/20'
};
