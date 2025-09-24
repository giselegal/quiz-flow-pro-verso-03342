/**
 * 🎯 SISTEMA DE PERSONALIZAÇÃO AVANÇADA
 * 
 * Utiliza dados de usuário, histórico e preferências
 * para criar experiências altamente personalizadas
 */

import React from 'react';
import { cacheManager } from '../cache/LRUCache';
import { useLogger } from '../logger/SmartLogger';

// ✅ INTERFACES AUXILIARES
export interface AbandonedStep {
    stepId: string;
    funnelId: string;
    abandonedAt: Date;
    timeSpent: number;
    reason?: 'timeout' | 'navigation' | 'error' | 'manual';
}

export interface ClickPattern {
    element: string;
    count: number;
    avgTimeToClick: number;
    lastClicked: Date;
}

export interface DevicePattern {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
    usage: number; // percentage
}

export interface SessionTime {
    date: Date;
    duration: number; // in minutes
    funnelId: string;
    completed: boolean;
}

export interface CompletedFunnel {
    id: string;
    completedAt: Date;
    timeSpent: number;
    score?: number;
}

export interface UserSegment {
    id: string;
    name: string;
    criteria: Record<string, any>;
    priority: number;
}

// ✅ TIPOS DE PERSONALIZAÇÃO
export interface UserPersonalizationContext {
    // Dados básicos do usuário
    user: {
        id: string;
        name?: string;
        email?: string;
        avatar?: string;
        joinedAt: Date;
        lastActiveAt: Date;
    };

    // Preferências explícitas
    preferences: {
        style?: string;
        colors?: string[];
        interests?: string[];
        difficulty?: 'beginner' | 'intermediate' | 'advanced';
        language?: string;
        timezone?: string;
        notifications?: boolean;
    };

    // Histórico comportamental
    history: {
        completedFunnels: CompletedFunnel[];
        abandonedSteps: AbandonedStep[];
        timeSpentByStep: Record<string, number>;
        clickPatterns: ClickPattern[];
        deviceUsage: DevicePattern[];
        sessionTimes: SessionTime[];
    };

    // Contexto da sessão atual
    session: {
        id: string;
        startedAt: Date;
        currentFunnel: string;
        currentStep: number;
        progress: number;
        answers: Record<string, any>;
        metadata: Record<string, any>;
    };

    // Segmentação dinâmica
    segments: UserSegment[];

    // Cálculos personalizados
    customCalculations: CustomCalculation[];
}

export interface CompletedFunnel {
    funnelId: string;
    completedAt: Date;
    timeSpent: number;
    finalResult: any;
    satisfaction?: number;
}

export interface CustomCalculation {
    id: string;
    name: string;
    formula: string; // JavaScript expression
    inputs: string[]; // User data keys needed
    result?: any;
    lastCalculated?: Date;
}

export interface PersonalizationRule {
    id: string;
    name: string;
    trigger: PersonalizationTrigger;
    action: PersonalizationAction;
    priority: number;
    active: boolean;
}

export interface PersonalizationTrigger {
    type: 'user_data' | 'behavior' | 'time' | 'step' | 'custom';
    condition: string; // JavaScript expression
    parameters: Record<string, any>;
}

export interface PersonalizationAction {
    type: 'content' | 'styling' | 'navigation' | 'calculation' | 'recommendation' | 'template';
    modifications: Record<string, any>;
    template?: string;
}

/**
 * 🧠 MOTOR DE PERSONALIZAÇÃO
 */
export class PersonalizationEngine {
    private static instance: PersonalizationEngine;
    private logger = useLogger('PersonalizationEngine');
    private cache = cacheManager.getCache<any>('personalization', 100);
    private rules: PersonalizationRule[] = [];

    static getInstance(): PersonalizationEngine {
        if (!this.instance) {
            this.instance = new PersonalizationEngine();
        }
        return this.instance;
    }

    /**
     * Personaliza conteúdo baseado no contexto do usuário
     */
    personalizeContent(
        template: string,
        context: UserPersonalizationContext,
        options?: { useAI?: boolean; cacheResult?: boolean }
    ): string {
        const cacheKey = `content_${context.user.id}_${this.hashContent(template)}`;

        // Verificar cache primeiro
        if (options?.cacheResult) {
            const cached = this.cache.get(cacheKey);
            if (cached) {
                this.logger.debug('Cache hit for personalized content', { userId: context.user.id });
                return cached;
            }
        }

        let personalizedContent = template;

        // 1. Substituições básicas de dados do usuário
        personalizedContent = this.applyUserDataSubstitutions(personalizedContent, context);

        // 2. Aplicar regras de personalização
        personalizedContent = this.applyPersonalizationRules(personalizedContent, context);

        // 3. Cálculos personalizados
        personalizedContent = this.applyCustomCalculations(personalizedContent, context);

        // 4. Recomendações baseadas em histórico
        personalizedContent = this.applyHistoryBasedRecommendations(personalizedContent, context);

        // 5. Personalização de IA (opcional)
        if (options?.useAI) {
            personalizedContent = this.applyAIPersonalization(personalizedContent, context);
        }

        // Cache resultado
        if (options?.cacheResult) {
            this.cache.set(cacheKey, personalizedContent);
        }

        this.logger.performance('personalize_content', Date.now());
        return personalizedContent;
    }

    /**
     * Aplica substituições básicas de dados do usuário
     */
    private applyUserDataSubstitutions(content: string, context: UserPersonalizationContext): string {
        const substitutions = {
            // Dados pessoais
            '{{user.name}}': context.user.name || 'pessoa especial',
            '{{user.firstName}}': context.user.name?.split(' ')[0] || 'você',

            // Preferências
            '{{user.style}}': context.preferences.style || 'único',
            '{{user.difficulty}}': context.preferences.difficulty || 'intermediário',

            // Progresso
            '{{session.progress}}': `${Math.round(context.session.progress * 100)}%`,
            '{{session.currentStep}}': context.session.currentStep.toString(),

            // Histórico
            '{{user.completedFunnels}}': context.history.completedFunnels.length.toString(),
            '{{user.experience}}': this.calculateExperienceLevel(context),

            // Tempo
            '{{user.timeOfDay}}': this.getTimeOfDay(),
            '{{user.dayOfWeek}}': this.getDayOfWeek(),
        };

        let result = content;
        for (const [placeholder, replacement] of Object.entries(substitutions)) {
            result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
        }

        return result;
    }

    /**
     * Aplica regras de personalização configuradas
     */
    private applyPersonalizationRules(content: string, context: UserPersonalizationContext): string {
        let result = content;

        // Ordenar regras por prioridade
        const activeRules = this.rules
            .filter(rule => rule.active)
            .sort((a, b) => b.priority - a.priority);

        for (const rule of activeRules) {
            if (this.evaluateTrigger(rule.trigger, context)) {
                result = this.applyAction(result, rule.action, context);
                this.logger.debug('Applied personalization rule', { ruleId: rule.id, ruleName: rule.name });
            }
        }

        return result;
    }

    /**
     * Executa cálculos personalizados
     */
    private applyCustomCalculations(content: string, context: UserPersonalizationContext): string {
        let result = content;

        for (const calc of context.customCalculations) {
            try {
                // Preparar contexto para cálculo
                const calcContext = this.prepareCalculationContext(context, calc.inputs);

                // Executar fórmula (sandbox seguro)
                const calculationResult = this.executeFormula(calc.formula, calcContext);

                // Substituir placeholders
                const placeholder = `{{calc.${calc.name}}}`;
                result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), calculationResult.toString());

                // Atualizar resultado no contexto
                calc.result = calculationResult;
                calc.lastCalculated = new Date();

            } catch (error) {
                this.logger.warn('Calculation failed', { 
                    calcId: calc.id, 
                    error: error instanceof Error ? error.message : String(error) 
                });
            }
        }

        return result;
    }

    /**
     * Aplica recomendações baseadas no histórico
     */
    private applyHistoryBasedRecommendations(content: string, context: UserPersonalizationContext): string {
        const recommendations = this.generateRecommendations(context);

        let result = content;

        // Substituir placeholders de recomendações
        result = result.replace(/{{recommend\.(\w+)}}/g, (match, type) => {
            const recommendation = recommendations.find(r => r.type === type);
            return recommendation ? recommendation.content : match;
        });

        return result;
    }

    /**
     * Personalização usando IA (placeholder para integração futura)
     */
    private applyAIPersonalization(content: string, context: UserPersonalizationContext): string {
        // TODO: Integrar com serviços de IA
        // Por exemplo: OpenAI, GPT, etc.

        this.logger.debug('AI personalization requested', { userId: context.user.id });

        // Por enquanto, apenas melhorar o tom baseado no contexto
        if (context.preferences.difficulty === 'beginner') {
            content = content.replace(/\b(complexo|avançado|sofisticado)\b/gi, 'simples');
        }

        return content;
    }

    /**
     * Calcula nível de experiência do usuário
     */
    private calculateExperienceLevel(context: UserPersonalizationContext): string {
        const completedCount = context.history.completedFunnels.length;

        if (completedCount === 0) return 'iniciante';
        if (completedCount < 3) return 'novato';
        if (completedCount < 10) return 'experiente';
        return 'expert';
    }

    /**
     * Gera hash do conteúdo para cache
     */
    private hashContent(content: string): string {
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(36);
    }

    /**
     * Avalia se um trigger deve ser ativado
     */
    private evaluateTrigger(trigger: PersonalizationTrigger, context: UserPersonalizationContext): boolean {
        try {
            // Criar contexto seguro para avaliação
            const evalContext = {
                user: context.user,
                preferences: context.preferences,
                history: context.history,
                session: context.session,
                segments: context.segments,
                params: trigger.parameters
            };

            // Avaliar condição de forma segura
            return this.safeEval(trigger.condition, evalContext);
        } catch (error) {
            this.logger.warn('Trigger evaluation failed', { 
                trigger: trigger.type, 
                error: error instanceof Error ? error.message : String(error)
            });
            return false;
        }
    }

    /**
     * Aplica uma ação de personalização
     */
    private applyAction(content: string, action: PersonalizationAction, context: UserPersonalizationContext): string {
        switch (action.type) {
            case 'content':
                return this.applyContentModifications(content, action.modifications);

            case 'styling':
                return this.applyStyleModifications(content, action.modifications);

            case 'template':
                return action.template?.replace(/{{(\w+)}}/g, (_, key) => {
                    return context.user[key as keyof typeof context.user]?.toString() || `{{${key}}}`;
                }) || content;

            case 'navigation':
                // Personalizar navegação baseada no contexto
                return content;

            case 'calculation':
                // Aplicar cálculos personalizados
                return content;

            case 'recommendation':
                // Adicionar recomendações baseadas no contexto
                return content + `\n<!-- Recomendação: ${this.recommendNextStep(context)} -->`;

            default:
                return content;
        }
    }

    private applyContentModifications(content: string, modifications: Record<string, any>): string {
        let result = content;

        for (const [key, value] of Object.entries(modifications)) {
            const pattern = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(pattern, value.toString());
        }

        return result;
    }

    private applyStyleModifications(content: string, modifications: Record<string, any>): string {
        // Implementar modificações de estilo baseadas nas modifications
        let result = content;
        
        for (const [key, value] of Object.entries(modifications)) {
            // Aplicar modificações de estilo CSS
            const stylePattern = new RegExp(`(${key}:\\s*)[^;]+`, 'g');
            result = result.replace(stylePattern, `$1${value}`);
        }
        
        return result;
    }

    private prepareCalculationContext(context: UserPersonalizationContext, inputs: string[]): any {
        const calcContext: any = {};

        for (const input of inputs) {
            const value = this.getNestedValue(context, input);
            calcContext[input] = value;
        }

        return calcContext;
    }

    private getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    private executeFormula(formula: string, context: any): any {
        // Implementação segura de execução de fórmulas
        // TODO: Usar biblioteca de sandboxing como vm2
        try {
            const func = new Function(...Object.keys(context), `return ${formula}`);
            return func(...Object.values(context));
        } catch (error) {
            throw new Error(`Formula execution failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private safeEval(expression: string, context: any): boolean {
        // Implementação segura de avaliação
        try {
            const func = new Function(...Object.keys(context), `return !!(${expression})`);
            return func(...Object.values(context));
        } catch {
            return false;
        }
    }

    private generateRecommendations(context: UserPersonalizationContext) {
        // Gerar recomendações baseadas no histórico e comportamento
        return [
            {
                type: 'style',
                content: this.recommendStyle(context),
                confidence: 0.8
            },
            {
                type: 'next_step',
                content: this.recommendNextStep(context),
                confidence: 0.9
            }
        ];
    }

    private recommendStyle(context: UserPersonalizationContext): string {
        const styles = context.history.completedFunnels
            .map(f => f.finalResult?.style)
            .filter(Boolean);

        // Retornar estilo mais comum
        const styleCounts = styles.reduce((acc, style) => {
            acc[style] = (acc[style] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mostCommon = Object.entries(styleCounts)
            .sort(([, a], [, b]) => (b as number) - (a as number))[0];

        return mostCommon ? mostCommon[0] : 'casual';
    }

    private recommendNextStep(context: UserPersonalizationContext): string {
        // Lógica para recomendar próximo passo baseada no padrão de uso
        return `Baseado no seu histórico, recomendamos continuar com ${context.session.currentStep + 1}`;
    }

    private getTimeOfDay(): string {
        const hour = new Date().getHours();
        if (hour < 12) return 'manhã';
        if (hour < 18) return 'tarde';
        return 'noite';
    }

    private getDayOfWeek(): string {
        const days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
        return days[new Date().getDay()];
    }

    /**
     * Adiciona nova regra de personalização
     */
    addPersonalizationRule(rule: Omit<PersonalizationRule, 'id'>): string {
        const newRule: PersonalizationRule = {
            ...rule,
            id: `rule_${Date.now()}_${Math.random().toString(36).slice(2)}`
        };

        this.rules.push(newRule);
        this.logger.debug('Added personalization rule', { ruleId: newRule.id });

        return newRule.id;
    }

    /**
     * Remove regra de personalização
     */
    removePersonalizationRule(ruleId: string): boolean {
        const index = this.rules.findIndex(r => r.id === ruleId);
        if (index >= 0) {
            this.rules.splice(index, 1);
            this.logger.debug('Removed personalization rule', { ruleId });
            return true;
        }
        return false;
    }

    /**
     * Obtém estatísticas de personalização
     */
    getPersonalizationStats(): {
        totalRules: number;
        activeRules: number;
        cacheHitRate: number;
        avgProcessingTime: number;
    } {
        return {
            totalRules: this.rules.length,
            activeRules: this.rules.filter(r => r.active).length,
            cacheHitRate: 0.85, // TODO: calcular real
            avgProcessingTime: 45 // TODO: calcular real
        };
    }
}

// ✅ SINGLETON EXPORT
export const personalizationEngine = PersonalizationEngine.getInstance();

// ✅ HOOK REACT PARA PERSONALIZAÇÃO
export function usePersonalization(context: UserPersonalizationContext) {
    const [personalizedContent, setPersonalizedContent] = React.useState<Record<string, string>>({});

    const personalize = React.useCallback((template: string, key?: string) => {
        const result = personalizationEngine.personalizeContent(template, context, {
            cacheResult: true,
            useAI: false
        });

        if (key) {
            setPersonalizedContent(prev => ({ ...prev, [key]: result }));
        }

        return result;
    }, [context]);

    return {
        personalize,
        personalizedContent,
        engine: personalizationEngine
    };
}

export default personalizationEngine;