/**
 * 🚀 STABLE MODULAR EDITOR - Versão Estável e Robusta
 * 
 * Editor de 4 colunas completo, sem dependências externas problemáticas.
 * Esta é a versão de produção estável do editor modular.
 */

import React, { useState } from 'react';
import { useQuizEditor } from '@/context/QuizEditorContext';

const StableModularEditor: React.FC = () => {
    console.log('🚀 StableModularEditor: Componente carregado!');

    const {
        funnel,
        selectedComponent,
        selectComponent,
        updateComponent,
        deleteComponent,
        duplicateComponent,
        addComponent
    } = useQuizEditor();

    console.log('🚀 StableModularEditor: Funnel recebido:', funnel);

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // 🔧 Verificação de segurança
    if (!funnel || !funnel.steps || funnel.steps.length === 0) {
        return (
            <div style={{
                padding: '20px',
                border: '2px solid #f56565',
                background: '#fed7d7',
                borderRadius: '8px',
                margin: '20px'
            }}>
                <h2 style={{ margin: '0 0 12px 0', color: '#c53030' }}>⚠️ Funnel não carregado</h2>
                <p style={{ margin: '0 0 8px 0', color: '#742a2a' }}>
                    O funnel não foi carregado corretamente pelo contexto.
                </p>
                <details style={{ marginTop: '12px' }}>
                    <summary style={{ cursor: 'pointer', color: '#742a2a' }}>Ver detalhes técnicos</summary>
                    <pre style={{
                        background: 'white',
                        padding: '8px',
                        borderRadius: '4px',
                        margin: '8px 0 0 0',
                        fontSize: '12px',
                        overflow: 'auto'
                    }}>
                        {JSON.stringify({ funnel }, null, 2)}
                    </pre>
                </details>
            </div>
        );
    }

    const currentStep = funnel.steps[currentStepIndex] || funnel.steps[0] || { id: 'default', components: [] };
    const components = currentStep.components || [];

    console.log('🚀 StableModularEditor: Step atual:', currentStep);
    console.log('🚀 StableModularEditor: Componentes:', components);

    // 🎨 Tipos de componentes disponíveis
    const componentTypes = [
        { type: 'header', name: '🏠 Cabeçalho', description: 'Cabeçalho com título e subtítulo' },
        { type: 'title', name: '📝 Título', description: 'Título principal da seção' },
        { type: 'text', name: '📄 Texto', description: 'Parágrafo de texto' },
        { type: 'image', name: '🖼️ Imagem', description: 'Imagem com alt text' },
        { type: 'button', name: '🔘 Botão', description: 'Botão de ação' },
        { type: 'options-grid', name: '⚏ Grade de Opções', description: 'Grade de opções múltiplas' }
    ];

    // 🔧 Handlers
    const handleAddComponent = (type: string) => {
        if (!currentStep) return;

        const newComponent = {
            type: type as any,
            props: {
                text: `Novo ${type}`,
                title: `Título do ${type}`,
                alt: type === 'image' ? 'Nova imagem' : undefined,
                options: type === 'options-grid' ? [
                    { id: '1', text: 'Opção 1' },
                    { id: '2', text: 'Opção 2' }
                ] : undefined
            },
            style: {
                margin: '8px 0',
                padding: '12px'
            },
        };

        addComponent(currentStep.id, newComponent);
    };

    const handleComponentClick = (component: any) => {
        selectComponent(component.id);
    };

    const handleStepChange = (stepIndex: number) => {
        setCurrentStepIndex(stepIndex);
        // Limpar seleção ao trocar de etapa
        selectComponent(null);
    };

    // 🎨 Renderização de componentes
    const renderComponent = (component: any) => {
        const isSelected = selectedComponent?.id === component.id;

        const containerStyle = {
            padding: '16px',
            margin: '8px 0',
            border: isSelected ? '2px solid #4299e1' : '1px solid #e2e8f0',
            borderRadius: '8px',
            background: isSelected ? '#ebf8ff' : 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isSelected ? '0 4px 12px rgba(66, 153, 225, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
            position: 'relative' as const
        };

        const selectedIndicator = isSelected ? (
            <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: '#4299e1',
                color: 'white',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '10px',
                fontWeight: 'bold'
            }}>
                SELECIONADO
            </div>
        ) : null;

        const componentContent = (() => {
            switch (component.type) {
                case 'header':
                    return (
                        <div style={{ background: '#f7fafc', padding: '16px', borderRadius: '6px' }}>
                            <h1 style={{ margin: 0, fontSize: '24px', color: '#1a202c', fontWeight: 'bold' }}>
                                {component.props?.title || 'Cabeçalho'}
                            </h1>
                            {component.props?.subtitle && (
                                <p style={{ margin: '8px 0 0 0', color: '#4a5568', fontSize: '16px' }}>
                                    {component.props.subtitle}
                                </p>
                            )}
                        </div>
                    );
                case 'title':
                    return (
                        <h2 style={{ margin: 0, fontSize: '20px', color: '#1a202c', fontWeight: '600' }}>
                            {component.props?.text || 'Título'}
                        </h2>
                    );
                case 'text':
                    return (
                        <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.6' }}>
                            {component.props?.text || 'Texto de exemplo. Clique para editar.'}
                        </p>
                    );
                case 'image':
                    return (
                        <div style={{ textAlign: 'center' }}>
                            {component.props?.src ? (
                                <img
                                    src={component.props.src}
                                    alt={component.props?.alt || 'Imagem'}
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    padding: '60px 20px',
                                    background: '#f7fafc',
                                    borderRadius: '8px',
                                    color: '#718096',
                                    border: '2px dashed #cbd5e0'
                                }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🖼️</div>
                                    <div style={{ fontSize: '14px' }}>Clique para adicionar uma imagem</div>
                                </div>
                            )}
                        </div>
                    );
                case 'button':
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <button style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                                transition: 'transform 0.2s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {component.props?.text || 'Botão'}
                            </button>
                        </div>
                    );
                case 'options-grid':
                    const options = component.props?.options || [
                        { id: '1', text: 'Opção 1' },
                        { id: '2', text: 'Opção 2' }
                    ];
                    return (
                        <div>
                            <h4 style={{ margin: '0 0 16px 0', color: '#2d3748' }}>Selecione uma opção:</h4>
                            <div style={{
                                display: 'grid',
                                gap: '12px',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
                            }}>
                                {options.map((option: any, index: number) => (
                                    <div key={option.id || index} style={{
                                        padding: '16px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        background: 'white',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#4299e1';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(66, 153, 225, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                                        }}
                                    >
                                        {option.image && (
                                            <img
                                                src={option.image}
                                                alt={option.text}
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                    marginBottom: '12px'
                                                }}
                                            />
                                        )}
                                        <div style={{ fontWeight: '500' }}>{option.text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                default:
                    return (
                        <div style={{
                            padding: '16px',
                            border: '1px solid #fed7d7',
                            borderRadius: '8px',
                            background: '#fef5e7',
                            color: '#744210'
                        }}>
                            <strong>⚠️ Tipo não implementado:</strong> "{component.type}"
                            <br />
                            <small>Este tipo de componente ainda não tem renderização visual.</small>
                        </div>
                    );
            }
        })();

        return (
            <div key={component.id} style={containerStyle} onClick={() => handleComponentClick(component)}>
                {selectedIndicator}
                {componentContent}
            </div>
        );
    };

    // 🎨 Painel de propriedades
    const renderPropertiesPanel = () => {
        if (!selectedComponent) {
            return (
                <div style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>Propriedades</h3>
                    <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>
                        Selecione um componente no canvas para editar suas propriedades
                    </p>
                </div>
            );
        }

        const handleTextChange = (field: string, value: string) => {
            updateComponent(currentStep.id, selectedComponent.id, {
                ...selectedComponent,
                props: {
                    ...selectedComponent.props,
                    [field]: value
                }
            });
        };

        const handleDelete = () => {
            if (confirm('Tem certeza que deseja excluir este componente?')) {
                deleteComponent(currentStep.id, selectedComponent.id);
                selectComponent(null);
            }
        };

        return (
            <div style={{ padding: '24px' }}>
                <div style={{
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '16px',
                    marginBottom: '24px'
                }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1a202c' }}>
                        🎨 Propriedades
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#718096' }}>
                        Tipo: <span style={{ fontWeight: '600', color: '#4299e1' }}>{selectedComponent.type}</span>
                    </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#2d3748'
                    }}>
                        Texto Principal:
                    </label>
                    <input
                        type="text"
                        value={selectedComponent.props?.text || selectedComponent.props?.title || ''}
                        onChange={(e) => {
                            const field = selectedComponent.props?.title !== undefined ? 'title' : 'text';
                            handleTextChange(field, e.target.value);
                        }}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                        placeholder="Digite o texto..."
                    />
                </div>

                {selectedComponent.type === 'header' && (
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#2d3748'
                        }}>
                            Subtítulo:
                        </label>
                        <input
                            type="text"
                            value={selectedComponent.props?.subtitle || ''}
                            onChange={(e) => handleTextChange('subtitle', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="Digite o subtítulo..."
                        />
                    </div>
                )}

                {selectedComponent.type === 'image' && (
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#2d3748'
                        }}>
                            URL da Imagem:
                        </label>
                        <input
                            type="url"
                            value={selectedComponent.props?.src || ''}
                            onChange={(e) => handleTextChange('src', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="https://exemplo.com/imagem.jpg"
                        />
                        <input
                            type="text"
                            value={selectedComponent.props?.alt || ''}
                            onChange={(e) => handleTextChange('alt', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                fontSize: '14px',
                                marginTop: '8px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="Texto alternativo da imagem"
                        />
                    </div>
                )}

                <div style={{
                    marginTop: '32px',
                    paddingTop: '20px',
                    borderTop: '1px solid #e2e8f0'
                }}>
                    <button
                        onClick={handleDelete}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        🗑️ Excluir Componente
                    </button>
                </div>
            </div>
        );
    };

    // 🎨 Estilos principais
    const mainStyle = {
        display: 'flex',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundAttachment: 'fixed'
    };

    const columnStyle = {
        background: 'white',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column' as const,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    };

    const headerStyle = {
        padding: '20px',
        borderBottom: '1px solid #e2e8f0',
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)'
    };

    return (
        <div style={mainStyle}>
            {/* COLUNA 1: ETAPAS (280px) */}
            <div style={{ ...columnStyle, width: '280px' }}>
                <div style={headerStyle}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1a202c' }}>
                        📋 Etapas
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#718096' }}>
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
                                    ? 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'
                                    : 'white',
                                color: currentStepIndex === index ? 'white' : '#2d3748',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '14px',
                                transition: 'all 0.2s ease',
                                boxShadow: currentStepIndex === index
                                    ? '0 4px 12px rgba(66, 153, 225, 0.3)'
                                    : '0 2px 4px rgba(0, 0, 0, 0.05)'
                            }}
                            onMouseEnter={(e) => {
                                if (currentStepIndex !== index) {
                                    e.currentTarget.style.borderColor = '#4299e1';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(66, 153, 225, 0.15)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentStepIndex !== index) {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                                }
                            }}
                        >
                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                Etapa {index + 1}
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.8 }}>
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
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1a202c' }}>
                        🧩 Componentes
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#718096' }}>
                        Arraste ou clique para adicionar
                    </p>
                </div>
                <div style={{ padding: '16px' }}>
                    {componentTypes.map((compType) => (
                        <button
                            key={compType.type}
                            onClick={() => handleAddComponent(compType.type)}
                            style={{
                                width: '100%',
                                padding: '16px',
                                margin: '0 0 12px 0',
                                background: 'white',
                                color: '#2d3748',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '14px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f7fafc';
                                e.currentTarget.style.borderColor = '#4299e1';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(66, 153, 225, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                            }}
                        >
                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                {compType.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#718096' }}>
                                {compType.description}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* COLUNA 3: CANVAS (flex) */}
            <div style={{ ...columnStyle, flex: 1, borderRight: 'none' }}>
                <div style={headerStyle}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1a202c' }}>
                        🎨 Canvas - {currentStep.title || currentStep.name || `Etapa ${currentStepIndex + 1}`}
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#718096' }}>
                        {components.length} componente{components.length !== 1 ? 's' : ''} nesta etapa
                    </p>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {components.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '80px 20px',
                            color: '#718096',
                            border: '2px dashed #cbd5e0',
                            borderRadius: '12px',
                            background: '#f7fafc'
                        }}>
                            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎨</div>
                            <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>Canvas Vazio</h4>
                            <p style={{ margin: 0, fontSize: '14px' }}>
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
            <div style={{ ...columnStyle, width: '350px', borderLeft: '1px solid #e2e8f0' }}>
                <div style={headerStyle}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#1a202c' }}>
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

export default StableModularEditor;