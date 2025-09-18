// Utilitário central para classes de margem em Tailwind com valores em px
// Aceita números ou strings numéricas e converte para classes mt|mb|ml|mr-*

export type SpacingSide = 'top' | 'bottom' | 'left' | 'right';

export function getMarginClass(
  value: string | number | null | undefined,
  type: SpacingSide
): string {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value ?? 0;
  if (Number.isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Negativas
  if ((numValue as number) < 0) {
    const absValue = Math.abs(numValue as number);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`;
  }

  // Positivas (até ~28 = 7rem, 32 = 8rem)
  const v = numValue as number;
  if (v <= 4) return `${prefix}-1`;
  if (v <= 8) return `${prefix}-2`;
  if (v <= 12) return `${prefix}-3`;
  if (v <= 16) return `${prefix}-4`;
  if (v <= 20) return `${prefix}-5`;
  if (v <= 24) return `${prefix}-6`;
  if (v <= 28) return `${prefix}-7`;
  if (v <= 32) return `${prefix}-8`;
  if (v <= 36) return `${prefix}-9`;
  if (v <= 40) return `${prefix}-10`;
  if (v <= 44) return `${prefix}-11`;
  if (v <= 48) return `${prefix}-12`;
  if (v <= 56) return `${prefix}-14`;
  if (v <= 64) return `${prefix}-16`;
  if (v <= 80) return `${prefix}-20`;
  if (v <= 96) return `${prefix}-24`;
  if (v <= 112) return `${prefix}-28`;
  return `${prefix}-32`;
}
