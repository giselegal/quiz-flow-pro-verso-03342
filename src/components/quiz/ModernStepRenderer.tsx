import React from 'react';
import { ModernQuizStep } from '@/data/modernQuizSteps';
import EditableHeader from './editable/EditableHeader';
import EditableHeading from './editable/EditableHeading';
import EditableSpacer from './editable/EditableSpacer';
import EditableButton from './editable/EditableButton';
import EditableScript from './editable/EditableScript';
import EditableQuestionStep from './editable/EditableQuestionStep';
import EditableIntroStep from './editable/EditableIntroStep';

interface ModernStepRendererProps {
    step: ModernQuizStep;
    onNameSubmit?: (name: string) => void;
    currentAnswers?: string[];
    onAnswersChange?: (answers: string[]) => void;
    onComponentEdit?: (componentId: string, field: string, value: any) => void;
    isEditable?: boolean;
}

/**
 * 🎯 RENDERIZADOR DE ETAPAS MODERNAS
 * 
 * Componente que renderiza etapas utilizando os novos componentes:
 * - Header, Heading, Spacer, Button, Script
 * - Mantém compatibilidade com componentes de questão existentes
 */
export default function ModernStepRenderer({
    step,
    onNameSubmit = () => { },
    currentAnswers = [],
    onAnswersChange = () => { },
    onComponentEdit = () => { },
    isEditable = false
}: ModernStepRendererProps) {

    const renderComponent = (component: any) => {
        const { id, type, props } = component;

        switch (type) {
            case 'header':
                return (
                    <EditableHeader
                        key={id}
                        logo={props.logo}
                        progress={props.progress}
                        showLogo={props.showLogo}
                        showProgress={props.showProgress}
                        allowReturn={props.allowReturn}
                        isEditable={false} // Sempre false para evitar edição inline
                        onEdit={(field, value) => onComponentEdit(id, field, value)}
                    />
                );

            case 'heading':
                return (
                    <EditableHeading
                        key={id}
                        content={props.content}
                        alignment={props.alignment}
                        backgroundColor={props.backgroundColor}
                        textColor={props.textColor}
                        borderColor={props.borderColor}
                        componentId={props.componentId}
                        maxWidth={props.maxWidth}
                        generalAlignment={props.generalAlignment}
                        headingLevel={props.headingLevel}
                        isEditable={false} // Sempre false para evitar edição inline
                        onEdit={(field, value) => onComponentEdit(id, field, value)}
                    />
                );

            case 'spacer':
                return (
                    <EditableSpacer
                        key={id}
                        height={props.height}
                        isEditable={false} // Sempre false para evitar edição inline
                        onEdit={(field, value) => onComponentEdit(id, field, value)}
                    />
                );

            case 'button':
                return (
                    <EditableButton
                        key={id}
                        text={props.text}
                        variant={props.variant}
                        size={props.size}
                        fullWidth={props.fullWidth}
                        isEditable={false} // Sempre false para evitar edição inline
                        onEdit={(field, value) => onComponentEdit(id, field, value)}
                    />
                );

            case 'script':
                return (
                    <EditableScript
                        key={id}
                        code={props.code}
                        visible={props.visible}
                        isEditable={false} // Sempre false para evitar edição inline
                        onEdit={(field, value) => onComponentEdit(id, field, value)}
                    />
                );

            default:
                return (
                    <div key={id} className="p-2 border border-red-300 bg-red-50 rounded text-red-600 text-xs">
                        Componente desconhecido: {type}
                    </div>
                );
        }
    };

    return (
        <div className="modern-step-container space-y-4">
            {/* Renderizar componentes adicionais em ordem */}
            {step.components && step.components
                .sort((a, b) => a.order - b.order)
                .map(renderComponent)
            }

            {/* Renderizar conteúdo principal da etapa */}
            {step.type === 'intro' && (
                <EditableIntroStep
                    data={step}
                    onNameSubmit={onNameSubmit}
                    isEditable={false} // Sempre false para evitar edição inline
                    onEdit={() => { }} // Componente principal não editável
                />
            )}

            {step.type === 'question' && (
                <EditableQuestionStep
                    data={step}
                    currentAnswers={currentAnswers}
                    onAnswersChange={onAnswersChange}
                    isEditable={false} // Sempre false para evitar edição inline
                    onEdit={() => { }} // Componente principal não editável
                />
            )}

            {step.type === 'strategic-question' && (
                <EditableQuestionStep
                    data={step}
                    currentAnswers={currentAnswers}
                    onAnswersChange={onAnswersChange}
                    isEditable={false} // Sempre false para evitar edição inline
                    onEdit={() => { }} // Componente principal não editável
                />
            )}

            {/* Adicionar outros tipos conforme necessário */}
        </div>
    );
}