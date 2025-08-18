import React, { useEffect } from 'react';
import { useGlobalStyles } from '@/hooks/useGlobalStyles';
import { preloadImagesByUrls } from '@/utils/imageManager';

// Lista de CDNs de imagens usados no aplicativo
const IMAGE_CDNS = ['https://res.cloudinary.com', 'https://images.unsplash.com'];

// Lista de imagens críticas para pré-carregar
const CRITICAL_IMAGES = [
  // Logo do site (será substituído pela logo real do contexto)
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',

  // Recursos de UI comumente usados
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp',
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp',

  // Imagens de transformação comuns
  'https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_80,w_800/v1745519979/Captura_de_tela_2025-03-31_034324_pmdn8y.webp',
];

/**
 * Componente invisível que gerencia o pré-carregamento de recursos críticos
 * e otimiza a conexão com CDNs de imagem
 */
const ResourcePreloader: React.FC = () => {
  const { globalStyles } = useGlobalStyles();

  // Lista dinâmica que inclui logo personalizada se disponível
  const criticalImages = [...CRITICAL_IMAGES];
  if (globalStyles.logo && !CRITICAL_IMAGES.includes(globalStyles.logo)) {
    criticalImages.unshift(globalStyles.logo);
  }

  useEffect(() => {
    // Pré-carregar imagens em baixa prioridade
    preloadImagesByUrls(criticalImages, {
      quality: 85,
      format: 'auto',
      onComplete: () => {
        console.debug('[ResourcePreloader] Pré-carregamento de imagens críticas concluído');
      },
    });

    // Informar o navegador sobre recurso de terceiros para melhorar conexão
    IMAGE_CDNS.forEach(cdnUrl => {
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = cdnUrl;
      preconnect.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect);

      // DNS prefetch como fallback para navegadores mais antigos
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = cdnUrl;
      document.head.appendChild(dnsPrefetch);
    });

    // Adicionar preload de imagens críticas ao head
    criticalImages.forEach(imgSrc => {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = `${imgSrc}?q=80&f=auto&w=32`; // Versão pequena para preload
      preloadLink.type = 'image/webp';
      document.head.appendChild(preloadLink);
    });

    return () => {
      // Limpar links de preconnect quando componente desmontar
      document
        .querySelectorAll(
          'link[rel="preconnect"], link[rel="dns-prefetch"], link[rel="preload"][as="image"]'
        )
        .forEach(el => {
          const href = el.getAttribute('href');
          if (
            href &&
            (IMAGE_CDNS.some(cdn => href.includes(cdn)) ||
              criticalImages.some(img => href.includes(img.split('?')[0])))
          ) {
            el.remove();
          }
        });
    };
  }, []);

  return null; // Este componente não renderiza nada visualmente, apenas manipula o DOM
};

export default ResourcePreloader;
