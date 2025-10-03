// 🎨 COMPONENTES EDITÁVEIS PARA QUIZ EDITOR
// 
// Este módulo exporta versões híbridas dos componentes de quiz
// que funcionam tanto em modo edição quanto preview

// Componentes base
export { default as EditableField } from './EditableField';

// Componentes de quiz originais editáveis
export { default as EditableIntroStep } from './EditableIntroStep';
export { default as EditableQuestionStep } from './EditableQuestionStep';

// Novos componentes avançados baseados no modelo analisado
export { default as EditableHeader } from './EditableHeader';
export { default as EditableSpacer } from './EditableSpacer';
export { default as EditableAdvancedOptions } from './EditableAdvancedOptions';
export { default as EditableButton } from './EditableButton';
export { default as EditableScript } from './EditableScript';
export { default as EditableHeading } from './EditableHeading';
export { default as EditableOptionsGrid } from './EditableOptionsGrid';
export { default as EditableOptions } from './EditableOptions';

// TODO: Adicionar outros componentes editáveis conforme necessário
// export { default as EditableStrategicQuestionStep } from './EditableStrategicQuestionStep';
// export { default as EditableTransitionStep } from './EditableTransitionStep';
// export { default as EditableResultStep } from './EditableResultStep';
// export { default as EditableOfferStep } from './EditableOfferStep';