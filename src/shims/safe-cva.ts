// Safe wrapper para cva que evita TDZ em ambientes com ordem de execução imprevisível
// Estratégia: prioriza window.cva (definido por guard em index.html); se ausente, retorna fallback estável.

// Tipos: manter VariantProps via import type (não gera dependência em runtime)
export type { VariantProps } from 'class-variance-authority';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cva(base: any, config?: any) {
  const g: any = (globalThis as any);
  const impl = g && typeof g.cva === 'function' ? g.cva : null;

  if (impl) {
    return impl(base, config);
  }

  // Fallback: retorna uma função que compõe classes com base e variants sem lógica complexa
  // suficiente para renderizar sem quebrar até a lib real inicializar.
  return function composed(variants?: Record<string, any>) {
    const baseClasses = Array.isArray(base) ? base.join(' ') : (typeof base === 'string' ? base : '');
    // Tentar extrair algumas classes simples de variants.variant / variants.size etc.
    const v = variants || {};
    const extra = [v.variant, v.size, v.className].filter(Boolean).join(' ');
    return [baseClasses, extra].filter(Boolean).join(' ');
  };
}
