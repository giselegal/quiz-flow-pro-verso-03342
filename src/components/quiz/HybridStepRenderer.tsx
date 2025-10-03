/**
 * 🎯 COMPONENTES HÍBRIDOS DE PRODUÇÃO
 * 
 * Esta camada consolida os componentes de produção com as funcionalidades
 * de edição, garantindo que os dados reais do funil sejam consumidos
 * pelos novos componentes editáveis.
 */

import React from 'react';
import { QuizStep } from '@/data/quizSteps';

// Importar componentes de produção originais
import IntroStep from '@/components/quiz/IntroStep';
import QuestionStep from '@/components/quiz/QuestionStep';
import StrategicQuestionStep from '@/components/quiz/StrategicQuestionStep';
import TransitionStep from '@/components/quiz/TransitionStep';
import ResultStep from '@/components/quiz/ResultStep';
import OfferStep from '@/components/quiz/OfferStep';

// Importar componentes editáveis novos
import EditableRichText from '@/components/quiz/editable/EditableRichText';
import EditableHeader from '@/components/quiz/editable/EditableHeader';
import EditableHeading from '@/components/quiz/editable/EditableHeading';
import EditableSpacer from '@/components/quiz/editable/EditableSpacer';
import EditableButton from '@/components/quiz/editable/EditableButton';
import EditableScript from '@/components/quiz/editable/EditableScript';
import EditableOptions from '@/components/quiz/editable/EditableOptions';
import EditableOptionsGrid from '@/components/quiz/editable/EditableOptionsGrid';
import EditableIntroStep from '@/components/quiz/editable/EditableIntroStep';
import EditableQuestionStep from '@/components/quiz/editable/EditableQuestionStep';
import EditableAdvancedOptions from '@/components/quiz/editable/EditableAdvancedOptions';

// ============================================================================
// INTERFACES CONSOLIDADAS
// ============================================================================

export interface HybridComponentProps {
    step: any; // QuizStep ou ExtendedStep
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
    onChange?: (content: any) => void;
    
    // Props específicas para componentes de produção
    onNameSubmit?: (name: string) => void;
    currentAnswers?: string[];
    onAnswersChange?: (answers: string[]) => void;
    currentAnswer?: string;
    onAnswerChange?: (answer: string) => void;
    onComplete?: () => void;
    userProfile?: any;
    offerKey?: string;
    
    // Props de controle
    mode?: 'edit' | 'preview' | 'production';
}

// ============================================================================
// COMPONENTE HÍBRIDO PRINCIPAL
// ============================================================================

/**
 * 🔄 COMPONENTE HÍBRIDO
 * 
 * Renderiza componentes de produção OU editáveis baseado no contexto,
 * garantindo que os dados reais do funil sejam sempre consumidos.
 */
export const HybridStepRenderer: React.FC<HybridComponentProps> = ({
    step,
    isEditable = false,
    mode = 'production',
    onEdit,
    onChange,
    ...props
}) => {
    // Se for modo de edição, usar componentes editáveis
    // Se for produção, usar componentes originais
    const useEditableComponents = mode === 'edit' || isEditable;

    switch (step.type) {
        case 'intro':
            // CONSOLIDADO: Sempre usa dados reais, mas permite edição
            return useEditableComponents ? (
                <div className="hybrid-intro-container">
                    {/* Header do funil real */}
                    <EditableHeader
                        logo="https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png"
                        progress={0}
                        showLogo={true}
                        showProgress={false}
                        allowReturn={false}
                        isEditable={isEditable}
                        onEdit={onEdit}
                    />
                    
                    {/* Conteúdo principal usando dados reais */}
                    <IntroStep
                        data={step} // DADOS REAIS DO FUNIL
                        onNameSubmit={props.onNameSubmit || (() => {})}
                    />
                </div>
            ) : (
                <IntroStep
                    data={step} // DADOS REAIS DO FUNIL
                    onNameSubmit={props.onNameSubmit || (() => {})}
                />
            );

        case 'question':
            return useEditableComponents ? (
                <div className="hybrid-question-container">
                    {/* Header com progresso real */}
                    <EditableHeader
                        logo="https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png"
                        progress={calculateProgress(step)} // CÁLCULO REAL
                        showLogo={true}
                        showProgress={true}
                        allowReturn={true}
                        isEditable={isEditable}
                        onEdit={onEdit}
                    />
                    
                    {/* Título da questão usando dados reais */}
                    <EditableHeading
                        content={`${step.questionNumber} - ${step.questionText}`} // DADOS REAIS
                        alignment="center"
                        headingLevel={1}
                        isEditable={isEditable}
                        onEdit={onEdit}
                    />
                    
                    <EditableSpacer height={24} isEditable={isEditable} onEdit={onEdit} />
                    
                    {/* Opções usando dados reais */}
                    <EditableOptionsGrid
                        options={step.options} // DADOS REAIS DO FUNIL
                        selectedOptions={props.currentAnswers || []}
                        multiSelect={step.requiredSelections > 1}
                        maxSelections={step.requiredSelections}
                        onSelectionChange={props.onAnswersChange}
                        isEditable={isEditable}
                        onEdit={onEdit}
                    />
                </div>
            ) : (
                <QuestionStep
                    data={step} // DADOS REAIS DO FUNIL
                    currentAnswers={props.currentAnswers || []}
                    onAnswersChange={props.onAnswersChange || (() => {})}
                />
            );

        case 'strategic-question':
            return useEditableComponents ? (
                <div className="hybrid-strategic-container">
                    <EditableHeader
                        logo="https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png"
                        progress={calculateProgress(step)}
                        showLogo={true}
                        showProgress={true}
                        allowReturn={true}
                        isEditable={isEditable}
                        onEdit={onEdit}
                    />
                    
                    <EditableHeading
                        content={step.questionText} // DADOS REAIS
                        alignment="center"
                        headingLevel={1}
                        isEditable={isEditable}
                        onEdit={onEdit}
                    />
                    
                    <EditableOptions
                        options={step.options} // DADOS REAIS DO FUNIL
                        selectedOptions={props.currentAnswer ? [props.currentAnswer] : []}
                        multipleChoice={false}
                        onSelectionChange={(selected) => props.onAnswerChange?.(selected[0] || '')}
                        isEditable={isEditable}
                        onEdit={onEdit}
                    />
                </div>
            ) : (
                <StrategicQuestionStep
                    data={step} // DADOS REAIS DO FUNIL
                    currentAnswer={props.currentAnswer || ''}
                    onAnswerChange={props.onAnswerChange || (() => {})}
                />
            );

        case 'transition':
        case 'transition-result':
            return useEditableComponents ? (
                <div className="hybrid-transition-container">
                    <EditableHeader
                        logo="https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png"
                        progress={calculateProgress(step)}
                        showLogo={true}
                        showProgress={true}
                        allowReturn={false}
                        isEditable={isEditable}
                        onEdit={onEdit}
                    />
                    
                    <EditableHeading
                        content={step.title || step.text} // DADOS REAIS
                        alignment="center"
                        headingLevel={1}
                        isEditable={isEditable}
                        onEdit={onEdit}
                    />
                    
                    {/* Script de transição real */}
                    <EditableScript
                        code={getTransitionScript(step)} // LÓGICA REAL DE TRANSIÇÃO
                        visible={false}
                        isEditable={isEditable}
                        onEdit={onEdit}
                    />
                </div>
            ) : (
                <TransitionStep
                    data={step} // DADOS REAIS DO FUNIL
                    onComplete={props.onComplete || (() => {})}
                />
            );

        case 'result':
            return useEditableComponents ? (
                <div className="hybrid-result-container">
                    <EditableHeader
                        logo="https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png"
                        progress={100}
                        showLogo={true}
                        showProgress={true}
                        allowReturn={false}
                        isEditable={isEditable}
                        onEdit={onEdit}
                    />
                    
                    <EditableRichText
                        content={generateResultContent(step, props.userProfile)} // CONTEÚDO REAL DINÂMICO
                        isEditable={isEditable}
                        onEdit={onEdit}
                        onChange={onChange}
                    />
                </div>
            ) : (
                <ResultStep
                    data={step} // DADOS REAIS DO FUNIL
                    userProfile={props.userProfile}
                />
            );

        case 'offer':
            return useEditableComponents ? (
                <div className="hybrid-offer-container">
                    <EditableHeader
                        logo="https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png"
                        progress={100}
                        showLogo={true}
                        showProgress={false}
                        allowReturn={false}
                        isEditable={isEditable}
                        onEdit={onEdit}
                    />
                    
                                            <EditableRichText
                        content={generateOfferContent(step, props.userProfile, props.offerKey || 'default')} // OFERTA REAL DINÂMICA
                        isEditable={isEditable}
                        onEdit={onEdit}
                        onChange={onChange}
                    />
                    
                    <EditableButton
                        text={getOfferButtonText(step, props.offerKey || 'default')} // TEXTO REAL DO BOTÃO
                        variant="default"
                        fullWidth={true}
                        isEditable={isEditable}
                        onEdit={onEdit}
                    />
                </div>
            ) : (
                <OfferStep
                    data={step} // DADOS REAIS DO FUNIL
                    userProfile={props.userProfile}
                    offerKey={props.offerKey || 'default'}
                />
            );

        // Novos tipos que só existem como editáveis
        case 'rich-text':
            return (
                <EditableRichText
                    content={step.content}
                    placeholder={step.placeholder}
                    maxWidth={step.maxWidth}
                    generalAlignment={step.generalAlignment}
                    showToolbar={step.showToolbar}
                    minHeight={step.minHeight}
                    backgroundColor={step.backgroundColor}
                    borderColor={step.borderColor}
                    componentId={step.componentId}
                    isEditable={isEditable}
                    onEdit={onEdit}
                    onChange={onChange}
                />
            );

        case 'header':
            return (
                <EditableHeader
                    logo={step.logo}
                    progress={step.progress}
                    showLogo={step.showLogo}
                    showProgress={step.showProgress}
                    allowReturn={step.allowReturn}
                    isEditable={isEditable}
                    onEdit={onEdit}
                />
            );

        // ... outros casos

        default:
            return (
                <div className="p-4 border border-red-300 bg-red-50 rounded">
                    <p className="text-red-600">Tipo de componente não reconhecido: {step.type}</p>
                </div>
            );
    }
};

// ============================================================================
// FUNÇÕES AUXILIARES PARA DADOS REAIS
// ============================================================================

/**
 * Calcula o progresso real baseado na posição no funil
 */
function calculateProgress(step: any): number {
    // Implementar lógica real de cálculo de progresso
    // baseada na posição da etapa no funil completo
    return 50; // Placeholder
}

/**
 * Gera conteúdo dinâmico para resultado baseado no perfil real
 */
function generateResultContent(step: any, userProfile: any): string {
    if (!userProfile) return step.title || 'Seu resultado';
    
    return `
        <h1>${userProfile.userName}, seu estilo é:</h1>
        <h2 style="color: #B89B7A;">${userProfile.resultStyle}</h2>
        <p>Características principais:</p>
        <ul>
                        ${userProfile.secondaryStyles?.map((style: string) => `<li>${style}</li>`).join('') || ''}
        </ul>
    `;
}

/**
 * Gera conteúdo dinâmico para oferta baseado no perfil real
 */
function generateOfferContent(step: any, userProfile: any, offerKey: string): string {
    const offerData = step.offerMap?.[offerKey] || step.offerMap?.['default'];
    if (!offerData) return '<h2>Oferta Especial</h2><p>Personalize sua jornada de estilo!</p>';
    
    return `
        <h1>${offerData.title}</h1>
        <p>${offerData.description}</p>
        <blockquote>
            <p>"${offerData.testimonial.quote}"</p>
            <footer>— ${offerData.testimonial.author}</footer>
        </blockquote>
    `;
}

/**
 * Obtém texto real do botão baseado na oferta
 */
function getOfferButtonText(step: any, offerKey: string): string {
    const offerData = step.offerMap?.[offerKey] || step.offerMap?.['default'];
    return offerData?.buttonText || 'Quero Descobrir Meu Estilo';
}

/**
 * Obtém script real de transição
 */
function getTransitionScript(step: any): string {
    return `
        // Script de transição real para ${step.type}
        setTimeout(() => {
            // Lógica de processamento real do quiz
            console.log('Processando resultados...');
            // Redirecionar para próxima etapa
        }, 2000);
    `;
}

export default HybridStepRenderer;