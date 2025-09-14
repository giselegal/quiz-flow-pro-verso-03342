// Exportar todos os tipos base
export * from './types';

// Exportar todos os módulos
export { HeaderSection } from './HeaderSection';
export { UserInfoSection } from './UserInfoSection';
export { ProgressSection } from './ProgressSection';
export { MainImageSection } from './MainImageSection';

// Exportar componentes principais
export {
    ModularResultHeaderBlock
} from './ModularResultHeader';

export {
    ModularResultEditor,
    ResponsivePreview
} from './ModularResultEditor';

// Re-exportar os tipos das props para facilitar uso
export type { HeaderSectionProps } from './HeaderSection';
export type { UserInfoSectionProps } from './UserInfoSection';
export type { ProgressSectionProps } from './ProgressSection';
export type { MainImageSectionProps } from './MainImageSection';
export type { ModularResultHeaderProps } from './ModularResultHeader';