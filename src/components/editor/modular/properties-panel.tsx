/**
 * 🎛️ PAINEL DE PROPRIEDADES MODULAR
 * 
 * Painel dinâmico para editar propriedades de componentes e etapas.
 * Formulários inteligentes baseados no tipo de componente selecionado.
 */

import React, { useState, useCallback } from 'react';
import {
    ModularComponent,
    ModularStep,
    ComponentType,
    TitleComponentProps,
    TextComponentProps,
    InputComponentProps,
    ButtonComponentProps,
    ImageComponentProps,
    OptionsComponentProps,
    SpacerComponentProps,
    DividerComponentProps,
    HelpTextComponentProps,
    ProgressBarComponentProps
} from './types';

// 🎯 Props do painel principal
interface ModularPropertiesPanelProps {
    selectedStep: ModularStep | null;
    selectedComponent: ModularComponent | null;
    onUpdateStep: (updates: Partial<ModularStep>) => void;
    onUpdateComponent: (updates: Partial<ModularComponent>) => void;
    onClose: () => void;
}

export const ModularPropertiesPanel: React.FC<ModularPropertiesPanelProps> = ({
    selectedStep,
    selectedComponent,
    onUpdateStep,
    onUpdateComponent,
    onClose
}) => {
    const [activeTab, setActiveTab] = useState<'component' | 'step'>('component');

    // Determinar qual aba mostrar por padrão
    React.useEffect(() => {
        if (selectedComponent) {
            setActiveTab('component');
        } else if (selectedStep) {
            setActiveTab('step');
        }
    }, [selectedComponent, selectedStep]);

    if (!selectedStep && !selectedComponent) {
        return (
            <div className="w-80 bg-white border-l border-gray-200 p-6 text-center">
                <div className="text-4xl mb-4 text-gray-300">🎨</div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Propriedades
                </h3>
                <p className="text-sm text-gray-500">
                    Selecione uma etapa ou componente para editar suas propriedades.
                </p>
            </div>
        );
    }

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Propriedades</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    ✕
                </button>
            </div>

            {/* Tabs */}
            {selectedStep && selectedComponent && (
                <div className="border-b border-gray-200">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('component')}
                            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'component'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Componente
                        </button>
                        <button
                            onClick={() => setActiveTab('step')}
                            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'step'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Etapa
                        </button>
                    </nav>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'component' && selectedComponent && (
                    <ComponentPropertiesForm
                        component={selectedComponent}
                        onUpdate={onUpdateComponent}
                    />
                )}

                {activeTab === 'step' && selectedStep && (
                    <StepPropertiesForm
                        step={selectedStep}
                        onUpdate={onUpdateStep}
                    />
                )}
            </div>
        </div>
    );
};

// 🧩 Formulário de propriedades de componente
interface ComponentPropertiesFormProps {
    component: ModularComponent;
    onUpdate: (updates: Partial<ModularComponent>) => void;
}

const ComponentPropertiesForm: React.FC<ComponentPropertiesFormProps> = ({
    component,
    onUpdate
}) => {
    const handleUpdate = useCallback((field: string, value: any) => {
        onUpdate({ [field]: value });
    }, [onUpdate]);

    return (
        <div className="p-4 space-y-6">
            {/* Propriedades base */}
            <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Geral</h4>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Visível
                        </label>
                        <input
                            type="checkbox"
                            checked={component.visible}
                            onChange={(e) => handleUpdate('visible', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Classe CSS
                        </label>
                        <input
                            type="text"
                            value={component.className || ''}
                            onChange={(e) => handleUpdate('className', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="custom-class"
                        />
                    </div>
                </div>
            </div>

            {/* Propriedades específicas do tipo */}
            {component.type === 'title' && (
                <TitleComponentForm
                    component={component as TitleComponentProps}
                    onUpdate={handleUpdate}
                />
            )}

            {component.type === 'text' && (
                <TextComponentForm
                    component={component as TextComponentProps}
                    onUpdate={handleUpdate}
                />
            )}

            {component.type === 'input' && (
                <InputComponentForm
                    component={component as InputComponentProps}
                    onUpdate={handleUpdate}
                />
            )}

            {component.type === 'button' && (
                <ButtonComponentForm
                    component={component as ButtonComponentProps}
                    onUpdate={handleUpdate}
                />
            )}

            {component.type === 'image' && (
                <ImageComponentForm
                    component={component as ImageComponentProps}
                    onUpdate={handleUpdate}
                />
            )}

            {component.type === 'options' && (
                <OptionsComponentForm
                    component={component as OptionsComponentProps}
                    onUpdate={handleUpdate}
                />
            )}

            {component.type === 'spacer' && (
                <SpacerComponentForm
                    component={component as SpacerComponentProps}
                    onUpdate={handleUpdate}
                />
            )}

            {component.type === 'divider' && (
                <DividerComponentForm
                    component={component as DividerComponentProps}
                    onUpdate={handleUpdate}
                />
            )}

            {component.type === 'help-text' && (
                <HelpTextComponentForm
                    component={component as HelpTextComponentProps}
                    onUpdate={handleUpdate}
                />
            )}

            {component.type === 'progress-bar' && (
                <ProgressBarComponentForm
                    component={component as ProgressBarComponentProps}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

// 📝 Formulário para título
const TitleComponentForm: React.FC<{
    component: TitleComponentProps;
    onUpdate: (field: string, value: any) => void;
}> = ({ component, onUpdate }) => (
    <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Título</h4>
        <div className="space-y-3">
            <FormField label="Texto">
                <input
                    type="text"
                    value={component.text}
                    onChange={(e) => onUpdate('text', e.target.value)}
                    className="form-input"
                />
            </FormField>

            <FormField label="Nível">
                <select
                    value={component.level}
                    onChange={(e) => onUpdate('level', e.target.value)}
                    className="form-select"
                >
                    <option value="h1">H1</option>
                    <option value="h2">H2</option>
                    <option value="h3">H3</option>
                    <option value="h4">H4</option>
                    <option value="h5">H5</option>
                    <option value="h6">H6</option>
                </select>
            </FormField>

            <FormField label="Alinhamento">
                <select
                    value={component.align}
                    onChange={(e) => onUpdate('align', e.target.value)}
                    className="form-select"
                >
                    <option value="left">Esquerda</option>
                    <option value="center">Centro</option>
                    <option value="right">Direita</option>
                </select>
            </FormField>

            <FormField label="Cor">
                <input
                    type="color"
                    value={component.color}
                    onChange={(e) => onUpdate('color', e.target.value)}
                    className="form-color"
                />
            </FormField>

            <FormField label="Tamanho da Fonte">
                <input
                    type="text"
                    value={component.fontSize}
                    onChange={(e) => onUpdate('fontSize', e.target.value)}
                    className="form-input"
                    placeholder="24px"
                />
            </FormField>
        </div>
    </div>
);

// 📄 Formulário para texto
const TextComponentForm: React.FC<{
    component: TextComponentProps;
    onUpdate: (field: string, value: any) => void;
}> = ({ component, onUpdate }) => (
    <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Texto</h4>
        <div className="space-y-3">
            <FormField label="Conteúdo">
                <textarea
                    value={component.content}
                    onChange={(e) => onUpdate('content', e.target.value)}
                    className="form-textarea"
                    rows={4}
                />
            </FormField>

            <FormField label="Alinhamento">
                <select
                    value={component.align}
                    onChange={(e) => onUpdate('align', e.target.value)}
                    className="form-select"
                >
                    <option value="left">Esquerda</option>
                    <option value="center">Centro</option>
                    <option value="right">Direita</option>
                    <option value="justify">Justificado</option>
                </select>
            </FormField>

            <FormField label="Cor">
                <input
                    type="color"
                    value={component.color}
                    onChange={(e) => onUpdate('color', e.target.value)}
                    className="form-color"
                />
            </FormField>

            <FormField label="Peso da Fonte">
                <select
                    value={component.fontWeight}
                    onChange={(e) => onUpdate('fontWeight', e.target.value)}
                    className="form-select"
                >
                    <option value="normal">Normal</option>
                    <option value="bold">Negrito</option>
                    <option value="lighter">Mais Leve</option>
                </select>
            </FormField>
        </div>
    </div>
);

// 📥 Formulário para input
const InputComponentForm: React.FC<{
    component: InputComponentProps;
    onUpdate: (field: string, value: any) => void;
}> = ({ component, onUpdate }) => (
    <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Campo de Entrada</h4>
        <div className="space-y-3">
            <FormField label="Rótulo">
                <input
                    type="text"
                    value={component.label}
                    onChange={(e) => onUpdate('label', e.target.value)}
                    className="form-input"
                />
            </FormField>

            <FormField label="Placeholder">
                <input
                    type="text"
                    value={component.placeholder}
                    onChange={(e) => onUpdate('placeholder', e.target.value)}
                    className="form-input"
                />
            </FormField>

            <FormField label="Tipo">
                <select
                    value={component.inputType}
                    onChange={(e) => onUpdate('inputType', e.target.value)}
                    className="form-select"
                >
                    <option value="text">Texto</option>
                    <option value="email">Email</option>
                    <option value="tel">Telefone</option>
                    <option value="number">Número</option>
                </select>
            </FormField>

            <FormField label="Obrigatório">
                <input
                    type="checkbox"
                    checked={component.required}
                    onChange={(e) => onUpdate('required', e.target.checked)}
                    className="form-checkbox"
                />
            </FormField>

            <FormField label="Limite de Caracteres">
                <input
                    type="number"
                    value={component.maxLength || ''}
                    onChange={(e) => onUpdate('maxLength', parseInt(e.target.value) || undefined)}
                    className="form-input"
                />
            </FormField>
        </div>
    </div>
);

// 🔘 Formulário para botão
const ButtonComponentForm: React.FC<{
    component: ButtonComponentProps;
    onUpdate: (field: string, value: any) => void;
}> = ({ component, onUpdate }) => (
    <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Botão</h4>
        <div className="space-y-3">
            <FormField label="Texto">
                <input
                    type="text"
                    value={component.text}
                    onChange={(e) => onUpdate('text', e.target.value)}
                    className="form-input"
                />
            </FormField>

            <FormField label="Variante">
                <select
                    value={component.variant}
                    onChange={(e) => onUpdate('variant', e.target.value)}
                    className="form-select"
                >
                    <option value="primary">Primário</option>
                    <option value="secondary">Secundário</option>
                    <option value="outline">Contorno</option>
                    <option value="ghost">Fantasma</option>
                </select>
            </FormField>

            <FormField label="Tamanho">
                <select
                    value={component.size}
                    onChange={(e) => onUpdate('size', e.target.value)}
                    className="form-select"
                >
                    <option value="sm">Pequeno</option>
                    <option value="md">Médio</option>
                    <option value="lg">Grande</option>
                </select>
            </FormField>

            <FormField label="Desabilitado">
                <input
                    type="checkbox"
                    checked={component.disabled}
                    onChange={(e) => onUpdate('disabled', e.target.checked)}
                    className="form-checkbox"
                />
            </FormField>
        </div>
    </div>
);

// [Implementar outros formulários de componentes...]
const ImageComponentForm: React.FC<any> = ({ component, onUpdate }) => null;
const OptionsComponentForm: React.FC<any> = ({ component, onUpdate }) => null;
const SpacerComponentForm: React.FC<any> = ({ component, onUpdate }) => null;
const DividerComponentForm: React.FC<any> = ({ component, onUpdate }) => null;
const HelpTextComponentForm: React.FC<any> = ({ component, onUpdate }) => null;
const ProgressBarComponentForm: React.FC<any> = ({ component, onUpdate }) => null;

// 📄 Formulário de propriedades de etapa
interface StepPropertiesFormProps {
    step: ModularStep;
    onUpdate: (updates: Partial<ModularStep>) => void;
}

const StepPropertiesForm: React.FC<StepPropertiesFormProps> = ({
    step,
    onUpdate
}) => {
    const handleSettingsUpdate = (field: string, value: any) => {
        onUpdate({
            settings: {
                ...step.settings,
                [field]: value
            }
        });
    };

    return (
        <div className="p-4 space-y-6">
            <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Informações</h4>
                <div className="space-y-3">
                    <FormField label="Nome">
                        <input
                            type="text"
                            value={step.name}
                            onChange={(e) => onUpdate({ name: e.target.value })}
                            className="form-input"
                        />
                    </FormField>

                    <FormField label="Tipo">
                        <select
                            value={step.type}
                            onChange={(e) => onUpdate({ type: e.target.value as any })}
                            className="form-select"
                        >
                            <option value="intro">Introdução</option>
                            <option value="question">Pergunta</option>
                            <option value="strategic-question">Pergunta Estratégica</option>
                            <option value="transition">Transição</option>
                            <option value="result">Resultado</option>
                            <option value="offer">Oferta</option>
                            <option value="custom">Personalizada</option>
                        </select>
                    </FormField>
                </div>
            </div>

            <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Aparência</h4>
                <div className="space-y-3">
                    <FormField label="Cor de Fundo">
                        <input
                            type="color"
                            value={step.settings.backgroundColor || '#ffffff'}
                            onChange={(e) => handleSettingsUpdate('backgroundColor', e.target.value)}
                            className="form-color"
                        />
                    </FormField>

                    <FormField label="Padding">
                        <input
                            type="number"
                            value={step.settings.padding || 24}
                            onChange={(e) => handleSettingsUpdate('padding', parseInt(e.target.value))}
                            className="form-input"
                        />
                    </FormField>

                    <FormField label="Altura Mínima">
                        <input
                            type="number"
                            value={step.settings.minHeight || 400}
                            onChange={(e) => handleSettingsUpdate('minHeight', parseInt(e.target.value))}
                            className="form-input"
                        />
                    </FormField>

                    <FormField label="Largura Máxima">
                        <input
                            type="number"
                            value={step.settings.maxWidth || ''}
                            onChange={(e) => handleSettingsUpdate('maxWidth', parseInt(e.target.value) || undefined)}
                            className="form-input"
                            placeholder="Sem limite"
                        />
                    </FormField>

                    <FormField label="Centralizar Conteúdo">
                        <input
                            type="checkbox"
                            checked={step.settings.centerContent || false}
                            onChange={(e) => handleSettingsUpdate('centerContent', e.target.checked)}
                            className="form-checkbox"
                        />
                    </FormField>
                </div>
            </div>
        </div>
    );
};

// 🎛️ Componente helper para campos de formulário
interface FormFieldProps {
    label: string;
    children: React.ReactNode;
    description?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, children, description }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
            {label}
        </label>
        {children}
        {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
    </div>
);

// 🎨 Estilos CSS globais para formulários
const formStyles = `
  .form-input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
  
  .form-select {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
  
  .form-textarea {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none;
  }
  
  .form-checkbox {
    @apply h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded;
  }
  
  .form-color {
    @apply w-full h-10 border border-gray-300 rounded-md cursor-pointer;
  }
`;