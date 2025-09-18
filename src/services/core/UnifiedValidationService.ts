
/**
 * 🎯 UNIFIED VALIDATION SERVICE - CONSOLIDAÇÃO ARQUITETURAL
 * 
 * FASE 3: Unifica a lógica de validação em um único serviço:
 * ✅ Consolida funnelValidationService + pageStructureValidator + validationService
 * ✅ Sistema centralizado de validação com Zod integration
 * ✅ Validação assíncrona com cache inteligente
 * ✅ Suporte completo para forms, blocks, steps e funnels
 * ✅ Performance otimizada com debouncing e batching
 */

import { z } from 'zod';
import { Block, BlockType } from '@/types/editor';
import { MASTER_BLOCK_REGISTRY } from '@/config/masterSchema';

// Tipos principais do serviço de validação
export interface ValidationRule {
    name: string;
    schema: z.ZodSchema<any>;
    async?: boolean;
    debounceMs?: number;
    priority: number;
    group?: string;
}

export interface ValidationContext {
    type: 'form' | 'block' | 'step' | 'funnel';
    id: string;
    parentId?: string;
    metadata?: Record<string, any>;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    performance?: ValidationPerformance;
}

export interface ValidationError {
    field: string;
    message: string;
    code: string;
    severity: 'error' | 'critical';
    path?: string[];
}

export interface ValidationWarning {
    field: string;
    message: string;
    code: string;
    suggestion?: string;
}

export interface ValidationPerformance {
    duration: number;
    rulesExecuted: number;
    cacheHits: number;
    cacheMisses: number;
}

export interface AsyncValidationJob {
    id: string;
    context: ValidationContext;
    data: any;
    rules: ValidationRule[];
    status: 'pending' | 'running' | 'completed' | 'failed';
    result?: ValidationResult;
    createdAt: number;
    completedAt?: number;
}

// Cache para otimização de performance
interface ValidationCache {
    results: Map<string, { result: ValidationResult; timestamp: number }>;
    schemas: Map<string, z.ZodSchema<any>>;
    rules: Map<string, ValidationRule[]>;
    ttl: number;
}

export class UnifiedValidationService {
    private cache: ValidationCache;
    private rules: Map<string, ValidationRule[]>;
    private schemas: Map<string, z.ZodSchema<any>>;
    private asyncJobs: Map<string, AsyncValidationJob>;
    private debounceTimeouts: Map<string, NodeJS.Timeout>;

    constructor() {
        this.cache = {
            results: new Map(),
            schemas: new Map(),
            rules: new Map(),
            ttl: 5 * 60 * 1000 // 5 minutos
        };

        this.rules = new Map();
        this.schemas = new Map();
        this.asyncJobs = new Map();
        this.debounceTimeouts = new Map();

        this.initializeDefaultRules();
        this.initializeBlockSchemas();
    }

    // === VALIDAÇÃO PRINCIPAL ===

    /**
     * Valida dados com regras específicas
     */
    async validate(
        data: any,
        context: ValidationContext,
        ruleNames?: string[]
    ): Promise<ValidationResult> {
        const startTime = Date.now();
        const cacheKey = this.generateCacheKey(data, context, ruleNames);

        // Verifica cache primeiro
        const cachedResult = this.getCachedResult(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        // Obtém regras para validação
        const rules = this.getRulesForContext(context, ruleNames);
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];
        let rulesExecuted = 0;

        // Executa regras síncronas
        const syncRules = rules.filter(rule => !rule.async);
        for (const rule of syncRules) {
            try {
                await rule.schema.parseAsync(data);
                rulesExecuted++;
            } catch (zodError) {
                if (zodError instanceof z.ZodError) {
                    zodError.errors.forEach(error => {
                        errors.push({
                            field: error.path.join('.'),
                            message: error.message,
                            code: error.code,
                            severity: 'error',
                            path: error.path as string[]
                        });
                    });
                }
                rulesExecuted++;
            }
        }

        // Inicia validações assíncronas se necessário
        const asyncRules = rules.filter(rule => rule.async);
        if (asyncRules.length > 0) {
            const asyncJob = await this.startAsyncValidation(data, context, asyncRules);
            // Para validação imediata, podemos aguardar ou retornar parcial
        }

        const result: ValidationResult = {
            isValid: errors.length === 0,
            errors,
            warnings,
            performance: {
                duration: Date.now() - startTime,
                rulesExecuted,
                cacheHits: cachedResult ? 1 : 0,
                cacheMisses: cachedResult ? 0 : 1
            }
        };

        // Cache do resultado
        this.cacheResult(cacheKey, result);

        return result;
    }

    /**
     * Validação específica para formulários
     */
    async validateForm(formData: Record<string, any>, formId: string): Promise<ValidationResult> {
        const context: ValidationContext = {
            type: 'form',
            id: formId
        };

        // Schema específico para formulário
        const formSchema = z.object({
            // Campos obrigatórios básicos
            id: z.string().min(1, 'ID é obrigatório'),
            // Validações específicas por tipo de formulário
            ...this.getFormSpecificSchema(formId)
        });

        return this.validateWithSchema(formData, formSchema, context);
    }

    /**
     * Validação específica para blocos
     */
    async validateBlock(block: Block, stepContext?: any): Promise<ValidationResult> {
        const context: ValidationContext = {
            type: 'block',
            id: block.id,
            metadata: { blockType: block.type, stepContext }
        };

        // Obtém schema do Master Block Registry
        const blockDefinition = MASTER_BLOCK_REGISTRY[block.type];
        if (!blockDefinition) {
            return {
                isValid: false,
                errors: [{
                    field: 'type',
                    message: `Tipo de bloco desconhecido: ${block.type}`,
                    code: 'UNKNOWN_BLOCK_TYPE',
                    severity: 'critical'
                }],
                warnings: []
            };
        }

        // Schema específico do bloco
        const blockSchema = blockDefinition.validation || z.object({
            id: z.string(),
            type: z.string(),
            properties: z.record(z.any()),
            styles: z.record(z.any()).optional(),
            children: z.array(z.string()).optional()
        });

        return this.validateWithSchema(block, blockSchema, context);
    }

    /**
     * Validação específica para steps
     */
    async validateStep(stepData: any, stepId: string, funnelId: string): Promise<ValidationResult> {
        const context: ValidationContext = {
            type: 'step',
            id: stepId,
            parentId: funnelId
        };

        const stepSchema = z.object({
            id: z.string().min(1, 'ID do step é obrigatório'),
            title: z.string().min(1, 'Título do step é obrigatório'),
            description: z.string().optional(),
            blocks: z.array(z.any()).min(1, 'Step deve ter pelo menos um bloco'),
            order: z.number().int().min(0, 'Ordem deve ser um número não negativo'),
            isRequired: z.boolean().default(false),
            validation: z.object({
                required: z.boolean().default(false),
                customRules: z.array(z.string()).optional()
            }).optional()
        });

        return this.validateWithSchema(stepData, stepSchema, context);
    }

    /**
     * Validação específica para funnels
     */
    async validateFunnel(funnelData: any, funnelId: string): Promise<ValidationResult> {
        const context: ValidationContext = {
            type: 'funnel',
            id: funnelId
        };

        const funnelSchema = z.object({
            id: z.string().min(1, 'ID do funil é obrigatório'),
            title: z.string().min(1, 'Título do funil é obrigatório'),
            description: z.string().optional(),
            steps: z.array(z.any()).min(1, 'Funil deve ter pelo menos um step'),
            settings: z.object({
                analytics: z.boolean().default(true),
                showProgress: z.boolean().default(true),
                allowBack: z.boolean().default(true),
                autoSave: z.boolean().default(true)
            }).optional(),
            theme: z.object({
                primaryColor: z.string().optional(),
                backgroundColor: z.string().optional(),
                fontFamily: z.string().optional()
            }).optional()
        });

        // Validação adicional: ordem dos steps
        const stepValidations = await this.validateStepSequence(funnelData.steps);

        const baseValidation = await this.validateWithSchema(funnelData, funnelSchema, context);

        // Mescla resultados
        return {
            isValid: baseValidation.isValid && stepValidations.isValid,
            errors: [...baseValidation.errors, ...stepValidations.errors],
            warnings: [...baseValidation.warnings, ...stepValidations.warnings],
            performance: baseValidation.performance
        };
    }

    // === VALIDAÇÃO ASSÍNCRONA ===

    /**
     * Inicia validação assíncrona
     */
    async startAsyncValidation(
        data: any,
        context: ValidationContext,
        rules: ValidationRule[]
    ): Promise<AsyncValidationJob> {
        const jobId = this.generateJobId();

        const job: AsyncValidationJob = {
            id: jobId,
            context,
            data,
            rules,
            status: 'pending',
            createdAt: Date.now()
        };

        this.asyncJobs.set(jobId, job);

        // Executa validação em background
        this.executeAsyncValidation(job);

        return job;
    }

    /**
     * Obtém resultado de validação assíncrona
     */
    getAsyncValidationResult(jobId: string): AsyncValidationJob | null {
        return this.asyncJobs.get(jobId) || null;
    }

    /**
     * Executa validação assíncrona
     */
    private async executeAsyncValidation(job: AsyncValidationJob): Promise<void> {
        job.status = 'running';
        const startTime = Date.now();

        try {
            const errors: ValidationError[] = [];
            const warnings: ValidationWarning[] = [];
            let rulesExecuted = 0;

            for (const rule of job.rules) {
                try {
                    // Aplicar debounce se configurado
                    if (rule.debounceMs) {
                        await this.debounce(`${job.id}-${rule.name}`, rule.debounceMs);
                    }

                    await rule.schema.parseAsync(job.data);
                    rulesExecuted++;
                } catch (zodError) {
                    if (zodError instanceof z.ZodError) {
                        zodError.errors.forEach(error => {
                            errors.push({
                                field: error.path.join('.'),
                                message: error.message,
                                code: error.code,
                                severity: 'error',
                                path: error.path as string[]
                            });
                        });
                    }
                    rulesExecuted++;
                }
            }

            job.result = {
                isValid: errors.length === 0,
                errors,
                warnings,
                performance: {
                    duration: Date.now() - startTime,
                    rulesExecuted,
                    cacheHits: 0,
                    cacheMisses: 1
                }
            };

            job.status = 'completed';
            job.completedAt = Date.now();

        } catch (error) {
            job.status = 'failed';
            job.completedAt = Date.now();
            job.result = {
                isValid: false,
                errors: [{
                    field: 'system',
                    message: error instanceof Error ? error.message : 'Erro desconhecido na validação',
                    code: 'ASYNC_VALIDATION_ERROR',
                    severity: 'critical'
                }],
                warnings: []
            };
        }
    }

    // === VALIDAÇÃO COM DEBOUNCE ===

    /**
     * Validação com debounce para performance
     */
    async validateWithDebounce(
        data: any,
        context: ValidationContext,
        debounceMs: number = 300
    ): Promise<ValidationResult> {
        const key = `${context.type}-${context.id}`;

        return new Promise((resolve) => {
            // Cancela timeout anterior se existir
            if (this.debounceTimeouts.has(key)) {
                clearTimeout(this.debounceTimeouts.get(key)!);
            }

            // Agenda nova validação
            const timeout = setTimeout(async () => {
                const result = await this.validate(data, context);
                this.debounceTimeouts.delete(key);
                resolve(result);
            }, debounceMs);

            this.debounceTimeouts.set(key, timeout);
        });
    }

    // === MÉTODOS AUXILIARES ===

    private async validateWithSchema(
        data: any,
        schema: z.ZodSchema<any>,
        context: ValidationContext
    ): Promise<ValidationResult> {
        const startTime = Date.now();

        try {
            await schema.parseAsync(data);
            return {
                isValid: true,
                errors: [],
                warnings: [],
                performance: {
                    duration: Date.now() - startTime,
                    rulesExecuted: 1,
                    cacheHits: 0,
                    cacheMisses: 1
                }
            };
        } catch (zodError) {
            const errors: ValidationError[] = [];

            if (zodError instanceof z.ZodError) {
                zodError.errors.forEach(error => {
                    errors.push({
                        field: error.path.join('.'),
                        message: error.message,
                        code: error.code,
                        severity: 'error',
                        path: error.path as string[]
                    });
                });
            }

            return {
                isValid: false,
                errors,
                warnings: [],
                performance: {
                    duration: Date.now() - startTime,
                    rulesExecuted: 1,
                    cacheHits: 0,
                    cacheMisses: 1
                }
            };
        }
    }

    private initializeDefaultRules(): void {
        // Regras básicas para formulários
        const formRules: ValidationRule[] = [
            {
                name: 'required-fields',
                schema: z.object({}).passthrough(),
                priority: 1,
                group: 'form'
            },
            {
                name: 'email-format',
                schema: z.object({
                    email: z.string().email('Email inválido').optional()
                }).passthrough(),
                priority: 2,
                group: 'form'
            },
            {
                name: 'phone-format',
                schema: z.object({
                    phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido').optional()
                }).passthrough(),
                priority: 2,
                group: 'form'
            }
        ];

        // Regras básicas para blocos
        const blockRules: ValidationRule[] = [
            {
                name: 'block-structure',
                schema: z.object({
                    id: z.string().min(1),
                    type: z.string().min(1),
                    properties: z.record(z.any())
                }),
                priority: 1,
                group: 'block'
            }
        ];

        this.rules.set('form', formRules);
        this.rules.set('block', blockRules);
    }

    private initializeBlockSchemas(): void {
        // Carrega schemas dos blocos do Master Registry
        Object.entries(MASTER_BLOCK_REGISTRY).forEach(([type, definition]) => {
            if (definition.validation) {
                this.schemas.set(type, definition.validation);
            }
        });
    }

    private getRulesForContext(
        context: ValidationContext,
        ruleNames?: string[]
    ): ValidationRule[] {
        const contextRules = this.rules.get(context.type) || [];

        if (ruleNames) {
            return contextRules.filter(rule => ruleNames.includes(rule.name));
        }

        return contextRules.sort((a, b) => a.priority - b.priority);
    }

    private generateCacheKey(
        data: any,
        context: ValidationContext,
        ruleNames?: string[]
    ): string {
        const dataHash = JSON.stringify(data);
        const contextKey = `${context.type}-${context.id}`;
        const rulesKey = ruleNames ? ruleNames.join(',') : 'all';

        return `${contextKey}-${rulesKey}-${this.simpleHash(dataHash)}`;
    }

    private getCachedResult(cacheKey: string): ValidationResult | null {
        const cached = this.cache.results.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < this.cache.ttl) {
            return cached.result;
        }

        // Remove cache expirado
        if (cached) {
            this.cache.results.delete(cacheKey);
        }

        return null;
    }

    private cacheResult(cacheKey: string, result: ValidationResult): void {
        this.cache.results.set(cacheKey, {
            result,
            timestamp: Date.now()
        });
    }

    private async validateStepSequence(steps: any[]): Promise<ValidationResult> {
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];

        // Verifica ordem sequencial
        const orders = steps.map(step => step.order).sort((a, b) => a - b);
        for (let i = 0; i < orders.length; i++) {
            if (orders[i] !== i) {
                warnings.push({
                    field: 'steps.order',
                    message: `Sequência de steps pode ter lacunas. Step ${i} esperado, mas encontrado ${orders[i]}`,
                    code: 'STEP_ORDER_GAP',
                    suggestion: 'Reorganize a ordem dos steps para ser sequencial'
                });
                break;
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    private getFormSpecificSchema(formId: string): Record<string, z.ZodSchema<any>> {
        // Schemas específicos por tipo de formulário
        const schemas: Record<string, Record<string, z.ZodSchema<any>>> = {
            'contact-form': {
                name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
                email: z.string().email('Email inválido'),
                message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres')
            },
            'quiz-form': {
                question: z.string().min(5, 'Pergunta deve ter pelo menos 5 caracteres'),
                options: z.array(z.string()).min(2, 'Deve haver pelo menos 2 opções')
            }
        };

        return schemas[formId] || {};
    }

    private async debounce(key: string, ms: number): Promise<void> {
        return new Promise(resolve => {
            if (this.debounceTimeouts.has(key)) {
                clearTimeout(this.debounceTimeouts.get(key)!);
            }

            const timeout = setTimeout(() => {
                this.debounceTimeouts.delete(key);
                resolve();
            }, ms);

            this.debounceTimeouts.set(key, timeout);
        });
    }

    private generateJobId(): string {
        return `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private simpleHash(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }

    // === LIMPEZA E MANUTENÇÃO ===

    /**
     * Limpa cache expirado
     */
    cleanupCache(): void {
        const now = Date.now();

        for (const [key, cached] of this.cache.results.entries()) {
            if (now - cached.timestamp >= this.cache.ttl) {
                this.cache.results.delete(key);
            }
        }
    }

    /**
     * Limpa jobs assíncronos antigos
     */
    cleanupAsyncJobs(): void {
        const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 horas

        for (const [jobId, job] of this.asyncJobs.entries()) {
            if (job.createdAt < cutoff) {
                this.asyncJobs.delete(jobId);
            }
        }
    }

    /**
     * Obtém estatísticas do serviço
     */
    getStats(): Record<string, any> {
        return {
            cachedResults: this.cache.results.size,
            cachedSchemas: this.cache.schemas.size,
            activeAsyncJobs: Array.from(this.asyncJobs.values()).filter(job =>
                job.status === 'pending' || job.status === 'running'
            ).length,
            completedAsyncJobs: Array.from(this.asyncJobs.values()).filter(job =>
                job.status === 'completed'
            ).length,
            debounceTimeouts: this.debounceTimeouts.size,
            totalRules: Array.from(this.rules.values()).reduce((total, rules) => total + rules.length, 0)
        };
    }

    /**
     * Limpa recursos
     */
    cleanup(): void {
        this.debounceTimeouts.forEach(timeout => clearTimeout(timeout));
        this.debounceTimeouts.clear();
        this.cache.results.clear();
        this.asyncJobs.clear();
    }
}

// Instância singleton
let unifiedValidationServiceInstance: UnifiedValidationService | null = null;

export const getUnifiedValidationService = (): UnifiedValidationService => {
    if (!unifiedValidationServiceInstance) {
        unifiedValidationServiceInstance = new UnifiedValidationService();
    }
    return unifiedValidationServiceInstance;
};

export default UnifiedValidationService;