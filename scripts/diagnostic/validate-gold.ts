import gold from '../..//public/templates/quiz21-v4-gold.json' assert { type: 'json' };
import { getSchemaErrors, validateQuizSchema } from '../../src/schemas/quiz-schema.zod';

const result = validateQuizSchema(gold);
if (!result.success) {
  console.log('Zod validation failed. Issues:');
  console.log(getSchemaErrors(gold).join('\n'));
  process.exit(1);
}
console.log('Zod validation passed.');
