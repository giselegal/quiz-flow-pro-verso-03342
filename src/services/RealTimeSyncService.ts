/**
 * 🔄 REAL-TIME SYNC SERVICE - FASE 3
 * 
 * Serviço de sincronização em tempo real que mantém o editor
 * e o quiz original sempre em sincronia bidirecional.
 */

import { QuizToEditorAdapter, EditorQuizState, ChangeEvent, SyncResult } from '../adapters/QuizToEditorAdapter_Phase3';
import { QuizQuestion, QuizAnswer, QuizOption } from '@/types/quiz';
import { QUIZ_STEPS, getStepById, STRATEGIC_ANSWER_TO_OFFER_KEY } from '@/data/quizSteps';
import { styleConfigGisele } from '@/data/styles';
import type { QuizStep } from '@/data/quizSteps';

// ===============================
// 🎯 INTERFACES DE SINCRONIZAÇÃO
// ===============================

export interface SyncConfiguration {
    autoSaveInterval: number; // ms
    retryAttempts: number;
    retryDelay: number; // ms
    enableRealTimeSync: boolean;
    enableConflictResolution: boolean;
}

export interface ConflictResolution {
    strategy: 'local-wins' | 'remote-wins' | 'merge' | 'prompt-user';
    conflictData: {
        local: any;
        remote: any;
        timestamp: string;
    };
}

export interface SyncEvent {
    id: string;
    type: 'sync-start' | 'sync-success' | 'sync-error' | 'conflict-detected';
    timestamp: string;
    data?: any;
    error?: string;
}

// ===============================
// 🔄 SERVIÇO DE SINCRONIZAÇÃO
// ===============================

export class RealTimeSyncService {

    private static instance: RealTimeSyncService;
    private adapter: QuizToEditorAdapter;
    private config: SyncConfiguration;
    private syncListeners: Array<(event: SyncEvent) => void> = [];
    private conflictQueue: ConflictResolution[] = [];
    private isOnline = true;
    private pendingChanges: EditorQuizState[] = [];

    constructor(config?: Partial<SyncConfiguration>) {
        this.adapter = QuizToEditorAdapter.getInstance();
        this.config = {
            autoSaveInterval: 15000, // 15 segundos
            retryAttempts: 3,
            retryDelay: 2000,
            enableRealTimeSync: true,
            enableConflictResolution: true,
            ...config
        };

        this.setupSyncListeners();
        this.startSyncMonitoring();
    }

    static getInstance(config?: Partial<SyncConfiguration>): RealTimeSyncService {
        if (!this.instance) {
            this.instance = new RealTimeSyncService(config);
        }
        return this.instance;
    }

    // ===============================
    // 🔄 SINCRONIZAÇÃO PRINCIPAL
    // ===============================

    /**
     * Inicia sincronização bidirecional completa
     */
    async startBidirectionalSync(funnelId?: string): Promise<SyncResult> {
        try {
            console.log('🔄 Iniciando sincronização bidirecional...', { funnelId });

            this.emitSyncEvent({
                id: this.generateEventId(),
                type: 'sync-start',
                timestamp: new Date().toISOString(),
                data: { funnelId }
            });

            // 1. Carregar dados atuais do quiz
            const quizData = await this.adapter.convertQuizToEditor(funnelId);

            if (!quizData.success) {
                throw new Error(quizData.error);
            }

            // 2. Configurar listeners para mudanças
            this.setupRealTimeListeners();

            // 3. Iniciar auto-save inteligente
            this.startIntelligentAutoSave();

            // 4. Detectar estado online/offline
            this.setupOnlineDetection();

            console.log('✅ Sincronização bidirecional iniciada');

            this.emitSyncEvent({
                id: this.generateEventId(),
                type: 'sync-success',
                timestamp: new Date().toISOString(),
                data: quizData.data
            });

            return {
                success: true,
                data: quizData.data,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Erro na sincronização bidirecional:', error);

            this.emitSyncEvent({
                id: this.generateEventId(),
                type: 'sync-error',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido',
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Sincroniza alterações específicas de uma questão
     */
    async syncQuestionChanges(question: QuizQuestion, editorState: EditorQuizState): Promise<SyncResult> {
        try {
            console.log('📝 Sincronizando alterações da questão:', question.id);

            // Validar questão
            if (!this.validateQuestion(question)) {
                throw new Error('Questão inválida');
            }

            // Marcar como alterado
            this.adapter.markDirty(editorState);

            // Se online, tentar sincronizar imediatamente
            if (this.isOnline) {
                const result = await this.adapter.saveEditorChanges(editorState);

                if (result.success) {
                    console.log('✅ Questão sincronizada em tempo real');
                    return result;
                } else {
                    // Adicionar à fila de pendências
                    this.addToPendingQueue(editorState);
                    throw new Error(result.error);
                }
            } else {
                // Offline: adicionar à fila
                this.addToPendingQueue(editorState);
                console.log('📶 Offline: questão adicionada à fila de sincronização');

                return {
                    success: true,
                    data: editorState,
                    warnings: ['Sincronização offline - será enviada quando conectar'],
                    timestamp: new Date().toISOString()
                };
            }

        } catch (error) {
            console.error('❌ Erro ao sincronizar questão:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido',
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Sincroniza alterações de pontuação/estilos
     */
    async syncScoringChanges(question: QuizQuestion, editorState: EditorQuizState): Promise<SyncResult> {
        try {
            console.log('🎯 Sincronizando alterações de pontuação:', question.id);

            // Validar sistema de pontuação
            if (!this.validateScoring(question)) {
                throw new Error('Sistema de pontuação inválido');
            }

            // Processar sincronização
            return await this.syncQuestionChanges(question, editorState);

        } catch (error) {
            console.error('❌ Erro ao sincronizar pontuação:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido',
                timestamp: new Date().toISOString()
            };
        }
    }

    // ===============================
    // 🤖 AUTO-SAVE INTELIGENTE
    // ===============================

    /**
     * Inicia auto-save inteligente baseado em atividade do usuário
     */
    private startIntelligentAutoSave(): void {
        let lastActivity = Date.now();
        let saveTimeout: NodeJS.Timeout;

        // Configurar auto-save baseado em inatividade
        const scheduleAutoSave = () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(async () => {
                const currentState = this.adapter.getSyncStatus();
                if (currentState.pendingChanges > 0) {
                    console.log('⏰ Auto-save por inatividade');
                    await this.processPendingChanges();
                }
            }, this.config.autoSaveInterval);
        };

        // Listener para atividade do usuário
        this.adapter.addChangeListener((event: ChangeEvent) => {
            lastActivity = Date.now();
            scheduleAutoSave();

            // Auto-save imediato para mudanças críticas
            if (event.type === 'question-updated') {
                setTimeout(async () => {
                    await this.processPendingChanges();
                }, 2000); // 2 segundos de debounce
            }
        });

        console.log('🤖 Auto-save inteligente iniciado');
    }

    /**
     * Processa todas as alterações pendentes
     */
    private async processPendingChanges(): Promise<void> {
        if (this.pendingChanges.length === 0) return;

        try {
            console.log(`📦 Processando ${this.pendingChanges.length} alterações pendentes...`);

            const latestState = this.pendingChanges[this.pendingChanges.length - 1];
            const result = await this.adapter.saveEditorChanges(latestState);

            if (result.success) {
                this.pendingChanges = []; // Limpar fila
                console.log('✅ Todas as alterações pendentes foram salvas');
            } else {
                console.error('❌ Erro ao salvar alterações pendentes:', result.error);
            }

        } catch (error) {
            console.error('❌ Erro ao processar alterações pendentes:', error);
        }
    }

    // ===============================
    // 🔍 DETECÇÃO DE CONFLITOS
    // ===============================

    /**
     * Detecta e resolve conflitos de sincronização
     */
    private async detectAndResolveConflicts(localState: EditorQuizState, remoteState: EditorQuizState): Promise<EditorQuizState> {
        const conflicts: ConflictResolution[] = [];

        // Detectar conflitos em questões
        for (let i = 0; i < Math.max(localState.questions.length, remoteState.questions.length); i++) {
            const localQuestion = localState.questions[i];
            const remoteQuestion = remoteState.questions[i];

            if (localQuestion && remoteQuestion && this.hasQuestionConflict(localQuestion, remoteQuestion)) {
                conflicts.push({
                    strategy: this.config.enableConflictResolution ? 'merge' : 'local-wins',
                    conflictData: {
                        local: localQuestion,
                        remote: remoteQuestion,
                        timestamp: new Date().toISOString()
                    }
                });
            }
        }

        // Emitir evento de conflito detectado
        if (conflicts.length > 0) {
            this.emitSyncEvent({
                id: this.generateEventId(),
                type: 'conflict-detected',
                timestamp: new Date().toISOString(),
                data: { conflictCount: conflicts.length }
            });
        }

        // Resolver conflitos
        return await this.resolveConflicts(localState, remoteState, conflicts);
    }

    /**
     * Verifica se há conflito entre duas questões
     */
    private hasQuestionConflict(local: QuizQuestion, remote: QuizQuestion): boolean {
        return (
            local.id === remote.id &&
            (local.title !== remote.title ||
                local.options?.length !== remote.options?.length ||
                JSON.stringify(local.options) !== JSON.stringify(remote.options))
        );
    }

    /**
     * Resolve conflitos usando estratégia configurada
     */
    private async resolveConflicts(
        localState: EditorQuizState,
        remoteState: EditorQuizState,
        conflicts: ConflictResolution[]
    ): Promise<EditorQuizState> {

        let resolvedState = { ...localState };

        for (const conflict of conflicts) {
            switch (conflict.strategy) {
                case 'local-wins':
                    // Manter versão local
                    break;

                case 'remote-wins':
                    // Usar versão remota
                    const questionIndex = localState.questions.findIndex(q => q.id === conflict.conflictData.remote.id);
                    if (questionIndex >= 0) {
                        resolvedState.questions[questionIndex] = conflict.conflictData.remote;
                    }
                    break;

                case 'merge':
                    // Tentar merge inteligente
                    const mergedQuestion = this.mergeQuestions(conflict.conflictData.local, conflict.conflictData.remote);
                    const mergeIndex = localState.questions.findIndex(q => q.id === mergedQuestion.id);
                    if (mergeIndex >= 0) {
                        resolvedState.questions[mergeIndex] = mergedQuestion;
                    }
                    break;

                case 'prompt-user':
                    // Adicionar à fila para resolução manual
                    this.conflictQueue.push(conflict);
                    break;
            }
        }

        return resolvedState;
    }

    /**
     * Faz merge inteligente de duas questões
     */
    private mergeQuestions(local: QuizQuestion, remote: QuizQuestion): QuizQuestion {
        return {
            ...local,
            // Usar título mais recente (assumindo que remote é mais recente)
            title: remote.title || local.title,
            // Merge de respostas preservando pontuação local
            options: this.mergeOptions(local.options || [], remote.options || [])
        };
    }

    /**
     * Faz merge de opções
     */
    private mergeOptions(localOptions: QuizOption[], remoteOptions: QuizOption[]): QuizOption[] {
        const merged: QuizOption[] = [];
        const maxLength = Math.max(localOptions.length, remoteOptions.length);

        for (let i = 0; i < maxLength; i++) {
            const local = localOptions[i];
            const remote = remoteOptions[i];

            if (local && remote) {
                // Merge das duas versões
                merged.push({
                    ...local,
                    label: remote.label || local.label,
                    text: remote.text || local.text,
                    // Preservar peso local (mais confiável)
                    weight: local.weight || remote.weight
                });
            } else if (local) {
                merged.push(local);
            } else if (remote) {
                merged.push(remote);
            }
        }

        return merged;
    }

    // ===============================
    // 🌐 DETECÇÃO ONLINE/OFFLINE
    // ===============================

    /**
     * Configura detecção de status online/offline
     */
    private setupOnlineDetection(): void {
        // Listener para mudanças de conectividade
        if (typeof window !== 'undefined') {
            window.addEventListener('online', () => {
                this.isOnline = true;
                console.log('🌐 Conexão restabelecida');
                this.processPendingChanges();
            });

            window.addEventListener('offline', () => {
                this.isOnline = false;
                console.log('📶 Conexão perdida - modo offline ativado');
            });

            this.isOnline = navigator.onLine;
        }
    }

    // ===============================
    // 🔧 UTILITÁRIOS
    // ===============================

    /**
     * Adiciona estado à fila de pendências
     */
    private addToPendingQueue(state: EditorQuizState): void {
        this.pendingChanges.push(state);
        // Manter apenas os últimos 10 estados
        if (this.pendingChanges.length > 10) {
            this.pendingChanges = this.pendingChanges.slice(-10);
        }
    }

    /**
     * Configura listeners básicos de sincronização
     */
    private setupSyncListeners(): void {
        this.adapter.addChangeListener((event: ChangeEvent) => {
            console.log('🔄 Evento de mudança detectado:', event.type);
        });
    }

    /**
     * Configura listeners em tempo real
     */
    private setupRealTimeListeners(): void {
        if (!this.config.enableRealTimeSync) return;

        // Aqui seria integração com WebSockets, Server-Sent Events, etc.
        console.log('🔴 Listeners de tempo real configurados');
    }

    /**
     * Inicia monitoramento de sincronização
     */
    private startSyncMonitoring(): void {
        setInterval(() => {
            const status = this.adapter.getSyncStatus();
            if (status.pendingChanges > 5) {
                console.warn('⚠️ Muitas alterações pendentes:', status.pendingChanges);
            }
        }, 60000); // Check a cada minuto
    }

    /**
     * Valida questão
     */
    private validateQuestion(question: QuizQuestion): boolean {
        return !!(
            question.id &&
            question.title &&
            question.type &&
            question.options &&
            question.options.length >= 2
        );
    }

    /**
     * Valida sistema de pontuação
     */
    private validateScoring(question: QuizQuestion): boolean {
        return question.options?.every(option =>
            option.weight && option.weight > 0
        ) || false;
    }

    /**
     * Gera ID único para eventos
     */
    private generateEventId(): string {
        return `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Emite evento de sincronização
     */
    private emitSyncEvent(event: SyncEvent): void {
        this.syncListeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('❌ Erro ao emitir evento de sync:', error);
            }
        });
    }

    /**
     * Adiciona listener para eventos de sincronização
     */
    addSyncListener(listener: (event: SyncEvent) => void): void {
        this.syncListeners.push(listener);
    }

    /**
     * Remove listener de sincronização
     */
    removeSyncListener(listener: (event: SyncEvent) => void): void {
        this.syncListeners = this.syncListeners.filter(l => l !== listener);
    }

    /**
     * Obtém configuração atual
     */
    getConfiguration(): SyncConfiguration {
        return { ...this.config };
    }

    /**
     * Atualiza configuração
     */
    updateConfiguration(config: Partial<SyncConfiguration>): void {
        this.config = { ...this.config, ...config };
        console.log('⚙️ Configuração de sincronização atualizada');
    }

    /**
     * Limpa recursos ao destruir
     */
    destroy(): void {
        this.adapter.stopAutoSave();
        this.syncListeners = [];
        this.conflictQueue = [];
        this.pendingChanges = [];
    }
}

// ===============================
// 🚀 INSTÂNCIA GLOBAL
// ===============================

export const realTimeSyncService = RealTimeSyncService.getInstance();