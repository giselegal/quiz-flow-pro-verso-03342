/**
 * 🧩 PLUGGABLE TEMPLATE SYSTEM
 * Inspirado no Unlayer Editor e Formium Wizard
 * 
 * Sistema extensível de templates que permite:
 * - Plugins de componentes
 * - Templates compostos
 * - Configuração dinâmica
 * - Hot-swapping de templates
 */

import { templateEventSystem } from '../events/TemplateEventSystem';
import { dynamicValidationSystem } from '../validation/DynamicValidationSystem';

export interface TemplatePlugin {
    id: string;
    name: string;
    version: string;
    description: string;
    author?: string;

    // Hooks do plugin
    onInstall?: (context: PluginContext) => void;
    onUninstall?: (context: PluginContext) => void;
    onActivate?: (context: PluginContext) => void;
    onDeactivate?: (context: PluginContext) => void;

    // Contribuições do plugin
    components?: PluginComponent[];
    validators?: PluginValidator[];
    templates?: PluginTemplate[];
    actions?: PluginAction[];
}

export interface PluginComponent {
    id: string;
    name: string;
    category: 'input' | 'display' | 'layout' | 'action' | 'custom';
    icon?: string;
    component: React.ComponentType<any>;
    props?: any;
    defaultSettings?: any;
}

export interface PluginValidator {
    id: string;
    name: string;
    validator: (value: any, config: any) => boolean | Promise<boolean>;
}

export interface PluginTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    template: any;
    preview?: string;
}

export interface PluginAction {
    id: string;
    name: string;
    icon?: string;
    handler: (context: ActionContext) => void | Promise<void>;
}

export interface PluginContext {
    templateId: string;
    eventSystem: typeof templateEventSystem;
    validationSystem: typeof dynamicValidationSystem;
    api: PluginAPI;
}

export interface ActionContext extends PluginContext {
    selectedElement?: any;
    formData: any;
    currentStep: number;
}

export interface PluginAPI {
    registerComponent: (component: PluginComponent) => void;
    unregisterComponent: (id: string) => void;
    registerValidator: (validator: PluginValidator) => void;
    registerTemplate: (template: PluginTemplate) => void;
    showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
    updateFormData: (path: string, value: any) => void;
    navigateToStep: (stepIndex: number) => void;
}

/**
 * Sistema de gerenciamento de plugins
 */
class PluginSystem {
    private plugins: Map<string, TemplatePlugin> = new Map();
    private activePlugins: Set<string> = new Set();
    private components: Map<string, PluginComponent> = new Map();
    private validators: Map<string, PluginValidator> = new Map();
    private templates: Map<string, PluginTemplate> = new Map();
    private actions: Map<string, PluginAction> = new Map();

    /**
     * Instalar um plugin
     */
    install(plugin: TemplatePlugin): void {
        if (this.plugins.has(plugin.id)) {
            throw new Error(`Plugin ${plugin.id} já está instalado`);
        }

        this.plugins.set(plugin.id, plugin);

        // Executar hook de instalação
        if (plugin.onInstall) {
            plugin.onInstall(this.createPluginContext(plugin.id));
        }

        templateEventSystem.emit('plugin:installed', {
            pluginId: plugin.id,
            name: plugin.name
        }, 'system');

        console.log(`🔌 Plugin ${plugin.name} instalado com sucesso`);
    }

    /**
     * Ativar um plugin
     */
    activate(pluginId: string, templateId: string): void {
        const plugin = this.plugins.get(pluginId);
        if (!plugin) {
            throw new Error(`Plugin ${pluginId} não encontrado`);
        }

        if (this.activePlugins.has(pluginId)) {
            console.warn(`Plugin ${pluginId} já está ativo`);
            return;
        }

        this.activePlugins.add(pluginId);

        // Registrar contribuições do plugin
        if (plugin.components) {
            plugin.components.forEach(component => {
                this.components.set(component.id, component);
            });
        }

        if (plugin.validators) {
            plugin.validators.forEach(validator => {
                this.validators.set(validator.id, validator);
                dynamicValidationSystem.registerCustomValidator(
                    validator.id,
                    validator.validator
                );
            });
        }

        if (plugin.templates) {
            plugin.templates.forEach(template => {
                this.templates.set(template.id, template);
            });
        }

        if (plugin.actions) {
            plugin.actions.forEach(action => {
                this.actions.set(action.id, action);
            });
        }

        // Executar hook de ativação
        if (plugin.onActivate) {
            plugin.onActivate(this.createPluginContext(pluginId, templateId));
        }

        templateEventSystem.emit('plugin:activated', {
            pluginId,
            name: plugin.name
        }, templateId);

        console.log(`✅ Plugin ${plugin.name} ativado`);
    }

    /**
     * Desativar um plugin
     */
    deactivate(pluginId: string, templateId: string): void {
        const plugin = this.plugins.get(pluginId);
        if (!plugin || !this.activePlugins.has(pluginId)) {
            return;
        }

        this.activePlugins.delete(pluginId);

        // Remover contribuições do plugin
        if (plugin.components) {
            plugin.components.forEach(component => {
                this.components.delete(component.id);
            });
        }

        if (plugin.validators) {
            plugin.validators.forEach(validator => {
                this.validators.delete(validator.id);
            });
        }

        if (plugin.templates) {
            plugin.templates.forEach(template => {
                this.templates.delete(template.id);
            });
        }

        if (plugin.actions) {
            plugin.actions.forEach(action => {
                this.actions.delete(action.id);
            });
        }

        // Executar hook de desativação
        if (plugin.onDeactivate) {
            plugin.onDeactivate(this.createPluginContext(pluginId, templateId));
        }

        templateEventSystem.emit('plugin:deactivated', {
            pluginId,
            name: plugin.name
        }, templateId);

        console.log(`❌ Plugin ${plugin.name} desativado`);
    }

    /**
     * Desinstalar um plugin
     */
    uninstall(pluginId: string, templateId: string): void {
        const plugin = this.plugins.get(pluginId);
        if (!plugin) {
            return;
        }

        // Desativar primeiro se estiver ativo
        if (this.activePlugins.has(pluginId)) {
            this.deactivate(pluginId, templateId);
        }

        // Executar hook de desinstalação
        if (plugin.onUninstall) {
            plugin.onUninstall(this.createPluginContext(pluginId, templateId));
        }

        this.plugins.delete(pluginId);

        templateEventSystem.emit('plugin:uninstalled', {
            pluginId,
            name: plugin.name
        }, templateId);

        console.log(`🗑️ Plugin ${plugin.name} desinstalado`);
    }

    /**
     * Obter componentes disponíveis
     */
    getAvailableComponents(category?: string): PluginComponent[] {
        const components = Array.from(this.components.values());
        return category
            ? components.filter(comp => comp.category === category)
            : components;
    }

    /**
     * Obter templates disponíveis
     */
    getAvailableTemplates(category?: string): PluginTemplate[] {
        const templates = Array.from(this.templates.values());
        return category
            ? templates.filter(tpl => tpl.category === category)
            : templates;
    }

    /**
     * Obter ações disponíveis
     */
    getAvailableActions(): PluginAction[] {
        return Array.from(this.actions.values());
    }

    /**
     * Obter plugin por ID
     */
    getPlugin(pluginId: string): TemplatePlugin | undefined {
        return this.plugins.get(pluginId);
    }

    /**
     * Listar todos os plugins
     */
    listPlugins(): TemplatePlugin[] {
        return Array.from(this.plugins.values());
    }

    /**
     * Listar plugins ativos
     */
    listActivePlugins(): TemplatePlugin[] {
        return Array.from(this.activePlugins)
            .map(id => this.plugins.get(id))
            .filter(Boolean) as TemplatePlugin[];
    }

    /**
     * Criar contexto do plugin
     */
    private createPluginContext(_pluginId: string, templateId: string = 'system'): PluginContext {
        return {
            templateId,
            eventSystem: templateEventSystem,
            validationSystem: dynamicValidationSystem,
            api: this.createPluginAPI(templateId)
        };
    }

    /**
     * Criar API do plugin
     */
    private createPluginAPI(templateId: string): PluginAPI {
        return {
            registerComponent: (component) => {
                this.components.set(component.id, component);
            },
            unregisterComponent: (id) => {
                this.components.delete(id);
            },
            registerValidator: (validator) => {
                this.validators.set(validator.id, validator);
                dynamicValidationSystem.registerCustomValidator(
                    validator.id,
                    validator.validator
                );
            },
            registerTemplate: (template) => {
                this.templates.set(template.id, template);
            },
            showNotification: (message, type = 'info') => {
                templateEventSystem.emit('notification:show', {
                    message,
                    type
                }, templateId);
            },
            updateFormData: (path, value) => {
                templateEventSystem.emit('form:update', {
                    path,
                    value
                }, templateId);
            },
            navigateToStep: (stepIndex) => {
                templateEventSystem.emit('navigation:step', {
                    stepIndex
                }, templateId);
            }
        };
    }
}

// Instância global do sistema de plugins
export const pluginSystem = new PluginSystem();

/**
 * Hook para usar plugins em componentes React
 */
import { useState, useEffect } from 'react';

export function usePluginSystem(templateId: string) {
    const [activePlugins, setActivePlugins] = useState<TemplatePlugin[]>([]);
    const [availableComponents, setAvailableComponents] = useState<PluginComponent[]>([]);

    useEffect(() => {
        // Atualizar estado quando plugins mudarem
        const updateState = () => {
            setActivePlugins(pluginSystem.listActivePlugins());
            setAvailableComponents(pluginSystem.getAvailableComponents());
        };

        updateState();

        // Escutar eventos de plugins
        const cleanups = [
            templateEventSystem.addEventListener('plugin:activated', updateState),
            templateEventSystem.addEventListener('plugin:deactivated', updateState),
            templateEventSystem.addEventListener('plugin:installed', updateState),
            templateEventSystem.addEventListener('plugin:uninstalled', updateState)
        ];

        return () => {
            cleanups.forEach(cleanup => cleanup());
        };
    }, []);

    return {
        activePlugins,
        availableComponents,
        availableTemplates: pluginSystem.getAvailableTemplates(),
        availableActions: pluginSystem.getAvailableActions(),
        activatePlugin: (pluginId: string) => pluginSystem.activate(pluginId, templateId),
        deactivatePlugin: (pluginId: string) => pluginSystem.deactivate(pluginId, templateId)
    };
}