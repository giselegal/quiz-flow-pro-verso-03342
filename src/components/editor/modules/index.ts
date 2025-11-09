// Exportar todos os tipos base
export * from './types';

// Exportar todos os módulos
export { HeaderSection } from './HeaderSection';
export { UserInfoSection } from './UserInfoSection';
export { ProgressSection } from './ProgressSection';
export { MainImageSection } from './MainImageSection';

// Exportar componentes principais
export {
    ModularResultHeaderBlock,
} from './ModularResultHeader';

// Lazy boundary para evitar carregamento antecipado de craftjs.
export const LazyModularResultEditor = async () =>
    import('./ModularResultEditor').then(m => ({ default: m.ModularResultEditor }));
export const LazyResponsivePreview = async () =>
    import('./ModularResultEditor').then(m => ({ default: m.ResponsivePreview }));

/**
 * NOTA: ModularResultEditor está deprecated e agora só deve ser
 * carregado via import dinâmico. Para usar em React:
 * const ModularResultEditor = React.lazy(LazyModularResultEditor);
 */

export {
    Step20SystemSelector,
} from './Step20SystemSelector';// Re-exportar os tipos das props para facilitar uso
export type { HeaderSectionProps } from './HeaderSection';
export type { UserInfoSectionProps } from './UserInfoSection';
export type { ProgressSectionProps } from './ProgressSection';
export type { MainImageSectionProps } from './MainImageSection';
export type { ModularResultHeaderProps } from './ModularResultHeader';