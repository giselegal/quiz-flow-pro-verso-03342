// filepath: src/utils/disable-animations.js
/**
 * Script para desativar animações não essenciais em dispositivos
 * de baixo desempenho ou quando o usuário prefere reduzir animações
 */

// Detectar preferências e dispositivos de baixo desempenho
export const shouldDisableAnimations = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowPerformance =
    navigator.hardwareConcurrency <= 4 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 768;
  const userReportedIssues = localStorage.getItem('prefer-reduced-animations') === 'true';
  return prefersReducedMotion || isLowPerformance || userReportedIssues;
};

// Desabilitar animações CSS
export const disableCssAnimations = () => {
  if (shouldDisableAnimations()) {
    const style = document.createElement('style');
    style.textContent = `
      * { animation: none !important; transition: none !important; transform: none !important; }
      @keyframes none { from {} to {} }
    `;
    document.head.appendChild(style);
    document.documentElement.classList.add('reduced-animations');
    console.log('🚫 Animações desativadas para melhorar desempenho');
    return true;
  }
  return false;
};

// Configurar animações essenciais
export const configureEssentialAnimations = () => {
  const disabled = shouldDisableAnimations();
  document.querySelectorAll('.loading-spinner, .progress-indicator').forEach(el => {
    el.classList.add('essential-animation');
  });
  if (disabled) {
    document
      .querySelectorAll('.animate-enhanced-pulse, .animate-bounce, .hover-scale')
      .forEach(el =>
        el.classList.remove('animate-enhanced-pulse', 'animate-bounce', 'hover-scale')
      );
  }
};

// Inicializar otimização de animações
export const initializeAnimationOptimization = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      disableCssAnimations();
      configureEssentialAnimations();
    });
  } else {
    disableCssAnimations();
    configureEssentialAnimations();
  }
  window.addEventListener('load', configureEssentialAnimations);
};

// Inicializa na carga
if (typeof window !== 'undefined') {
  initializeAnimationOptimization();
}
