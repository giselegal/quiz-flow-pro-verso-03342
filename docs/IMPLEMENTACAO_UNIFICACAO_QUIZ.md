# Unificação Quiz: Canonical JSON → Service → Editor

## Objetivo
Eliminar divergências e consolidar uma única fonte de verdade (canonical `quiz-definition`) alimentando:
- `QuizPageIntegrationService`
- Estado interno do editor (`QuizEditorMode` + store normalizada)
- Painel de Propriedades unificado (substituir versões duplicadas)

## Situação Atual (Resumo)
| Camada | Origem Atual | Problema |
|--------|--------------|----------|
| Canonical Steps | `domain/quiz/quiz-definition.ts` | Fonte correta já existente |
| Adaptador Legacy | `data/quizSteps.ts` | OK para compatibilidade; expõe `QUIZ_STEPS` |
| Service Funnel Seed | `QuizPageIntegrationService.createDefaultQuizFunnel` | DUPLICA conteúdo, não usa canonical |
| Painel Propriedades (A) | `components/editor/panels/QuizPropertiesPanel.tsx` | Gera mocks locais, ignora canonical |
| Painel Propriedades (B) | `components/editor/quiz/QuizPropertiesPanel.tsx` | Versão simplificada; sem imagens/scoring |
| Estilos | `data/styles.ts` (`styleConfigGisele`) | Não integrados ao painel |
| Scoring | Apenas lista de estilos + defaultWeight | Matriz inexistente na UI |
| Offers | Variants ricas no canonical | Não editáveis no painel |

## Principais Gaps
1. Seed duplicado vs canonical.
2. Painéis não consomem dados realistas (imagens, requiredSelections, variants).
3. Ausência de scoring matrix editable.
4. Ausência de hash/integridade dinâmica (invalidar cache quando canonical muda).
5. Nenhum binding progress (countedStepIds) para exibir progresso real.

## Estratégia (Fases Incrementais)
### Fase 1 – Fundamento (este PR)
- Criar util `canonicalQuizAdapters.ts` com função `canonicalToFunnelComponents(definition)`.
- Refatorar `QuizPageIntegrationService.createDefaultQuizFunnel` para usar o adapter.
- Marcar antigo array inline como deprecado (comentário JSDoc). 
- Não alterar ainda UI do painel (reduz risco). 

### Fase 2 – Estado do Editor
- Assegurar que carregamento inicial do editor, se não houver draft, deriva do canonical (já parcialmente feito via builder; alinhar).
- Mapear cada step canonical → `QuizQuestionEditable` mantendo campos: `requiredSelections`, `options.image`, `type`.

### Fase 3 – Unificação Painel
- Remover painel duplicado.
- Novo painel lê diretamente questions/styles do store normalizado.
- Exibir e permitir editar: título/questão, opções (texto + imagem), requiredSelections, ordem.

### Fase 4 – Scoring Matrix
- Introduzir `scoring.matrix` (stepId -> optionId -> styleId -> weight).
- UI: tabela dinâmica; defaults = `defaultWeight` se opção/style compatível.

### Fase 5 – Offers & Strategic Mapping
- UI para visualizar e editar `variants` + `matchQuestionId`.
- Indicar quais strategic steps alimentam oferta (tag).

### Fase 6 – SEO / Tracking / Progress
- Abas adicionais: SEO (title, desc, keywords), Tracking (event toggles), Progress (marcar countedStepIds), Readonly integrity hash.

### Fase 7 – Integrity & Versioning
- Calcular hash (SHA-256) do JSON canonical + matrix + variants → atualizar `integrity.hash`.
- Comparar versão para invalidar cache de persistência local.

## Decisões Técnicas
- Adapter evita espalhar parsing; single transformation point.
- Mantemos `quizSteps.ts` enquanto legado chamar; internamente continua apontando para canonical (já faz isso) – sem breaking changes.
- Service passa a refletir canonical -> funnels salvos representam snapshot + diffs (futuro: armazenar somente delta).
- Scoring matrix: armazenada em `QuizTemplateData.scoring.matrix` evitando alterar canonical base.

## Contratos Principais
Adapter Output Component:
```
{
  id: string;
  type: 'intro'|'question'|'strategic-question'|'transition'|'transition-result'|'result'|'offer';
  name: string; // derivado de title/questionText/índice
  description: string;
  step: number; // ordem natural
  isEditable: boolean;
  properties: { requiredSelections?; matchQuestionId?; };
  styles: Record<string, any>; // placeholder (não modifica canonical agora)
  content: {
    title?: string; questionText?: string; options?: { id; text; image? }[];
    variants?: any[]; buttonText?: string;
  };
}
```

## Riscos / Mitigações
| Risco | Mitigação |
|-------|-----------|
| Quebra de testes que dependem do seed antigo | Manter ids/ordem idênticos na transformação |
| Divergência de nomes `strategic` vs `strategic-question` | Normalizar type no adapter; service preserva canonical type |
| Futuros campos novos no canonical não mapeados | Adapter genérico passa campos conhecidos + guarda resto em `properties.__raw` |

## Métricas de Sucesso (Fase 1)
- Service cria funnel com total de steps = `definition.steps.length`.
- IDs resultantes idênticos aos do canonical.
- Nenhum uso restante de array literal antigo (grep confirma).

## Checklist Fase 1
- [ ] Criar `canonicalQuizAdapters.ts`
- [ ] Refatorar `createDefaultQuizFunnel`
- [ ] Atualizar comentários depreciação
- [ ] Executar testes básicos (build + grep)

## Próximas Fases (fora deste commit inicial)
Documentadas acima; cada uma vira PR incremental.

---
_Arquivo gerado automaticamente como base de implementação._
