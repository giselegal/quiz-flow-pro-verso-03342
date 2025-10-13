/**
 * 🎯 TEMPLATE EDITOR SERVICE
 * 
 * Gerencia salvamento de alterações do editor para JSON
 * Permite edição 100% via JSON do sistema de templates v3.0
 */

import HybridTemplateService from './HybridTemplateService';

export interface SaveResult {
    success: boolean;
    message: string;
    stepId?: string;
    error?: any;
}

export class TemplateEditorService {

    /**
     * Salva alterações de um step específico
     */
    static async saveStepChanges(
        stepId: string,
        updatedStep: any
    ): Promise<SaveResult> {
        try {
            console.log(`💾 Salvando alterações do ${stepId}...`);

            // 1. Validar estrutura do step
            if (!this.validateStepStructure(updatedStep)) {
                return {
                    success: false,
                    message: 'Estrutura do step inválida',
                    stepId
                };
            }

            // 2. Obter master template
            const master = await HybridTemplateService.getMasterTemplate();
            if (!master) {
                return {
                    success: false,
                    message: 'Master template não disponível',
                    stepId
                };
            }

            // 3. Atualizar step no master
            master.steps[stepId] = {
                ...master.steps[stepId],
                ...updatedStep,
                metadata: {
                    ...master.steps[stepId]?.metadata,
                    ...updatedStep.metadata,
                    updatedAt: new Date().toISOString()
                }
            };

            // 4. Salvar no servidor via API
            const saved = await this.saveMasterToServer(master);

            if (saved) {
                // 5. Limpar cache para recarregar alterações
                HybridTemplateService.clearCache();

                // 6. Monitorar uso do storage
                this.logStorageUsage();

                console.log(`✅ Step ${stepId} salvo com sucesso`);
                return {
                    success: true,
                    message: `Step ${stepId} salvo com sucesso`,
                    stepId
                };
            } else {
                return {
                    success: false,
                    message: 'Erro ao salvar no servidor',
                    stepId
                };
            }

        } catch (error) {
            console.error(`❌ Erro ao salvar ${stepId}:`, error);
            return {
                success: false,
                message: 'Erro ao processar salvamento',
                stepId,
                error
            };
        }
    }

    /**
     * Salva o master template completo no servidor
     */
    private static async saveMasterToServer(master: any): Promise<boolean> {
        try {
            // Em produção: salvar via API
            // Por enquanto: localStorage para desenvolvimento

            if (typeof window !== 'undefined' && window.localStorage) {
                const key = 'quiz-master-template-v3';
                localStorage.setItem(key, JSON.stringify(master));
                console.log('✅ Master template salvo no localStorage');

                // Simular delay de rede
                await new Promise(resolve => setTimeout(resolve, 100));

                return true;
            }

            // TODO: Implementar API endpoint para produção
            // const response = await fetch('/api/templates/save', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(master)
            // });
            // return response.ok;

            console.warn('⚠️ localStorage não disponível, salvamento não realizado');
            return false;
        } catch (error) {
            console.error('❌ Erro ao salvar no servidor:', error);
            return false;
        }
    }

    /**
     * Carrega master template do localStorage (dev)
     */
    static async loadMasterFromStorage(): Promise<any | null> {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const key = 'quiz-master-template-v3';
                const stored = localStorage.getItem(key);

                if (stored) {
                    const master = JSON.parse(stored);
                    console.log('✅ Master template carregado do localStorage');
                    return master;
                }
            }

            return null;
        } catch (error) {
            console.error('❌ Erro ao carregar do localStorage:', error);
            return null;
        }
    }

    /**
     * Valida estrutura de um step
     */
    private static validateStepStructure(step: any): boolean {
        if (!step || typeof step !== 'object') {
            console.warn('❌ Step não é um objeto válido');
            return false;
        }

        // Campos obrigatórios
        const required = ['templateVersion', 'metadata'];
        for (const field of required) {
            if (!step[field]) {
                console.warn(`❌ Campo obrigatório ausente: ${field}`);
                return false;
            }
        }

        // Validar templateVersion
        if (step.templateVersion !== '3.0') {
            console.warn(`❌ templateVersion inválida: ${step.templateVersion}`);
            return false;
        }

        // Validar metadata
        if (!step.metadata.id || !step.metadata.name) {
            console.warn('❌ Metadata incompleta (id ou name ausente)');
            return false;
        }

        // Validar sections se existir
        if (step.sections && !Array.isArray(step.sections)) {
            console.warn('❌ Campo "sections" deve ser array');
            return false;
        }

        console.log('✅ Estrutura do step válida');
        return true;
    }

    /**
     * Exporta o master template como JSON para download
     */
    static async exportMasterTemplate(): Promise<string> {
        const master = await HybridTemplateService.getMasterTemplate();
        if (!master) {
            throw new Error('Master template não disponível');
        }

        console.log('📦 Exportando master template...');
        return JSON.stringify(master, null, 2);
    }

    /**
     * Importa master template de JSON
     */
    static async importMasterTemplate(jsonString: string): Promise<SaveResult> {
        try {
            console.log('📥 Importando master template...');

            const data = JSON.parse(jsonString);

            // Validar estrutura básica
            if (data.templateVersion !== "3.0") {
                return {
                    success: false,
                    message: `Versão do template incorreta: ${data.templateVersion} (esperado: 3.0)`
                };
            }

            if (!data.steps || typeof data.steps !== 'object') {
                return {
                    success: false,
                    message: 'Campo "steps" ausente ou inválido'
                };
            }

            const stepCount = Object.keys(data.steps).length;
            if (stepCount !== 21) {
                return {
                    success: false,
                    message: `Número incorreto de steps: ${stepCount} (esperado: 21)`
                };
            }

            // Salvar
            const saved = await this.saveMasterToServer(data);

            if (saved) {
                HybridTemplateService.clearCache();
                console.log('✅ Template importado com sucesso');
                return {
                    success: true,
                    message: 'Template importado com sucesso'
                };
            }

            return {
                success: false,
                message: 'Erro ao salvar template importado'
            };

        } catch (error) {
            console.error('❌ Erro ao importar:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'JSON inválido',
                error
            };
        }
    }

    /**
     * Limpa dados salvos no localStorage
     */
    static clearLocalStorage(): void {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const key = 'quiz-master-template-v3';
                localStorage.removeItem(key);
                console.log('🗑️ localStorage limpo');
            }
        } catch (error) {
            console.error('❌ Erro ao limpar localStorage:', error);
        }
    }

    /**
     * Verifica se há dados salvos no localStorage
     */
    static hasLocalStorageData(): boolean {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const key = 'quiz-master-template-v3';
                return !!localStorage.getItem(key);
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    /**
     * Valida todos os steps do master template
     */
    static async validateAllSteps(): Promise<{
        valid: number;
        invalid: number;
        errors: Array<{ stepId: string; errors: string[] }>;
    }> {
        const master = await HybridTemplateService.getMasterTemplate();
        if (!master) {
            throw new Error('Master template não disponível');
        }

        let valid = 0;
        let invalid = 0;
        const errors: Array<{ stepId: string; errors: string[] }> = [];

        for (const stepId in master.steps) {
            const step = master.steps[stepId] as any; // Steps do master podem ter propriedades extras
            const stepErrors: string[] = [];

            // Validar estrutura básica
            if (!step.templateVersion) {
                stepErrors.push('templateVersion ausente');
            } else if (step.templateVersion !== '3.0') {
                stepErrors.push(`templateVersion incorreta: ${step.templateVersion}`);
            }

            if (!step.metadata) {
                stepErrors.push('metadata ausente');
            } else {
                if (!step.metadata.id) stepErrors.push('metadata.id ausente');
                if (!step.metadata.name) stepErrors.push('metadata.name ausente');
            }

            if (!step.sections || !Array.isArray(step.sections)) {
                stepErrors.push('sections ausente ou não é array');
            }

            if (stepErrors.length > 0) {
                invalid++;
                errors.push({ stepId, errors: stepErrors });
            } else {
                valid++;
            }
        }

        console.log(`✅ Validação completa: ${valid} válidos, ${invalid} inválidos`);

        return { valid, invalid, errors };
    }

    /**
     * Monitora uso do localStorage
     */
    static getStorageUsage(): {
        used: number;
        limit: number;
        percentage: number;
        shouldMigrate: boolean;
    } {
        let used = 0;

        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                // Calcular apenas dados relacionados ao quiz21
                for (let key in localStorage) {
                    if (key.startsWith('quiz21-') || key.startsWith('quiz-master-')) {
                        const value = localStorage.getItem(key);
                        if (value) {
                            // UTF-16 = 2 bytes por caractere
                            used += value.length * 2;
                        }
                    }
                }
            }
        } catch (error) {
            console.warn('⚠️ Erro ao calcular uso do storage:', error);
        }

        const limit = 5 * 1024 * 1024; // 5 MB (conservador)
        const percentage = (used / limit) * 100;
        const shouldMigrate = percentage > 60; // Alerta aos 60%

        return { used, limit, percentage, shouldMigrate };
    }

    /**
     * Log de uso do storage (chamado após salvamento)
     */
    private static logStorageUsage(): void {
        const usage = this.getStorageUsage();
        const usedKB = (usage.used / 1024).toFixed(2);
        const limitKB = (usage.limit / 1024).toFixed(0);

        console.log(`💾 Storage: ${usedKB} KB / ${limitKB} KB (${usage.percentage.toFixed(1)}%)`);

        if (usage.shouldMigrate) {
            console.warn('⚠️ Storage acima de 60%, considere migrar para IndexedDB');
            console.info('📖 Veja: docs/ANALISE_INDEXEDDB_VS_LOCALSTORAGE.md');
        }
    }

    // Aliases para compatibilidade com testes
    static clearStorage = TemplateEditorService.clearLocalStorage;
    static hasStorageData = TemplateEditorService.hasLocalStorageData;
    static getStorageKey(): string {
        return 'quiz21-edited'; // Compatibilidade
    }
}

export default TemplateEditorService;
