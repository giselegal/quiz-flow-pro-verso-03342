/**
 * 🧩 COMPONENTES BASE MODULARES
 * 
 * Componentes React reutilizáveis para o sistema modular.
 * Cada componente é independente e editável.
 */

import React from 'react';
import { ComponentRenderProps, ModularComponent } from './types';
import CompositeIntroStep from './components/composite/CompositeIntroStep';
import CompositeQuestionStep from './components/composite/CompositeQuestionStep';
import CompositeStrategicQuestionStep from './components/composite/CompositeStrategicQuestionStep';
import CompositeTransitionStep from './components/composite/CompositeTransitionStep';
import CompositeTransitionResultStep from './components/composite/CompositeTransitionResultStep';
import CompositeResultStep from './components/composite/CompositeResultStep';
import CompositeOfferStep from './components/composite/CompositeOfferStep';

// 🎨 Wrapper comum para todos os componentes modulares
interface ModularWrapperProps {
    component: ModularComponent;
    isSelected: boolean;
    isEditing: boolean;
    onSelect: (id: string) => void;
    children: React.ReactNode;
}

const ModularWrapper: React.FC<ModularWrapperProps> = ({
    component,
    isSelected,
    isEditing,
    onSelect,
    children
}) => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(component.id);
    };

    return (
        <div
            className={`modular-component ${isSelected ? 'selected' : ''} ${component.className || ''}`}
            style={{
                position: 'relative',
                outline: isSelected ? '2px solid #3b82f6' : 'none',
                outlineOffset: '2px',
                cursor: isEditing ? 'pointer' : 'default',
                order: component.order,
                display: component.visible ? 'block' : 'none',
                ...component.style
            }}
            onClick={handleClick}
            data-component-id={component.id}
            data-component-type={component.type}
        >
            {children}

            {/* Overlay de seleção */}
            {isSelected && isEditing && (
                <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">
                    {component.type}
                </div>
            )}
        </div>
    );
};

// 📝 Componente de Título
export const TitleComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'title') return null;

    const Tag = component.level;

    return (
        <ModularWrapper {...props}>
            <Tag
                style={{
                    textAlign: component.align,
                    color: component.color,
                    fontSize: component.fontSize,
                    margin: 0
                }}
            >
                {component.text}
            </Tag>
        </ModularWrapper>
    );
};

// 📄 Componente de Texto
export const TextComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'text') return null;

    return (
        <ModularWrapper {...props}>
            <div
                style={{
                    textAlign: component.align,
                    color: component.color,
                    fontSize: component.fontSize,
                    fontWeight: component.fontWeight
                }}
                dangerouslySetInnerHTML={{ __html: component.content }}
            />
        </ModularWrapper>
    );
};

// 📥 Componente de Input
export const InputComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'input') return null;

    return (
        <ModularWrapper {...props}>
            <div className="space-y-2">
                {component.label && (
                    <label className="block text-sm font-medium text-gray-700">
                        {component.label}
                        {component.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <input
                    type={component.inputType}
                    placeholder={component.placeholder}
                    required={component.required}
                    maxLength={component.maxLength}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </ModularWrapper>
    );
};

// 🔘 Componente de Botão
export const ButtonComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'button') return null;

    const getButtonClasses = () => {
        const base = 'px-4 py-2 rounded font-medium transition-colors';
        const sizes = {
            sm: 'text-sm px-3 py-1.5',
            md: 'text-base px-4 py-2',
            lg: 'text-lg px-6 py-3'
        };
        const variants = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700',
            secondary: 'bg-gray-600 text-white hover:bg-gray-700',
            outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
            ghost: 'text-blue-600 hover:bg-blue-50'
        };

        return `${base} ${sizes[component.size]} ${variants[component.variant]} ${component.disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`;
    };

    return (
        <ModularWrapper {...props}>
            <button
                className={getButtonClasses()}
                disabled={component.disabled}
            >
                {component.text}
            </button>
        </ModularWrapper>
    );
};

// 🖼️ Componente de Imagem
export const ImageComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'image') return null;

    return (
        <ModularWrapper {...props}>
            <img
                src={component.src}
                alt={component.alt}
                style={{
                    width: component.width,
                    height: component.height,
                    objectFit: component.fit,
                    borderRadius: component.rounded ? '8px' : '0',
                    boxShadow: component.shadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                className="max-w-full h-auto"
            />
        </ModularWrapper>
    );
};

// ☑️ Componente de Opções
export const OptionsComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'options') return null;

    const getLayoutClasses = () => {
        switch (component.layout) {
            case 'grid':
                return `grid gap-3 grid-cols-${component.columnsPerRow}`;
            case 'list':
                return 'space-y-2';
            case 'cards':
                return `grid gap-4 grid-cols-${component.columnsPerRow}`;
            default:
                return 'space-y-2';
        }
    };

    return (
        <ModularWrapper {...props}>
            <div className="space-y-3">
                {component.title && (
                    <h3 className="text-lg font-medium text-gray-900">
                        {component.title}
                    </h3>
                )}

                <div className={getLayoutClasses()}>
                    {component.options.map((option) => (
                        <label
                            key={option.id}
                            className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                            <input
                                type={component.selectionType === 'single' ? 'radio' : 'checkbox'}
                                name={component.id}
                                value={option.value}
                                defaultChecked={option.selected}
                                className="h-4 w-4 text-blue-600"
                            />

                            {option.image && (
                                <img
                                    src={option.image}
                                    alt=""
                                    className="w-8 h-8 rounded object-cover"
                                />
                            )}

                            <span className="flex-1 text-gray-900">
                                {option.text}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </ModularWrapper>
    );
};

// 📏 Componente de Espaçador
export const SpacerComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'spacer') return null;

    return (
        <ModularWrapper {...props}>
            <div
                style={{
                    height: `${component.height}px`,
                    backgroundColor: component.backgroundColor || 'transparent'
                }}
            />
        </ModularWrapper>
    );
};

// ➖ Componente de Divisor
export const DividerComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'divider') return null;

    return (
        <ModularWrapper {...props}>
            <div
                style={{ margin: `${component.margin}px 0` }}
            >
                <hr
                    style={{
                        height: `${component.thickness}px`,
                        backgroundColor: component.color,
                        border: 'none',
                        borderStyle: component.borderStyle
                    }}
                />
            </div>
        </ModularWrapper>
    );
};

// ❓ Componente de Texto de Ajuda
export const HelpTextComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'help-text') return null;

    const getVariantClasses = () => {
        const variants = {
            info: 'bg-blue-50 border-blue-200 text-blue-800',
            warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            success: 'bg-green-50 border-green-200 text-green-800',
            error: 'bg-red-50 border-red-200 text-red-800'
        };
        return variants[component.variant];
    };

    return (
        <ModularWrapper {...props}>
            <div className={`p-3 border rounded-lg ${getVariantClasses()}`}>
                <div className="flex items-start space-x-2">
                    {component.icon && (
                        <span className="text-lg">{component.icon}</span>
                    )}
                    <div className="flex-1">
                        <div dangerouslySetInnerHTML={{ __html: component.content }} />
                    </div>
                </div>
            </div>
        </ModularWrapper>
    );
};

// 📊 Componente de Barra de Progresso
export const ProgressBarComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'progress-bar') return null;

    const percentage = Math.round((component.currentStep / component.totalSteps) * 100);

    return (
        <ModularWrapper {...props}>
            <div className="space-y-2">
                {component.showStepText && (
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Etapa {component.currentStep} de {component.totalSteps}</span>
                        {component.showPercentage && (
                            <span>{percentage}%</span>
                        )}
                    </div>
                )}

                <div
                    className="w-full rounded-full overflow-hidden"
                    style={{ backgroundColor: component.backgroundColor }}
                >
                    <div
                        className="h-2 transition-all duration-300 ease-out"
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: component.color
                        }}
                    />
                </div>
            </div>
        </ModularWrapper>
    );
};

// 🧩 Componentes compostos de etapas
export const StepIntroComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'step-intro') return null;

    return (
        <ModularWrapper {...props}>
            <CompositeIntroStep
                title={component.title}
                formQuestion={component.formQuestion}
                placeholder={component.placeholder}
                buttonText={component.buttonText}
                image={component.image}
                description={component.description}
                backgroundColor={component.backgroundColor}
                textColor={component.textColor}
                accentColor={component.accentColor}
                showHeader={component.showHeader}
                showProgress={component.showProgress}
                progress={component.progress}
            />
        </ModularWrapper>
    );
};

export const StepQuestionComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'step-question') return null;

    return (
        <ModularWrapper {...props}>
            <CompositeQuestionStep
                questionNumber={component.questionNumber}
                questionText={component.questionText}
                subtitle={component.subtitle}
                options={component.options}
                requiredSelections={component.requiredSelections}
                allowMultipleSelection={component.allowMultipleSelection}
                backgroundColor={component.backgroundColor}
                textColor={component.textColor}
                accentColor={component.accentColor}
                totalSteps={component.totalSteps}
                editableHint={component.editableHint}
            />
        </ModularWrapper>
    );
};

export const StepStrategicQuestionComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'step-strategic-question') return null;

    return (
        <ModularWrapper {...props}>
            <CompositeStrategicQuestionStep
                questionText={component.questionText}
                options={component.options}
                backgroundColor={component.backgroundColor}
                textColor={component.textColor}
                accentColor={component.accentColor}
                questionNumber={component.questionNumber}
                progressCurrentStep={component.progressCurrentStep}
                totalSteps={component.totalSteps}
                editableHint={component.editableHint}
            />
        </ModularWrapper>
    );
};

export const StepTransitionComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'step-transition') return null;

    return (
        <ModularWrapper {...props}>
            <CompositeTransitionStep
                title={component.title}
                subtitle={component.subtitle}
                text={component.text}
                image={component.image}
                backgroundColor={component.backgroundColor}
                textColor={component.textColor}
                accentColor={component.accentColor}
                showAnimation={component.showAnimation}
                editableHint={component.editableHint}
            />
        </ModularWrapper>
    );
};

export const StepTransitionResultComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'step-transition-result') return null;

    return (
        <ModularWrapper {...props}>
            <CompositeTransitionResultStep
                title={component.title}
                subtitle={component.subtitle}
                description={component.description}
                backgroundColor={component.backgroundColor}
                textColor={component.textColor}
                accentColor={component.accentColor}
                showAnimation={component.showAnimation}
                editableHint={component.editableHint}
            />
        </ModularWrapper>
    );
};

export const StepResultComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'step-result') return null;

    return (
        <ModularWrapper {...props}>
            <CompositeResultStep
                title={component.title}
                subtitle={component.subtitle}
                userName={component.userName}
                resultStyle={component.resultStyle}
                description={component.description}
                image={component.image}
                characteristics={component.characteristics}
                ctaText={component.ctaText}
                resultPlaceholder={component.resultPlaceholder}
                backgroundColor={component.backgroundColor}
                textColor={component.textColor}
                accentColor={component.accentColor}
                showEditableHint={component.showEditableHint}
            />
        </ModularWrapper>
    );
};

export const StepOfferComponent: React.FC<ComponentRenderProps> = (props) => {
    const { component } = props;

    if (component.type !== 'step-offer') return null;

    return (
        <ModularWrapper {...props}>
            <CompositeOfferStep
                title={component.title}
                subtitle={component.subtitle}
                description={component.description}
                userName={component.userName}
                resultStyle={component.resultStyle}
                buttonText={component.buttonText}
                image={component.image}
                testimonial={component.testimonial}
                price={component.price}
                originalPrice={component.originalPrice}
                benefits={component.benefits}
                ctaText={component.ctaText}
                secureNote={component.secureNote}
                backgroundColor={component.backgroundColor}
                textColor={component.textColor}
                accentColor={component.accentColor}
                showEditableHint={component.showEditableHint}
            />
        </ModularWrapper>
    );
};

// 🏭 Mapa de componentes para renderização
export const COMPONENT_MAP = {
    title: TitleComponent,
    text: TextComponent,
    input: InputComponent,
    button: ButtonComponent,
    image: ImageComponent,
    options: OptionsComponent,
    spacer: SpacerComponent,
    divider: DividerComponent,
    'help-text': HelpTextComponent,
    'progress-bar': ProgressBarComponent,
    'step-intro': StepIntroComponent,
    'step-question': StepQuestionComponent,
    'step-strategic-question': StepStrategicQuestionComponent,
    'step-transition': StepTransitionComponent,
    'step-transition-result': StepTransitionResultComponent,
    'step-result': StepResultComponent,
    'step-offer': StepOfferComponent
} as const;