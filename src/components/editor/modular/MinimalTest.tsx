/**
 * 🚀 EDITOR MODULAR COMPLETO - SEM DEPENDÊNCIAS EXTERNAS
 * 
 * Editor completo de 4 colunas funcionando sem bibliotecas externas
 */

import React, { useState } from 'react';
import { useQuizEditor } from '@/context/QuizEditorContext';

const MinimalTest: React.FC = () => {
    console.log('🚀 Editor Modular: Componente carregado!');

    const {
        funnel,
        selectedComponent,
        selectComponent,
        updateComponent,
        deleteComponent,
        duplicateComponent,
        addComponent
    } = useQuizEditor();

    console.log('🚀 Editor Modular: Funnel recebido:', funnel);

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // 🔧 Verificação de segurança
    if (!funnel || !funnel.steps || funnel.steps.length === 0) {
        return (
            <div style={{ padding: '20px', border: '2px solid red', background: '#ffe6e6' }}>
                <h2>❌ Erro: Funnel não carregado</h2>
                <p>O funnel não foi carregado corretamente pelo contexto.</p>
                <pre>{JSON.stringify({ funnel }, null, 2)}</pre>
            </div>
        );
    }

    const currentStep = funnel.steps[currentStepIndex] || funnel.steps[0] || { id: 'default', components: [] };
    const components = currentStep.components || [];

    console.log('🚀 Editor Modular: Step atual:', currentStep);
    console.log('🚀 Editor Modular: Componentes:', components);

    const componentTypes = [
        { type: 'header', name: 'Cabeçalho', icon: '🏠' },
        { type: 'title', name: 'Título', icon: '📝' },
        { type: 'text', name: 'Texto', icon: '📄' },
        { type: 'image', name: 'Imagem', icon: '🖼️' },
        { type: 'button', name: 'Botão', icon: '🔘' },
        { type: 'options-grid', name: 'Grade de Opções', icon: '⚏' }
    ];

    const handleAddComponent = (type: string) => {
        if (!currentStep) return;
        addComponent(currentStep.id, {
            type: type as any,
            props: {
                text: `Novo ${type}`,
                title: `Título do ${type}`
            },
            style: {},
        });
    };

    const renderComponent = (component: any) => {
        const isSelected = selectedComponent?.id === component.id;
        const containerStyle = {
            padding: '12px',
            margin: '8px 0',
            border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
            borderRadius: '8px',
            background: isSelected ? '#f0f8ff' : 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        };

        const handleClick = () => {
            selectComponent(component);
        };

        switch (component.type) {
            case 'header':
                return (
                    <div style={containerStyle} onClick={handleClick}>
                        <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '6px' }}>
                            <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
                                {component.props?.title || 'Cabeçalho'}
                            </h1>
                            {component.props?.subtitle && (
                                <p style={{ margin: '8px 0 0 0', color: '#666' }}>{component.props.subtitle}</p>
                            )}
                        </div>
                    </div>
                );
            case 'title':
                return (
                    <div style={containerStyle} onClick={handleClick}>
                        <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>
                            {component.props?.text || 'Título'}
                        </h2>
                    </div>
                );
            case 'text':
                return (
                    <div style={containerStyle} onClick={handleClick}>
                        <p style={{ margin: 0, color: '#555' }}>
                            {component.props?.text || 'Texto de exemplo'}
                        </p>
                    </div>
                );
            case 'image':
                return (
                    <div style={containerStyle} onClick={handleClick}>
                        <div style={{ textAlign: 'center' }}>
                            {component.props?.src ? (
                                <img
                                    src={component.props.src}
                                    alt={component.props?.alt || 'Imagem'}
                                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
                                />
                            ) : (
                                <div style={{ padding: '40px', background: '#f0f0f0', borderRadius: '4px', color: '#666' }}>
                                    🖼️ Imagem não definida
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'button':
                return (
                    <div style={containerStyle} onClick={handleClick}>
                        <div style={{ textAlign: 'center' }}>
                            <button style={{
                                padding: '12px 24px',
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}>
                                {component.props?.text || 'Botão'}
                            </button>
                        </div>
                    </div>
                );
            case 'options-grid':
                const options = component.props?.options || [
                    { id: '1', text: 'Opção 1' },
                    { id: '2', text: 'Opção 2' }
                ];
                return (
                    <div style={containerStyle} onClick={handleClick}>
                        <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                            {options.map((option: any, index: number) => (
                                <div key={option.id || index} style={{
                                    padding: '12px',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: 'white'
                                }}>
                                    {option.image && (
                                        <img
                                            src={option.image}
                                            alt={option.text}
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }}
                                        />
                                    )}
                                    <div>{option.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return (
                    <div style={containerStyle} onClick={handleClick}>
                        <p style={{ margin: 0, color: '#d00' }}>
                            Componente "{component.type}" não implementado
                        </p>
                    </div>
                );
        }
    };

    const renderPropertiesPanel = () => {
        if (!selectedComponent) {
            return (
                <div style={{ padding: '16px' }}>
                    <p style={{ color: '#666', fontStyle: 'italic' }}>
                        Selecione um componente para editar suas propriedades
                    </p>
                </div>
            );
        }

        const handleTextChange = (field: string, value: string) => {
            updateComponent(selectedComponent.id, {
                ...selectedComponent,
                props: {
                    ...selectedComponent.props,
                    [field]: value
                }
            });
        };

        return (
            <div style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#333' }}>
                    🎨 Propriedades: {selectedComponent.type}
                </h3>

                <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                        Texto:
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
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    />
                </div>

                {selectedComponent.type === 'header' && (
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                            Subtítulo:
                        </label>
                        <input
                            type="text"
                            value={selectedComponent.props?.subtitle || ''}
                            onChange={(e) => handleTextChange('subtitle', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                )}

                {selectedComponent.type === 'image' && (
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                            URL da Imagem:
                        </label>
                        <input
                            type="url"
                            value={selectedComponent.props?.src || ''}
                            onChange={(e) => handleTextChange('src', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                )}

                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                    <button
                        onClick={() => deleteComponent(selectedComponent.id)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        🗑️ Excluir Componente
                    </button>
                </div>
            </div>
        );
    };

    const mainStyle = {
        display: 'flex',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        background: '#f5f5f5'
    };

    const columnStyle = {
        background: 'white',
        borderRight: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column' as const
    };

    return (
        <div style={mainStyle}>
            {/* COLUNA 1: ETAPAS (250px) */}
            <div style={{ ...columnStyle, width: '250px' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>📋 Etapas ({funnel.steps.length})</h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                    {funnel.steps.map((step, index) => (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStepIndex(index)}
                            style={{
                                width: '100%',
                                padding: '12px 8px',
                                margin: '4px 0',
                                background: currentStepIndex === index ? '#007bff' : 'white',
                                color: currentStepIndex === index ? 'white' : '#333',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ fontWeight: 'bold' }}>Etapa {index + 1}</div>
                            <div style={{ fontSize: '12px', opacity: 0.8 }}>
                                {step.title || step.name || `Etapa ${index + 1}`}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* COLUNA 2: COMPONENTES (280px) */}
            <div style={{ ...columnStyle, width: '280px' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>🧩 Componentes</h3>
                </div>
                <div style={{ padding: '16px' }}>
                    {componentTypes.map((compType) => (
                        <button
                            key={compType.type}
                            onClick={() => handleAddComponent(compType.type)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                margin: '6px 0',
                                background: 'white',
                                color: '#333',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '14px',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f0f8ff';
                                e.currentTarget.style.borderColor = '#007bff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.borderColor = '#ddd';
                            }}
                        >
                            <span>{compType.icon}</span>
                            <span>{compType.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* COLUNA 3: CANVAS (flex) */}
            <div style={{ ...columnStyle, flex: 1, borderRight: 'none' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>
                        🎨 Canvas - {currentStep.title || currentStep.name || `Etapa ${currentStepIndex + 1}`}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
                        {components.length} componente{components.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                    {components.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#666',
                            border: '2px dashed #ddd',
                            borderRadius: '8px',
                            background: '#fafafa'
                        }}>
                            <h4 style={{ margin: '0 0 8px 0' }}>Canvas Vazio</h4>
                            <p style={{ margin: 0, fontSize: '14px' }}>
                                Adicione componentes usando a coluna à esquerda
                            </p>
                        </div>
                    ) : (
                        components.map((component) => (
                            <div key={component.id}>
                                {renderComponent(component)}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* COLUNA 4: PROPRIEDADES (320px) */}
            <div style={{ ...columnStyle, width: '320px', borderRight: 'none', borderLeft: '1px solid #ddd' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>⚙️ Propriedades</h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {renderPropertiesPanel()}
                </div>
            </div>
        </div>
    );
}; export default MinimalTest;