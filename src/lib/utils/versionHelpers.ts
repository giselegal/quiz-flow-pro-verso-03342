/**
 * 🔧 VERSION HELPERS
 * Utilitários para verificação de versões de templates
 */

/**
 * Verifica se template é v3.x (qualquer versão 3)
 */
export function isV3Template(version: string | undefined): boolean {
  if (!version) return false;
  return version.startsWith('3.');
}

/**
 * Verifica se template é v3.2+ (com suporte a variáveis dinâmicas)
 */
export function isV32OrNewer(version: string | undefined): boolean {
  if (!version) return false;
  const match = version.match(/^3\.(\d+)/);
  if (!match) return false;
  return parseInt(match[1]) >= 2;
}

/**
 * Verifica se template usa formato de blocos (v3.0+)
 */
export function hasBlocksFormat(template: any): boolean {
  return Array.isArray(template?.blocks) && template.blocks.length > 0;
}

/**
 * Extrai versão numérica para comparação
 */
export function getVersionNumber(version: string | undefined): number {
  if (!version) return 0;
  const match = version.match(/^(\d+)\.(\d+)/);
  if (!match) return 0;
  return parseInt(match[1]) * 10 + parseInt(match[2]);
}

/**
 * Compara versões
 */
export function compareVersions(v1: string, v2: string): number {
  return getVersionNumber(v1) - getVersionNumber(v2);
}
