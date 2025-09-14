/**
 * 🎯 UNIVERSAL STEP EDITOR - VERSÃO FUNCIONAL COM 4 COLUNAS
 * 
 * Editor visual universal com layout de 4 colunas e renderização real
 */

import React from 'react';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

export interface UniversalStepEditorProps {
    stepId: string;
    stepNumber: number;
    funnelId?: string;
    onStepChange?: (stepId: string) => void;
    onSave?: (stepId: string, data: any) => void;
    readOnly?: boolean;
    showNavigation?: boolean;
}

const UniversalStepEditor: React.FC<UniversalStepEditorProps> = ({
    stepId = 'step-1',
    stepNumber = 1,
    funnelId = 'quiz-21-steps-complete',
    onStepChange,
    onSave,
    readOnly = false,
    showNavigation = true
}) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentStepData, setCurrentStepData] = React.useState<any>(null);
    const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null);
    const [selectedBlockData, setSelectedBlockData] = React.useState<any>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

    // Carregar dados do step atual
    React.useEffect(() => {
        const loadStepData = () => {
            try {
                setIsLoading(true);
                console.log('🔍 Carregando dados para:', stepId, 'step number:', stepNumber);

                // Buscar dados do step no template
                const stepKey = `step-${stepNumber}`;
                const stepData = QUIZ_STYLE_21_STEPS_TEMPLATE[stepKey];

                if (stepData && Array.isArray(stepData)) {
                    const stepInfo = {
                        name: `Step ${stepNumber}`,
                        description: `Conteúdo do step ${stepNumber}`,
                        blocks: stepData
                    };
                    setCurrentStepData(stepInfo);
                    console.log('✅ Dados do step carregados:', stepKey, {
                        nome: stepInfo.name,
                        blocos: stepData.length,
                        primeiroBloco: stepData[0]
                    });
                } else {
                    // Dados de fallback mais realistas
                    const fallbackData = {
                        name: `Step ${stepNumber}`,
                        description: `Conteúdo do step ${stepNumber}`,
                        blocks: [
                            {
                                id: `step${stepNumber}-title`,
                                type: "text",
                                order: 1,
                                content: {
                                    text: `<span style="color: #B89B7A; font-weight: 700;">Step ${stepNumber}</span> do quiz interativo`
                                },
                                properties: {
                                    fontSize: "text-2xl",
                                    fontWeight: "font-bold",
                                    textAlign: "center",
                                    color: "#432818"
                                }
                            },
                            {
                                id: `step${stepNumber}-question`,
                                type: "form-container",
                                order: 2,
                                content: {
                                    title: `Pergunta do Step ${stepNumber}`,
                                    placeholder: "Digite sua resposta...",
                                    buttonText: "Continuar",
                                    backgroundColor: "#FFFFFF",
                                    borderColor: "#B89B7A",
                                    buttonBackgroundColor: "#B89B7A",
                                    buttonTextColor: "#FFFFFF"
                                },
                                properties: {}
                            }
                        ]
                    };

                    setCurrentStepData(fallbackData);
                    console.warn('⚠️ Step não encontrado, usando fallback:', stepKey, fallbackData);
                }
            } catch (error) {
                console.error('❌ Erro ao carregar step:', error);
                setCurrentStepData({
                    blocks: [],
                    name: `Step ${stepNumber} (Erro)`,
                    description: 'Erro ao carregar conteúdo'
                });
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(loadStepData, 500);
        return () => clearTimeout(timer);
    }, [stepId, stepNumber]);

    const handleNext = () => {
        if (stepNumber < 21) {
            const nextStepId = `step-${stepNumber + 1}`;
            onStepChange?.(nextStepId);
        }
    };

    const handlePrevious = () => {
        if (stepNumber > 1) {
            const prevStepId = `step-${stepNumber - 1}`;
            onStepChange?.(prevStepId);
        }
    };

    const handleSave = () => {
        const saveData = {
            stepId,
            stepNumber,
            data: currentStepData,
            timestamp: Date.now()
        };
        onSave?.(stepId, saveData);
        console.log('✅ Step salvo:', saveData);
    };

    // Função para atualizar propriedades de bloco em tempo real
    const updateBlockProperty = (blockId: string, path: string, value: any) => {
        setCurrentStepData((prev: any) => {
            if (!prev?.blocks) return prev;

            const updatedBlocks = prev.blocks.map((block: any) => {
                if (block.id !== blockId) return block;

                const newBlock = { ...block };
                const pathParts = path.split('.');

                if (pathParts[0] === 'content') {
                    newBlock.content = { ...newBlock.content };
                    newBlock.content[pathParts[1]] = value;
                } else if (pathParts[0] === 'properties') {
                    newBlock.properties = { ...newBlock.properties };
                    newBlock.properties[pathParts[1]] = value;
                } else {
                    newBlock[pathParts[0]] = value;
                }

                return newBlock;
            });

            return { ...prev, blocks: updatedBlocks };
        });

        // Atualizar dados do bloco selecionado se for o mesmo
        if (selectedBlockData?.id === blockId) {
            setSelectedBlockData((prev: any) => {
                if (!prev) return prev;
                const newData = { ...prev };
                const pathParts = path.split('.');

                if (pathParts[0] === 'content') {
                    newData.content = { ...newData.content };
                    newData.content[pathParts[1]] = value;
                } else if (pathParts[0] === 'properties') {
                    newData.properties = { ...newData.properties };
                    newData.properties[pathParts[1]] = value;
                } else {
                    newData[pathParts[0]] = value;
                }

                return newData;
            });
        }

        console.log('🔄 Propriedade atualizada:', blockId, path, value);
        setHasUnsavedChanges(true);
    };

    // Auto-save das mudanças
    React.useEffect(() => {
        if (!hasUnsavedChanges) return;

        const autoSaveTimer = setTimeout(() => {
            handleSave();
            setHasUnsavedChanges(false);
            console.log('💾 Auto-save executado');
        }, 2000); // Auto-save após 2 segundos de inatividade

        return () => clearTimeout(autoSaveTimer);
    }, [hasUnsavedChanges, currentStepData]);

    // Renderizar componente visual baseado no tipo
    const renderComponent = (component: any, index: number) => {
        const { type, content, properties } = component;
        const isSelected = selectedBlockId === component.id;

        const handleBlockClick = () => {
            setSelectedBlockId(component.id);
            setSelectedBlockData(component);
            console.log('🎯 Bloco selecionado:', component);
        };

        const blockWrapper = (children: React.ReactNode) => (
            <div
                key={index}
                className={`cursor-pointer transition-all duration-200 ${isSelected
                        ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg'
                        : 'hover:shadow-md hover:ring-1 hover:ring-gray-300'
                    }`}
                onClick={handleBlockClick}
            >
                {children}
                {isSelected && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Selecionado
                    </div>
                )}
            </div>
        );

        switch (type) {
            case 'quiz-intro-header':
                return blockWrapper(
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4 relative">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">📋 Quiz Header</h3>
                            <span className="text-xs text-gray-500">{type}</span>
                        </div>
                        <div className="space-y-4">
                            {properties?.logoUrl && (
                                <div className="text-center">
                                    <img
                                        src={properties.logoUrl}
                                        alt={properties.logoAlt || 'Logo'}
                                        className="h-12 mx-auto"
                                    />
                                </div>
                            )}
                            {properties?.enableProgressBar && (
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${properties.progressValue || 0}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'text':
                return blockWrapper(
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4 relative">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">📝 Texto</h3>
                            <span className="text-xs text-gray-500">{type}</span>
                        </div>
                        <div
                            className={`${properties?.fontSize || 'text-base'} ${properties?.fontWeight || 'font-normal'} ${properties?.textAlign || 'text-left'}`}
                            style={{ color: properties?.color || '#000000' }}
                            dangerouslySetInnerHTML={{ __html: content?.text || 'Texto não definido' }}
                        />
                    </div>
                );

            case 'form-container':
                return blockWrapper(
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4 relative">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">📝 Formulário</h3>
                            <span className="text-xs text-gray-500">{type}</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {content?.title || 'Campo de formulário'}
                                </label>
                                <input
                                    type="text"
                                    placeholder={content?.placeholder || 'Digite aqui...'}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    style={{
                                        backgroundColor: content?.backgroundColor || '#FFFFFF',
                                        borderColor: content?.borderColor || '#B89B7A',
                                        color: content?.textColor || '#432818'
                                    }}
                                />
                            </div>
                            <button
                                className="w-full py-3 px-4 rounded-md font-medium transition-colors"
                                style={{
                                    backgroundColor: content?.buttonBackgroundColor || '#B89B7A',
                                    color: content?.buttonTextColor || '#FFFFFF'
                                }}
                            >
                                {content?.buttonText || 'Enviar'}
                            </button>
                        </div>
                    </div>
                );

            case 'legal-notice':
                return (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">⚖️ Aviso Legal</h3>
                            <span className="text-xs text-gray-500">{type}</span>
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-xs text-gray-500">
                                {properties?.copyrightText || '© 2025 - Todos os direitos reservados'}
                            </p>
                            <div className="space-x-4">
                                {properties?.showPrivacyLink && (
                                    <a href={properties.privacyLinkUrl || '#'} className="text-xs text-blue-600 hover:underline">
                                        {properties.privacyText || 'Política de Privacidade'}
                                    </a>
                                )}
                                {properties?.showTermsLink && (
                                    <a href={properties.termsLinkUrl || '#'} className="text-xs text-blue-600 hover:underline">
                                        {properties.termsText || 'Termos de Uso'}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'HeaderSection':
                return (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">📋 Header</h3>
                            <span className="text-xs text-gray-500">HeaderSection</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                                <h2 className="text-2xl font-bold text-gray-900">{properties?.title || 'Título do Step'}</h2>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
                                <p className="text-gray-600">{properties?.subtitle || 'Subtítulo do step'}</p>
                            </div>
                        </div>
                    </div>
                );

            case 'UserInfoSection':
                return (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">👤 Informações do Usuário</h3>
                            <span className="text-xs text-gray-500">UserInfoSection</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold">👤</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Nome do Usuário</p>
                                    <p className="text-sm text-gray-500">Informações personalizadas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'ProgressSection':
                return (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">📊 Progresso</h3>
                            <span className="text-xs text-gray-500">ProgressSection</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Step {stepNumber} de 21</span>
                                <span className="text-sm font-medium text-gray-900">{Math.round((stepNumber / 21) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(stepNumber / 21) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                );

            case 'MainImageSection':
                return (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">🖼️ Imagem Principal</h3>
                            <span className="text-xs text-gray-500">MainImageSection</span>
                        </div>
                        <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl mb-2">🖼️</div>
                                <p className="text-gray-500">Imagem do Step {stepNumber}</p>
                            </div>
                        </div>
                    </div>
                );

            case 'QuestionSection':
                return (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">❓ Pergunta</h3>
                            <span className="text-xs text-gray-500">QuestionSection</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-3">
                                    {properties?.question || `Pergunta do Step ${stepNumber}?`}
                                </h4>
                                <div className="space-y-2">
                                    {(properties?.options || ['Opção A', 'Opção B', 'Opção C']).map((option: string, optIndex: number) => (
                                        <label key={optIndex} className="flex items-center space-x-3">
                                            <input
                                                type="radio"
                                                name={`question-${index}`}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span className="text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">🧩 {type || 'Componente'}</h3>
                            <span className="text-xs text-gray-500">{type}</span>
                        </div>
                        {content?.text && (
                            <div dangerouslySetInnerHTML={{ __html: content.text }} />
                        )}
                        {properties && Object.keys(properties).length > 0 && (
                            <pre className="text-xs text-gray-500 mt-2 bg-gray-100 p-2 rounded overflow-auto">
                                {JSON.stringify(properties, null, 2)}
                            </pre>
                        )}
                    </div>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando Step {stepNumber}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                        {currentStepData?.name || `Step ${stepNumber}`}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {currentStepData?.description || `Conteúdo do step ${stepNumber}`}
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => {
                            handleSave();
                            setHasUnsavedChanges(false);
                        }}
                        className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-2 ${hasUnsavedChanges
                                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        <span>💾</span>
                        <span>{hasUnsavedChanges ? 'Salvar Alterações' : 'Salvar'}</span>
                        {hasUnsavedChanges && (
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        )}
                    </button>
                </div>
            </div>

            {/* Layout de 4 Colunas */}
            <div className="flex-1 flex">
                {/* Coluna 1: Navegação / Estrutura */}
                <div className="w-64 bg-white border-r border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🗂️ Estrutura</h3>

                    <div className="space-y-2">
                        {Array.from({ length: 21 }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                onClick={() => onStepChange?.(`step-${num}`)}
                                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${num === stepNumber
                                    ? 'bg-blue-100 text-blue-800 font-medium'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                Step {num}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Coluna 2: Componentes Disponíveis */}
                <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🧩 Componentes</h3>

                    <div className="space-y-3">
                        <div
                            className="bg-white rounded-lg p-3 border border-gray-200 cursor-grab hover:bg-gray-50 hover:shadow-md transition-all"
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', JSON.stringify({
                                    type: 'HeaderSection',
                                    id: `new-header-${Date.now()}`,
                                    content: { title: 'Novo Título', subtitle: 'Novo Subtítulo' },
                                    properties: { fontSize: 'text-2xl', fontWeight: 'font-bold' }
                                }));
                            }}
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">📋</span>
                                <div>
                                    <p className="font-medium text-gray-900">Header</p>
                                    <p className="text-xs text-gray-500">Título e subtítulo</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white rounded-lg p-3 border border-gray-200 cursor-grab hover:bg-gray-50 hover:shadow-md transition-all"
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', JSON.stringify({
                                    type: 'text',
                                    id: `new-text-${Date.now()}`,
                                    content: { text: 'Novo texto aqui...' },
                                    properties: { fontSize: 'text-base', textAlign: 'left' }
                                }));
                            }}
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">�</span>
                                <div>
                                    <p className="font-medium text-gray-900">Texto</p>
                                    <p className="text-xs text-gray-500">Parágrafo de texto</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white rounded-lg p-3 border border-gray-200 cursor-grab hover:bg-gray-50 hover:shadow-md transition-all"
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', JSON.stringify({
                                    type: 'UserInfoSection',
                                    id: `new-userinfo-${Date.now()}`,
                                    content: {},
                                    properties: {}
                                }));
                            }}
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">�</span>
                                <div>
                                    <p className="font-medium text-gray-900">User Info</p>
                                    <p className="text-xs text-gray-500">Informações do usuário</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white rounded-lg p-3 border border-gray-200 cursor-grab hover:bg-gray-50 hover:shadow-md transition-all"
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', JSON.stringify({
                                    type: 'image',
                                    id: `new-image-${Date.now()}`,
                                    content: {},
                                    properties: {
                                        src: 'https://via.placeholder.com/400x300',
                                        alt: 'Nova imagem',
                                        maxWidth: 'md'
                                    }
                                }));
                            }}
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">🖼️</span>
                                <div>
                                    <p className="font-medium text-gray-900">Image</p>
                                    <p className="text-xs text-gray-500">Imagem principal</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white rounded-lg p-3 border border-gray-200 cursor-grab hover:bg-gray-50 hover:shadow-md transition-all"
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', JSON.stringify({
                                    type: 'form-container',
                                    id: `new-form-${Date.now()}`,
                                    content: {
                                        title: 'Nova Pergunta',
                                        placeholder: 'Digite sua resposta...',
                                        buttonText: 'Enviar',
                                        backgroundColor: '#FFFFFF',
                                        borderColor: '#B89B7A',
                                        buttonBackgroundColor: '#B89B7A',
                                        buttonTextColor: '#FFFFFF'
                                    },
                                    properties: {}
                                }));
                            }}
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">❓</span>
                                <div>
                                    <p className="font-medium text-gray-900">Question</p>
                                    <p className="text-xs text-gray-500">Pergunta com opções</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna 3: Editor Visual Principal */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div
                        className="bg-white rounded-lg border border-gray-200 p-6 min-h-full"
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add('ring-2', 'ring-blue-300', 'bg-blue-50');
                        }}
                        onDragLeave={(e) => {
                            e.currentTarget.classList.remove('ring-2', 'ring-blue-300', 'bg-blue-50');
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('ring-2', 'ring-blue-300', 'bg-blue-50');

                            try {
                                const componentData = JSON.parse(e.dataTransfer.getData('text/plain'));
                                console.log('🎯 Componente solto:', componentData);

                                // Adicionar o novo componente à lista de blocos
                                const newBlock = {
                                    ...componentData,
                                    order: currentStepData?.blocks?.length || 0
                                };

                                setCurrentStepData((prev: any) => ({
                                    ...prev,
                                    blocks: [...(prev?.blocks || []), newBlock]
                                }));

                                setHasUnsavedChanges(true);
                                console.log('✅ Novo componente adicionado:', newBlock);
                            } catch (error) {
                                console.error('❌ Erro ao processar drop:', error);
                            }
                        }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                🎯 Preview - Step {stepNumber}
                            </h2>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">ID:</span>
                                <span className="text-sm font-mono text-gray-700">{stepId}</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {currentStepData?.blocks && currentStepData.blocks.length > 0 ? (
                                currentStepData.blocks.map((block: any, index: number) => (
                                    renderComponent(block, index)
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🎯</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Step {stepNumber}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {currentStepData?.description || 'Arrastar componentes para começar a editar'}
                                    </p>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">
                                            Funil: {funnelId} | ID: {stepId}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Botões de Navegação abaixo dos blocos */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={stepNumber <= 1}
                                        className="flex items-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <span>←</span>
                                        <span>Step Anterior</span>
                                    </button>

                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-500">Step {stepNumber} de 21</span>
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${(stepNumber / 21) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {Math.round((stepNumber / 21) * 100)}%
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        disabled={stepNumber >= 21}
                                        className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <span>Próximo Step</span>
                                        <span>→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna 4: Propriedades */}
                <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Propriedades</h3>

                    {selectedBlockData ? (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <h4 className="font-medium text-blue-900 mb-2">Bloco Selecionado</h4>
                                <div className="text-sm space-y-1">
                                    <div><strong>ID:</strong> {selectedBlockData.id}</div>
                                    <div><strong>Tipo:</strong> {selectedBlockData.type}</div>
                                    <div><strong>Ordem:</strong> {selectedBlockData.order}</div>
                                </div>
                            </div>

                            {/* Propriedades editáveis */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ID do Componente
                                </label>
                                <input
                                    type="text"
                                    defaultValue={selectedBlockData.id}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    readOnly={readOnly}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo do Componente
                                </label>
                                <input
                                    type="text"
                                    defaultValue={selectedBlockData.type}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                                    readOnly
                                />
                            </div>

                            {/* Content Properties */}
                            {selectedBlockData.content && Object.keys(selectedBlockData.content).length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Conteúdo</h4>
                                    <div className="space-y-3">
                                        {Object.entries(selectedBlockData.content).map(([key, value]) => (
                                            <div key={key}>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    {key}
                                                </label>
                                                {typeof value === 'string' ? (
                                                    key === 'text' ? (
                                                        <textarea
                                                            defaultValue={value}
                                                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                                                            rows={3}
                                                            readOnly={readOnly}
                                                            onChange={(e) => {
                                                                if (!readOnly) {
                                                                    updateBlockProperty(selectedBlockData.id, `content.${key}`, e.target.value);
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            defaultValue={value}
                                                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                                                            readOnly={readOnly}
                                                            onChange={(e) => {
                                                                if (!readOnly) {
                                                                    updateBlockProperty(selectedBlockData.id, `content.${key}`, e.target.value);
                                                                }
                                                            }}
                                                        />
                                                    )
                                                ) : (
                                                    <div className="text-xs bg-gray-100 p-2 rounded">
                                                        {JSON.stringify(value, null, 2)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Properties */}
                            {selectedBlockData.properties && Object.keys(selectedBlockData.properties).length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Propriedades</h4>
                                    <pre className="text-xs bg-gray-100 p-3 rounded-md overflow-auto max-h-40">
                                        {JSON.stringify(selectedBlockData.properties, null, 2)}
                                    </pre>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    className="w-full bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition-colors text-sm"
                                    onClick={() => {
                                        setSelectedBlockId(null);
                                        setSelectedBlockData(null);
                                    }}
                                >
                                    Desselecionar Bloco
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">👆</div>
                                <p className="text-sm">Clique em um componente para editá-lo</p>
                            </div>

                            {/* Propriedades gerais do step */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome do Step
                                </label>
                                <input
                                    type="text"
                                    defaultValue={currentStepData?.name || `Step ${stepNumber}`}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    readOnly={readOnly}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descrição
                                </label>
                                <textarea
                                    defaultValue={currentStepData?.description || `Conteúdo do step ${stepNumber}`}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    readOnly={readOnly}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo do Step
                                </label>
                                <select
                                    defaultValue="quiz-question"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    disabled={readOnly}
                                >
                                    <option value="intro">Introdução</option>
                                    <option value="quiz-question">Pergunta Quiz</option>
                                    <option value="strategic-question">Pergunta Estratégica</option>
                                    <option value="result">Resultado</option>
                                </select>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Estatísticas</h4>
                                <div className="bg-gray-50 rounded-md p-3 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Componentes:</span>
                                        <span className="text-sm font-medium">{currentStepData?.blocks?.length || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Progresso:</span>
                                        <span className="text-sm font-medium">{Math.round((stepNumber / 21) * 100)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Step:</span>
                                        <span className="text-sm font-medium">{stepNumber}/21</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Footer */}
            {showNavigation && (
                <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={stepNumber <= 1}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                        <span>←</span>
                        <span>Step {stepNumber - 1}</span>
                    </button>

                    <div className="text-center">
                        <span className="text-sm text-gray-500">Step {stepNumber} de 21</span>
                        <div className="w-32 bg-gray-200 rounded-full h-1 mt-1">
                            <div
                                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${(stepNumber / 21) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={stepNumber >= 21}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                        <span>Step {stepNumber + 1}</span>
                        <span>→</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UniversalStepEditor;