# Template Engine API (MVP)

Rotas sob `/api/templates`.

## Listar drafts
GET /api/templates
Response: `[ { id, slug, name, updatedAt, draftVersion } ]`

## Criar template base
POST /api/templates
Body: `{ "name": "Quiz X", "slug": "quiz-x" }`
Response: `{ id, slug }`

## Obter draft completo
GET /api/templates/:id
Response: `TemplateDraft`

## Atualizar metadados
PATCH /api/templates/:id/meta
Body (qualquer subset): `{ name?, description?, tags?, seo?, tracking? }`
Response: `TemplateMeta`

## Adicionar stage
POST /api/templates/:id/stages
Body: `{ type: "question", afterStageId?: "stage_intro", label?: "Pergunta 2" }`
Response: `Stage`

## Reordenar stages
POST /api/templates/:id/stages/reorder
Body: `{ orderedIds: ["stage_intro","stage_q1","stage_result"] }`
Response: `Stage[]`

## Atualizar stage
PATCH /api/templates/:id/stages/:stageId
Body: `{ enabled?, type?, meta? }`
Response: `Stage`

## Remover stage
DELETE /api/templates/:id/stages/:stageId
Response: `{ ok: true }`

## Definir outcomes
PUT /api/templates/:id/outcomes
Body: `{ outcomes: [ { id?, minScore?, maxScore?, template } ] }`
Response: `Outcome[]`

## Atualizar scoring
PATCH /api/templates/:id/scoring
Body: `{ mode?, weights? }`
Response: `ScoringConfig`

## Definir branching
PUT /api/templates/:id/branching
Body: `{ rules: BranchingRule[] }`
Response: `BranchingRule[]`

## Validar draft
POST /api/templates/:id/validate
Response: `{ errors: [...], warnings: [...] }`

## Publicar
POST /api/templates/:id/publish
Response: `{ id, version, publishedAt }`

## Preview runtime draft
POST /api/templates/:id/runtime/preview/start
Response: `{ sessionId, currentStageId }`

> Nota: Execução de resposta de runtime draft ainda não exposta (somente published possui answerRuntime pelo slug). Pode ser adicionada: `POST /api/templates/:id/runtime/preview/answer` se necessário.

## Próximos incrementos sugeridos
- Endpoint answer runtime published/draft unificado
- Diff publish vs draft
- History / rollback
- Lock otimista (If-Match: draftVersion)

---

## Integração Frontend (/template-engine)

Foi adicionada uma rota SPA específica em `/template-engine` (a rota antiga `/editor/template-engine` agora redireciona) que consome estes endpoints e permite:

### Capacidades atuais UI
- Listar templates (GET /api/templates)
- Criar template base (POST /api/templates)
- Abrir draft e visualizar metadados + stages
- Editar nome e descrição (PATCH /:id/meta)
- Adicionar stage (POST /:id/stages)
- Reordenar stages (POST /:id/stages/reorder)
- Ver status de validação (POST /:id/validate – disparado via hook)
- Publicar (POST /:id/publish)

### Hooks React Query criados
Arquivo: `src/api/templates/hooks.ts`
- useTemplatesList()
- useTemplateDraft(id)
- useCreateTemplate()
- useUpdateMeta(id)
- useAddStage(id)
- useReorderStages(id)
- useSetOutcomes(id)
- useSetScoring(id)
- useSetBranching(id)
- useValidateDraft(id)
- usePublish(id)
- usePreviewStart(id)

### Componentes principais
Local: `src/components/editor/templates/`
- TemplateEngineList.tsx – tabela de drafts + criação
- TemplateEngineEditor.tsx – edição básica (meta, stages, validação, publish)
- TemplateEnginePage.tsx – container que alterna lista/editor

### Extensões futuras planejadas na UI
- Abas para Outcomes / Scoring / Branching
- Preview (iniciar sessão draft e simular respostas)
- Exibição do diff antes de publicar
- Lock otimista usando draftVersion e cabeçalho If-Match
- Histórico de publicações e rollback

### Convenções de Estado
- React Query controla cache e invalidação
- `draftVersion` incrementa a cada mutação (server) – pronto para servir como ETag
- Validação é refetch manual (hook com staleTime curto)

### Boas práticas de uso (exemplo mínimo)
```tsx
import { useTemplateDraft, useUpdateMeta } from '@/api/templates/hooks';

function MetaEditor({ id }: { id: string }) {
	const { data: draft } = useTemplateDraft(id);
	const updateMeta = useUpdateMeta(id);
	if (!draft) return null;
	return <input defaultValue={draft.meta.name} onBlur={e => updateMeta.mutate({ name: e.target.value })} />;
}
```

---

## Fluxo UI resumido
1. Usuário acessa `/editor/template-engine` → lista chama GET /api/templates
2. Cria novo template → POST; invalida list; abre item
3. Edição de meta → PATCH; invalida detail + list
4. Adição / reorder de stages → mutações e invalidação do draft
5. Hook de validação obtém erros (se existirem) antes do publish
6. Publish só habilitado quando não há errors → snapshot versão incrementada

---

## Próximos passos recomendados backend+frontend
1. Implementar endpoint answer preview (draft) e UI de simulação
2. Outcomes editor (CRUD + ordenação + normalização visual)
3. Branching visual builder (árvore condicional)
4. Diff publish vs draft (servidor gera delta simples: added/removed/changed)
5. ETag / If-Match para evitar overwrite concorrente
6. Histórico (append no publish + viewer na UI)

