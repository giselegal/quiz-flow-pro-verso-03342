import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { QUIZ_STEPS, type QuizStep } from '@/data/quizSteps';
import { Plus, Save, Trash2, ArrowUp, ArrowDown, Copy, Eye, ChevronDown, Settings } from 'lucide-react';
import './QuizEditorStyles.css';

// Importar sistema híbrido consolidado que consome dados reais do funil
import { HybridStepRenderer } from '@/components/quiz/HybridStepRenderer';

// Importar componentes editáveis híbridos
import EditableIntroStep from '@/components/quiz/editable/EditableIntroStep';
import EditableQuestionStep from '@/components/quiz/editable/EditableQuestionStep';

// Importar novos componentes baseados no modelo do funil
import EditableHeader from '@/components/quiz/editable/EditableHeader';
import EditableSpacer from '@/components/quiz/editable/EditableSpacer';
import EditableAdvancedOptions from '@/components/quiz/editable/EditableAdvancedOptions';
import EditableButton from '@/components/quiz/editable/EditableButton';
import EditableScript from '@/components/quiz/editable/EditableScript';
import EditableHeading from '@/components/quiz/editable/EditableHeading';
import EditableOptionsGrid, { QuizOption } from '@/components/quiz/editable/EditableOptionsGrid';
import EditableOptions, { EditableOptionsProps } from '@/components/quiz/editable/EditableOptions';
import EditableRichText from '@/components/quiz/editable/EditableRichText';

interface QuizFunnelEditorProps {
    funnelId?: string;
    templateId?: string;
}

type ExtendedStepType = QuizStep['type'] | 'header' | 'spacer' | 'advanced-options' | 'button' | 'script' | 'heading' | 'options-grid' | 'options' | 'rich-text';

type EditableQuizStep = (QuizStep | {
    type: 'header';
    logo?: string;
    progress?: number;
    showLogo?: boolean;
    showProgress?: boolean;
    allowReturn?: boolean;
} | {
    type: 'spacer';
    height?: number;
} | {
    type: 'advanced-options';
    options?: Array<{ id: string; text: string; htmlContent?: string; prefix?: string }>;
    multiSelect?: boolean;
} | {
    type: 'button';
    text?: string;
    variant?: string;
    size?: string;
    fullWidth?: boolean;
} | {
    type: 'script';
    code?: string;
    visible?: boolean;
} | {
    type: 'heading';
    content?: string;
    alignment?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    componentId?: string;
    maxWidth?: number;
    generalAlignment?: 'start' | 'center' | 'end';
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
} | {
    type: 'options-grid';
    options?: QuizOption[];
    selectedOptions?: string[];
    multiSelect?: boolean;
    maxSelections?: number;
    columns?: 1 | 2 | 3 | 4;
    gap?: number;
    showImages?: boolean;
    showPrefixes?: boolean;
    buttonStyle?: 'default' | 'outline' | 'ghost';
    imageSize?: 'small' | 'medium' | 'large';
    orientation?: 'vertical' | 'horizontal';
} | {
    type: 'options';
    // Layout
    columns?: 1 | 2 | 3 | 4;
    direction?: 'vertical' | 'horizontal';
    disposition?: 'image-text' | 'text-image' | 'text-only' | 'image-only';
    // Opções
    options?: QuizOption[];
    selectedOptions?: string[];
    // Validações
    multipleChoice?: boolean;
    required?: boolean;
    autoProceed?: boolean;
    // Estilização
    borders?: 'small' | 'medium' | 'large' | 'none';
    shadows?: 'none' | 'small' | 'medium' | 'large';
    spacing?: 'small' | 'medium' | 'large';
    detail?: 'none' | 'subtle' | 'prominent';
    style?: 'simple' | 'rounded' | 'modern';
    // Personalização
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    // Avançado
    componentId?: string;
    // Geral
    maxWidth?: number;
    generalAlignment?: 'start' | 'center' | 'end';
} | {
    type: 'rich-text';
    // Conteúdo
    content?: string;
    placeholder?: string;
    // Layout
    maxWidth?: number;
    generalAlignment?: 'start' | 'center' | 'end';
    // Configurações do Editor
    showToolbar?: boolean;
    minHeight?: number;
    // Personalização
    backgroundColor?: string;
    borderColor?: string;
    // Avançado
    componentId?: string;
}) & { id: string };

// Tipos que são ETAPAS COMPLETAS do funil
const STEP_TYPES: Array<string> = [
    'intro', 'question', 'strategic-question', 'transition', 'transition-result', 'result', 'offer'
];

// Tipos que são COMPONENTES INDIVIDUAIS 
const COMPONENT_TYPES: Array<string> = [
    'header', 'spacer', 'advanced-options', 'button', 'script', 'heading', 'options-grid', 'options', 'rich-text'
];

function createBlankStep(type: ExtendedStepType): EditableQuizStep {
    const baseId = `step-${Date.now()}`;
    switch (type) {
        case 'intro':
            return {
                id: baseId,
                type: 'intro',
                title: 'Título de Introdução',
                formQuestion: 'Como posso te chamar?',
                placeholder: 'Seu nome...',
                buttonText: 'Começar',
                nextStep: ''
            };
        case 'question':
            return {
                id: baseId,
                type: 'question',
                questionNumber: 'X de Y',
                questionText: 'Pergunta...',
                requiredSelections: 3,
                options: [
                    { id: 'opt-1', text: 'Opção 1' },
                    { id: 'opt-2', text: 'Opção 2' }
                ],
                nextStep: ''
            };
        case 'strategic-question':
            return {
                id: baseId,
                type: 'strategic-question',
                questionText: 'Pergunta estratégica...',
                options: [
                    { id: 'estr-1', text: 'Resposta A' },
                    { id: 'estr-2', text: 'Resposta B' }
                ],
                nextStep: ''
            };
        case 'transition':
            return { id: baseId, type: 'transition', title: 'Transição...', text: 'Processando...', nextStep: '' };
        case 'transition-result':
            return { id: baseId, type: 'transition-result', title: 'Preparando resultado...', nextStep: '' };
        case 'result':
            return { id: baseId, type: 'result', title: '{userName}, seu estilo é:', nextStep: '' };
        case 'offer':
            return { id: baseId, type: 'offer', offerMap: {}, image: '' };
        case 'header':
            return {
                id: baseId,
                type: 'header',
                logo: 'https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png',
                progress: 28.57,
                showLogo: true,
                showProgress: true,
                allowReturn: true
            };
        case 'spacer':
            return { id: baseId, type: 'spacer', height: 32 };
        case 'advanced-options':
            return {
                id: baseId,
                type: 'advanced-options',
                options: [
                    { id: 'opt-1', text: 'Opção A', prefix: 'A)' },
                    { id: 'opt-2', text: 'Opção B', prefix: 'B)' }
                ],
                multiSelect: false
            };
        case 'button':
            return { id: baseId, type: 'button', text: 'Clique aqui', variant: 'default', size: 'default', fullWidth: true };
        case 'script':
            return { id: baseId, type: 'script', code: '// Digite seu código JavaScript aqui', visible: false };
        case 'heading':
            return {
                id: baseId,
                type: 'heading',
                content: '4- O que mais chama sua atenção nos detalhes das roupas?',
                alignment: 'center',
                backgroundColor: '#ffffff',
                textColor: '#000000',
                borderColor: '#000000',
                componentId: '',
                maxWidth: 100,
                generalAlignment: 'start',
                headingLevel: 1
            };
        case 'options-grid':
            return {
                id: baseId,
                type: 'options-grid',
                options: [
                    {
                        id: 'opt-1',
                        text: '<strong>Poucos detalhes</strong>, básico e prático.',
                        prefix: 'A)',
                        image: 'https://cakto-quiz-br01.b-cdn.net/uploads/36e5a642-0988-479b-908d-e8507e0068e0.png',
                        htmlContent: '<p>A) <strong>Poucos detalhes</strong>, básico e prático.</p>'
                    },
                    {
                        id: 'opt-2',
                        text: '<strong>Bem discretos e sutis,</strong> clean e clássico.',
                        prefix: 'B)',
                        image: 'https://cakto-quiz-br01.b-cdn.net/uploads/24ae72b9-e8a6-4292-af76-c3f8de4f12fc.png',
                        htmlContent: '<p>B) <strong>Bem discretos e sutis,</strong> clean e clássico.</p>'
                    },
                    {
                        id: 'opt-3',
                        text: '<strong>Básico</strong>, mas <strong>com um toque de estilo.</strong>',
                        prefix: 'C)',
                        image: 'https://cakto-quiz-br01.b-cdn.net/uploads/bc764766-f9c4-4c66-945a-60e7de7c196f.png',
                        htmlContent: '<p>C) <strong>Básico</strong>, mas <strong>com um toque de estilo.</strong></p>'
                    },
                    {
                        id: 'opt-4',
                        text: '<strong>Detalhes refinados</strong>, elegantes e que deem status.',
                        prefix: 'D)',
                        image: 'https://cakto-quiz-br01.b-cdn.net/uploads/7d4ab0ef-7b82-48f0-aa6a-a964c99bed7b.png',
                        htmlContent: '<p>D) <strong>Detalhes refinados</strong>, elegantes e que deem status.</p>'
                    }
                ],
                selectedOptions: [],
                multiSelect: true,
                maxSelections: 3,
                columns: 2,
                gap: 2,
                showImages: true,
                showPrefixes: true,
                buttonStyle: 'default',
                imageSize: 'medium',
                orientation: 'vertical'
            };
        case 'options':
            return {
                id: baseId,
                type: 'options',
                // Layout
                columns: 2,
                direction: 'vertical',
                disposition: 'image-text',
                // Opções
                options: [
                    {
                        id: 'opt-1',
                        text: '<strong>Poucos detalhes</strong>, básico e prático.',
                        image: 'https://cakto-quiz-br01.b-cdn.net/uploads/36e5a642-0988-479b-908d-e8507e0068e0.png',
                        htmlContent: '<p>A) <strong>Poucos detalhes</strong>, básico e prático.</p>'
                    },
                    {
                        id: 'opt-2',
                        text: '<strong>Bem discretos e sutis,</strong> clean e clássico.',
                        image: 'https://cakto-quiz-br01.b-cdn.net/uploads/24ae72b9-e8a6-4292-af76-c3f8de4f12fc.png',
                        htmlContent: '<p>B) <strong>Bem discretos e sutis,</strong> clean e clássico.</p>'
                    },
                    {
                        id: 'opt-3',
                        text: '<strong>Básico</strong>, mas <strong>com um toque de estilo.</strong>',
                        image: 'https://cakto-quiz-br01.b-cdn.net/uploads/bc764766-f9c4-4c66-945a-60e7de7c196f.png',
                        htmlContent: '<p>C) <strong>Básico</strong>, mas <strong>com um toque de estilo.</strong></p>'
                    },
                    {
                        id: 'opt-4',
                        text: '<strong>Detalhes refinados</strong>, elegantes e que deem status.',
                        image: 'https://cakto-quiz-br01.b-cdn.net/uploads/7d4ab0ef-7b82-48f0-aa6a-a964c99bed7b.png',
                        htmlContent: '<p>D) <strong>Detalhes refinados</strong>, elegantes e que deem status.</p>'
                    },
                    {
                        id: 'opt-5',
                        text: '<strong>Detalhes delicados</strong>, como laços ou babados.',
                        image: 'https://cakto-quiz-br01.b-cdn.net/uploads/c1f924db-b6ca-47c4-8781-c5cf3c7433f8.png',
                        htmlContent: '<p>E) <strong>Detalhes delicados</strong>, como laços ou babados.</p>'
                    },
                    {
                        id: 'opt-6',
                        text: '<strong>Detalhes que valorizem o corpo</strong>, como couro, zíper e fendas.',
                        image: 'https://cakto-quiz-br01.b-cdn.net/uploads/f2537fb2-3014-407b-b866-0d86aa3b628d.png',
                        htmlContent: '<p>F) <strong>Detalhes que valorizem o corpo</strong>, como couro, zíper e fendas.</p>'
                    },
                    {
                        id: 'opt-7',
                        text: '<strong>Detalhes marcantes, </strong>com firmeza e peso.',
                        image: 'https://cakto-quiz-br01.b-cdn.net/uploads/c2729a10-f8d1-4124-8fb8-63ea834a1272.png',
                        htmlContent: '<p>G) <strong>Detalhes marcantes, </strong>com firmeza e peso.</p>'
                    },
                    {
                        id: 'opt-8',
                        text: '<strong>Detalhes diferentes</strong> do convencional, produções ousadas.',
                        image: 'https://cakto-quiz-br01.b-cdn.net/uploads/37bdd83d-a0f5-4f23-8c26-3d4d7563043d.png',
                        htmlContent: '<p>H) <strong>Detalhes diferentes</strong> do convencional, produções ousadas.</p>'
                    }
                ],
                selectedOptions: [],
                // Validações
                multipleChoice: true,
                required: true,
                autoProceed: false,
                // Estilização
                borders: 'small',
                shadows: 'none',
                spacing: 'small',
                detail: 'none',
                style: 'simple',
                // Personalização
                backgroundColor: '#ffffff',
                textColor: '#000000',
                borderColor: '#e5e7eb',
                // Avançado
                componentId: '',
                // Geral
                maxWidth: 100,
                generalAlignment: 'start'
            };
        case 'rich-text':
            return {
                id: baseId,
                type: 'rich-text',
                // Conteúdo
                content: '<h2>Título</h2><p><br></p><p>Preencha o texto.</p>',
                placeholder: 'Digite seu texto aqui...',
                // Layout
                maxWidth: 100,
                generalAlignment: 'start',
                // Configurações do Editor
                showToolbar: true,
                minHeight: 150,
                // Personalização
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                // Avançado
                componentId: ''
            };
        default:
            return { id: baseId, type: 'question', questionText: 'Pergunta...', options: [], nextStep: '' };
    }
}

const QuizFunnelEditorWYSIWYG: React.FC<QuizFunnelEditorProps> = ({ funnelId, templateId }) => {
    const crud = useUnifiedCRUD();
    const [steps, setSteps] = useState<EditableQuizStep[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [selectedBlockId, setSelectedBlockId] = useState<string>(''); // Para seleção de blocos no canvas
    const [isSaving, setIsSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
    const [activeInsertDropdown, setActiveInsertDropdown] = useState<string | null>(null);

    // Carregar steps iniciais com estrutura modularizada
    useEffect(() => {
        const existing = (crud.currentFunnel as any)?.quizSteps as EditableQuizStep[] | undefined;
        if (existing && existing.length) {
            setSteps(existing.map(s => ({ ...s })));
            setSelectedId(existing[0].id);
            return;
        }

        // Converter automaticamente para estrutura modularizada
        const modularizedSteps: EditableQuizStep[] = [];
        const quizStepsArray = Object.entries(QUIZ_STEPS);

        quizStepsArray.forEach(([id, step], index) => {
            const stepNumber = index + 1;
            const totalSteps = quizStepsArray.length;
            const progressPercentage = Math.round((stepNumber / totalSteps) * 100);

            // 1. Adicionar Header para cada etapa
            modularizedSteps.push({
                id: `${id}-header`,
                type: 'header',
                logo: 'https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png',
                progress: progressPercentage,
                showLogo: true,
                showProgress: true,
                allowReturn: stepNumber > 1
            });

            // 2. Adicionar Heading para questões
            if (step.type === 'question' || step.type === 'strategic-question') {
                const headingContent = step.questionNumber
                    ? `${step.questionNumber} - ${step.questionText}`
                    : step.questionText || 'Pergunta';

                modularizedSteps.push({
                    id: `${id}-heading`,
                    type: 'heading',
                    content: headingContent,
                    alignment: 'center',
                    headingLevel: 1,
                    textColor: '#000000',
                    backgroundColor: '#ffffff',
                    maxWidth: 100,
                    generalAlignment: 'center'
                });

                // Adicionar espaçador após heading
                modularizedSteps.push({
                    id: `${id}-spacer`,
                    type: 'spacer',
                    height: 24
                });
            }

            // 3. Adicionar a etapa original
            modularizedSteps.push({
                id,
                ...step as QuizStep
            });

            // 4. Adicionar espaçador final para separar etapas
            modularizedSteps.push({
                id: `${id}-spacer-end`,
                type: 'spacer',
                height: 32
            });
        });

        setSteps(modularizedSteps);
        if (modularizedSteps.length) setSelectedId(modularizedSteps[0].id);
    }, [crud.currentFunnel]);

    const selectedStep = steps.find(s => s.id === selectedId);

    const updateStep = useCallback((id: string, patch: Partial<EditableQuizStep>) => {
        setSteps(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
    }, []);

    const addStepAfter = (afterId?: string, type: ExtendedStepType = 'question') => {
        setSteps(prev => {
            const idx = afterId ? prev.findIndex(s => s.id === afterId) : prev.length - 1;
            const newStep = createBlankStep(type);
            const clone = [...prev];
            clone.splice(idx + 1, 0, newStep);
            // Selecionar automaticamente o novo step
            setSelectedId(newStep.id);
            return clone;
        });
    };

    const addStepBefore = (beforeId: string, type: ExtendedStepType = 'question') => {
        setSteps(prev => {
            const idx = prev.findIndex(s => s.id === beforeId);
            if (idx === -1) return prev;
            const newStep = createBlankStep(type);
            const clone = [...prev];
            clone.splice(idx, 0, newStep);
            // Selecionar automaticamente o novo step
            setSelectedId(newStep.id);
            return clone;
        });
    };

    const addStepAtEnd = (type: ExtendedStepType = 'question') => {
        const newStep = createBlankStep(type);
        setSteps(prev => [...prev, newStep]);
        setSelectedId(newStep.id);
    };

    const removeStep = (id: string) => {
        setSteps(prev => {
            const filtered = prev.filter(s => s.id !== id);
            if (selectedId === id && filtered.length > 0) {
                setSelectedId(filtered[0].id);
            }
            return filtered;
        });
    };

    const moveStep = (id: string, direction: number) => {
        setSteps(prev => {
            const idx = prev.findIndex(s => s.id === id);
            if (idx === -1) return prev;
            const newIdx = idx + direction;
            if (newIdx < 0 || newIdx >= prev.length) return prev;
            const clone = [...prev];
            [clone[idx], clone[newIdx]] = [clone[newIdx], clone[idx]];
            return clone;
        });
    };

    const duplicateStep = (id: string) => {
        setSteps(prev => {
            const idx = prev.findIndex(s => s.id === id);
            if (idx === -1) return prev;
            const original = prev[idx];
            const duplicate = { ...original, id: `${original.id}-copy-${Date.now()}` };
            const clone = [...prev];
            clone.splice(idx + 1, 0, duplicate);
            return clone;
        });
    };

    const handleSave = useCallback(async () => {
        if (!crud.currentFunnel) return;
        setIsSaving(true);
        try {
            const updated = { ...crud.currentFunnel, quizSteps: steps };
            crud.setCurrentFunnel(updated);
            await crud.saveFunnel(updated);
        } catch (e) {
            console.error('Erro ao salvar quizSteps', e);
        } finally {
            setIsSaving(false);
        }
    }, [steps, crud]);



    // Mock de resultados para o componente ResultStep
    const mockResults = {
        userProfile: 'Empreendedor Visionário',
        categories: ['Liderança', 'Inovação', 'Estratégia']
    };

    // Wrapper simples para componentes no modo preview
    const SelectableWrapper: React.FC<{
        children: React.ReactNode;
        blockId: string;
        label: string;
    }> = ({ children, blockId, label }) => {
        return (
            <div
                className={`relative transition-all duration-200 group ${selectedBlockId === blockId
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : 'hover:ring-1 hover:ring-gray-300'
                    }`}
                onMouseDown={(e) => {
                    // Usar onMouseDown em vez de onClick para melhor responsividade
                    // e evitar conflitos com outros event handlers
                    if (e.button === 0) { // Left click only
                        setSelectedBlockId(blockId);
                        const stepId = blockId.split('-')[0];
                        setSelectedId(stepId);
                    }
                }}
            >
                <div className="absolute -top-6 left-0 bg-gray-600 text-white px-2 py-1 text-xs rounded z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {label}
                </div>
                <div className="relative z-0">
                    {children}
                </div>
            </div>
        );
    };

    // Wrapper para componentes editáveis
    const EditableWrapper: React.FC<{
        children: React.ReactNode;
        blockId: string;
        label: string;
        isEditable?: boolean;
    }> = ({ children, blockId, label, isEditable = false }) => {
        return (
            <div
                className={`relative transition-all duration-200 group ${selectedBlockId === blockId
                    ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/50'
                    : 'hover:ring-1 hover:ring-blue-300'
                    } ${isEditable ? 'cursor-pointer' : ''}`}
                onMouseDown={(e) => {
                    // Usar onMouseDown para melhor responsividade
                    if (e.button === 0) { // Left click only
                        setSelectedBlockId(blockId);
                        const stepId = blockId.split('-')[0];
                        setSelectedId(stepId);
                    }
                }}
            >
                {/* Label do componente */}
                <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {label} {isEditable && '(Editável)'}
                </div>

                {/* Toolbar de edição para modo editável */}
                {isEditable && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <div className="flex gap-1 bg-white shadow-lg rounded p-1 border">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="Configurações">
                                <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                title="Remover"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const stepId = blockId.split('-')[0];
                                    removeStep(stepId);
                                }}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="relative z-0">
                    {children}
                </div>
            </div>
        );
    };

    // Props estáveis para evitar re-renderizações
    const stableRealProps = useMemo(() => ({
        onNameSubmit: (name: string) => {
            console.log('Nome real submetido:', name);
            // Aqui integraria com o sistema real de coleta de nomes
        },
        onComplete: () => {
            console.log('Transição real completa');
            // Aqui integraria com o sistema real de navegação
        },
        currentAnswers: [] as string[], // Seria obtido do estado real do quiz
        onAnswersChange: (answers: string[]) => {
            console.log('Respostas reais alteradas:', answers);
            // Aqui integraria com o sistema real de pontuação
        },
        currentAnswer: '', // Seria obtido do estado real do quiz
        onAnswerChange: (answer: string) => {
            console.log('Resposta real alterada:', answer);
            // Aqui integraria com o sistema real de pontuação
        },
    }), []);

    const stableUserProfile = useMemo(() => ({
        userName: 'Usuário', // Seria obtido do estado real
        resultStyle: 'Estilo Calculado', // Baseado nas respostas reais
        secondaryStyles: ['Característica 1', 'Característica 2'] // Calculado dinamicamente
    }), []);

    // Função para renderizar componente híbrido que consome dados reais do funil (Memoizada)
    const renderRealComponent = useCallback((step: EditableQuizStep) => {
        const isEditMode = previewMode === 'edit';
        const WrapperComponent = isEditMode ? EditableWrapper : SelectableWrapper;

        // Renderizar usando o sistema híbrido que consome dados reais
        return (
            <WrapperComponent
                blockId={`${step.id}-${step.type}`}
                label={getStepLabel(step.type)}
                isEditable={isEditMode}
            >
                <HybridStepRenderer
                    step={step} // DADOS REAIS DO FUNIL
                    isEditable={isEditMode}
                    mode={isEditMode ? 'edit' : 'preview'}
                    onEdit={(field, value) => updateStep(step.id, { [field]: value })}
                    onChange={(content) => updateStep(step.id, { content })}
                    // Props específicas para componentes de produção
                    onNameSubmit={stableRealProps.onNameSubmit}
                    currentAnswers={stableRealProps.currentAnswers}
                    onAnswersChange={stableRealProps.onAnswersChange}
                    currentAnswer={stableRealProps.currentAnswer}
                    onAnswerChange={stableRealProps.onAnswerChange}
                    onComplete={stableRealProps.onComplete}
                    userProfile={stableUserProfile}
                    offerKey="default" // Seria calculado dinamicamente
                />
            </WrapperComponent>
        );
    }, [previewMode, updateStep, stableRealProps, stableUserProfile]);

    // Função auxiliar para obter labels dos componentes
    const getStepLabel = (type: string): string => {
        const labels: Record<string, string> = {
            'intro': 'Introdução',
            'question': 'Pergunta',
            'strategic-question': 'Pergunta Estratégica',
            'transition': 'Transição',
            'transition-result': 'Transição p/ Resultado',
            'result': 'Resultado',
            'offer': 'Oferta',
            'header': 'Header',
            'spacer': 'Espaçador',
            'advanced-options': 'Opções Avançadas',
            'button': 'Botão',
            'script': 'Script',
            'heading': 'Título',
            'options-grid': 'Grade de Opções',
            'options': 'Opções do Quiz',
            'rich-text': 'Editor de Texto Rico'
        };
        return labels[type] || 'Componente';
    };

    return (
        <div
            className="quiz-editor-container h-full w-full flex flex-col bg-background"
            style={{
                color: '#1a1716',
                backgroundColor: 'white',
                '--tw-text-opacity': '1'
            } as React.CSSProperties}
        >
            <div className="h-10 border-b flex items-center gap-2 px-3 text-xs bg-muted/30">
                <span className="font-semibold">Quiz Editor WYSIWYG</span>
                <Button size="sm" variant="outline" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
                <div className="ml-auto flex gap-2">
                    <Button
                        size="sm"
                        variant={previewMode === 'edit' ? 'default' : 'outline'}
                        onClick={() => setPreviewMode('edit')}
                    >
                        Editar
                    </Button>
                    <Button
                        size="sm"
                        variant={previewMode === 'preview' ? 'default' : 'outline'}
                        onClick={() => setPreviewMode('preview')}
                    >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                    </Button>
                </div>
            </div>

            <div
                className="flex-1 flex overflow-hidden"
                onClick={() => setActiveInsertDropdown(null)} // Fechar dropdowns ao clicar fora
            >
                {/* COL 1 - SEQUÊNCIA DE ETAPAS */}
                <div className="w-60 border-r flex flex-col">
                    <div className="p-3 flex items-center justify-between border-b">
                        <span className="text-xs font-semibold">Sequência do Funil</span>
                        <Badge variant="secondary" className="text-[10px]">{steps.length}</Badge>
                    </div>
                    <div className="flex-1 overflow-auto text-xs">
                        {steps.map((s, idx) => {
                            const active = s.id === selectedId;
                            return (
                                <div key={s.id}>
                                    {/* Zona de Inserção no Topo (apenas no primeiro elemento) */}
                                    {idx === 0 && (
                                        <div className="group/insert relative">
                                            <div className="h-1 hover:h-8 transition-all bg-transparent hover:bg-blue-50 border-2 border-dashed border-transparent hover:border-blue-300 flex items-center justify-center">
                                                <div className="opacity-0 group-hover/insert:opacity-100 transition-opacity">
                                                    <div className="relative">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-6 text-[10px] bg-white shadow-sm"
                                                            onClick={() => setActiveInsertDropdown(activeInsertDropdown === `before-${s.id}` ? null : `before-${s.id}`)}
                                                        >
                                                            <Plus className="w-3 h-3 mr-1" /> Inserir no Início
                                                            <ChevronDown className="w-3 h-3 ml-1" />
                                                        </Button>

                                                        {/* Dropdown Menu */}
                                                        {activeInsertDropdown === `before-${s.id}` && (
                                                            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-50 min-w-48 max-h-80 overflow-y-auto">
                                                                {/* Etapas */}
                                                                <div className="px-2 py-1 bg-gray-100 text-[9px] font-semibold text-gray-600">🏗️ ETAPAS</div>
                                                                {STEP_TYPES.map(type => (
                                                                    <button
                                                                        key={type}
                                                                        className="w-full px-3 py-2 text-left text-[11px] hover:bg-gray-50 flex items-center gap-2 border-b"
                                                                        onClick={() => {
                                                                            addStepBefore(s.id, type as ExtendedStepType);
                                                                            setActiveInsertDropdown(null);
                                                                        }}
                                                                    >
                                                                        <span>
                                                                            {type === 'intro' && '🏠'}
                                                                            {type === 'question' && '❓'}
                                                                            {type === 'strategic-question' && '🎯'}
                                                                            {type === 'transition' && '⏳'}
                                                                            {type === 'transition-result' && '🔄'}
                                                                            {type === 'result' && '🏆'}
                                                                            {type === 'offer' && '🎁'}
                                                                        </span>
                                                                        {type.replace('-', ' ')}
                                                                    </button>
                                                                ))}
                                                                {/* Componentes */}
                                                                <div className="px-2 py-1 bg-blue-100 text-[9px] font-semibold text-blue-600">🧩 COMPONENTES</div>
                                                                {COMPONENT_TYPES.map(type => (
                                                                    <button
                                                                        key={type}
                                                                        className="w-full px-3 py-2 text-left text-[11px] hover:bg-blue-50 flex items-center gap-2 border-b last:border-b-0"
                                                                        onClick={() => {
                                                                            addStepBefore(s.id, type as ExtendedStepType);
                                                                            setActiveInsertDropdown(null);
                                                                        }}
                                                                    >
                                                                        <span>
                                                                            {type === 'header' && '📋'}
                                                                            {type === 'spacer' && '📏'}
                                                                            {type === 'advanced-options' && '🎛️'}
                                                                            {type === 'button' && '🔘'}
                                                                            {type === 'script' && '📜'}
                                                                            {type === 'heading' && '📝'}
                                                                            {type === 'options-grid' && '🔢'}
                                                                            {type === 'options' && '☑️'}
                                                                            {type === 'rich-text' && '📝'}
                                                                        </span>
                                                                        {type.replace('-', ' ')}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Elemento Step */}
                                    <div
                                        className={`relative border-b cursor-pointer group transition-all ${active ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                                            }`}
                                        onClick={() => setSelectedId(s.id)}
                                    >
                                        {/* Indicador de Posição */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500" />

                                        <div className="pl-4 pr-3 py-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                                                    {idx + 1}
                                                </div>
                                                <span className="font-medium truncate flex-1">
                                                    {s.type === 'intro' && '🏠 Introdução'}
                                                    {s.type === 'question' && '❓ Pergunta'}
                                                    {s.type === 'strategic-question' && '🎯 Estratégica'}
                                                    {s.type === 'transition' && '⏳ Transição'}
                                                    {s.type === 'transition-result' && '🔄 Trans. Result'}
                                                    {s.type === 'result' && '🏆 Resultado'}
                                                    {s.type === 'offer' && '🎁 Oferta'}
                                                </span>
                                            </div>

                                            {/* Preview do conteúdo */}
                                            <div className="text-[10px] text-gray-500 mb-2 truncate">
                                                {s.type === 'intro' && (s.title || 'Introdução do Quiz')}
                                                {s.type === 'question' && (s.questionText || 'Pergunta do Quiz')}
                                                {s.type === 'strategic-question' && (s.questionText || 'Pergunta Estratégica')}
                                                {s.type === 'transition' && (s.title || 'Tela de Transição')}
                                                {s.type === 'transition-result' && (s.title || 'Preparando Resultado')}
                                                {s.type === 'result' && (s.title || 'Resultado do Quiz')}
                                                {s.type === 'offer' && 'Oferta Personalizada'}
                                            </div>

                                            {/* Controles de Ação */}
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-6 w-6 text-blue-500 hover:bg-blue-100"
                                                    disabled={idx === 0}
                                                    onClick={(e) => { e.stopPropagation(); moveStep(s.id, -1); }}
                                                    title="Mover para cima"
                                                >
                                                    <ArrowUp className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-6 w-6 text-blue-500 hover:bg-blue-100"
                                                    disabled={idx === steps.length - 1}
                                                    onClick={(e) => { e.stopPropagation(); moveStep(s.id, 1); }}
                                                    title="Mover para baixo"
                                                >
                                                    <ArrowDown className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-6 w-6 text-green-500 hover:bg-green-100"
                                                    onClick={(e) => { e.stopPropagation(); duplicateStep(s.id); }}
                                                    title="Duplicar"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-6 w-6 text-red-500 hover:bg-red-100"
                                                    onClick={(e) => { e.stopPropagation(); removeStep(s.id); }}
                                                    title="Remover"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Conexão Visual para o Próximo Step */}
                                        {idx < steps.length - 1 && (
                                            <div className="absolute bottom-0 left-7 w-0.5 h-3 bg-gradient-to-b from-purple-400 to-blue-400" />
                                        )}
                                    </div>

                                    {/* Zona de Inserção Entre Elementos */}
                                    <div className="group/insert relative">
                                        <div className="h-1 hover:h-8 transition-all bg-transparent hover:bg-green-50 border-2 border-dashed border-transparent hover:border-green-300 flex items-center justify-center">
                                            <div className="opacity-0 group-hover/insert:opacity-100 transition-opacity">
                                                <div className="relative">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 text-[10px] bg-white shadow-sm border-green-300 text-green-600 hover:bg-green-50"
                                                        onClick={() => setActiveInsertDropdown(activeInsertDropdown === `after-${s.id}` ? null : `after-${s.id}`)}
                                                    >
                                                        <Plus className="w-3 h-3 mr-1" /> Inserir Após
                                                        <ChevronDown className="w-3 h-3 ml-1" />
                                                    </Button>

                                                    {/* Dropdown Menu */}
                                                    {activeInsertDropdown === `after-${s.id}` && (
                                                        <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-50 min-w-48 max-h-80 overflow-y-auto">
                                                            {/* Etapas */}
                                                            <div className="px-2 py-1 bg-gray-100 text-[9px] font-semibold text-gray-600">🏗️ ETAPAS</div>
                                                            {STEP_TYPES.map(type => (
                                                                <button
                                                                    key={type}
                                                                    className="w-full px-3 py-2 text-left text-[11px] hover:bg-gray-50 flex items-center gap-2 border-b"
                                                                    onClick={() => {
                                                                        addStepAfter(s.id, type as ExtendedStepType);
                                                                        setActiveInsertDropdown(null);
                                                                    }}
                                                                >
                                                                    <span>
                                                                        {type === 'intro' && '🏠'}
                                                                        {type === 'question' && '❓'}
                                                                        {type === 'strategic-question' && '🎯'}
                                                                        {type === 'transition' && '⏳'}
                                                                        {type === 'transition-result' && '🔄'}
                                                                        {type === 'result' && '🏆'}
                                                                        {type === 'offer' && '🎁'}
                                                                    </span>
                                                                    {type.replace('-', ' ')}
                                                                </button>
                                                            ))}
                                                            {/* Componentes */}
                                                            <div className="px-2 py-1 bg-blue-100 text-[9px] font-semibold text-blue-600">🧩 COMPONENTES</div>
                                                            {COMPONENT_TYPES.map(type => (
                                                                <button
                                                                    key={type}
                                                                    className="w-full px-3 py-2 text-left text-[11px] hover:bg-blue-50 flex items-center gap-2 border-b last:border-b-0"
                                                                    onClick={() => {
                                                                        addStepAfter(s.id, type as ExtendedStepType);
                                                                        setActiveInsertDropdown(null);
                                                                    }}
                                                                >
                                                                    <span>
                                                                        {type === 'header' && '📋'}
                                                                        {type === 'spacer' && '📏'}
                                                                        {type === 'advanced-options' && '🎛️'}
                                                                        {type === 'button' && '🔘'}
                                                                        {type === 'script' && '📜'}
                                                                        {type === 'heading' && '📝'}
                                                                        {type === 'options-grid' && '🔢'}
                                                                        {type === 'options' && '☑️'}
                                                                        {type === 'rich-text' && '📝'}
                                                                    </span>
                                                                    {type.replace('-', ' ')}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Adicionar no Final */}
                    <div className="p-3 border-t bg-gradient-to-r from-purple-50 to-blue-50">
                        <div className="text-[10px] font-medium text-gray-700 mb-2">ADICIONAR NO FINAL</div>
                        <div className="relative">
                            <Button
                                size="sm"
                                variant="default"
                                className="w-full text-[10px] h-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                                onClick={() => setActiveInsertDropdown(activeInsertDropdown === 'end' ? null : 'end')}
                            >
                                <Plus className="w-3 h-3 mr-1" /> Novo Componente
                                <ChevronDown className="w-3 h-3 ml-1" />
                            </Button>

                            {/* Dropdown Menu para adicionar no final */}
                            {activeInsertDropdown === 'end' && (
                                <div className="absolute bottom-full left-0 mb-1 bg-white border rounded shadow-lg z-50 w-full max-h-80 overflow-y-auto">
                                    {/* Seção de Etapas */}
                                    <div className="px-2 py-1 bg-gray-100 text-[9px] font-semibold text-gray-600">🏗️ ETAPAS DO FUNIL</div>
                                    {STEP_TYPES.map(type => (
                                        <button
                                            key={type}
                                            className="w-full px-3 py-2 text-left text-[11px] hover:bg-gray-50 flex items-center gap-2 border-b"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addStepAtEnd(type as ExtendedStepType);
                                                setActiveInsertDropdown(null);
                                            }}
                                        >
                                            <span>
                                                {type === 'intro' && '🏠'}
                                                {type === 'question' && '❓'}
                                                {type === 'strategic-question' && '🎯'}
                                                {type === 'transition' && '⏳'}
                                                {type === 'transition-result' && '🔄'}
                                                {type === 'result' && '🏆'}
                                                {type === 'offer' && '🎁'}
                                            </span>
                                            <div>
                                                <div className="font-medium">{type.replace('-', ' ')}</div>
                                                <div className="text-[9px] text-gray-500">
                                                    {type === 'intro' && 'Introdução do quiz'}
                                                    {type === 'question' && 'Pergunta múltipla escolha'}
                                                    {type === 'strategic-question' && 'Pergunta estratégica'}
                                                    {type === 'transition' && 'Tela de transição'}
                                                    {type === 'transition-result' && 'Transição para resultado'}
                                                    {type === 'result' && 'Resultado do quiz'}
                                                    {type === 'offer' && 'Oferta personalizada'}
                                                </div>
                                            </div>
                                        </button>
                                    ))}

                                    {/* Seção de Componentes */}
                                    <div className="px-2 py-1 bg-blue-100 text-[9px] font-semibold text-blue-600">🧩 COMPONENTES</div>
                                    {COMPONENT_TYPES.map(type => (
                                        <button
                                            key={type}
                                            className="w-full px-3 py-2 text-left text-[11px] hover:bg-blue-50 flex items-center gap-2 border-b last:border-b-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addStepAtEnd(type as ExtendedStepType);
                                                setActiveInsertDropdown(null);
                                            }}
                                        >
                                            <span>
                                                {type === 'header' && '📋'}
                                                {type === 'spacer' && '📏'}
                                                {type === 'advanced-options' && '🎛️'}
                                                {type === 'button' && '🔘'}
                                                {type === 'script' && '📜'}
                                                {type === 'heading' && '📝'}
                                                {type === 'options-grid' && '🔢'}
                                                {type === 'options' && '☑️'}
                                                {type === 'rich-text' && '📝'}
                                            </span>
                                            <div>
                                                <div className="font-medium">{type.replace('-', ' ')}</div>
                                                <div className="text-[9px] text-gray-500">
                                                    {type === 'header' && 'Cabeçalho com logo e progresso'}
                                                    {type === 'spacer' && 'Espaçamento vertical'}
                                                    {type === 'advanced-options' && 'Opções avançadas customizáveis'}
                                                    {type === 'button' && 'Botão de ação'}
                                                    {type === 'script' && 'Código JavaScript'}
                                                    {type === 'heading' && 'Título editável'}
                                                    {type === 'options-grid' && 'Grade de opções'}
                                                    {type === 'options' && 'Lista de opções'}
                                                    {type === 'rich-text' && 'Editor de texto rico'}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* COL 2 - BIBLIOTECA DE COMPONENTES */}
                <div className="w-72 border-r flex flex-col">
                    <div className="p-3 border-b text-xs font-semibold">Biblioteca de Componentes</div>

                    {/* Seção de Etapas do Funil */}
                    <div className="p-3 border-b">
                        <label className="block text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                            🏗️ Etapas do Funil
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {STEP_TYPES.map(type => (
                                <Button
                                    key={type}
                                    size="sm"
                                    variant="outline"
                                    className="text-[10px] h-8 flex flex-col items-center p-1"
                                    onClick={() => addStepAfter(selectedId, type as ExtendedStepType)}
                                >
                                    <span className="truncate w-full text-center">
                                        {type === 'intro' && '🏠 Intro'}
                                        {type === 'question' && '❓ Pergunta'}
                                        {type === 'strategic-question' && '🎯 Estratégica'}
                                        {type === 'transition' && '⏳ Transição'}
                                        {type === 'transition-result' && '🔄 Trans. Result'}
                                        {type === 'result' && '🏆 Resultado'}
                                        {type === 'offer' && '🎁 Oferta'}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Seção de Componentes Individuais */}
                    <div className="p-3 border-b">
                        <label className="block text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                            🧩 Componentes
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {COMPONENT_TYPES.map(type => (
                                <Button
                                    key={type}
                                    size="sm"
                                    variant="ghost"
                                    className="text-[10px] h-8 flex flex-col items-center p-1 border border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50"
                                    onClick={() => addStepAfter(selectedId, type as ExtendedStepType)}
                                >
                                    <span className="truncate w-full text-center">
                                        {type === 'header' && '📋 Header'}
                                        {type === 'spacer' && '📏 Spacer'}
                                        {type === 'advanced-options' && '🎛️ Opções+'}
                                        {type === 'button' && '🔘 Botão'}
                                        {type === 'script' && '📜 Script'}
                                        {type === 'heading' && '📝 Título'}
                                        {type === 'options-grid' && '🔢 Grade Opções'}
                                        {type === 'options' && '☑️ Opções'}
                                        {type === 'rich-text' && '📝 Texto Rico'}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </div>


                </div>

                {/* COL 3 - PREVIEW WYSIWYG */}
                <div className="flex-1 border-r bg-gray-50 flex flex-col">
                    <div className="p-3 border-b text-xs font-semibold flex items-center gap-2">
                        Preview WYSIWYG
                        {selectedBlockId && (
                            <Badge variant="outline" className="text-[10px]">
                                Bloco selecionado
                            </Badge>
                        )}
                    </div>
                    <div
                        className="flex-1 overflow-auto"
                        onClick={(e) => {
                            // Limpar seleção APENAS se clicou diretamente no fundo, não nos componentes
                            if (e.target === e.currentTarget) {
                                setSelectedBlockId('');
                            }
                        }}
                    >
                        {!selectedStep ? (
                            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                Selecione uma etapa para ver o preview
                            </div>
                        ) : (
                            // Renderizar componente real SEMPRE (edit ou preview)
                            <div className="min-h-full">
                                {renderRealComponent(selectedStep)}
                            </div>
                        )}
                    </div>
                </div>

                {/* COL 4 - PROPRIEDADES */}
                <div className="w-80 flex flex-col">
                    <div className="p-3 border-b text-xs font-semibold">
                        Propriedades
                        {selectedBlockId && (
                            <div className="text-[10px] text-blue-600 mt-1">
                                Editando: {selectedBlockId}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 overflow-auto p-4 text-xs space-y-4">
                        {!selectedStep ? (
                            <div className="text-muted-foreground text-[11px]">Selecione uma etapa.</div>
                        ) : (
                            <>
                                {/* Seção Configurar Componente */}
                                <div className="space-y-2 pb-4 border-b">
                                    <label className="block text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                                        Configurar Componente
                                    </label>
                                    <div className="bg-blue-50 p-2 rounded border">
                                        <div className="font-medium text-blue-700 mb-1">
                                            {selectedStep.type.toUpperCase()}
                                        </div>
                                        <div className="text-[10px] text-blue-600">
                                            Componente selecionado para edição
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium text-[11px]">Tipo do Componente</label>
                                        <select
                                            className="w-full border rounded px-2 py-1 text-[11px]"
                                            value={selectedStep.type}
                                            onChange={e => updateStep(selectedStep.id, { type: e.target.value as any })}
                                        >
                                            {STEP_TYPES.map(t => (
                                                <option key={t} value={t}>
                                                    {t === 'intro' && '🏠 Introdução'}
                                                    {t === 'question' && '❓ Pergunta'}
                                                    {t === 'strategic-question' && '🎯 Estratégica'}
                                                    {t === 'transition' && '⏳ Transição'}
                                                    {t === 'transition-result' && '🔄 Trans. Result'}
                                                    {t === 'result' && '🏆 Resultado'}
                                                    {t === 'offer' && '🎁 Oferta'}
                                                    {t === 'header' && '📋 Header'}
                                                    {t === 'spacer' && '📏 Espaçador'}
                                                    {t === 'advanced-options' && '🎛️ Opções Avançadas'}
                                                    {t === 'button' && '🔘 Botão'}
                                                    {t === 'script' && '💻 Script'}
                                                    {t === 'heading' && '📝 Título'}
                                                    {t === 'rich-text' && '📝 Texto Rico'}
                                                    {t === 'options-grid' && '🎛️ Grade de Opções'}
                                                    {t === 'options' && '📝 Opções do Quiz'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Seção ID */}
                                <div>
                                    <label className="block mb-1 font-medium">ID</label>
                                    <input disabled value={selectedStep.id} className="w-full border rounded px-2 py-1 text-[11px] bg-muted/30" />
                                </div>

                                {selectedStep.type === 'intro' && (
                                    <>
                                        <div>
                                            <label className="block mb-1 font-medium">Título</label>
                                            <textarea
                                                rows={3}
                                                value={selectedStep.title || ''}
                                                onChange={e => updateStep(selectedStep.id, { title: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Pergunta do Form</label>
                                            <input
                                                value={selectedStep.formQuestion || ''}
                                                onChange={e => updateStep(selectedStep.id, { formQuestion: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Placeholder</label>
                                            <input
                                                value={selectedStep.placeholder || ''}
                                                onChange={e => updateStep(selectedStep.id, { placeholder: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Texto do Botão</label>
                                            <input
                                                value={selectedStep.buttonText || ''}
                                                onChange={e => updateStep(selectedStep.id, { buttonText: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">URL da Imagem</label>
                                            <input
                                                value={selectedStep.image || ''}
                                                onChange={e => updateStep(selectedStep.id, { image: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                                placeholder="https://..."
                                            />
                                            {selectedStep.image && (
                                                <img
                                                    src={selectedStep.image}
                                                    alt="Preview"
                                                    className="w-full h-16 object-cover rounded mt-1"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </>
                                )}

                                {selectedStep.type === 'question' && (
                                    <>
                                        <div>
                                            <label className="block mb-1 font-medium">Número da Pergunta</label>
                                            <input
                                                value={selectedStep.questionNumber || ''}
                                                onChange={e => updateStep(selectedStep.id, { questionNumber: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Texto da Pergunta</label>
                                            <textarea
                                                rows={3}
                                                value={selectedStep.questionText || ''}
                                                onChange={e => updateStep(selectedStep.id, { questionText: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Seleções Obrigatórias</label>
                                            <input
                                                type="number"
                                                value={selectedStep.requiredSelections || 1}
                                                onChange={e => updateStep(selectedStep.id, { requiredSelections: parseInt(e.target.value) || 1 })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                    </>
                                )}

                                {selectedStep.type === 'strategic-question' && (
                                    <div>
                                        <label className="block mb-1 font-medium">Pergunta Estratégica</label>
                                        <textarea
                                            rows={3}
                                            value={selectedStep.questionText || ''}
                                            onChange={e => updateStep(selectedStep.id, { questionText: e.target.value })}
                                            className="w-full border rounded px-2 py-1 text-[11px]"
                                        />
                                    </div>
                                )}

                                {(selectedStep.type === 'transition' || selectedStep.type === 'transition-result') && (
                                    <div>
                                        <label className="block mb-1 font-medium">Título</label>
                                        <input
                                            value={selectedStep.title || ''}
                                            onChange={e => updateStep(selectedStep.id, { title: e.target.value })}
                                            className="w-full border rounded px-2 py-1 text-[11px]"
                                        />
                                    </div>
                                )}

                                {selectedStep.type === 'result' && (
                                    <div>
                                        <label className="block mb-1 font-medium">Título do Resultado</label>
                                        <input
                                            value={selectedStep.title || ''}
                                            onChange={e => updateStep(selectedStep.id, { title: e.target.value })}
                                            className="w-full border rounded px-2 py-1 text-[11px]"
                                        />
                                    </div>
                                )}

                                {/* Novos campos para componentes do modelo do funil */}
                                {selectedStep.type === 'header' && (
                                    <>
                                        {/* Switches de Controle */}
                                        <div className="space-y-3 p-3 bg-gray-50 rounded border">
                                            <h4 className="text-xs font-semibold text-gray-700">Controles de Visibilidade</h4>

                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    checked={(selectedStep as any).showLogo !== false}
                                                    onCheckedChange={(checked) => updateStep(selectedStep.id, { showLogo: checked })}
                                                    id="show-logo"
                                                />
                                                <label htmlFor="show-logo" className="text-sm font-medium">
                                                    Mostrar Logo
                                                </label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    checked={(selectedStep as any).showProgress !== false}
                                                    onCheckedChange={(checked) => updateStep(selectedStep.id, { showProgress: checked })}
                                                    id="show-progress"
                                                />
                                                <label htmlFor="show-progress" className="text-sm font-medium">
                                                    Mostrar Progresso
                                                </label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    checked={(selectedStep as any).allowReturn !== false}
                                                    onCheckedChange={(checked) => updateStep(selectedStep.id, { allowReturn: checked })}
                                                    id="allow-return"
                                                />
                                                <label htmlFor="allow-return" className="text-sm font-medium">
                                                    Permitir Voltar
                                                </label>
                                            </div>
                                        </div>

                                        {/* Campos de Configuração */}
                                        <div>
                                            <label className="block mb-1 font-medium">URL do Logo</label>
                                            <input
                                                value={(selectedStep as any).logo || ''}
                                                onChange={e => updateStep(selectedStep.id, { logo: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Progresso (%)</label>
                                            <div className="space-y-2">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={(selectedStep as any).progress || 0}
                                                    onChange={e => updateStep(selectedStep.id, { progress: parseFloat(e.target.value) || 0 })}
                                                    className="w-full"
                                                />
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>0%</span>
                                                    <span className="font-medium">{((selectedStep as any).progress || 0).toFixed(1)}%</span>
                                                    <span>100%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {selectedStep.type === 'spacer' && (
                                    <div>
                                        <label className="block mb-1 font-medium">Altura (px)</label>
                                        <input
                                            type="number"
                                            min="10"
                                            max="200"
                                            value={(selectedStep as any).height || 32}
                                            onChange={e => updateStep(selectedStep.id, { height: parseInt(e.target.value) || 32 })}
                                            className="w-full border rounded px-2 py-1 text-[11px]"
                                        />
                                    </div>
                                )}

                                {selectedStep.type === 'button' && (
                                    <>
                                        <div>
                                            <label className="block mb-1 font-medium">Texto do Botão</label>
                                            <input
                                                value={(selectedStep as any).text || ''}
                                                onChange={e => updateStep(selectedStep.id, { text: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Variante</label>
                                            <select
                                                value={(selectedStep as any).variant || 'default'}
                                                onChange={e => updateStep(selectedStep.id, { variant: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            >
                                                <option value="default">Padrão</option>
                                                <option value="destructive">Destrutivo</option>
                                                <option value="outline">Contorno</option>
                                                <option value="secondary">Secundário</option>
                                                <option value="ghost">Fantasma</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Tamanho</label>
                                            <select
                                                value={(selectedStep as any).size || 'default'}
                                                onChange={e => updateStep(selectedStep.id, { size: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px]"
                                            >
                                                <option value="sm">Pequeno</option>
                                                <option value="default">Médio</option>
                                                <option value="lg">Grande</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {selectedStep.type === 'script' && (
                                    <>
                                        <div>
                                            <label className="block mb-1 font-medium">Código JavaScript</label>
                                            <textarea
                                                rows={8}
                                                value={(selectedStep as any).code || ''}
                                                onChange={e => updateStep(selectedStep.id, { code: e.target.value })}
                                                className="w-full border rounded px-2 py-1 text-[11px] font-mono"
                                                placeholder="// Digite seu código aqui..."
                                            />
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={(selectedStep as any).visible || false}
                                                    onChange={e => updateStep(selectedStep.id, { visible: e.target.checked })}
                                                />
                                                <span className="text-[11px]">Visível no preview</span>
                                            </label>
                                        </div>
                                    </>
                                )}

                                {selectedStep.type === 'heading' && (
                                    <>
                                        {/* Seção Estilo */}
                                        <div className="space-y-3 p-3 bg-gray-50 rounded border">
                                            <h4 className="text-xs font-semibold text-gray-700">Estilo</h4>

                                            <div>
                                                <label className="block mb-1 font-medium">Conteúdo</label>
                                                <input
                                                    value={(selectedStep as any).content || ''}
                                                    onChange={e => updateStep(selectedStep.id, { content: e.target.value })}
                                                    className="w-full border rounded px-2 py-1 text-[11px]"
                                                    placeholder="Digite seu título aqui..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-1 font-medium">Alinhamento</label>
                                                <select
                                                    value={(selectedStep as any).alignment || 'center'}
                                                    onChange={e => updateStep(selectedStep.id, { alignment: e.target.value as 'left' | 'center' | 'right' })}
                                                    className="w-full border rounded px-2 py-1 text-[11px]"
                                                >
                                                    <option value="left">Esquerda</option>
                                                    <option value="center">Centralizado</option>
                                                    <option value="right">Direita</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block mb-1 font-medium">Nível do Título</label>
                                                <select
                                                    value={(selectedStep as any).headingLevel || 1}
                                                    onChange={e => updateStep(selectedStep.id, { headingLevel: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 })}
                                                    className="w-full border rounded px-2 py-1 text-[11px]"
                                                >
                                                    <option value={1}>H1 - Título Principal</option>
                                                    <option value={2}>H2 - Subtítulo</option>
                                                    <option value={3}>H3 - Título de Seção</option>
                                                    <option value={4}>H4 - Título Pequeno</option>
                                                    <option value={5}>H5 - Título Menor</option>
                                                    <option value={6}>H6 - Título Mínimo</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Seção Personalização */}
                                        <div className="space-y-3 p-3 bg-gray-50 rounded border">
                                            <h4 className="text-xs font-semibold text-gray-700">Personalização</h4>

                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="block mb-1 text-xs font-medium">Cor de Fundo</label>
                                                    <input
                                                        type="color"
                                                        value={(selectedStep as any).backgroundColor || '#ffffff'}
                                                        onChange={e => updateStep(selectedStep.id, { backgroundColor: e.target.value })}
                                                        className="w-full h-8 border rounded cursor-pointer"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-xs font-medium">Cor do Texto</label>
                                                    <input
                                                        type="color"
                                                        value={(selectedStep as any).textColor || '#000000'}
                                                        onChange={e => updateStep(selectedStep.id, { textColor: e.target.value })}
                                                        className="w-full h-8 border rounded cursor-pointer"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-xs font-medium">Cor da Borda</label>
                                                    <input
                                                        type="color"
                                                        value={(selectedStep as any).borderColor || '#000000'}
                                                        onChange={e => updateStep(selectedStep.id, { borderColor: e.target.value })}
                                                        className="w-full h-8 border rounded cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Seção Avançado */}
                                        <div className="space-y-3 p-3 bg-gray-50 rounded border">
                                            <h4 className="text-xs font-semibold text-gray-700">Avançado</h4>

                                            <div>
                                                <label className="block mb-1 font-medium">ID do Componente</label>
                                                <input
                                                    value={(selectedStep as any).componentId || ''}
                                                    onChange={e => updateStep(selectedStep.id, { componentId: e.target.value })}
                                                    className="w-full border rounded px-2 py-1 text-[11px]"
                                                    placeholder="Digite o ID..."
                                                />
                                            </div>
                                        </div>

                                        {/* Seção Geral */}
                                        <div className="space-y-3 p-3 bg-gray-50 rounded border">
                                            <h4 className="text-xs font-semibold text-gray-700">Geral</h4>

                                            <div>
                                                <label className="block mb-1 font-medium">Tamanho Máximo (%)</label>
                                                <div className="space-y-2">
                                                    <input
                                                        type="range"
                                                        min="10"
                                                        max="100"
                                                        value={(selectedStep as any).maxWidth || 100}
                                                        onChange={e => updateStep(selectedStep.id, { maxWidth: parseInt(e.target.value) })}
                                                        className="w-full"
                                                    />
                                                    <div className="flex justify-between text-xs text-gray-500">
                                                        <span>10%</span>
                                                        <span className="font-medium">{(selectedStep as any).maxWidth || 100}%</span>
                                                        <span>100%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block mb-1 font-medium">Alinhamento Geral</label>
                                                <select
                                                    value={(selectedStep as any).generalAlignment || 'start'}
                                                    onChange={e => updateStep(selectedStep.id, { generalAlignment: e.target.value as 'start' | 'center' | 'end' })}
                                                    className="w-full border rounded px-2 py-1 text-[11px]"
                                                >
                                                    <option value="start">Começo</option>
                                                    <option value="center">Centro</option>
                                                    <option value="end">Fim</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {selectedStep.type === 'options' && (
                                    <>
                                        {/* Seção Layout */}
                                        <div className="space-y-3 p-3 bg-gray-50 rounded border">
                                            <h4 className="text-xs font-semibold text-gray-700">Layout</h4>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block mb-1 font-medium">Colunas</label>
                                                    <select
                                                        value={(selectedStep as any).columns || 2}
                                                        onChange={e => updateStep(selectedStep.id, { columns: parseInt(e.target.value) as 1 | 2 | 3 | 4 })}
                                                        className="w-full border rounded px-2 py-1 text-[11px]"
                                                    >
                                                        <option value={1}>1 Coluna</option>
                                                        <option value={2}>2 Colunas</option>
                                                        <option value={3}>3 Colunas</option>
                                                        <option value={4}>4 Colunas</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block mb-1 font-medium">Direção</label>
                                                    <select
                                                        value={(selectedStep as any).direction || 'vertical'}
                                                        onChange={e => updateStep(selectedStep.id, { direction: e.target.value as 'vertical' | 'horizontal' })}
                                                        className="w-full border rounded px-2 py-1 text-[11px]"
                                                    >
                                                        <option value="vertical">Vertical</option>
                                                        <option value="horizontal">Horizontal</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block mb-1 font-medium">Disposição</label>
                                                <select
                                                    value={(selectedStep as any).disposition || 'image-text'}
                                                    onChange={e => updateStep(selectedStep.id, { disposition: e.target.value as 'image-text' | 'text-image' | 'text-only' | 'image-only' })}
                                                    className="w-full border rounded px-2 py-1 text-[11px]"
                                                >
                                                    <option value="image-text">Imagem | Texto</option>
                                                    <option value="text-image">Texto | Imagem</option>
                                                    <option value="text-only">Apenas Texto</option>
                                                    <option value="image-only">Apenas Imagem</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Seção Opções */}
                                        <div className="space-y-3 p-3 bg-gray-50 rounded border">
                                            <h4 className="text-xs font-semibold text-gray-700">Opções</h4>
                                            <div className="text-xs text-gray-600">
                                                {((selectedStep as any).options || []).length} opções configuradas
                                            </div>
                                            <Button size="sm" className="w-full text-xs" onClick={() => {
                                                const currentOptions = (selectedStep as any).options || [];
                                                const newOption = {
                                                    id: `opt-${Date.now()}`,
                                                    text: 'Nova opção',
                                                    htmlContent: '<p>Nova opção</p>',
                                                    image: 'https://via.placeholder.com/256x256?text=Nova+Op%C3%A7%C3%A3o'
                                                };
                                                updateStep(selectedStep.id, { options: [...currentOptions, newOption] });
                                            }}>
                                                + Adicionar Opção
                                            </Button>
                                        </div>

                                        {/* Seção Validações */}
                                        <div className="space-y-3 p-3 bg-gray-50 rounded border">
                                            <h4 className="text-xs font-semibold text-gray-700">Validações</h4>

                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    checked={(selectedStep as any).multipleChoice !== false}
                                                    onCheckedChange={(checked) => updateStep(selectedStep.id, { multipleChoice: checked })}
                                                    id="multiple-choice"
                                                />
                                                <label htmlFor="multiple-choice" className="text-sm font-medium">
                                                    Múltipla Escolha
                                                </label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    checked={(selectedStep as any).required !== false}
                                                    onCheckedChange={(checked) => updateStep(selectedStep.id, { required: checked })}
                                                    id="required"
                                                />
                                                <label htmlFor="required" className="text-sm font-medium">
                                                    Obrigatório
                                                </label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    checked={(selectedStep as any).autoProceed || false}
                                                    onCheckedChange={(checked) => updateStep(selectedStep.id, { autoProceed: checked })}
                                                    id="auto-proceed"
                                                />
                                                <label htmlFor="auto-proceed" className="text-sm font-medium">
                                                    Auto-avançar
                                                </label>
                                            </div>
                                        </div>

                                        {/* Seção Estilização */}
                                        <div className="space-y-3 p-3 bg-gray-50 rounded border">
                                            <h4 className="text-xs font-semibold text-gray-700">Estilização</h4>

                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="block mb-1 font-medium">Bordas</label>
                                                    <select
                                                        value={(selectedStep as any).borders || 'small'}
                                                        onChange={e => updateStep(selectedStep.id, { borders: e.target.value as 'small' | 'medium' | 'large' | 'none' })}
                                                        className="w-full border rounded px-2 py-1 text-[11px]"
                                                    >
                                                        <option value="none">Nenhuma</option>
                                                        <option value="small">Pequena</option>
                                                        <option value="medium">Média</option>
                                                        <option value="large">Grande</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block mb-1 font-medium">Sombras</label>
                                                    <select
                                                        value={(selectedStep as any).shadows || 'none'}
                                                        onChange={e => updateStep(selectedStep.id, { shadows: e.target.value as 'none' | 'small' | 'medium' | 'large' })}
                                                        className="w-full border rounded px-2 py-1 text-[11px]"
                                                    >
                                                        <option value="none">Sem Sombras</option>
                                                        <option value="small">Pequena</option>
                                                        <option value="medium">Média</option>
                                                        <option value="large">Grande</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block mb-1 font-medium">Espaçamento</label>
                                                    <select
                                                        value={(selectedStep as any).spacing || 'small'}
                                                        onChange={e => updateStep(selectedStep.id, { spacing: e.target.value as 'small' | 'medium' | 'large' })}
                                                        className="w-full border rounded px-2 py-1 text-[11px]"
                                                    >
                                                        <option value="small">Pequeno</option>
                                                        <option value="medium">Médio</option>
                                                        <option value="large">Grande</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block mb-1 font-medium">Detalhe</label>
                                                    <select
                                                        value={(selectedStep as any).detail || 'none'}
                                                        onChange={e => updateStep(selectedStep.id, { detail: e.target.value as 'none' | 'subtle' | 'prominent' })}
                                                        className="w-full border rounded px-2 py-1 text-[11px]"
                                                    >
                                                        <option value="none">Nenhum</option>
                                                        <option value="subtle">Sutil</option>
                                                        <option value="prominent">Proeminente</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block mb-1 font-medium">Estilo</label>
                                                    <select
                                                        value={(selectedStep as any).style || 'simple'}
                                                        onChange={e => updateStep(selectedStep.id, { style: e.target.value as 'simple' | 'rounded' | 'modern' })}
                                                        className="w-full border rounded px-2 py-1 text-[11px]"
                                                    >
                                                        <option value="simple">Simples</option>
                                                        <option value="rounded">Arredondado</option>
                                                        <option value="modern">Moderno</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Seção Personalização */}
                                        <div className="space-y-3 p-3 bg-gray-50 rounded border">
                                            <h4 className="text-xs font-semibold text-gray-700">Personalização</h4>

                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="block mb-1 text-xs font-medium">Cor</label>
                                                    <input
                                                        type="color"
                                                        value={(selectedStep as any).backgroundColor || '#ffffff'}
                                                        onChange={e => updateStep(selectedStep.id, { backgroundColor: e.target.value })}
                                                        className="w-full h-8 border rounded cursor-pointer"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-xs font-medium">Texto</label>
                                                    <input
                                                        type="color"
                                                        value={(selectedStep as any).textColor || '#000000'}
                                                        onChange={e => updateStep(selectedStep.id, { textColor: e.target.value })}
                                                        className="w-full h-8 border rounded cursor-pointer"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-xs font-medium">Borda</label>
                                                    <input
                                                        type="color"
                                                        value={(selectedStep as any).borderColor || '#e5e7eb'}
                                                        onChange={e => updateStep(selectedStep.id, { borderColor: e.target.value })}
                                                        className="w-full h-8 border rounded cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Seção Avançado */}
                                        <div className="space-y-3 p-3 bg-gray-50 rounded border">
                                            <h4 className="text-xs font-semibold text-gray-700">Avançado</h4>

                                            <div>
                                                <label className="block mb-1 font-medium">ID do Componente</label>
                                                <input
                                                    value={(selectedStep as any).componentId || ''}
                                                    onChange={e => updateStep(selectedStep.id, { componentId: e.target.value })}
                                                    className="w-full border rounded px-2 py-1 text-[11px]"
                                                    placeholder="Digite o ID..."
                                                />
                                            </div>
                                        </div>

                                        {/* Seção Geral */}
                                        <div className="space-y-3 p-3 bg-gray-50 rounded border">
                                            <h4 className="text-xs font-semibold text-gray-700">Geral</h4>

                                            <div>
                                                <label className="block mb-1 font-medium">Tamanho Máximo (%)</label>
                                                <div className="space-y-2">
                                                    <input
                                                        type="range"
                                                        min="10"
                                                        max="100"
                                                        value={(selectedStep as any).maxWidth || 100}
                                                        onChange={e => updateStep(selectedStep.id, { maxWidth: parseInt(e.target.value) })}
                                                        className="w-full"
                                                    />
                                                    <div className="flex justify-between text-xs text-gray-500">
                                                        <span>10%</span>
                                                        <span className="font-medium">{(selectedStep as any).maxWidth || 100}%</span>
                                                        <span>100%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block mb-1 font-medium">Alinhamento</label>
                                                <select
                                                    value={(selectedStep as any).generalAlignment || 'start'}
                                                    onChange={e => updateStep(selectedStep.id, { generalAlignment: e.target.value as 'start' | 'center' | 'end' })}
                                                    className="w-full border rounded px-2 py-1 text-[11px]"
                                                >
                                                    <option value="start">Começo</option>
                                                    <option value="center">Centro</option>
                                                    <option value="end">Fim</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Próximo Step - apenas para tipos que suportam */}
                                {selectedStep.type !== 'header' && selectedStep.type !== 'spacer' && selectedStep.type !== 'script' && selectedStep.type !== 'heading' && selectedStep.type !== 'options' && (
                                    <div>
                                        <label className="block mb-1 font-medium">Próximo Step</label>
                                        <select
                                            value={(selectedStep as any).nextStep || ''}
                                            onChange={e => updateStep(selectedStep.id, { nextStep: e.target.value })}
                                            className="w-full border rounded px-2 py-1 text-[11px]"
                                        >
                                            <option value="">Selecione...</option>
                                            {steps.map(s => (
                                                <option key={s.id} value={s.id}>{s.id} ({s.type})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizFunnelEditorWYSIWYG;