/**
 * Script para filtrar e otimizar scripts externos indesejados
 */

// Bloqueia scripts do Lovable/GPT Engineer que podem causar problemas
(function() {
  'use strict';
  
  // Lista de scripts a serem bloqueados ou otimizados
  const BLOCKED_SCRIPTS = [
    'lovable.js',
    'gpt-engineer',
    'rrweb',
    'component-tagger',
    'replit-dev-banner.js'
  ];

  // Lista de funções globais a serem limpas
  const BLOCKED_GLOBALS = [
    'LOV_SELECTOR_SCRIPT_VERSION',
    '__rrweb_original__',
    'rrweb'
  ];

  // Função para bloquear scripts
  const blockScript = (src) => {
    return BLOCKED_SCRIPTS.some(blocked => src.includes(blocked));
  };

  // Intercepta a criação de novos scripts
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(this, tagName);
    
    if (tagName.toLowerCase() === 'script') {
      const originalSetAttribute = element.setAttribute;
      element.setAttribute = function(name, value) {
        if (name === 'src' && blockScript(value)) {
          console.log('🚫 [Security] Blocked script:', value);
          return;
        }
        return originalSetAttribute.call(this, name, value);
      };

      // Intercepta a propriedade src
      Object.defineProperty(element, 'src', {
        set: function(value) {
          if (blockScript(value)) {
            console.log('🚫 [Security] Blocked script src:', value);
            return;
          }
          this.setAttribute('src', value);
        },
        get: function() {
          return this.getAttribute('src');
        }
      });
    }
    
    return element;
  };

  // Remove variáveis globais indesejadas
  BLOCKED_GLOBALS.forEach(globalVar => {
    if (window[globalVar]) {
      try {
        delete window[globalVar];
        console.log('🧹 [Cleanup] Removed global variable:', globalVar);
      } catch (e) {
        console.warn('⚠️ Could not remove global variable:', globalVar);
      }
    }
  });

  // Bloqueia window.postMessage para origins suspeitas
  const originalPostMessage = window.postMessage;
  window.postMessage = function(message, targetOrigin, ...args) {
    if (message && typeof message === 'object' && message.type) {
      const suspiciousTypes = [
        'RRWEB_EVENT',
        'ELEMENT_CLICKED',
        'SELECTOR_SCRIPT_LOADED'
      ];
      
      if (suspiciousTypes.includes(message.type)) {
        console.log('🚫 [Security] Blocked suspicious message:', message.type);
        return;
      }
    }
    
    return originalPostMessage.call(this, message, targetOrigin, ...args);
  };

  // Remove event listeners suspeitos
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    // Bloqueia listeners relacionados ao tracking/recording
    const suspiciousEvents = ['scroll', 'mousemove', 'click'];
    const listenerString = listener ? listener.toString() : '';
    
    if (suspiciousEvents.includes(type) && 
        (listenerString.includes('rrweb') || 
         listenerString.includes('LOV_') ||
         listenerString.includes('GPT_'))) {
      console.log('🚫 [Security] Blocked suspicious event listener:', type);
      return;
    }
    
    return originalAddEventListener.call(this, type, listener, options);
  };

  console.log('🛡️ [Security] External script filter initialized');
})();

export {};
