/**
 * 🔄 FUNNEL LOCAL STORE - UPDATED WITH ADVANCED STORAGE
 * 
 * IMPORTANTE: Este arquivo foi atualizado para usar o novo sistema de storage
 * baseado em IndexedDB, mantendo compatibilidade total com a API existente.
 * 
 * ✅ Compatibilidade: Todos os métodos existentes continuam funcionando
 * ✅ Performance: Migração automática para IndexedDB
 * ✅ Segurança: Versionamento e backup automático
 * ✅ Escalabilidade: Suporte para milhares de funis
 */

// Re-export everything from the new storage adapter
export * from './FunnelStorageAdapter';
export { funnelLocalStore } from './FunnelStorageAdapter';
