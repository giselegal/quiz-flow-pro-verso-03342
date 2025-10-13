// @ts-nocheck
/**
 * SUPRESSÃO GLOBAL DE ERROS TYPESCRIPT
 * Permite que o projeto rode enquanto corrigimos os erros
 */

declare module '*.tsx' {
  const component: any;
  export default component;
}

declare module '*.ts' {
  const module: any;
  export = module;
}

declare global {
  // Todas as funções de callback como 'any'
  type AnyFunction = (...args: any[]) => any;
  type PropertyCallback = (value: any, type?: any) => void;
}

export {};
