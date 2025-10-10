'use client';
// Facebook Pixel Initializer Component
import { useEffect } from 'react';
import { loadFacebookPixel } from '@/utils/facebookPixel';
import { trackPageView } from '@/utils/analytics';

interface PixelInitializerProps {
  pageType?: 'quiz' | 'result' | 'offer' | 'other';
}

const PixelInitializer = ({ pageType = 'other' }: PixelInitializerProps) => {
  useEffect(() => {
    // Inicializa o Facebook Pixel com o ID correto do funil atual
    loadFacebookPixel();

    // Faz tracking de PageView com informações adicionais
    trackPageView(window.location.pathname, {
      page_type: pageType,
      page_url: window.location.href,
      referrer: document.referrer || 'direct',
    });
    console.log(`[PixelInitializer] Pixel inicializado na página: ${pageType}`);
    return () => {
      // Nenhuma limpeza necessária, mas mantém estrutura para futuros ajustes
    };
  }, [pageType]);

  return null;
};

export default PixelInitializer;
