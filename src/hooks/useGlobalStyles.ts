import { useState, useEffect } from 'react';
import { createGlobalStyles } from '@/utils/config/globalStyles';

interface GlobalStyles {
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  logo?: string;
}

export const useGlobalStyles = () => {
  const [globalStyles, setGlobalStyles] = useState<GlobalStyles>(() => {
    // Inicializar com os estilos padrão do config
    const defaultStyles = createGlobalStyles();

    // Tentar carregar do localStorage
    try {
      const saved = localStorage.getItem('globalStyles');
      if (saved) {
        return { ...defaultStyles, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Erro ao carregar estilos salvos:', error);
    }

    return defaultStyles;
  });

  const updateGlobalStyles = (newStyles: Partial<GlobalStyles>) => {
    const updatedStyles = { ...globalStyles, ...newStyles };
    setGlobalStyles(updatedStyles);

    // Salvar no localStorage
    try {
      localStorage.setItem('globalStyles', JSON.stringify(updatedStyles));
    } catch (error) {
      console.warn('Erro ao salvar estilos:', error);
    }

    // Aplicar estilos CSS customizados ao documento
    applyStylesToDocument(updatedStyles);
  };

  const applyStylesToDocument = (styles: GlobalStyles) => {
    const root = document.documentElement;

    if (styles.primaryColor) {
      root.style.setProperty('--primary-color', styles.primaryColor);
    }

    if (styles.secondaryColor) {
      root.style.setProperty('--secondary-color', styles.secondaryColor);
    }

    if (styles.textColor) {
      root.style.setProperty('--text-color', styles.textColor);
    }

    if (styles.backgroundColor) {
      root.style.setProperty('--background-color', styles.backgroundColor);
    }

    if (styles.fontFamily) {
      root.style.setProperty('--font-family', styles.fontFamily);
    }
  };

  // Aplicar estilos na inicialização
  useEffect(() => {
    applyStylesToDocument(globalStyles);
  }, []);

  return {
    globalStyles,
    updateGlobalStyles,
  };
};
