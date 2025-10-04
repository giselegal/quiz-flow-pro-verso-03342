/**
 * 🧩 ATOMIC COMPONENTS INDEX
 * 
 * Exportações centrais para o sistema de componentes atômicos modulares.
 */

// Tipos e interfaces
export * from './types';

// Utilitários e factories
export * from './utils';

// Componentes atômicos
export { default as AtomicTitleComponent } from './AtomicTitle';
export { default as AtomicTextComponent } from './AtomicText';
export { default as AtomicButtonComponent } from './AtomicButton';
export { default as AtomicInputComponent } from './AtomicInput';

// Novos componentes atômicos do diretório quiz/atomic-components
export { AtomicImage } from '../quiz/atomic-components/AtomicImage';
export { AtomicSpacer } from '../quiz/atomic-components/AtomicSpacer';
export { AtomicDivider } from '../quiz/atomic-components/AtomicDivider';
export { AtomicQuestion } from '../quiz/atomic-components/AtomicQuestion';
export { AtomicOptions } from '../quiz/atomic-components/AtomicOptions';

// Container principal
export { default as ModularStepContainer } from './ModularStepContainer';

// Wrapper compartilhado
export { AtomicWrapper } from './shared/AtomicWrapper';