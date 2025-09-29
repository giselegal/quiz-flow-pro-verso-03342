# Migração Final dos Blocks do Quiz (Canonical Dynamic Blocks)

## Objetivo
Eliminar a duplicação massiva de definição de blocks no arquivo legado `quiz21StepsComplete.ts`, adotando geração dinâmica 100% baseada no `quiz-definition.json` + heurísticas e overrides opcionais.

## Estado Atual
- Fonte de verdade semântica: `src/domain/quiz/quiz-definition.ts` (migração de JSON → TS para evitar parsing issues) com 21 steps, offers, scoring, progress.
- Gerador dinâmico: `src/domain/quiz/blockTemplateGenerator.ts` (builders: intro, question, strategic-question, transition, transition-result, result, offer + seções modulares de result/offer).
- Heurísticas aplicadas a perguntas: layout grid/list, colunas, optionStyle, selectionMode, required/min/max + ordinal dinâmico derivado de `progress.countedStepIds`.
- Feature flags (implementadas em `src/templates/quiz21StepsAdapter.ts`):
  - `VITE_QUIZ_DYNAMIC_BLOCKS=1`: gera somente subset a partir da etapa 12 (migração incremental).
  - `VITE_QUIZ_DYNAMIC_QUESTIONS=1`: gera apenas steps de perguntas (2–11) para validar heurísticas isoladamente.
  - `VITE_QUIZ_DYNAMIC_ALL=1`: gera todos os steps (modo canônico completo) — PRIORIDADE sobre as demais.
  - Ausência de flags: modo `legacy` (atualmente equivalente a `all`, servindo apenas como fallback / rollback rápido).
- Script de verificação: `npm run quiz:verify-blocks` garante presença e consistência básica (question/result/offer). 
- Script diff legado vs dinâmico: `npm run quiz:diff-blocks` com tolerâncias definidas (delta ≤ 2 e ignoráveis decorativos).

## Critérios para Remover Legado
1. `VITE_QUIZ_DYNAMIC_ALL=1` executa app sem erros de runtime (navegação 1→21) – VALIDAR.
2. `npm run quiz:verify-blocks` passa sem issues.
3. Smoke tests relevantes (mínimo): `npm run smoke:step1`, `npm run smoke:step20` passam com flag full.
4. Nenhum import externo crítico depende de IDs de blocos específicos do legado (ex.: `step1-title`). Se houver, mapear via override ou converter para seleção por `stepId` + tipo de bloco.
5. Métricas/KPIs de interação (se instrumentadas) continuam gerando eventos principais: `quiz_started`, `quiz_completed`, `offer_viewed`, `offer_clicked`.

## Fases de Remoção
| Fase | Ação | Flag | Resultado |
|------|------|------|-----------|
| 1 | Validar full dynamic em dev local | VITE_QUIZ_DYNAMIC_ALL=1 | Confiança funcional |
| 2 | Adicionar script diff bloco (legado vs dinâmico) | (independente) | Lista divergências |
| 3 | Ajustar overrides pontuais (se necessário) | Opcional | Alinha experiência UI |
| 4 | Remover literal de blocks legado | - | Redução gigantesca de LOC |
| 5 | Converter `quiz21StepsComplete.ts` em adapter fino | - | Dependências externas intactas |
| 6 | Atualizar docs arquiteturais | - | Governança clara |

## Estratégia de Rollback
| Cenário | Sintoma | Ação Immediate | Ação Curativa |
|---------|--------|----------------|---------------|
| Bug layout perguntas | Cards desalinhados | Desabilitar `VITE_QUIZ_DYNAMIC_QUESTIONS` | Ajustar heurística/override |
| Erro transição final | Step 19→20 quebra | Ativar só `VITE_QUIZ_DYNAMIC_BLOCKS` | Revisar builder result/offer |
| Diferença contagem blocks | Script diff falha | Voltar sem flags | Ajustar builder ou remover block fantasma legado |
| Evento tracking ausente | Falta `offer_viewed` | Reativar legado parcial | Instrumentar evento no bloco dinâmico |

## Script Diff (Implementado)
Executa comparação para cada step:
- countLegacy vs countDynamic (tolera delta absoluto ≤ 2)
- tipos setLegacy vs setDynamic (ignora decorativos / lista IGNORABLE)
Diferenças relevantes produzem exit code != 0.

## Overrides (Exemplo de Uso Futuro)
```ts
import { registerQuestionOverride } from 'src/domain/quiz/blockTemplateGenerator';
registerQuestionOverride({
  stepId: 'step-4',
  layout: 'grid',
  columns: 3,
  extraBlocksBefore: [{ id: 'promo-banner', type: 'banner', order: -1, content: { text: 'NOVO!' } }]
});
```

## Benefícios Pós-Remoção
- Única fonte semântica e visual derivada (zero drift).
- Redução radical de LOC (arquivo legado tinha ~3700 linhas).
- Geração programática facilita futura edição visual / builder guiado.
- Base pronta para versionamento de layouts e A/B tests controlados.

## Próximos Incrementos (Opcional)
1. Tipar Block centralmente (ex: `BlockDefinition` em `contracts.ts`).
2. Introduzir camadas de tema (tokens) para remover cores estáticas.
3. Persistir overrides por step em store configurável (ex.: JSON separado ou DB).
4. Adicionar testes unitários para cada builder isolado.

---
Documento gerado automaticamente como parte da finalização da migração de blocks.
