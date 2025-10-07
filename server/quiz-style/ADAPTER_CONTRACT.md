## Adapter Legacy quiz-style -> TemplateEngine (Contrato Inicial)

Este documento descreve o mapeamento mínimo (Nível 1 - read-only) entre o modelo legacy do quiz de estilo (arquivos JSON em `public/templates/quiz-steps/*.json` e/ou template completo `src/templates/quiz21StepsComplete.ts`) e o `TemplateDraft` do novo Template Engine.

### Objetivo (Fase Atual)
Permitir visualizar um funil legacy dentro do Template Engine sem persistir nem publicar alterações (somente leitura), retornando um objeto `TemplateDraft` sintético.

### Fontes Legacy Consideradas
1. Arquivos step JSON: `public/templates/quiz-steps/etapa-*.json` (contêm blocks, metadata, navigation básica e opções)
2. (Futuro) Estrutura consolidada `QUIZ_STYLE_21_STEPS_TEMPLATE` para enriquecer com mais blocos/contexto.

### Heurísticas de Mapeamento (Nível 1)
| Aspecto Legacy | TemplateDraft | Regra / Observação |
|----------------|---------------|--------------------|
| Step (etapa-X) | Stage | `id = stage_{index}`; `order = index`; `type`: 1ª etapa = `intro`; última = `result`; demais = `question` |
| Blocks array (por step) | Component único por stage | Componente sintético `legacyBlocksBundle` contendo todos os blocks do step em `props.blocks` |
| Block específico (ex: QuizContentIntegration) | (inside props) | Nenhuma decomposição ainda (modularização vem depois) |
| Opções (question.data.options) | (mantidas em props) | Não gera componentes individuais. |
| Navegação / integration.nextStep | Ignorado (por enquanto) | Fluxo linear sequencial pela ordem dos stages. |
| Pontos / scoring (points) | Scoring.weights | Não aplicado no Nível 1 (score ficará 0). |
| Categorias de estilo (styleCategory) | Outcomes (futuro) | Nesta fase outcomes placeholder (baixo / alto). |
| SEO / Tracking | meta.seo / meta.tracking | Preenchidos parcialmente com defaults. |
| Histórico | history[] | Vazio. |

### Estrutura Gerada (Resumo)
```
TemplateDraft {
  meta: { name, slug, description?, tags: ['legacy','quiz-style'], seo: {}, tracking: {} },
  stages: [ { id, type, order, componentIds:[cmpId] } ... ],
  components: { cmpId: { id, type:'legacyBlocksBundle', props:{ blocks:[...] } } },
  logic: { scoring: { mode:'sum', weights:{}, normalization:{ percent:true } }, branching: [] },
  outcomes: [ { id:'out_default', minScore:0, maxScore:9999, template:'Resultado placeholder (score {{score}})' } ],
  status:'draft'
}
```

### Futuras Extensões (Próximas Fases)
1. Extração de cada pergunta/opção em componentes estruturados (StageComponent granulares)
2. Geração de pesos automáticos por opção e outcomes por faixas / categorias
3. Interpretação de `integration.conditionalLogic` em regras de branching
4. Round-trip (applyDraftDelta) para gravar alterações de volta ao formato legacy

### Limitações Explícitas (Nível 1)
* Sem persistência: cada chamada reconstrói o draft.
* Sem suporte a remoção/inserção persistente de stages.
* Scoring sempre 0 (outcomes placeholders).
* Sem validação específica do legacy além de carregamento de JSON.

---
Versão do contrato: 0.1.0 (read-only)
