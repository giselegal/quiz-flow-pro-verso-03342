// Safe wrapper para cva que evita TDZ em ambientes com ordem de execução imprevisível
// Estratégia: prioriza window.cva (definido por guard em index.html); se ausente, retorna fallback estável.

// Tipos: manter VariantProps e a assinatura do cva via import type (não gera dependência em runtime)
export type { VariantProps } from 'class-variance-authority';
// Interface mínima da função cva original para manter tipos sem importar valor runtime
// A assinatura real: (base: string | string[], config?: { variants?: Record<string, Record<string,string>>; defaultVariants?: Record<string,string> }) => (props?: Record<string,string>) => string
// Mantemos genérico para não restringir uso existente.
type CvaFn = (base: unknown, config?: unknown) => (props?: Record<string, unknown>) => string;

// Implementação com a MESMA assinatura do cva original para preservar inferência de tipos
const cvaImpl: CvaFn = ((base: unknown, config?: unknown) => {
  const g = globalThis as unknown as { cva?: Function };
  const impl = typeof g?.cva === 'function' ? g.cva : null;

  if (impl) {
    // Encaminha para a implementação real quando disponível
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (impl as any)(base as any, config as any);
  }

  // Fallback: retorna função simples que concatena classes
  return ((variants?: Record<string, unknown>) => {
    const baseClasses = Array.isArray(base)
      ? (base as unknown[]).join(' ')
      : typeof base === 'string'
        ? (base as string)
        : '';
    const v = variants ?? {};
    const extra = [
      (v as any).variant,
      (v as any).size,
      (v as any).className,
    ]
      .filter(Boolean)
      .join(' ');
    return [baseClasses, extra].filter(Boolean).join(' ');
  });
}) as CvaFn;

export { cvaImpl as cva };
