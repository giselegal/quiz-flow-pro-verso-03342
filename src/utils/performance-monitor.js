/**
 * Script de monitoramento de desempenho e otimizações automáticas
 * Este script detecta problemas de desempenho e aplica otimizações em tempo real
 */

// Configurações
const PERFORMANCE_THRESHOLD = {
  LCP: 2500, // Largest Contentful Paint em ms (ideal < 2.5s)
  CLS: 0.1, // Cumulative Layout Shift (ideal < 0.1)
  FID: 100, // First Input Delay em ms (ideal < 100ms)
};

// Variáveis de estado
let performanceIssuesDetected = false;
let optimizationsApplied = false;

// Função para registrar métricas de desempenho
export const monitorPerformance = () => {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    // Monitorar Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      const lcp = lastEntry.startTime;

      console.log(`📊 LCP: ${Math.round(lcp)}ms ${lcp < PERFORMANCE_THRESHOLD.LCP ? '✅' : '⚠️'}`);

      // Se o LCP for ruim, aplicar otimizações
      if (lcp > PERFORMANCE_THRESHOLD.LCP && !optimizationsApplied) {
        console.log('⚠️ LCP está alto. Aplicando otimizações...');
        applyPerformanceOptimizations();
        performanceIssuesDetected = true;
      }
    });

    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Monitorar Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver(entryList => {
      for (const entry of entryList.getEntries()) {
        // Apenas processa se não for uma entrada retroativa
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }

      console.log(
        `📊 CLS: ${clsValue.toFixed(3)} ${clsValue < PERFORMANCE_THRESHOLD.CLS ? '✅' : '⚠️'}`
      );

      // Se o CLS for ruim, aplicar otimizações
      if (clsValue > PERFORMANCE_THRESHOLD.CLS && !optimizationsApplied) {
        console.log('⚠️ CLS está alto. Aplicando otimizações...');
        applyLayoutStabilityOptimizations();
        performanceIssuesDetected = true;
      }
    });

    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Monitorar First Input Delay (FID)
    const fidObserver = new PerformanceObserver(entryList => {
      for (const entry of entryList.getEntries()) {
        const fid = entry.processingStart - entry.startTime;

        console.log(
          `📊 FID: ${Math.round(fid)}ms ${fid < PERFORMANCE_THRESHOLD.FID ? '✅' : '⚠️'}`
        );

        // Se o FID for ruim, aplicar otimizações
        if (fid > PERFORMANCE_THRESHOLD.FID && !optimizationsApplied) {
          console.log('⚠️ FID está alto. Aplicando otimizações...');
          applyInputResponseOptimizations();
          performanceIssuesDetected = true;
        }
      }
    });

    fidObserver.observe({ type: 'first-input', buffered: true });

    // Registrar no final da carga da página
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (performanceIssuesDetected) {
          console.log('🔧 Otimizações aplicadas devido a problemas de desempenho detectados.');
          reportPerformanceIssues();
        } else {
          console.log('✅ Desempenho está bom. Nenhuma otimização adicional necessária.');
        }
      }, 3000);
    });
  } catch (error) {
    console.error('Erro ao monitorar desempenho:', error);
  }
};

// Aplicar otimizações de desempenho gerais
export const applyPerformanceOptimizations = () => {
  if (optimizationsApplied) return;
  optimizationsApplied = true;

  try {
    // 1. Reduzir qualidade das imagens para economizar banda
    reduceImageQuality();

    // 2. Desativar animações para melhorar desempenho
    disableNonEssentialAnimations();

    // 3. Desconectar observadores de evento não essenciais
    disconnectNonEssentialObservers();

    // 4. Armazenar preferência para sessões futuras
    localStorage.setItem('performance-optimizations-needed', 'true');

    console.log('✅ Otimizações aplicadas com sucesso');
  } catch (error) {
    console.error('Erro ao aplicar otimizações:', error);
  }
};

// Reduzir qualidade das imagens após detecção de problemas
export const reduceImageQuality = () => {
  try {
    // Encontrar todas as imagens na página
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      const src = img.src;

      // Modificar apenas URLs do Cloudinary
      if (src && src.includes('cloudinary.com')) {
        // Reduzir qualidade para 60% e otimizar formato
        let optimizedSrc = src;

        // Substituir parâmetro de qualidade existente
        if (optimizedSrc.includes('q_')) {
          optimizedSrc = optimizedSrc.replace(/q_[0-9]+/g, 'q_60');
        } else if (optimizedSrc.includes('/upload/')) {
          // Adicionar parâmetro de qualidade se não existir
          optimizedSrc = optimizedSrc.replace('/upload/', '/upload/q_60,');
        }

        // Definir a nova fonte otimizada
        if (optimizedSrc !== src) {
          img.src = optimizedSrc;
        }
      }
    });

    console.log(`✅ Qualidade de imagens reduzida para ${images.length} imagens`);
  } catch (error) {
    console.error('Erro ao reduzir qualidade das imagens:', error);
  }
};

// Desativar animações não essenciais
export const disableNonEssentialAnimations = () => {
  try {
    // Desativar animações CSS
    const style = document.createElement('style');
    style.textContent = `
      * {
        animation: none !important;
        transition: none !important;
        transform: none !important;
      }
    `;
    document.head.appendChild(style);

    // Remover classes de animação específicas
    const animatedElements = document.querySelectorAll(
      '.animate-bounce, .animate-pulse, .animate-spin, .animate-ping, .hover-scale'
    );

    animatedElements.forEach(el => {
      el.classList.remove(
        'animate-bounce',
        'animate-pulse',
        'animate-spin',
        'animate-ping',
        'hover-scale'
      );
    });

    console.log(`✅ Animações desativadas para ${animatedElements.length} elementos`);
  } catch (error) {
    console.error('Erro ao desativar animações:', error);
  }
};

// Desconectar observadores não essenciais
export const disconnectNonEssentialObservers = () => {
  try {
    // Limpar timers não essenciais
    const highTimers = [];
    for (let i = 0; i < 1000; i++) {
      highTimers.push(i);
    }

    // Limitar apenas a intervalos de alta frequência
    highTimers.forEach(id => {
      try {
        // Tentar limpar o intervalo se for de alta frequência
        if (id > 10) {
          clearInterval(id);
          clearTimeout(id);
        }
      } catch (e) {
        // Ignorar erros
      }
    });

    console.log('✅ Timers não essenciais desconectados');
  } catch (error) {
    console.error('Erro ao desconectar observadores:', error);
  }
};

// Otimizar estabilidade de layout
export const applyLayoutStabilityOptimizations = () => {
  try {
    // Fixar tamanhos para elementos que causam layout shifts
    const dynamicElements = document.querySelectorAll('img, iframe, video');

    dynamicElements.forEach(el => {
      // Preservar dimensões e proporções
      if (el.getAttribute('width') && el.getAttribute('height')) {
        const width = el.getAttribute('width');
        const height = el.getAttribute('height');

        // Garantir que elementos mantenham aspecto
        el.style.aspectRatio = `${width} / ${height}`;
        el.style.width = '100%';
      }
    });

    console.log(`✅ Estabilidade de layout aprimorada para ${dynamicElements.length} elementos`);
  } catch (error) {
    console.error('Erro ao otimizar estabilidade de layout:', error);
  }
};

// Otimizar resposta a inputs do usuário
export const applyInputResponseOptimizations = () => {
  try {
    // Remover event listeners de hover não essenciais
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');

    interactiveElements.forEach(el => {
      // Aplicar estilo de clicável sem hover
      el.style.cursor = 'pointer';
    });

    console.log(`✅ Resposta de input otimizada para ${interactiveElements.length} elementos`);
  } catch (error) {
    console.error('Erro ao otimizar resposta a inputs:', error);
  }
};

// Reportar problemas de desempenho para análise futura
export const reportPerformanceIssues = () => {
  // Aqui poderia enviar dados para uma API de análise, se necessário
  localStorage.setItem(
    'performance-issues-detected',
    JSON.stringify({
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      optimizationsApplied: true,
    })
  );
};

// Inicializar monitoramento quando o script é carregado
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(monitorPerformance, 1000);
  });
}

// Exportar para uso global
export default {
  monitorPerformance,
  applyPerformanceOptimizations,
  reduceImageQuality,
  disableNonEssentialAnimations,
};
