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
