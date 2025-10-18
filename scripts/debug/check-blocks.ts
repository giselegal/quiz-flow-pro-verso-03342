/*
 * Quick diagnostic: verify v3→Block conversion and type mapping for steps 20 and 21
 */
import { safeGetTemplateBlocks } from '../../src/utils/templateConverter';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '../../src/templates/quiz21StepsComplete';
import type { BlockComponent } from '../../src/components/editor/quiz/types';

function inspect(stepId: string) {
  const blocks: BlockComponent[] = safeGetTemplateBlocks(stepId, QUIZ_STYLE_21_STEPS_TEMPLATE);
  const types = blocks.map((b: BlockComponent) => b.type);
  console.log(`Step ${stepId}: ${blocks.length} blocks`);
  console.log(types);
}

inspect('step-20');
inspect('step-21');
