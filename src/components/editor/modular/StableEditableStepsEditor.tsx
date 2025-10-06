/**
 * 🚀 STABLE EDITABLE STEPS EDITOR - Sistema Modular Estável
 * 
 * Editor de 4 colunas com componentes estáveis e sem dependências problemáticas:
 * - Coluna 1: Lista de Etapas (280px)
 * - Coluna 2: Biblioteca de Componentes (300px) 
 * - Coluna 3: Canvas com Preview WYSIWYG (flex)
 * - Coluna 4: Painel de Propriedades Dinâmico (350px)
 */

import React, { useState } from 'react';
import { useQuizEditor } from '@/context/QuizEditorContext';
import { CustomThemeProvider, useCustomTheme } from '@/hooks/useCustomTheme';
import ModularHeaderStable from './components/ModularHeaderStable';
import ModularTitleStable from './components/ModularTitleStable';
import ModularTextStable from './components/ModularTextStable';

const StableEditableStepsEditor: React.FC = () => {
    return (
        <CustomThemeProvider>
            <StableEditableStepsEditorInner />
        </CustomThemeProvider>
    );
};

const StableEditableStepsEditorInner: React.FC = () => {
    const theme = useCustomTheme();
    const {
        funnel,
        selectedComponent,
        selectComponent,
        updateComponent,
        deleteComponent,
        duplicateComponent,
        addComponent
    } = useQuizEditor();

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // 🔧 Verificações de segurança
    if (!funnel || !funnel.steps || funnel.steps.length === 0) {
        return (
            <div style={{
                padding: '40px',
                textAlign: 'center',
                fontFamily: theme.fonts.body
            }}>
                <h2 style={{ color: theme.colors.error, marginBottom: '16px' }}>
                    ⚠️ Funnel não carregado
                </h2>
                <p style={{ color: theme.colors.gray[600] }}>
                    O funnel não foi carregado corretamente pelo contexto.
                </p>
            </div>
        );
    }

    const currentStep = funnel.steps[currentStepIndex] || funnel.steps[0] || { id: 'default', components: [] };
    const components = currentStep.components || [];

    // 🎨 Tipos de componentes disponíveis
    const availableComponents = [
        {
            type: 'header',
            name: '🏠 Cabeçalho',
            description: 'Cabeçalho com título, subtítulo e progresso',
            defaultProps: {
                title: 'Novo Cabeçalho',
                subtitle: 'Subtítulo do cabeçalho',
                showProgress: true,
                showLogo: true
            }
        },
        {
            type: 'title',
            name: '📝 Título',
            description: 'Título editável com formatação',
            defaultProps: {
                text: 'Novo Título',
                fontSize: 'xl',
                fontWeight: 'bold',
                textAlign: 'center'
            }
        },
        {
            type: 'text',
            name: '📄 Texto',
            description: 'Texto editável com formatação',
            defaultProps: {
                content: 'Novo texto. Clique para editar.',
                fontSize: 'md',
                fontWeight: 'normal',
                textAlign: 'left'
            }
        },
        {
            type: 'image',
            name: '🖼️ Imagem',
            description: 'Imagem com URL e texto alternativo',
            defaultProps: {
                src: '',
                alt: 'Nova imagem',
                maxWidth: '100%'
            }
        },
        {
            type: 'button',
            name: '🔘 Botão',
            description: 'Botão de ação personalizável',
            defaultProps: {
                text: 'Novo Botão',
                variant: 'primary',
                size: 'md'
            }
        },
        {
            type: 'options-grid',
            name: '⚏ Grade de Opções',
            description: 'Grade de opções múltiplas',
            defaultProps: {
                options: [
                    { id: '1', text: 'Opção 1' },
                    { id: '2', text: 'Opção 2' }
                ]
            }
        }
    ];

    // 🔧 Handlers
    const handleAddComponent = (componentType: string) => {
        const compConfig = availableComponents.find(c => c.type === componentType);
        if (!compConfig || !currentStep) return;

        const newComponent = {
            type: componentType as any,
            props: compConfig.defaultProps,
            style: {
                margin: '8px 0',
                padding: '12px'
            }
        };

        addComponent(currentStep.id, newComponent);
    };

    const handleComponentSelect = (component: any) => {
        selectComponent(component.id);
    };

    const handleComponentUpdate = (componentId: string, updates: any) => {
        if (!currentStep) return;

        const component = components.find(c => c.id === componentId);
        if (!component) return;

        const updatedComponent = {
            ...component,
            props: {
                ...component.props,
                ...updates
            }
        };

        updateComponent(currentStep.id, componentId, updatedComponent);
    };

    const handleStepChange = (stepIndex: number) => {
        setCurrentStepIndex(stepIndex);
        selectComponent(null); // Limpar seleção ao trocar de etapa
    };

    // 🎨 Renderização de componentes
    const renderComponent = (component: any) => {
        const isSelected = selectedComponent?.id === component.id;

        const commonProps = {
            isEditable: true,
            isSelected,
            onSelect: () => handleComponentSelect(component),
            onUpdate: (updates: any) => handleComponentUpdate(component.id, updates)
        };

        switch (component.type) {
            case 'header':
                return (
                    <ModularHeaderStable
                        key={component.id}
                        {...component.props}
                        {...commonProps}
                        currentStep={currentStepIndex + 1}
                        totalSteps={funnel.steps.length}
                    />
                );
            case 'title':
                return (
                    <ModularTitleStable
                        key={component.id}
                        {...component.props}
                        {...commonProps}
                    />
                );
            case 'text':
                return (
                    <ModularTextStable
                        key={component.id}
                        {...component.props}
                        {...commonProps}
                    />
                );
            case 'image':
                return (
                    <div
                        key={component.id}
                        style={{
                            padding: '16px',
                            margin: '8px 0',
                            border: isSelected ? `2px solid ${theme.colors.primary}` : '1px solid #e2e8f0',
                            borderRadius: theme.radii.md,
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                        onClick={() => handleComponentSelect(component)}
                    >
                        {component.props?.src ? (
                            <img
                                src={component.props.src}
                                alt={component.props.alt || 'Imagem'}
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: theme.radii.md
                                }}
                            />
                        ) : (
                            <div style={{
                                padding: '40px',
                                textAlign: 'center',
                                backgroundColor: theme.colors.gray[50],
                                borderRadius: theme.radii.md,
                                border: `2px dashed ${theme.colors.gray[300]}`
                            }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🖼️</div>
                                <div style={{ color: theme.colors.gray[500] }}>
                                    Clique para adicionar imagem
                                </div>
                            </div>
                        )}

                        {isSelected && (
                            <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                backgroundColor: theme.colors.primary,
                                color: 'white',
                                borderRadius: theme.radii.sm,
                                padding: '2px 6px',
                                fontSize: theme.fontSizes.xs,
                                fontWeight: 'bold'
                            }}>
                                SELECIONADO
                            </div>
                        )}
                    </div>
                );
            case 'button':
                return (
                    <div
                        key={component.id}
                        style={{
                            padding: '16px',
                            margin: '8px 0',
                            border: isSelected ? `2px solid ${theme.colors.primary}` : '1px solid #e2e8f0',
                            borderRadius: theme.radii.md,
                            cursor: 'pointer',
                            textAlign: 'center',
                            position: 'relative'
                        }}
                        onClick={() => handleComponentSelect(component)}
                    >
                        <button style={{
                            padding: '12px 24px',
                            backgroundColor: theme.colors.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: theme.radii.md,
                            fontSize: theme.fontSizes.md,
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}>
                            {component.props?.text || 'Botão'}
                        </button>

                        {isSelected && (
                            <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                backgroundColor: theme.colors.primary,
                                color: 'white',
                                borderRadius: theme.radii.sm,
                                padding: '2px 6px',
                                fontSize: theme.fontSizes.xs,
                                fontWeight: 'bold'
                            }}>
                                SELECIONADO
                            </div>
                        )}
                    </div>
                );
            default:
                return (
                    <div
                        key={component.id}
                        style={{
                            padding: '16px',
                            margin: '8px 0',
                            border: `1px solid ${theme.colors.warning}`,
                            borderRadius: theme.radii.md,
                            backgroundColor: '#fef5e7',
                            color: '#744210'
                        }}
                    >
                        <strong>⚠️ Tipo não implementado:</strong> "{component.type}"
                    </div>
                );
        }
    };

    // 🎨 Painel de propriedades
    const renderPropertiesPanel = () => {
        if (!selectedComponent) {
            return (
                <div style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
                    <h3 style={{ margin: '0 0 8px 0', color: theme.colors.gray[800] }}>Propriedades</h3>
                    <p style={{ margin: 0, color: theme.colors.gray[500], fontSize: theme.fontSizes.sm }}>
                        Selecione um componente no canvas para editar suas propriedades
                    </p>
                </div>
            );
        }

        return (
            <div style={{ padding: '24px' }}>
                <div style={{
                    borderBottom: `1px solid ${theme.colors.gray[200]}`,
                    paddingBottom: '16px',
                    marginBottom: '24px'
                }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: theme.fontSizes.lg, color: theme.colors.gray[800] }}>
                        🎨 Propriedades
                    </h3>
                    <p style={{ margin: 0, fontSize: theme.fontSizes.sm, color: theme.colors.gray[500] }}>
                        Tipo: <span style={{ fontWeight: '600', color: theme.colors.primary }}>
                            {selectedComponent.type}
                        </span>
                    </p>
                </div>

                {/* Propriedades básicas de texto */}
                {(selectedComponent.type === 'title' || selectedComponent.type === 'text' || selectedComponent.type === 'header') && (
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: theme.fontSizes.sm,
                            fontWeight: '600',
                            color: theme.colors.gray[700]
                        }}>
                            Texto:
                        </label>
                        <input
                            type="text"
                            value={selectedComponent.props?.text || selectedComponent.props?.title || selectedComponent.props?.content || ''}
                            onChange={(e) => {
                                const field = selectedComponent.props?.title !== undefined ? 'title' :
                                    selectedComponent.props?.content !== undefined ? 'content' : 'text';
                                handleComponentUpdate(selectedComponent.id, { [field]: e.target.value });
                            }}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: `1px solid ${theme.colors.gray[300]}`,
                                borderRadius: theme.radii.md,
                                fontSize: theme.fontSizes.sm,
                                boxSizing: 'border-box'
                            }}
                            placeholder="Digite o texto..."
                        />
                    </div>
                )}

                {/* Botão de excluir */}
                <div style={{
                    marginTop: '32px',
                    paddingTop: '20px',
                    borderTop: `1px solid ${theme.colors.gray[200]}`
                }}>
                    <button
                        onClick={() => {
                            if (confirm('Tem certeza que deseja excluir este componente?')) {
                                deleteComponent(currentStep.id, selectedComponent.id);
                                selectComponent(null);
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: theme.colors.error,
                            color: 'white',
                            border: 'none',
                            borderRadius: theme.radii.md,
                            cursor: 'pointer',
                            fontSize: theme.fontSizes.sm,
                            fontWeight: '600'
                        }}
                    >
                        🗑️ Excluir Componente
                    </button>
                </div>
            </div>
        );
    };

    // 🎨 Estilos principais
    const mainStyle: React.CSSProperties = {
        display: 'flex',
        minHeight: '100vh',
        fontFamily: theme.fonts.body,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundAttachment: 'fixed'
    };

    const columnStyle: React.CSSProperties = {
        background: 'white',
        borderRight: `1px solid ${theme.colors.gray[200]}`,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: theme.shadows.sm
    };

    const headerStyle: React.CSSProperties = {
        padding: '20px',
        borderBottom: `1px solid ${theme.colors.gray[200]}`,
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)'
    };

    return (
        <div style={mainStyle}>
            {/* COLUNA 1: ETAPAS (280px) */}
            <div style={{ ...columnStyle, width: '280px' }}>
                <div style={headerStyle}>
                    <h3 style={{
                        margin: '0 0 4px 0',
                        fontSize: theme.fontSizes.lg,
                        color: theme.colors.gray[800]
                    }}>
                        📋 Etapas
                    </h3>
                    <p style={{
                        margin: 0,
                        fontSize: theme.fontSizes.xs,
                        color: theme.colors.gray[500]
                    }}>
                        {funnel.steps.length} etapas disponíveis
                    </p>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                    {funnel.steps.map((step, index) => (
                        <button
                            key={step.id}
                            onClick={() => handleStepChange(index)}
                            style={{
                                width: '100%',
                                padding: '16px 12px',
                                margin: '0 0 8px 0',
                                background: currentStepIndex === index
                                    ? `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.blue[600]} 100%)`
                                    : 'white',
                                color: currentStepIndex === index ? 'white' : theme.colors.gray[700],
                                border: `1px solid ${theme.colors.gray[200]}`,
                                borderRadius: theme.radii.md,
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: theme.fontSizes.sm,
                                transition: 'all 0.2s ease',
                                boxShadow: currentStepIndex === index
                                    ? `0 4px 12px rgba(66, 153, 225, 0.3)`
                                    : theme.shadows.sm
                            }}
                        >
                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                Etapa {index + 1}
                            </div>
                            <div style={{ fontSize: theme.fontSizes.xs, opacity: 0.8 }}>
                                {step.title || step.name || `Etapa ${index + 1}`}
                            </div>
                            <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>
                                {components.length} componente{components.length !== 1 ? 's' : ''}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* COLUNA 2: COMPONENTES (300px) */}
            <div style={{ ...columnStyle, width: '300px' }}>
                <div style={headerStyle}>
                    <h3 style={{
                        margin: '0 0 4px 0',
                        fontSize: theme.fontSizes.lg,
                        color: theme.colors.gray[800]
                    }}>
                        🧩 Componentes
                    </h3>
                    <p style={{
                        margin: 0,
                        fontSize: theme.fontSizes.xs,
                        color: theme.colors.gray[500]
                    }}>
                        Clique para adicionar ao canvas
                    </p>
                </div>
                <div style={{ padding: '16px' }}>
                    {availableComponents.map((comp) => (
                        <button
                            key={comp.type}
                            onClick={() => handleAddComponent(comp.type)}
                            style={{
                                width: '100%',
                                padding: '16px',
                                margin: '0 0 12px 0',
                                background: 'white',
                                color: theme.colors.gray[700],
                                border: `1px solid ${theme.colors.gray[200]}`,
                                borderRadius: theme.radii.md,
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: theme.fontSizes.sm,
                                transition: 'all 0.2s ease',
                                boxShadow: theme.shadows.sm
                            }}
                        >
                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                {comp.name}
                            </div>
                            <div style={{ fontSize: theme.fontSizes.xs, color: theme.colors.gray[500] }}>
                                {comp.description}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* COLUNA 3: CANVAS (flex) */}
            <div style={{ ...columnStyle, flex: 1, borderRight: 'none' }}>
                <div style={headerStyle}>
                    <h3 style={{
                        margin: '0 0 4px 0',
                        fontSize: theme.fontSizes.lg,
                        color: theme.colors.gray[800]
                    }}>
                        🎨 Canvas - {currentStep.title || currentStep.name || `Etapa ${currentStepIndex + 1}`}
                    </h3>
                    <p style={{
                        margin: 0,
                        fontSize: theme.fontSizes.xs,
                        color: theme.colors.gray[500]
                    }}>
                        {components.length} componente{components.length !== 1 ? 's' : ''} nesta etapa
                    </p>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {components.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '80px 20px',
                            color: theme.colors.gray[500],
                            border: `2px dashed ${theme.colors.gray[300]}`,
                            borderRadius: theme.radii.lg,
                            background: theme.colors.gray[50]
                        }}>
                            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎨</div>
                            <h4 style={{ margin: '0 0 8px 0', color: theme.colors.gray[700] }}>Canvas Vazio</h4>
                            <p style={{ margin: 0, fontSize: theme.fontSizes.sm }}>
                                Adicione componentes usando a biblioteca à esquerda
                            </p>
                        </div>
                    ) : (
                        <div>
                            {components.map((component) => renderComponent(component))}
                        </div>
                    )}
                </div>
            </div>

            {/* COLUNA 4: PROPRIEDADES (350px) */}
            <div style={{ ...columnStyle, width: '350px', borderLeft: `1px solid ${theme.colors.gray[200]}` }}>
                <div style={headerStyle}>
                    <h3 style={{
                        margin: 0,
                        fontSize: theme.fontSizes.lg,
                        color: theme.colors.gray[800]
                    }}>
                        ⚙️ Propriedades
                    </h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {renderPropertiesPanel()}
                </div>
            </div>
        </div>
    );
};

export default StableEditableStepsEditor;