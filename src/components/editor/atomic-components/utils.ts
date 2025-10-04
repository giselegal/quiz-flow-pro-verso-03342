/**
 * 🏭 ATOMIC COMPONENT FACTORIES
 * 
 * Funções para criar componentes atômicos com valores padrão.
 */

import {
    AtomicComponent,
    AtomicComponentType,
    AtomicTitle,
    AtomicText,
    AtomicButton,
    AtomicInput,
    AtomicImage,
    AtomicSpacer,
    AtomicDivider,
    ModularStep
} from './types';

// 🎲 Gerar ID único
const generateId = () => `atomic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 🏭 Factories para componentes atômicos
export const createAtomicTitle = (overrides: Partial<AtomicTitle> = {}): AtomicTitle => ({
    id: generateId(),
    type: 'title',
    order: 0,
    visible: true,
    text: 'Novo Título',
    size: 'large',
    alignment: 'center',
    color: '#1f2937',
    weight: 'bold',
    ...overrides
});

export const createAtomicText = (overrides: Partial<AtomicText> = {}): AtomicText => ({
    id: generateId(),
    type: 'text',
    order: 0,
    visible: true,
    content: 'Novo texto. Clique para editar.',
    size: 'medium',
    alignment: 'center',
    color: '#4b5563',
    markdown: false,
    ...overrides
});

export const createAtomicButton = (overrides: Partial<AtomicButton> = {}): AtomicButton => ({
    id: generateId(),
    type: 'button',
    order: 0,
    visible: true,
    text: 'Continuar',
    action: 'next',
    style: 'primary',
    size: 'medium',
    fullWidth: false,
    ...overrides
});

export const createAtomicInput = (overrides: Partial<AtomicInput> = {}): AtomicInput => ({
    id: generateId(),
    type: 'input',
    order: 0,
    visible: true,
    label: 'Campo de texto',
    placeholder: 'Digite aqui...',
    inputType: 'text',
    required: false,
    ...overrides
});

export const createAtomicImage = (overrides: Partial<AtomicImage> = {}): AtomicImage => ({
    id: generateId(),
    type: 'image',
    order: 0,
    visible: true,
    src: '',
    alt: 'Imagem',
    borderRadius: 8,
    alignment: 'center',
    ...overrides
});

export const createAtomicSpacer = (overrides: Partial<AtomicSpacer> = {}): AtomicSpacer => ({
    id: generateId(),
    type: 'spacer',
    order: 0,
    visible: true,
    height: 24,
    ...overrides
});

export const createAtomicDivider = (overrides: Partial<AtomicDivider> = {}): AtomicDivider => ({
    id: generateId(),
    type: 'divider',
    order: 0,
    visible: true,
    style: 'solid',
    color: '#e5e7eb',
    thickness: 1,
    ...overrides
});

// Novos factories para quiz components
export const createAtomicQuestion = (overrides: Partial<any> = {}): any => ({
    id: generateId(),
    type: 'question',
    order: 0,
    visible: true,
    question: 'Sua pergunta aparece aqui',
    description: '',
    questionType: 'multiple-choice',
    required: false,
    style: 'default',
    ...overrides
});

export const createAtomicOptions = (overrides: Partial<any> = {}): any => ({
    id: generateId(),
    type: 'options',
    order: 0,
    visible: true,
    optionType: 'radio',
    layout: 'vertical',
    columns: 1,
    options: [
        { id: 'option-1', text: 'Opção 1', value: 'option-1' },
        { id: 'option-2', text: 'Opção 2', value: 'option-2' }
    ],
    ...overrides
});

// 🎪 Factory universal baseada no tipo
export const createAtomicComponent = (
    type: AtomicComponentType,
    overrides: Partial<AtomicComponent> = {}
): AtomicComponent => {
    switch (type) {
        case 'title':
            return createAtomicTitle(overrides as Partial<AtomicTitle>);
        case 'text':
            return createAtomicText(overrides as Partial<AtomicText>);
        case 'button':
            return createAtomicButton(overrides as Partial<AtomicButton>);
        case 'input':
            return createAtomicInput(overrides as Partial<AtomicInput>);
        case 'image':
            return createAtomicImage(overrides as Partial<AtomicImage>);
        case 'spacer':
            return createAtomicSpacer(overrides as Partial<AtomicSpacer>);
        case 'divider':
            return createAtomicDivider(overrides as Partial<AtomicDivider>);
        case 'question':
            return createAtomicQuestion(overrides);
        case 'options':
            return createAtomicOptions(overrides);
        default:
            // Fallback para tipos não implementados
            return createAtomicText({ content: `Componente ${type} não implementado` });
    }
};

// 🏗️ Criar etapa modular com componentes padrão
export const createModularStep = (
    type: 'intro' | 'question' | 'result' | 'custom' = 'custom',
    overrides: Partial<ModularStep> = {}
): ModularStep => {
    const baseId = `step-${Date.now()}`;
    let defaultComponents: AtomicComponent[] = [];

    // Criar componentes padrão baseados no tipo de etapa
    switch (type) {
        case 'intro':
            defaultComponents = [
                createAtomicTitle({
                    text: 'Bem-vindo!',
                    order: 0
                }),
                createAtomicText({
                    content: 'Vamos começar esta jornada juntos.',
                    order: 1
                }),
                createAtomicInput({
                    label: 'Como posso chamá-lo?',
                    placeholder: 'Seu nome...',
                    order: 2
                }),
                createAtomicButton({
                    text: 'Começar',
                    order: 3
                })
            ];
            break;

        case 'question':
            defaultComponents = [
                createAtomicText({
                    content: 'Nova pergunta?',
                    size: 'large',
                    order: 0
                }),
                createAtomicButton({
                    text: 'Continuar',
                    order: 1
                })
            ];
            break;

        case 'result':
            defaultComponents = [
                createAtomicTitle({
                    text: 'Resultado!',
                    order: 0
                }),
                createAtomicText({
                    content: 'Aqui está seu resultado personalizado.',
                    order: 1
                }),
                createAtomicButton({
                    text: 'Finalizar',
                    order: 2
                })
            ];
            break;

        case 'custom':
        default:
            defaultComponents = [
                createAtomicTitle({
                    text: 'Nova Etapa',
                    order: 0
                }),
                createAtomicText({
                    content: 'Personalize esta etapa adicionando componentes.',
                    order: 1
                })
            ];
    }

    return {
        id: baseId,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Step`,
        type,
        components: defaultComponents,
        settings: {
            backgroundColor: '#ffffff',
            padding: 24,
            minHeight: 200
        },
        ...overrides
    };
};

// 🔄 Utilitários para manipulação de ordem
export const reorderComponents = (
    components: AtomicComponent[],
    fromIndex: number,
    toIndex: number
): AtomicComponent[] => {
    const result = [...components];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);

    // Reordenar os valores de order
    return result.map((comp, index) => ({
        ...comp,
        order: index
    }));
};

export const insertComponent = (
    components: AtomicComponent[],
    afterComponentId: string | null,
    newComponent: AtomicComponent
): AtomicComponent[] => {
    if (afterComponentId === null) {
        // Inserir no início
        const newOrder = 0;
        const updatedComponents = components.map(comp => ({
            ...comp,
            order: comp.order + 1
        }));
        return [{ ...newComponent, order: newOrder }, ...updatedComponents];
    }

    const afterIndex = components.findIndex(comp => comp.id === afterComponentId);
    if (afterIndex === -1) return components;

    const result = [...components];
    const newOrder = components[afterIndex].order + 0.5;

    result.splice(afterIndex + 1, 0, { ...newComponent, order: newOrder });

    // Reordenar todos os componentes
    return result
        .sort((a, b) => a.order - b.order)
        .map((comp, index) => ({
            ...comp,
            order: index
        }));
};

export const removeComponent = (
    components: AtomicComponent[],
    componentId: string
): AtomicComponent[] => {
    return components
        .filter(comp => comp.id !== componentId)
        .map((comp, index) => ({
            ...comp,
            order: index
        }));
};