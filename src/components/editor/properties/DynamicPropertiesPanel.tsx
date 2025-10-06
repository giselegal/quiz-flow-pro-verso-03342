/**
 * 🎨 DYNAMIC PROPERTIES PANEL
 * 
 * Painel de propriedades que adapta seu conteúdo baseado no tipo do step selecionado.
 * Fornece formulários específicos para cada tipo de componente editável.
 */

import React from 'react';

export interface DynamicPropertiesPanelProps {
    selectedStep: any;
    onUpdate: (updates: any) => void;
    onDelete: () => void;
}

const DynamicPropertiesPanel: React.FC<DynamicPropertiesPanelProps> = ({
    selectedStep,
    onUpdate,
    onDelete
}) => {
    if (!selectedStep) {
        return (
            <div style={{ padding: '16px' }}>
                <p style={{ color: 'hsl(var(--muted-foreground))', fontStyle: 'italic' }}>
                    Selecione uma etapa para editar suas propriedades
                </p>
            </div>
        );
    }

    const handleChange = (field: string, value: any) => {
        onUpdate({
            ...selectedStep,
            [field]: value
        });
    };

    const inputStyle = {
        width: '100%',
        padding: '8px 12px',
        border: '1px solid hsl(var(--border))',
        borderRadius: '6px',
        fontSize: '14px',
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '6px',
        fontSize: '13px',
        fontWeight: 'bold' as const,
        color: 'hsl(var(--foreground))'
    };

    const sectionStyle = {
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid hsl(var(--border))'
    };

    // Renderizar campos específicos baseado no tipo
    const renderTypeSpecificFields = () => {
        switch (selectedStep.type) {
            case 'intro':
                return (
                    <>
                        <div style={sectionStyle}>
                            <label style={labelStyle}>Título Principal:</label>
                            <textarea
                                value={selectedStep.title || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                                placeholder="Digite o título principal..."
                            />
                        </div>

                        <div style={sectionStyle}>
                            <label style={labelStyle}>Pergunta do Formulário:</label>
                            <input
                                type="text"
                                value={selectedStep.formQuestion || ''}
                                onChange={(e) => handleChange('formQuestion', e.target.value)}
                                style={inputStyle}
                                placeholder="Ex: Como posso te chamar?"
                            />
                        </div>

                        <div style={sectionStyle}>
                            <label style={labelStyle}>Placeholder do Input:</label>
                            <input
                                type="text"
                                value={selectedStep.placeholder || ''}
                                onChange={(e) => handleChange('placeholder', e.target.value)}
                                style={inputStyle}
                                placeholder="Ex: Digite seu nome..."
                            />
                        </div>

                        <div style={sectionStyle}>
                            <label style={labelStyle}>Texto do Botão:</label>
                            <input
                                type="text"
                                value={selectedStep.buttonText || ''}
                                onChange={(e) => handleChange('buttonText', e.target.value)}
                                style={inputStyle}
                                placeholder="Ex: Continuar"
                            />
                        </div>

                        <div style={sectionStyle}>
                            <label style={labelStyle}>URL da Imagem:</label>
                            <input
                                type="url"
                                value={selectedStep.image || ''}
                                onChange={(e) => handleChange('image', e.target.value)}
                                style={inputStyle}
                                placeholder="https://..."
                            />
                        </div>
                    </>
                );

            case 'question':
                return (
                    <>
                        <div style={sectionStyle}>
                            <label style={labelStyle}>Número da Questão:</label>
                            <input
                                type="text"
                                value={selectedStep.questionNumber || ''}
                                onChange={(e) => handleChange('questionNumber', e.target.value)}
                                style={inputStyle}
                                placeholder="Ex: 1/10"
                            />
                        </div>

                        <div style={sectionStyle}>
                            <label style={labelStyle}>Texto da Pergunta:</label>
                            <textarea
                                value={selectedStep.questionText || ''}
                                onChange={(e) => handleChange('questionText', e.target.value)}
                                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                                placeholder="Digite a pergunta..."
                            />
                        </div>

                        <div style={sectionStyle}>
                            <label style={labelStyle}>Seleções Obrigatórias:</label>
                            <input
                                type="number"
                                value={selectedStep.requiredSelections || 1}
                                onChange={(e) => handleChange('requiredSelections', parseInt(e.target.value) || 1)}
                                style={inputStyle}
                                min="1"
                            />
                        </div>

                        <div style={sectionStyle}>
                            <label style={labelStyle}>Opções:</label>
                            <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', margin: '4px 0 8px 0' }}>
                                {selectedStep.options?.length || 0} opções configuradas
                            </p>
                            <button
                                onClick={() => {
                                    const newOption = {
                                        id: `opt-${Date.now()}`,
                                        text: 'Nova opção',
                                        image: ''
                                    };
                                    const currentOptions = selectedStep.options || [];
                                    handleChange('options', [...currentOptions, newOption]);
                                }}
                                style={{
                                    padding: '8px 16px',
                                    background: 'hsl(var(--primary))',
                                    color: 'hsl(var(--primary-foreground))',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                }}
                            >
                                + Adicionar Opção
                            </button>
                        </div>
                    </>
                );

            case 'transition':
            case 'transition-result':
                return (
                    <>
                        <div style={sectionStyle}>
                            <label style={labelStyle}>Mensagem Principal:</label>
                            <textarea
                                value={selectedStep.message || ''}
                                onChange={(e) => handleChange('message', e.target.value)}
                                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                                placeholder="Digite a mensagem de transição..."
                            />
                        </div>

                        <div style={sectionStyle}>
                            <label style={labelStyle}>Duração (segundos):</label>
                            <input
                                type="number"
                                value={selectedStep.duration || 3}
                                onChange={(e) => handleChange('duration', parseInt(e.target.value) || 3)}
                                style={inputStyle}
                                min="1"
                                max="10"
                            />
                        </div>
                    </>
                );

            case 'result':
                return (
                    <>
                        <div style={sectionStyle}>
                            <label style={labelStyle}>Título do Resultado:</label>
                            <input
                                type="text"
                                value={selectedStep.title || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                                style={inputStyle}
                                placeholder="Ex: Seu resultado está pronto!"
                            />
                        </div>

                        <div style={sectionStyle}>
                            <label style={labelStyle}>Descrição:</label>
                            <textarea
                                value={selectedStep.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                                placeholder="Descreva o resultado..."
                            />
                        </div>

                        <div style={sectionStyle}>
                            <label style={labelStyle}>Estilo Calculado:</label>
                            <input
                                type="text"
                                value={selectedStep.styleType || ''}
                                onChange={(e) => handleChange('styleType', e.target.value)}
                                style={inputStyle}
                                placeholder="Ex: Natural, Romântico, etc."
                                disabled
                            />
                            <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', margin: '4px 0 0 0' }}>
                                (Calculado automaticamente)
                            </p>
                        </div>
                    </>
                );

            case 'offer':
                return (
                    <>
                        <div style={sectionStyle}>
                            <label style={labelStyle}>Título da Oferta:</label>
                            <input
                                type="text"
                                value={selectedStep.title || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                                style={inputStyle}
                                placeholder="Ex: Oferta Especial"
                            />
                        </div>

                        <div style={sectionStyle}>
                            <label style={labelStyle}>Descrição:</label>
                            <textarea
                                value={selectedStep.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                                placeholder="Descreva a oferta..."
                            />
                        </div>

                        <div style={sectionStyle}>
                            <label style={labelStyle}>Preço:</label>
                            <input
                                type="text"
                                value={selectedStep.price || ''}
                                onChange={(e) => handleChange('price', e.target.value)}
                                style={inputStyle}
                                placeholder="Ex: R$ 197,00"
                            />
                        </div>

                        <div style={sectionStyle}>
                            <label style={labelStyle}>Link do Botão:</label>
                            <input
                                type="url"
                                value={selectedStep.buttonLink || ''}
                                onChange={(e) => handleChange('buttonLink', e.target.value)}
                                style={inputStyle}
                                placeholder="https://..."
                            />
                        </div>
                    </>
                );

            default:
                return (
                    <div style={sectionStyle}>
                        <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                            Propriedades para o tipo "{selectedStep.type}" ainda não foram implementadas.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '2px solid hsl(var(--border))' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 'bold', color: 'hsl(var(--foreground))' }}>
                    {selectedStep.title || selectedStep.name || 'Propriedades'}
                </h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                    Tipo: <strong>{selectedStep.type}</strong>
                </p>
            </div>

            {renderTypeSpecificFields()}

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid hsl(var(--border))' }}>
                <button
                    onClick={onDelete}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: 'hsl(var(--destructive))',
                        color: 'hsl(var(--destructive-foreground))',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                >
                    🗑️ Excluir Etapa
                </button>
            </div>
        </div>
    );
};

export default DynamicPropertiesPanel;
