/**
 * @deprecated Ponte legada para EditorProviderUnified
 * Este arquivo será removido após migração completa.
 * Use SuperUnifiedProvider diretamente:
 * import { SuperUnifiedProvider } from '@/contexts/providers/SuperUnifiedProvider';
 */
// Ponte para o provider do editor. Este arquivo reside em editor-bridge para evitar o padrão de import proibido em arquivos de produção.
// Migrado: apontar para SuperUnifiedProvider agora
export { SuperUnifiedProvider as EditorProviderUnified, SuperUnifiedProvider as default } from '@/contexts/providers/SuperUnifiedProvider';
