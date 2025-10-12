/**
 * Template Adapter
 * 
 * Adapter pattern para unificar templates v2.0 e v3.0
 * Detecta versão automaticamente e valida estrutura
 * 
 * @version 1.0.0
 * @date 2025-10-12
 */

import type {
    TemplateV2,
    TemplateV3,
    TemplateVersion,
    AnyTemplate,
} from '@/types/template-v3.types';

/**
 * Classe principal do adapter
 */
export class TemplateAdapter {
    /**
     * Detecta a versão do template
     * 
     * @param template - Template a ser analisado
     * @returns Versão detectada
     * 
     * @example
     * ```typescript
     * const version = TemplateAdapter.detectVersion(template);
     * // "3.0" | "2.1" | "2.0" | "1.0"
     * ```
     */
    static detectVersion(template: any): TemplateVersion {
        if (!template || typeof template !== 'object') {
            throw new Error('Template inválido: deve ser um objeto');
        }

        // Verificar se tem templateVersion explícito
        const version = template.templateVersion;

        if (version) {
            // v3.0
            if (version === "3.0" || version === "3") {
                return "3.0";
            }

            // v2.1
            if (version === "2.1") {
                return "2.1";
            }

            // v2.0
            if (version === "2.0" || version === "2") {
                return "2.0";
            }

            // v1.0
            if (version === "1.0" || version === "1") {
                return "1.0";
            }
        }

        // Detecção heurística por estrutura
        return this.detectVersionByStructure(template);
    }

    /**
     * Detecta versão pela estrutura do template
     * 
     * @private
     * @param template - Template a ser analisado
     * @returns Versão detectada
     */
    private static detectVersionByStructure(template: any): TemplateVersion {
        // v3.0 tem: sections, theme, offer
        if (template.sections && template.theme && template.offer) {
            return "3.0";
        }

        // v2.x tem: blocks, metadata, layout
        if (template.blocks && template.metadata) {
            return "2.0";
        }

        // v1.0 tem apenas blocks
        if (template.blocks) {
            return "1.0";
        }

        // Fallback para v2.0
        console.warn('Não foi possível detectar versão do template, assumindo v2.0');
        return "2.0";
    }

    /**
     * Verifica se o template é v3.0
     * 
     * @param template - Template a ser verificado
     * @returns true se for v3.0
     * 
     * @example
     * ```typescript
     * if (TemplateAdapter.isV3(template)) {
     *   // Processar como v3.0
     * }
     * ```
     */
    static isV3(template: any): template is TemplateV3 {
        return this.detectVersion(template) === "3.0";
    }

    /**
     * Verifica se o template é v2.x
     * 
     * @param template - Template a ser verificado
     * @returns true se for v2.0 ou v2.1
     */
    static isV2(template: any): template is TemplateV2 {
        const version = this.detectVersion(template);
        return version === "2.0" || version === "2.1";
    }

    /**
     * Normaliza template para formato unificado
     * Valida estrutura e retorna template tipado
     * 
     * @param template - Template a ser normalizado
     * @returns Template validado (v2 ou v3)
     * 
     * @example
     * ```typescript
     * const normalized = TemplateAdapter.normalize(rawTemplate);
     * if (TemplateAdapter.isV3(normalized)) {
     *   // TypeScript sabe que é TemplateV3
     *   console.log(normalized.sections);
     * }
     * ```
     */
    static normalize(template: any): AnyTemplate {
        const version = this.detectVersion(template);

        if (version === "3.0") {
            return this.validateV3(template);
        } else {
            return this.validateV2(template);
        }
    }

    /**
     * Valida estrutura do template v3.0
     * 
     * @private
     * @param template - Template v3 a ser validado
     * @returns Template v3 validado
     * @throws Error se estrutura inválida
     */
    private static validateV3(template: any): TemplateV3 {
        const errors: string[] = [];

        // Validar campos obrigatórios
        if (!template.templateVersion || template.templateVersion !== "3.0") {
            errors.push('templateVersion deve ser "3.0"');
        }

        if (!template.metadata || typeof template.metadata !== 'object') {
            errors.push('metadata é obrigatório e deve ser objeto');
        }

        if (!template.offer || typeof template.offer !== 'object') {
            errors.push('offer é obrigatório e deve ser objeto');
        }

        if (!template.theme || typeof template.theme !== 'object') {
            errors.push('theme é obrigatório e deve ser objeto');
        }

        if (!template.layout || typeof template.layout !== 'object') {
            errors.push('layout é obrigatório e deve ser objeto');
        }

        if (!template.sections || !Array.isArray(template.sections)) {
            errors.push('sections é obrigatório e deve ser array');
        }

        // Validar sections
        if (template.sections) {
            template.sections.forEach((section: any, index: number) => {
                if (!section.id) {
                    errors.push(`Section ${index}: id é obrigatório`);
                }
                if (!section.type) {
                    errors.push(`Section ${index}: type é obrigatório`);
                }
                if (typeof section.enabled !== 'boolean') {
                    errors.push(`Section ${index}: enabled deve ser boolean`);
                }
                if (typeof section.order !== 'number') {
                    errors.push(`Section ${index}: order deve ser number`);
                }
                if (!section.props || typeof section.props !== 'object') {
                    errors.push(`Section ${index}: props é obrigatório e deve ser objeto`);
                }
            });
        }

        // Validar theme
        if (template.theme) {
            if (!template.theme.colors || typeof template.theme.colors !== 'object') {
                errors.push('theme.colors é obrigatório');
            }
            if (!template.theme.fonts || typeof template.theme.fonts !== 'object') {
                errors.push('theme.fonts é obrigatório');
            }
            if (!template.theme.spacing || typeof template.theme.spacing !== 'object') {
                errors.push('theme.spacing é obrigatório');
            }
            if (!template.theme.borderRadius || typeof template.theme.borderRadius !== 'object') {
                errors.push('theme.borderRadius é obrigatório');
            }
        }

        // Validar offer
        if (template.offer) {
            if (!template.offer.productName) {
                errors.push('offer.productName é obrigatório');
            }
            if (!template.offer.pricing || typeof template.offer.pricing !== 'object') {
                errors.push('offer.pricing é obrigatório');
            }
        }

        // Lançar erro se houver problemas
        if (errors.length > 0) {
            throw new Error(
                `Template v3.0 inválido:\n${errors.map(e => `  - ${e}`).join('\n')}`
            );
        }

        return template as TemplateV3;
    }

    /**
     * Valida estrutura do template v2.x
     * 
     * @private
     * @param template - Template v2 a ser validado
     * @returns Template v2 validado
     */
    private static validateV2(template: any): TemplateV2 {
        const errors: string[] = [];

        // Validações mais lenientes para v2
        if (template.blocks && !Array.isArray(template.blocks)) {
            errors.push('blocks deve ser array se presente');
        }

        if (template.metadata && typeof template.metadata !== 'object') {
            errors.push('metadata deve ser objeto se presente');
        }

        if (errors.length > 0) {
            console.warn(
                `Template v2.0 com problemas:\n${errors.map(e => `  - ${e}`).join('\n')}`
            );
        }

        return template as TemplateV2;
    }

    /**
     * Converte template v2 para v3 (implementação futura)
     * 
     * @param templateV2 - Template v2 a ser convertido
     * @returns Template v3 convertido
     * @throws Error - Ainda não implementado
     * 
     * @todo Implementar conversão automática v2→v3
     */
    static convertV2ToV3(templateV2: TemplateV2): TemplateV3 {
        throw new Error(
            'Conversão v2→v3 ainda não implementada. ' +
            'Use templates nativos v3.0 ou aguarde próxima versão.'
        );
    }

    /**
     * Retorna informações sobre o template
     * 
     * @param template - Template a ser analisado
     * @returns Objeto com informações
     * 
     * @example
     * ```typescript
     * const info = TemplateAdapter.getInfo(template);
     * console.log(info);
     * // {
     * //   version: "3.0",
     * //   isValid: true,
     * //   sectionsCount: 11,
     * //   hasTheme: true,
     * //   hasOffer: true
     * // }
     * ```
     */
    static getInfo(template: any): {
        version: TemplateVersion;
        isValid: boolean;
        sectionsCount?: number;
        blocksCount?: number;
        hasTheme: boolean;
        hasOffer: boolean;
        metadata?: {
            id?: string;
            name?: string;
            category?: string;
        };
    } {
        try {
            const version = this.detectVersion(template);
            const normalized = this.normalize(template);

            const info: any = {
                version,
                isValid: true,
                hasTheme: !!template.theme,
                hasOffer: !!template.offer,
            };

            if (this.isV3(normalized)) {
                info.sectionsCount = normalized.sections?.length || 0;
                info.metadata = {
                    id: normalized.metadata?.id,
                    name: normalized.metadata?.name,
                    category: normalized.metadata?.category,
                };
            } else {
                info.blocksCount = normalized.blocks?.length || 0;
                info.metadata = {
                    id: normalized.metadata?.id,
                    name: normalized.metadata?.name,
                };
            }

            return info;
        } catch (error) {
            return {
                version: "2.0",
                isValid: false,
                hasTheme: false,
                hasOffer: false,
            };
        }
    }

    /**
     * Filtra sections habilitadas e ordena
     * 
     * @param template - Template v3
     * @returns Array de sections ordenadas e habilitadas
     * 
     * @example
     * ```typescript
     * const activeSections = TemplateAdapter.getActiveSections(templateV3);
     * activeSections.forEach(section => {
     *   console.log(section.id, section.order);
     * });
     * ```
     */
    static getActiveSections(template: TemplateV3) {
        if (!this.isV3(template)) {
            throw new Error('getActiveSections() só funciona com templates v3.0');
        }

        return template.sections
            .filter(section => section.enabled)
            .sort((a, b) => a.order - b.order);
    }

    /**
     * Busca section por ID
     * 
     * @param template - Template v3
     * @param sectionId - ID da section
     * @returns Section encontrada ou undefined
     */
    static findSection(template: TemplateV3, sectionId: string) {
        if (!this.isV3(template)) {
            throw new Error('findSection() só funciona com templates v3.0');
        }

        return template.sections.find(section => section.id === sectionId);
    }

    /**
     * Gera CSS variables do theme
     * 
     * @param template - Template v3
     * @returns Objeto com CSS variables
     * 
     * @example
     * ```typescript
     * const cssVars = TemplateAdapter.getCSSVariables(templateV3);
     * // { "--color-primary": "#B89B7A", ... }
     * ```
     */
    static getCSSVariables(template: TemplateV3): Record<string, string> {
        if (!this.isV3(template)) {
            throw new Error('getCSSVariables() só funciona com templates v3.0');
        }

        const { theme } = template;
        const vars: Record<string, string> = {};

        // Colors
        Object.entries(theme.colors).forEach(([key, value]) => {
            vars[`--color-${key}`] = value;
        });

        // Fonts
        vars['--font-heading'] = theme.fonts.heading;
        vars['--font-body'] = theme.fonts.body;
        vars['--font-fallback'] = theme.fonts.fallback;

        // Spacing
        Object.entries(theme.spacing).forEach(([key, value]) => {
            vars[`--spacing-${key}`] = value;
        });

        // Border Radius
        Object.entries(theme.borderRadius).forEach(([key, value]) => {
            vars[`--radius-${key}`] = value;
        });

        return vars;
    }
}

/**
 * Type guard para verificar se é TemplateV3
 */
export function isTemplateV3(template: AnyTemplate): template is TemplateV3 {
    return TemplateAdapter.isV3(template);
}

/**
 * Type guard para verificar se é TemplateV2
 */
export function isTemplateV2(template: AnyTemplate): template is TemplateV2 {
    return TemplateAdapter.isV2(template);
}

/**
 * Hook helper para templates (futuro)
 * @todo Criar hook React para facilitar uso
 */
export function useTemplate(template: AnyTemplate) {
    // Implementação futura com React hooks
    return {
        version: TemplateAdapter.detectVersion(template),
        isV3: TemplateAdapter.isV3(template),
        info: TemplateAdapter.getInfo(template),
    };
}
