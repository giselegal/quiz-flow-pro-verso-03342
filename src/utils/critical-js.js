/**
 * critical-js.js
 * Script crítico que deve ser executado antes do carregamento da aplicação React
 * Foco em melhorar o desempenho (LCP) e evitar layout shifts (CLS)
 */

(function () {
  // Definir classe que indica que estamos carregando JavaScript
  document.documentElement.classList.add('js-loading');

  // Disponibilizar utilitários globais
  window.QUIZ_PERF = {
    startTime: performance.now(),
    markerTimings: {},
    mark: function (name) {
      this.markerTimings[name] = performance.now() - this.startTime;
      if (console && console.log)
        console.log(`Marker: ${name} - ${this.markerTimings[name].toFixed(2)}ms`);
    },
  };

  // Função para remover classe js-loading quando pronto
  function revealContent() {
    document.documentElement.classList.remove('js-loading');
    document.documentElement.classList.add('js-loaded');
    window.QUIZ_PERF.mark('content_revealed');
  }

  // Definir tempo limite máximo para o carregamento (fallback)
  var readyTimeout = setTimeout(function () {
    revealContent();
  }, 2000);

  // Revelar conteúdo quando a página estiver carregada
  window.addEventListener('load', function () {
    clearTimeout(readyTimeout);
    setTimeout(revealContent, 100); // Pequeno atraso para permitir renderização final
  });

  // Preparar placeholder para imagens principais, evitando layout shifts
  var rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML =
      '<div class="loading-fallback">' +
      '<div class="content-placeholder"></div>' +
      '<div style="text-align: center; margin-top: 16px;">' +
      '<div class="spinner-placeholder" style="display: inline-block; width: 32px; height: 32px; border: 4px solid #B89B7A; border-bottom-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>' +
      '</div>' +
      '</div>';
  }

  // Adicionar estilo para animação do spinner
  var styleElement = document.createElement('style');
  styleElement.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(styleElement);
})();
