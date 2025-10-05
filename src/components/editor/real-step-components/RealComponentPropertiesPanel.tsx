/**
 * 🎯 PAINEL DE PROPRIEDADES PARA COMPONENTES REAIS
 * 
 * Painel específico para editar propriedades dos componentes modulares das 21 etapas reais
 * Baseado no design profissional do sistema Cakto
 */

import React from 'react';
import { RealComponentProps, RealComponentType } from './types';
import { cn } from '@/lib/utils';
import { Settings, X, Edit3, Palette, Layout, ArrowLeft, Image, BarChart3 } from 'lucide-react';

interface RealComponentPropertiesPanelProps {
    component: RealComponentProps | null;
    onUpdate: (updates: Partial<RealComponentProps>) => void;
    onClose: () => void;
}

// 🎛️ Componente Switch profissional
const Switch: React.FC<{
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}> = ({ id, checked, onChange, label }) => (
    <div className="flex items-center space-x-2">
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            data-state={checked ? "checked" : "unchecked"}
            value="on"
            className={cn(
                "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "disabled:cursor-not-allowed disabled:opacity-50",
                checked ? "bg-primary" : "bg-input"
            )}
            id={id}
            onClick={() => onChange(!checked)}
        >
            <span
                data-state={checked ? "checked" : "unchecked"}
                className={cn(
                    "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
                    checked ? "translate-x-5" : "translate-x-0"
                )}
            />
        </button>
        <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor={id}
        >
            {label}
        </label>
    </div>
);

// 🎨 Componente Card
const Card: React.FC<{
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}> = ({ title, children, icon }) => (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center space-x-2">
                {icon}
                <p className="text-sm text-muted-foreground">{title}</p>
            </div>
        </div>
        <div className="p-6 pt-0">
            {children}
        </div>
    </div>
);

export const RealComponentPropertiesPanel: React.FC<RealComponentPropertiesPanelProps> = ({
    component,
    onUpdate,
    onClose
}) => {
    if (!component) {
        return (
            <div className="overflow-hidden canvas-editor hidden md:block w-full max-w-[24rem] relative border-l">
                <div className="h-full w-full rounded-[inherit] overflow-hidden">
                    <div className="grid gap-4 px-4 pb-4 pt-2 my-4">
                        <div className="text-center text-muted-foreground py-12">
                            <Settings size={48} className="mx-auto mb-4 text-muted-foreground/50" />
                            <h3 className="text-lg font-medium mb-2">Selecione um Componente</h3>
                            <p className="text-sm mb-4">
                                Clique em qualquer componente no canvas para editar suas propriedades
                            </p>
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                                <h4 className="font-medium text-blue-900 mb-2">💡 Como usar:</h4>
                                <ul className="text-xs text-blue-700 space-y-1">
                                    <li>• Clique em um componente no canvas</li>
                                    <li>• Veja o componente destacado em azul</li>
                                    <li>• Use este painel para editar propriedades</li>
                                    <li>• Mudanças são salvas automaticamente</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleContentUpdate = (updates: Record<string, any>) => {
        onUpdate({
            content: { ...component.content, ...updates }
        });
    };

    const handlePropertiesUpdate = (updates: Record<string, any>) => {
        onUpdate({
            properties: { ...component.properties, ...updates }
        });
    };

    return (
        <div className="overflow-hidden canvas-editor hidden md:block w-full max-w-[24rem] relative border-l">
            <div className="h-full w-full rounded-[inherit]" style={{ overflow: "hidden scroll" }}>
                <div className="grid gap-4 px-4 pb-4 pt-2 my-4">

                    {/* Header com botão fechar */}
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-semibold">Propriedades</h3>
                            <div className="flex items-center space-x-2">
                                <p className="text-sm text-muted-foreground">{component.type}</p>
                                <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    <span>Auto-save</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-muted rounded"
                        >
                            <X size={16} className="text-muted-foreground" />
                        </button>
                    </div>

                    {/* Card: Informações do Componente */}
                    <Card title="Informações do Componente" icon={<Edit3 size={16} />}>
                        <div className="grid gap-3">
                            <div>
                                <label className="text-sm font-medium" htmlFor="componentId">
                                    ID do Componente
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    id="componentId"
                                    type="text"
                                    value={component.id}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium" htmlFor="componentOrder">
                                    Ordem
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    id="componentOrder"
                                    type="number"
                                    value={component.order || 0}
                                    onChange={(e) => onUpdate({ order: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Card: Conteúdo Específico do Componente */}
                    {renderContentCard(component.type as RealComponentType, component.content, handleContentUpdate)}

                    {/* Card: Configurações de Estilo */}
                    <Card title="Configurações de Estilo" icon={<Palette size={16} />}>
                        {renderStyleControls(component.properties, handlePropertiesUpdate)}
                    </Card>

                    <div className="py-4"></div>
                </div>
            </div>
        </div>
    );
};

// 📝 Renderizar card de conteúdo específico por tipo
function renderContentCard(
    type: RealComponentType,
    content: Record<string, any>,
    onUpdate: (updates: Record<string, any>) => void
) {
    switch (type) {
        case 'quiz-intro-header':
            return (
                <Card title="Header" icon={<ArrowLeft size={16} />}>
                    <div className="grid gap-2">
                        <div>
                            <label className="text-sm font-medium" htmlFor="headerTitle">
                                Título
                            </label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                id="headerTitle"
                                type="text"
                                value={content.title || ''}
                                onChange={(e) => onUpdate({ title: e.target.value })}
                                placeholder="Digite o título..."
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium" htmlFor="headerSubtitle">
                                Subtítulo
                            </label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                id="headerSubtitle"
                                type="text"
                                value={content.subtitle || ''}
                                onChange={(e) => onUpdate({ subtitle: e.target.value })}
                                placeholder="Digite o subtítulo..."
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium" htmlFor="headerDescription">
                                Descrição
                            </label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                id="headerDescription"
                                value={content.description || ''}
                                onChange={(e) => onUpdate({ description: e.target.value })}
                                placeholder="Digite a descrição..."
                            />
                        </div>

                        <div className="space-y-3 mt-4">
                            <Switch
                                id="show-logo"
                                checked={content.showLogo || false}
                                onChange={(checked) => onUpdate({ showLogo: checked })}
                                label="Mostrar Logo"
                            />
                            <Switch
                                id="show-progress"
                                checked={content.showProgress || false}
                                onChange={(checked) => onUpdate({ showProgress: checked })}
                                label="Mostrar Progresso"
                            />
                            <Switch
                                id="allow-return"
                                checked={content.allowReturn || false}
                                onChange={(checked) => onUpdate({ allowReturn: checked })}
                                label="Permitir Voltar"
                            />
                        </div>

                        {content.showLogo && (
                            <div className="mt-4">
                                <label className="text-sm font-medium" htmlFor="logoUrl">
                                    URL do Logo
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    id="logoUrl"
                                    type="url"
                                    value={content.logoUrl || ''}
                                    onChange={(e) => onUpdate({ logoUrl: e.target.value })}
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>
                        )}
                    </div>
                </Card>
            );

        case 'text':
        case 'text-inline':
            return (
                <Card title="Conteúdo de Texto" icon={<Edit3 size={16} />}>
                    <div>
                        <label className="text-sm font-medium" htmlFor="textContent">
                            Texto
                        </label>
                        <textarea
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            id="textContent"
                            value={content.text || ''}
                            onChange={(e) => onUpdate({ text: e.target.value })}
                            placeholder="Digite o texto..."
                        />
                    </div>
                </Card>
            );

        case 'options-grid':
            return (
                <Card title="Opções de Resposta" icon={<Layout size={16} />}>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium" htmlFor="questionText">
                                Pergunta
                            </label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                id="questionText"
                                type="text"
                                value={content.question || ''}
                                onChange={(e) => onUpdate({ question: e.target.value })}
                                placeholder="Digite a pergunta..."
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Opções ({(content.options || []).length})
                            </label>
                            <div className="text-xs text-muted-foreground mb-2">
                                Use o editor avançado para gerenciar opções individualmente
                            </div>
                            <div className="max-h-32 overflow-y-auto border rounded p-2 bg-muted/50">
                                {(content.options || []).map((option: any, index: number) => (
                                    <div key={index} className="text-sm py-1">
                                        {index + 1}. {option.text || 'Opção sem texto'}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            );

        case 'form-container':
            return (
                <Card title="Campo de Formulário" icon={<Edit3 size={16} />}>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium" htmlFor="fieldType">
                                Tipo de Campo
                            </label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                id="fieldType"
                                value={content.fieldType || 'text'}
                                onChange={(e) => onUpdate({ fieldType: e.target.value })}
                            >
                                <option value="text">Texto</option>
                                <option value="email">E-mail</option>
                                <option value="tel">Telefone</option>
                                <option value="password">Senha</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium" htmlFor="fieldLabel">
                                Label
                            </label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                id="fieldLabel"
                                type="text"
                                value={content.label || ''}
                                onChange={(e) => onUpdate({ label: e.target.value })}
                                placeholder="Label do campo"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium" htmlFor="fieldPlaceholder">
                                Placeholder
                            </label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                id="fieldPlaceholder"
                                type="text"
                                value={content.placeholder || ''}
                                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                                placeholder="Placeholder do campo"
                            />
                        </div>

                        <Switch
                            id="field-required"
                            checked={content.required || false}
                            onChange={(checked) => onUpdate({ required: checked })}
                            label="Campo obrigatório"
                        />
                    </div>
                </Card>
            );

        default:
            return (
                <Card title="Configuração de Componente" icon={<Settings size={16} />}>
                    <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded">
                        Editor específico para <strong>{type}</strong> será implementado em breve.
                    </div>
                </Card>
            );
    }
}

// 🎨 Renderizar controles de estilo
function renderStyleControls(
    properties: Record<string, any>,
    onUpdate: (updates: Record<string, any>) => void
) {
    return (
        <div className="space-y-3">
            <div>
                <label className="text-sm font-medium" htmlFor="bgColor">
                    Cor de Fundo
                </label>
                <input
                    className="w-full h-10 border border-input rounded cursor-pointer"
                    id="bgColor"
                    type="color"
                    value={properties.backgroundColor || '#FFFFFF'}
                    onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                />
            </div>

            <div>
                <label className="text-sm font-medium" htmlFor="textColor">
                    Cor do Texto
                </label>
                <input
                    className="w-full h-10 border border-input rounded cursor-pointer"
                    id="textColor"
                    type="color"
                    value={properties.color || '#000000'}
                    onChange={(e) => onUpdate({ color: e.target.value })}
                />
            </div>

            <div>
                <label className="text-sm font-medium" htmlFor="textAlign">
                    Alinhamento
                </label>
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    id="textAlign"
                    value={properties.textAlign || 'left'}
                    onChange={(e) => onUpdate({ textAlign: e.target.value })}
                >
                    <option value="left">Esquerda</option>
                    <option value="center">Centro</option>
                    <option value="right">Direita</option>
                    <option value="justify">Justificado</option>
                </select>
            </div>

            <div>
                <label className="text-sm font-medium" htmlFor="padding">
                    Padding
                </label>
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    id="padding"
                    type="text"
                    value={properties.padding || ''}
                    onChange={(e) => onUpdate({ padding: e.target.value })}
                    placeholder="ex: 16px, 1rem"
                />
            </div>
        </div>
    );
}

