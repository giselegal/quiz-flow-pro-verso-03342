// @ts-nocheck
/**
 * Botão de correção rápida para imagens embaçadas
 * Adicione este componente em qualquer local da introdução do quiz
 * para corrigir rapidamente o problema das imagens embaçadas
 */
import React, { useState, useEffect } from 'react';
import { replaceBlurryIntroImages } from '../../utils/images/blurry-image-fixer';

const QuickFixButton = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [stats, setStats] = useState({ fixed: 0, total: 0 });
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Verificar se há imagens embaçadas após o carregamento da página
    setTimeout(() => {
      const blurryImages = document.querySelectorAll(
        'img[src*="e_blur"], img.blur, img.placeholder'
      );
      const introImages = document.querySelectorAll('.quiz-intro img, [data-section="intro"] img');

      if (blurryImages.length > 0 || introImages.length > 0) {
        setShowButton(true);
        setStats({ fixed: 0, total: blurryImages.length + introImages.length });
      }
    }, 2000);
  }, []);

  const fixImages = () => {
    setIsFixing(true);

    // Corrigir imagens embaçadas
    const result = replaceBlurryIntroImages();
    setStats({
      fixed: result.replaced,
      total: result.total,
    });

    setTimeout(() => {
      setIsFixing(false);
    }, 3000);
  };

  if (!showButton && process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 9999,
        backgroundColor: isFixing ? '#FFC107' : '#e91e63',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '30px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        userSelect: 'none',
      }}
      onClick={!isFixing ? fixImages : undefined}
    >
      {isFixing ? (
        <>
          <span style={{ marginRight: '10px' }}>🔄</span>
          <span>
            Corrigindo imagens... ({stats.fixed}/{stats.total})
          </span>
        </>
      ) : (
        <>
          <span style={{ marginRight: '10px' }}>🔍</span>
          <span>Corrigir imagens embaçadas</span>
        </>
      )}
    </div>
  );
};

export default QuickFixButton;
