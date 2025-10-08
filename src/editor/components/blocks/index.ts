/**
 * 🎯 BLOCK COMPONENTS - Índice e Registro Automático
 * 
 * Importa e registra todos os componentes modulares no BlockRegistry.
 */

// Importar componentes
import QuizIntroHeaderBlock from './QuizIntroHeaderBlock';
import TextBlock from './TextBlock';
import FormInputBlock from './FormInputBlock';
import ButtonBlock from './ButtonBlock';

// Importar registry
import { registerBlock } from '@/editor/registry/BlockRegistry';

// ============================================================================
// REGISTRO AUTOMÁTICO
// ============================================================================

// Intro Components (Step 1)
registerBlock('quiz-intro-header', QuizIntroHeaderBlock);
registerBlock('text', TextBlock);
// Temporariamente desabilitado até alinhar tipos de FormInputBlock ao novo contrato
// registerBlock('form-input', FormInputBlock);
registerBlock('button', ButtonBlock);

// TODO: Adicionar mais componentes conforme implementação:
// - QuizQuestionBlock (steps 2-11)
// - QuizOptionsBlock (steps 2-11)
// - QuizNavigationBlock (steps 2-11)
// - TransitionBlock (steps 12, 19)
// - ResultHeadlineBlock (step 20)
// - ResultSecondaryListBlock (step 20)
// - OfferCoreBlock (step 21)
// - OfferUrgencyBlock (step 21)
// - CheckoutButtonBlock (step 21)

// ============================================================================
// EXPORTS
// ============================================================================

export {
    QuizIntroHeaderBlock,
    TextBlock,
    // FormInputBlock,
    ButtonBlock
};

console.log('✅ Componentes modulares registrados no BlockRegistry');
