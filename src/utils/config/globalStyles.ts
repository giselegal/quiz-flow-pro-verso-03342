export interface GlobalStylesConfig {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;
  logo?: string;
  logoHeight?: string;
  logoAlt?: string;
}

export const createGlobalStyles = (): GlobalStylesConfig => {
  return {
    primaryColor: '#B89B7A',
    secondaryColor: '#432818',
    textColor: '#1A1818',
    backgroundColor: '#FAF9F7',
    fontFamily: 'Inter, sans-serif',
    logo: '',
    logoHeight: 'auto',
    logoAlt: 'Logo da marca',
  };
};
