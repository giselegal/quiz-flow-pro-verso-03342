// Polyfill de process.env no navegador para compatibilidade com código legado
// Deve ser importado antes de qualquer uso de process.env
(() => {
  if (typeof window === 'undefined') return;
  const w = window as any;
  const metaEnv = (import.meta as any)?.env || {};
  const envObj: Record<string, any> = { ...metaEnv };
  envObj.NODE_ENV = metaEnv?.MODE || (typeof process !== 'undefined' ? (process as any).env?.NODE_ENV : 'development');
  w.process = w.process || {};
  w.process.env = { ...(w.process.env || {}), ...envObj };
})();

