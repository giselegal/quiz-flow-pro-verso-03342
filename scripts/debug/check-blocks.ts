/*
 * Quick diagnostic: verify v3→Block conversion and type mapping for steps 20 and 21
 */
import { safeGetTemplateBlocks } from '@/utils/templateConverter';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

function inspect(stepId: string) {
  const blocks = safeGetTemplateBlocks(stepId, QUIZ_STYLE_21_STEPS_TEMPLATE);
  const types = blocks.map(b => b.type);
  console.log(`Step ${stepId}: ${blocks.length} blocks`);
  console.log(types);
}

inspect('step-20');
inspect('step-21');
