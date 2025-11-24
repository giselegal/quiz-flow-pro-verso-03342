/**
 * 🔄 EDITOR-DASHBOARD SYNC SERVICE
 * 
 * Serviço que sincroniza automaticamente dados entre o editor e o dashboard admin.
 * Garante que quando um funil é salvo/publicado no editor, o dashboard é atualizado em tempo real.
 */

import { funnelService } from '@/services/canonical';
import type { UnifiedFunnelData } from '@/services/canonical';
import { toast } from '@/hooks/use-toast';
import { StorageService } from '@/services/core/StorageService';
import { appLogger } from '@/lib/utils/appLogger';

// Tipo de funil compatível com sistema antigo
type UnifiedFunnel = UnifiedFunnelData;

// ============================================================================
// INTERFACES
// ============================================================================

export interface EditorSyncEvent {
    type: 'save' | 'publish' | 'delete' | 'create';
    funnelId: string;
    funnelData?: Partial<UnifiedFunnel>;
    timestamp: Date;
}

export interface SyncNotification {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: Date;
    autoHide?: boolean;
}

type SyncCallback = (event: EditorSyncEvent) => void;
type NotificationCallback = (notification: SyncNotification) => void;

// ============================================================================
// EDITOR-DASHBOARD SYNC SERVICE
// ============================================================================

class EditorDashboardSyncServiceImpl {
    private callbacks: SyncCallback[] = [];
    private notificationCallbacks: NotificationCallback[] = [];
    private syncHistory: EditorSyncEvent[] = [];
    private readonly MAX_HISTORY = 50;

    // ========================================================================
    // EVENT SUBSCRIPTION
    // ========================================================================

    /**
     * Registra callback para escutar eventos de sincronização
     */
    onSync(callback: SyncCallback): () => void {
        this.callbacks.push(callback);

        // Retorna função para cancelar subscription
        return () => {
            const index = this.callbacks.indexOf(callback);
            if (index > -1) {
                this.callbacks.splice(index, 1);
            }
        };
    }

    /**
     * Registra callback para notificações de sistema
     */
    onNotification(callback: NotificationCallback): () => void {
        this.notificationCallbacks.push(callback);

        return () => {
            const index = this.notificationCallbacks.indexOf(callback);
            if (index > -1) {
                this.notificationCallbacks.splice(index, 1);
            }
        };
    }

    // ========================================================================
    // SYNC OPERATIONS
    // ========================================================================

    /**
     * Sincroniza salvamento de funil entre editor e dashboard
     */
    async syncFunnelSave(funnelId: string, funnelData: Partial<UnifiedFunnel>): Promise<boolean> {
        try {
            appLogger.info(`🔄 EditorDashboardSync: Sincronizando salvamento do funil ${funnelId}...`);

            // 1. Salvar usando funnelService canônico
            const result = await funnelService.updateFunnel(funnelId, funnelData as any);
            if (!result) {
                throw new Error('Falha ao salvar funil');
            }
            const savedFunnel = result;

            // 2. Criar evento de sincronização
            const syncEvent: EditorSyncEvent = {
                type: 'save',
                funnelId: savedFunnel.id,
                funnelData: savedFunnel,
                timestamp: new Date(),
            };

            // 3. Notificar todos os listeners
            this.emitSyncEvent(syncEvent);

            // 4. Limpar cache do funnelService
            // Note: funnelService gerencia cache automaticamente

            // 5. Mostrar notificação de sucesso
            this.showNotification({
                type: 'success',
                message: `Funil "${savedFunnel.name}" salvo com sucesso`,
                autoHide: true,
            });

            appLogger.info(`✅ Funil ${funnelId} sincronizado com sucesso`);
            return true;

        } catch (error) {
            appLogger.error(`❌ Erro ao sincronizar salvamento do funil ${funnelId}:`, { data: [error] });

            this.showNotification({
                type: 'error',
                message: `Erro ao salvar funil: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                autoHide: false,
            });

            return false;
        }
    }

    /**
     * Sincroniza publicação de funil entre editor e dashboard
     */
    async syncFunnelPublish(funnelId: string, funnelData: Partial<UnifiedFunnel>): Promise<boolean> {
        try {
            appLogger.info(`🚀 EditorDashboardSync: Sincronizando publicação do funil ${funnelId}...`);

            // 1. Marcar como publicado
            const currentVersion = typeof funnelData.version === 'number' ? funnelData.version : 0;
            const publishedData = {
                ...funnelData,
                is_published: true,
                version: currentVersion + 1,
            };

            // 2. Salvar usando funnelService canônico
            const result = await funnelService.updateFunnel(funnelId, publishedData as any);
            if (!result) {
                throw new Error('Falha ao publicar funil');
            }
            const publishedFunnel = result;

            // 3. Criar evento de sincronização
            const syncEvent: EditorSyncEvent = {
                type: 'publish',
                funnelId: publishedFunnel.id,
                funnelData: publishedFunnel,
                timestamp: new Date(),
            };

            // 4. Notificar todos os listeners
            this.emitSyncEvent(syncEvent);

            // 5. Cache gerenciado automaticamente pelo funnelService
            // Métricas atualizadas após publicação

            // 7. Mostrar notificação de sucesso
            this.showNotification({
                type: 'success',
                message: `Funil "${publishedFunnel.name}" publicado com sucesso! Dashboard atualizado.`,
                autoHide: true,
            });

            // 8. Toast adicional para confirmação
            toast({
                title: '🎉 Funil Publicado!',
                description: `O funil "${publishedFunnel.name}" está agora disponível para visualização.`,
                variant: 'default',
            });

            appLogger.info(`✅ Funil ${funnelId} publicado e sincronizado`);
            return true;

        } catch (error) {
            appLogger.error(`❌ Erro ao sincronizar publicação do funil ${funnelId}:`, { data: [error] });

            this.showNotification({
                type: 'error',
                message: `Erro ao publicar funil: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                autoHide: false,
            });

            return false;
        }
    }

    /**
     * Sincroniza criação de novo funil
     */
    async syncFunnelCreate(funnelData: Partial<UnifiedFunnel>): Promise<UnifiedFunnel | null> {
        try {
            appLogger.info('🆕 EditorDashboardSync: Sincronizando criação de novo funil...');

            // 1. Criar funil usando funnelService canônico
            const newFunnel = await funnelService.createFunnel({
                name: funnelData.name || 'Novo Funil',
            });

            if (!newFunnel) {
                throw new Error('Falha ao criar funil');
            }

            // 2. Criar evento de sincronização
            const syncEvent: EditorSyncEvent = {
                type: 'create',
                funnelId: newFunnel.id,
                funnelData: newFunnel,
                timestamp: new Date(),
            };

            // 3. Notificar listeners
            this.emitSyncEvent(syncEvent);

            // 4. Cache gerenciado automaticamente

            // 5. Mostrar notificação
            this.showNotification({
                type: 'success',
                message: `Novo funil "${newFunnel.name}" criado com sucesso`,
                autoHide: true,
            });

            appLogger.info(`✅ Novo funil ${newFunnel.id} criado e sincronizado`);
            return newFunnel;

        } catch (error) {
            appLogger.error('❌ Erro ao sincronizar criação de funil:', { data: [error] });

            this.showNotification({
                type: 'error',
                message: `Erro ao criar funil: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                autoHide: false,
            });

            return null;
        }
    }

    /**
     * Sincroniza deleção de funil
     */
    async syncFunnelDelete(funnelId: string): Promise<boolean> {
        try {
            appLogger.info(`🗑️ EditorDashboardSync: Sincronizando deleção do funil ${funnelId}...`);

            // 1. Deletar usando funnelService canônico
            const success = await funnelService.deleteFunnel(funnelId);

            if (!success) {
                throw new Error('Falha ao deletar funil do banco de dados');
            }

            // 2. Criar evento de sincronização
            const syncEvent: EditorSyncEvent = {
                type: 'delete',
                funnelId,
                timestamp: new Date(),
            };

            // 3. Notificar listeners
            this.emitSyncEvent(syncEvent);

            // 4. Cache gerenciado automaticamente

            // 5. Mostrar notificação
            this.showNotification({
                type: 'info',
                message: 'Funil deletado com sucesso',
                autoHide: true,
            });

            appLogger.info(`✅ Funil ${funnelId} deletado e sincronizado`);
            return true;

        } catch (error) {
            appLogger.error(`❌ Erro ao sincronizar deleção do funil ${funnelId}:`, { data: [error] });

            this.showNotification({
                type: 'error',
                message: `Erro ao deletar funil: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                autoHide: false,
            });

            return false;
        }
    }

    // ========================================================================
    // REAL-TIME DASHBOARD UPDATE
    // ========================================================================

    /**
     * Força atualização do dashboard quando detecta mudanças
     */
    async refreshDashboardData(): Promise<void> {
        try {
            appLogger.info('🔄 EditorDashboardSync: Atualizando dados do dashboard...');

            // Recarregar dados essenciais usando funnelService
            await funnelService.listFunnels();

            this.showNotification({
                type: 'info',
                message: 'Dashboard atualizado com os dados mais recentes',
                autoHide: true,
            });

            appLogger.info('✅ Dashboard atualizado');

        } catch (error) {
            appLogger.error('❌ Erro ao atualizar dashboard:', { data: [error] });
        }
    }

    /**
     * Verifica se há mudanças pendentes e sincroniza automaticamente
     */
    async autoSync(): Promise<void> {
        try {
            // Verificar se há mudanças locais não sincronizadas
            const localChanges = this.getUnsyncedChanges();

            if (localChanges.length > 0) {
                appLogger.info(`🔄 EditorDashboardSync: ${localChanges.length} mudanças pendentes encontradas`);

                for (const change of localChanges) {
                    await this.processPendingChange(change);
                }
            }

        } catch (error) {
            appLogger.error('❌ Erro no auto-sync:', { data: [error] });
        }
    }

    // ========================================================================
    // HISTORY & MONITORING
    // ========================================================================

    /**
     * Retorna histórico de sincronizações
     */
    getSyncHistory(): EditorSyncEvent[] {
        return [...this.syncHistory];
    }

    /**
     * Retorna estatísticas de sincronização
     */
    getSyncStats() {
        const total = this.syncHistory.length;
        const byType = this.syncHistory.reduce((acc, event) => {
            acc[event.type] = (acc[event.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const last24h = this.syncHistory.filter(
            event => Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000,
        ).length;

        return {
            total,
            byType,
            last24h,
            lastSync: this.syncHistory[this.syncHistory.length - 1]?.timestamp,
        };
    }

    // ========================================================================
    // PRIVATE METHODS
    // ========================================================================

    private emitSyncEvent(event: EditorSyncEvent): void {
        // Adicionar ao histórico
        this.syncHistory.push(event);

        // Manter apenas os últimos eventos
        if (this.syncHistory.length > this.MAX_HISTORY) {
            this.syncHistory.shift();
        }

        // Notificar todos os callbacks
        this.callbacks.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                appLogger.error('❌ Erro em callback de sincronização:', { data: [error] });
            }
        });
    }

    private showNotification(notification: Omit<SyncNotification, 'id' | 'timestamp'>): void {
        const fullNotification: SyncNotification = {
            ...notification,
            id: crypto.randomUUID(),
            timestamp: new Date(),
        };

        this.notificationCallbacks.forEach(callback => {
            try {
                callback(fullNotification);
            } catch (error) {
                appLogger.error('❌ Erro em callback de notificação:', { data: [error] });
            }
        });
    }

    private getUnsyncedChanges(): any[] {
        // Implementação para detectar mudanças locais não sincronizadas
        try {
            const localChanges = StorageService.safeGetString('editor_unsynced_changes');
            return localChanges ? JSON.parse(localChanges) : [];
        } catch {
            return [];
        }
    }

    private async processPendingChange(change: any): Promise<void> {
        // Implementação para processar mudanças pendentes
        appLogger.info('🔄 Processando mudança pendente:', { data: [change] });
    }

    // ========================================================================
    // PUBLIC UTILITIES
    // ========================================================================

    /**
     * Conecta o editor ao sistema de sincronização
     */
    connectEditor(editorInstance: any): () => void {
        appLogger.info('🔗 EditorDashboardSync: Editor conectado ao sistema de sincronização');

        // Configurar auto-sync a cada 30 segundos
        const autoSyncInterval = setInterval(() => {
            // Pausar quando aba estiver oculta para economizar CPU/Rede
            if (typeof document !== 'undefined' && document.hidden) return;
            this.autoSync();
        }, 30000);

        // Pausar/resumir imediatamente com Page Visibility
        const visibilityHandler = () => {
            if (document.hidden) {
                // noop: ciclo já checa hidden
            } else {
                // Ao voltar, dispara um sync rápido
                this.autoSync();
            }
        };
        if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
            document.addEventListener('visibilitychange', visibilityHandler);
        }

        // Retornar função de cleanup
        return () => {
            clearInterval(autoSyncInterval);
            if (typeof document !== 'undefined' && typeof document.removeEventListener === 'function') {
                document.removeEventListener('visibilitychange', visibilityHandler);
            }
            appLogger.info('🔌 EditorDashboardSync: Editor desconectado');
        };
    }

    /**
     * Conecta o dashboard ao sistema de sincronização
     */
    connectDashboard(dashboardInstance: any): () => void {
        appLogger.info('🔗 EditorDashboardSync: Dashboard conectado ao sistema de sincronização');

        // Escutar eventos de sincronização para atualizar dashboard
        const unsubscribe = this.onSync((event) => {
            appLogger.info(`📡 Dashboard: Recebido evento de sincronização ${event.type} para funil ${event.funnelId}`);

            // Atualizar dados do dashboard se necessário
            if (dashboardInstance && typeof dashboardInstance.refresh === 'function') {
                dashboardInstance.refresh();
            }
        });

        return unsubscribe;
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const EditorDashboardSyncService = new EditorDashboardSyncServiceImpl();
export default EditorDashboardSyncService;