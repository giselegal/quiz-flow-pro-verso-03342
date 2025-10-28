# Scripts Deprecated

⚠️ **ATENÇÃO: Scripts nesta pasta estão OBSOLETOS**

## Motivo

Estes scripts usam `src/data/quizSteps.ts` que foi deprecated.

**Fonte única atual:** `public/templates/quiz21-complete.json`
**Service canonical:** `src/services/canonical/TemplateService.ts`

## Scripts Movidos

1. **convert-quiz-steps-to-json.ts** - Conversão obsoleta (JSON já é a fonte)
2. **update-master-from-quizSteps.ts** - Atualização invertida (quizSteps não é mais master)
3. **compare-template-sources.ts** - Comparação obsoleta
4. **test-navigation-integration.ts** - Testes obsoletos
5. **test-quiz-navigation-config.ts** - Testes obsoletos

## Se Precisar Usar

1. Veja `ARQUITETURA_TEMPLATES_DEFINITIVA.md` para arquitetura correta
2. Use `TemplateService.getInstance()` ao invés de `QUIZ_STEPS`
3. Leia de `quiz21-complete.json` diretamente se necessário

## Data de Deprecation

28 de outubro de 2025
