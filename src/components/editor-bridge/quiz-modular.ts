// 🔗 Editor-Bridge (quiz-modular)
// Este arquivo expõe explicitamente todos os componentes modulares usados pelos wrappers lazy.
// Motivo: evitar imports diretos de editor/* no runtime de produção e facilitar testes/mocks.
export { default as ModularIntroStep } from '@/components/editor/quiz-estilo/ModularIntroStep';
export { default as ModularQuestionStep } from '@/components/editor/quiz-estilo/ModularQuestionStep';
export { default as ModularStrategicQuestionStep } from '@/components/editor/quiz-estilo/ModularStrategicQuestionStep';
export { default as ModularTransitionStep } from '@/components/editor/quiz-estilo/ModularTransitionStep';
export { default as ModularResultStep } from '@/components/editor/quiz-estilo/ModularResultStep';
export { default as ModularOfferStep } from '@/components/editor/quiz-estilo/ModularOfferStep';
