/**
 * Shim para 'require' em ambiente ESM
 * 
 * Este arquivo fornece uma implementação básica de 'require' para módulos que dependem dele
 * em um ambiente ESM. É carregado antes de qualquer outro código via script tag no index.html.
 */

// Verificar se 'require' já está definido
if (typeof window !== 'undefined' && typeof window.require === 'undefined') {
  // Implementação básica de 'require' para compatibilidade
  window.require = function(modulePath) {
    console.warn(`[require-shim] Chamada para require('${modulePath}') interceptada.`);
    // Retornar um objeto vazio para evitar erros
    return {};
  };
  
  // Definir também no escopo global
  if (typeof globalThis !== 'undefined') {
    globalThis.require = window.require;
  }
  
  console.log('[require-shim] Shim para require instalado com sucesso.');
}