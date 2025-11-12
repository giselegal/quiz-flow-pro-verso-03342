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

/**
 * Type definition para versões suportadas
 */
export type TemplateVersion = '1.0' | '2.0' | '2.1' | '3.0' | '3.1' | '3.2';

/**
 * Lista de versões suportadas (mais recente primeiro)
 */
export const SUPPORTED_VERSIONS: TemplateVersion[] = ['3.2', '3.1', '3.0', '2.1', '2.0', '1.0'];

/**
 * Verifica se suporta variáveis dinâmicas (v3.2+)
 * Templates v3.2+ suportam variáveis como {{theme.colors.primary}}
 */
export function supportsDynamicVariables(version: string | undefined): boolean {
  return isV32OrNewer(version);
}

/**
 * Verifica se versão é suportada
 */
export function isSupportedVersion(version: string | undefined): boolean {
  if (!version) return false;
  return SUPPORTED_VERSIONS.includes(version as TemplateVersion);
}

/**
 * Obtém a versão mais recente suportada
 */
export function getLatestVersion(): TemplateVersion {
  return SUPPORTED_VERSIONS[0];
}

/**
 * Verifica se uma versão precisa de migração para v3.2
 */
export function needsMigration(version: string | undefined): boolean {
  if (!version) return true;
  return compareVersions(version, '3.2') < 0;
}

/**
 * Formata versão para display
 */
export function formatVersion(version: string | undefined): string {
  if (!version) return 'desconhecida';
  return `v${version}`;
}

/**
 * Verifica se é versão legacy (< 3.0)
 */
export function isLegacyVersion(version: string | undefined): boolean {
  if (!version) return true;
  const [major] = version.split('.').map(Number);
  return major < 3;
}
