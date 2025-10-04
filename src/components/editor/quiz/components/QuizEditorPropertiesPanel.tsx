import React, { memo, useMemo, useCallback } from 'react';
import { EditableQuizStep } from '../hooks/useQuizEditorState';

/**
 * ✨ QUIZ EDITOR PROPERTIES PANEL
 * 
 * Painel de edição de propriedades do step selecionado
 * Formulários dinâmicos por tipo de step
 * Validação e feedback em tempo real
 */

export interface QuizEditorPropertiesPanelProps {
    selectedStep: EditableQuizStep | null;
    selectedBlockId: string;
    isVisible: boolean;

    // Callbacks
    onUpdateStep: (stepId: string, updates: Partial<EditableQuizStep>) => void;
    onClose: () => void;
}

const QuizEditorPropertiesPanel: React.FC<QuizEditorPropertiesPanelProps> = memo(({
    selectedStep,
    selectedBlockId,
    isVisible,
    onUpdateStep,
    onClose
}) => {
    // Handle input change
    const handleInputChange = useCallback((field: keyof EditableQuizStep, value: any) => {
        if (!selectedStep) return;
        onUpdateStep(selectedStep.id, { [field]: value });
    }, [selectedStep, onUpdateStep]);

    // Handle array input change (for options, characteristics, etc.)
    const handleArrayInputChange = useCallback((field: keyof EditableQuizStep, index: number, value: any) => {
        if (!selectedStep || !Array.isArray(selectedStep[field])) return;

        const currentArray = selectedStep[field] as any[];
        const newArray = [...currentArray];
        newArray[index] = value;

        onUpdateStep(selectedStep.id, { [field]: newArray });
    }, [selectedStep, onUpdateStep]);

    // Add array item
    const handleAddArrayItem = useCallback((field: keyof EditableQuizStep, defaultValue: any) => {
        if (!selectedStep) return;

        const currentArray = (selectedStep[field] as any[]) || [];
        const newArray = [...currentArray, defaultValue];

        onUpdateStep(selectedStep.id, { [field]: newArray });
    }, [selectedStep, onUpdateStep]);

    // Remove array item
    const handleRemoveArrayItem = useCallback((field: keyof EditableQuizStep, index: number) => {
        if (!selectedStep || !Array.isArray(selectedStep[field])) return;

        const currentArray = selectedStep[field] as any[];
        const newArray = currentArray.filter((_, i) => i !== index);

        onUpdateStep(selectedStep.id, { [field]: newArray });
    }, [selectedStep, onUpdateStep]);

    // Render intro step properties
    const renderIntroProperties = useMemo(() => () => {
        if (!selectedStep || selectedStep.type !== 'intro') return null;

        return (
            <div className="properties-section">
                <h4>🏠 Propriedades da Introdução</h4>

                <div className="form-group">
                    <label>Título Principal</label>
                    <input
                        type="text"
                        value={selectedStep.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Ex: Bem-vindo ao Quiz!"
                    />
                </div>

                <div className="form-group">
                    <label>Descrição</label>
                    <textarea
                        value={selectedStep.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Descreva o que o usuário pode esperar..."
                        rows={3}
                    />
                </div>

                <div className="form-group">
                    <label>Pergunta do Formulário</label>
                    <input
                        type="text"
                        value={selectedStep.formQuestion || ''}
                        onChange={(e) => handleInputChange('formQuestion', e.target.value)}
                        placeholder="Ex: Como posso te chamar?"
                    />
                </div>

                <div className="form-group">
                    <label>Placeholder do Input</label>
                    <input
                        type="text"
                        value={selectedStep.placeholder || ''}
                        onChange={(e) => handleInputChange('placeholder', e.target.value)}
                        placeholder="Ex: Digite seu nome"
                    />
                </div>

                <div className="form-group">
                    <label>Texto do Botão</label>
                    <input
                        type="text"
                        value={selectedStep.buttonText || ''}
                        onChange={(e) => handleInputChange('buttonText', e.target.value)}
                        placeholder="Ex: Começar Quiz"
                    />
                </div>

                <div className="form-group">
                    <label>Imagem de Fundo</label>
                    <input
                        type="url"
                        value={selectedStep.image || ''}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        placeholder="URL da imagem"
                    />
                </div>
            </div>
        );
    }, [selectedStep, handleInputChange]);

    // Render question step properties
    const renderQuestionProperties = useMemo(() => () => {
        if (!selectedStep || !['question', 'strategic-question'].includes(selectedStep.type)) return null;

        return (
            <div className="properties-section">
                <h4>❓ Propriedades da Pergunta</h4>

                <div className="form-group">
                    <label>Número da Pergunta</label>
                    <input
                        type="text"
                        value={selectedStep.questionNumber || ''}
                        onChange={(e) => handleInputChange('questionNumber', e.target.value)}
                        placeholder="Ex: 01"
                    />
                </div>

                <div className="form-group">
                    <label>Texto da Pergunta</label>
                    <textarea
                        value={selectedStep.questionText || ''}
                        onChange={(e) => handleInputChange('questionText', e.target.value)}
                        placeholder="Digite sua pergunta aqui..."
                        rows={3}
                    />
                </div>

                <div className="form-group">
                    <label>Opções de Resposta</label>
                    <div className="array-input">
                        {(selectedStep.options || []).map((option, index) => (
                            <div key={index} className="array-item">
                                <input
                                    type="text"
                                    value={option.text}
                                    onChange={(e) => handleArrayInputChange('options', index, {
                                        ...option,
                                        text: e.target.value
                                    })}
                                    placeholder={`Opção ${index + 1}`}
                                />
                                <input
                                    type="url"
                                    value={option.image || ''}
                                    onChange={(e) => handleArrayInputChange('options', index, {
                                        ...option,
                                        image: e.target.value
                                    })}
                                    placeholder="URL da imagem (opcional)"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveArrayItem('options', index)}
                                    className="remove-btn"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddArrayItem('options', {
                                id: `option-${Date.now()}`,
                                text: '',
                                image: ''
                            })}
                            className="add-btn"
                        >
                            ➕ Adicionar Opção
                        </button>
                    </div>
                </div>

                {selectedStep.type === 'strategic-question' && (
                    <div className="form-group">
                        <label>Seleções Obrigatórias</label>
                        <input
                            type="number"
                            min="1"
                            max={selectedStep.options?.length || 1}
                            value={selectedStep.requiredSelections || 1}
                            onChange={(e) => handleInputChange('requiredSelections', parseInt(e.target.value))}
                        />
                    </div>
                )}
            </div>
        );
    }, [selectedStep, handleInputChange, handleArrayInputChange, handleAddArrayItem, handleRemoveArrayItem]);

    // Render result step properties
    const renderResultProperties = useMemo(() => () => {
        if (!selectedStep || selectedStep.type !== 'result') return null;

        return (
            <div className="properties-section">
                <h4>🎉 Propriedades do Resultado</h4>

                <div className="form-group">
                    <label>Título do Resultado</label>
                    <input
                        type="text"
                        value={selectedStep.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Ex: Seu Perfil Ideal"
                    />
                </div>

                <div className="form-group">
                    <label>Subtítulo</label>
                    <input
                        type="text"
                        value={selectedStep.subtitle || ''}
                        onChange={(e) => handleInputChange('subtitle', e.target.value)}
                        placeholder="Subtítulo do resultado"
                    />
                </div>

                <div className="form-group">
                    <label>Descrição</label>
                    <textarea
                        value={selectedStep.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Descrição detalhada do resultado..."
                        rows={4}
                    />
                </div>

                <div className="form-group">
                    <label>Características</label>
                    <div className="array-input">
                        {(selectedStep.characteristics || []).map((characteristic, index) => (
                            <div key={index} className="array-item">
                                <input
                                    type="text"
                                    value={characteristic}
                                    onChange={(e) => handleArrayInputChange('characteristics', index, e.target.value)}
                                    placeholder={`Característica ${index + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveArrayItem('characteristics', index)}
                                    className="remove-btn"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddArrayItem('characteristics', '')}
                            className="add-btn"
                        >
                            ➕ Adicionar Característica
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label>Imagem do Resultado</label>
                    <input
                        type="url"
                        value={selectedStep.image || ''}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        placeholder="URL da imagem"
                    />
                </div>
            </div>
        );
    }, [selectedStep, handleInputChange, handleArrayInputChange, handleAddArrayItem, handleRemoveArrayItem]);

    // Render offer step properties
    const renderOfferProperties = useMemo(() => () => {
        if (!selectedStep || selectedStep.type !== 'offer') return null;

        return (
            <div className="properties-section">
                <h4>💰 Propriedades da Oferta</h4>

                <div className="form-group">
                    <label>Título da Oferta</label>
                    <input
                        type="text"
                        value={selectedStep.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Ex: Oferta Especial Para Você!"
                    />
                </div>

                <div className="form-group">
                    <label>Descrição</label>
                    <textarea
                        value={selectedStep.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Descrição da oferta..."
                        rows={3}
                    />
                </div>

                <div className="form-group">
                    <label>Preço</label>
                    <input
                        type="text"
                        value={selectedStep.price || ''}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="Ex: R$ 97,00"
                    />
                </div>

                <div className="form-group">
                    <label>Preço Original</label>
                    <input
                        type="text"
                        value={selectedStep.originalPrice || ''}
                        onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                        placeholder="Ex: R$ 197,00"
                    />
                </div>

                <div className="form-group">
                    <label>Benefícios</label>
                    <div className="array-input">
                        {(selectedStep.benefits || []).map((benefit, index) => (
                            <div key={index} className="array-item">
                                <input
                                    type="text"
                                    value={benefit}
                                    onChange={(e) => handleArrayInputChange('benefits', index, e.target.value)}
                                    placeholder={`Benefício ${index + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveArrayItem('benefits', index)}
                                    className="remove-btn"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddArrayItem('benefits', '')}
                            className="add-btn"
                        >
                            ➕ Adicionar Benefício
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label>Texto do Botão</label>
                    <input
                        type="text"
                        value={selectedStep.buttonText || ''}
                        onChange={(e) => handleInputChange('buttonText', e.target.value)}
                        placeholder="Ex: Quero Aproveitar!"
                    />
                </div>
            </div>
        );
    }, [selectedStep, handleInputChange, handleArrayInputChange, handleAddArrayItem, handleRemoveArrayItem]);

    // Render transition step properties
    const renderTransitionProperties = useMemo(() => () => {
        if (!selectedStep || !['transition', 'transition-result'].includes(selectedStep.type)) return null;

        return (
            <div className="properties-section">
                <h4>➡️ Propriedades da Transição</h4>

                <div className="form-group">
                    <label>Título da Transição</label>
                    <input
                        type="text"
                        value={selectedStep.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Ex: Analisando suas respostas..."
                    />
                </div>

                <div className="form-group">
                    <label>Descrição</label>
                    <textarea
                        value={selectedStep.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Mensagem durante a transição..."
                        rows={2}
                    />
                </div>
            </div>
        );
    }, [selectedStep, handleInputChange]);

    // Main properties renderer
    const renderProperties = useMemo(() => {
        if (!selectedStep) return null;

        switch (selectedStep.type) {
            case 'intro':
                return renderIntroProperties();
            case 'question':
            case 'strategic-question':
                return renderQuestionProperties();
            case 'result':
                return renderResultProperties();
            case 'offer':
                return renderOfferProperties();
            case 'transition':
            case 'transition-result':
                return renderTransitionProperties();
            default:
                return null;
        }
    }, [
        selectedStep,
        renderIntroProperties,
        renderQuestionProperties,
        renderResultProperties,
        renderOfferProperties,
        renderTransitionProperties
    ]);

    if (!isVisible) return null;

    return (
        <div className="quiz-editor-properties-panel">
            <div className="panel-header">
                <h3>⚙️ Propriedades</h3>
                <button
                    className="close-btn"
                    onClick={onClose}
                    title="Fechar painel"
                >
                    ✕
                </button>
            </div>

            <div className="panel-content">
                {selectedStep ? (
                    <>
                        <div className="step-info">
                            <div className="step-type-badge">
                                {selectedStep.type}
                            </div>
                            <div className="step-id">
                                ID: {selectedStep.id}
                            </div>
                            {selectedBlockId && (
                                <div className="selected-block">
                                    Bloco: {selectedBlockId}
                                </div>
                            )}
                        </div>

                        {renderProperties}
                    </>
                ) : (
                    <div className="empty-state">
                        <p>Selecione um step para editar suas propriedades</p>
                    </div>
                )}
            </div>
        </div>
    );
});

QuizEditorPropertiesPanel.displayName = 'QuizEditorPropertiesPanel';

export default QuizEditorPropertiesPanel;