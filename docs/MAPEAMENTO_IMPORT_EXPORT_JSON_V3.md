# 📦 Mapeamento Import/Export JSON v3.0 ↔ Editor

Este guia resume, de ponta a ponta, como o editor importa e exporta templates JSON v3.0, quais são os formatos envolvidos, onde ficam os conversores e qual é a ordem de resolução em runtime.

## Visão geral rápida

- Fonte canônica atual: Template TS normalizado (quiz21StepsComplete) exposto por `getQuiz21StepsTemplate()`.
- Preferência por Registry: quando um step está registrado no `TemplateRegistry` com o id `step-XX`, ele tem prioridade sobre o TS para esse step específico (via `getStepTemplate()` adicionado em `src/templates/imports.ts`).
- Import JSON v3 → Blocks: `BlocksToJSONv3Adapter.jsonv3ToBlocks()` (validação Zod aplicada no bridge/adaptador).
- Export Blocks → JSON v3: `BlocksToJSONv3Adapter.blocksToJSONv3()`.
- Upload/Download no editor: `ImportTemplateButton` e `QuizEditorBridge.exportToJSONv3()`/`importFromJSONv3()`.

## Fluxos 🔄

1) Editor → Exportar JSON v3
- Paso a paso:
  - Usuário edita blocos no editor.
  - `QuizEditorBridge.exportToJSONv3(funnelId)` busca os steps, converte cada `blocks[]` com `BlocksToJSONv3Adapter.blocksToJSONv3()` e gera um objeto `{ 'step-XX': JSONv3Template }`.
  - O JSON pode ser salvo em arquivo como `public/templates/step-XX-v3.json`.

2) Importar JSON v3 → Editor
- Paso a paso:
  - Upload do arquivo via `ImportTemplateButton` chama `quizEditorBridge.importFromJSONv3(json)`.
  - `BlocksToJSONv3Adapter.jsonv3ToBlocks()` converte `sections[]` → `blocks[]` do editor.
  - O editor recebe `blocks[]` e renderiza normalmente (EnhancedBlockRegistry).
  - Opcional: registrar no `TemplateRegistry` para que esse step passe a ser a fonte preferida no runtime.

3) Runtime (carregamento do step)
- Ordem de resolução do step `step-XX`:
  1. `TemplateRegistry.get('step-XX')` (se existir) → preferido (permite overrides vindos de JSON)
  2. `getQuiz21StepsTemplate()['step-XX']` → fallback (fonte TS normalizada)

- Implementado em `src/templates/imports.ts`:
  - `getStepTemplate(stepId)` retorna `{ step, source: 'registry' | 'ts' }`.
  - `loadTemplate(templateId)` retorna `{ template: completo (TS), step: preferindo Registry }`.

## Formatos de dados 📐

1) JSON v3.0 (por step)

- Arquivo típico: `public/templates/step-02-v3.json`
- Estrutura (resumo):
  - `templateVersion`: string ("3.0")
  - `metadata`: { id, name, description, category, tags, createdAt, updatedAt, author, ... }
  - `theme`: { colors, fonts, spacing, borderRadius }
  - `sections`: Array<{ type, id, content, style?, animation? }>
  - `validation`: Regras de validação do step
  - `navigation`: { nextStep, prevStep?, allowBack?, requiresUserInput?, autoAdvance?, autoAdvanceDelay? }
  - `analytics`: { events[], trackingId }

2) Blocks (Editor)
- Cada block possui: `{ id, type, order?, properties | content }` dependendo do componente.
- O EnhancedBlockRegistry resolve `type` → componente React.

## Conversores 🧠

- Arquivo: `src/adapters/BlocksToJSONv3Adapter.ts`

Principais métodos:
- `blocksToJSONv3(blocks, stepId, metadata?)` → JSON v3.0
- `jsonv3ToBlocks(json)` → Block[]

Mapeamentos de tipo (exemplos):
- Blocks → Sections
  - `text-inline` → `text-block`
  - `button-inline` → `button-primary`
  - `image-display-inline` → `image-display`
  - `progress-bar` → `progress-indicator`
  - `options-grid` → `options-grid`

- Sections → Blocks
  - `text-block` → `text-inline`
  - `button-primary` → `button-inline`
  - `image-display` → `image-display-inline`
  - `progress-indicator` → `progress-bar`
  - `options-grid` → `options-grid`

Tipos atômicos do questionário (v3) usados nos templates recentes e suportados pelo Editor:
- `question-progress`, `question-number`, `question-text`, `question-instructions`, `options-grid` (canônico), `question-navigation`.

Normalização de tipos:
- `src/utils/blockNormalization.ts` padroniza aliases como `options grid` → `options-grid` (canônico) para evitar falhas por variação de grafia.

## Pontos de integração 🔌

- `src/templates/imports.ts`
  - `getQuiz21StepsTemplate()` → retorna o template TS normalizado com `_source='ts'`.
  - `getStepTemplate(stepId)` → prefere Registry e cai para TS.
  - `loadTemplate(templateId)` → expõe `{ template, step }` com prioridade a Registry.
  - Em tempo de import, todos os `step-XX` do TS são registrados no Registry (com tipos normalizados) para consulta unificada.

- `src/services/TemplateRegistry.ts`
  - Registry singleton de templates por `id` (e.g., `step-02`).
  - Permite sobrescrever um step com conteúdo vindo de JSON.

- `src/services/QuizEditorBridge.ts`
  - `exportToJSONv3(funnelId)`/`importFromJSONv3(json)` realizam a conversão bidirecional.

- `src/components/editor/ImportTemplateButton.tsx`
  - UI para importar JSON v3.0 e aplicar no editor.

## Como forçar um step a usar o JSON v3 (override via Registry)

Se você quer que o runtime use o arquivo `public/templates/step-02-v3.json` para a etapa 2:

1) Carregue o JSON e converta para blocks:

```ts
import { TemplateRegistry } from '@/services/TemplateRegistry';
import BlocksToJSONv3Adapter from '@/adapters/BlocksToJSONv3Adapter';

async function overrideStep02FromJson() {
  const res = await fetch('/templates/step-02-v3.json');
  const json = await res.json();
  const blocks = BlocksToJSONv3Adapter.jsonv3ToBlocks(json);
  // Se necessário, envolva em um objeto step { blocks } ou registre os blocks diretamente conforme seu adapter consome
  TemplateRegistry.getInstance().register('step-02', { blocks });
}
```

2) A partir daí, `loadTemplate('step-02')` e fluxo de runtime usarão o step do Registry (source = `registry`).

Observação: se o seu adapter espera `sections` em vez de `blocks`, registre no formato adequado (a maioria dos paths atuais aceita `blocks`). Entradas HTML (ex.: `content.titleHtml`) passam por sanitização básica.

## Contratos mínimos ✅

- Import (JSON v3 → Editor):
  - Input: JSON v3 válido com `sections[]`.
  - Output: `Block[]` renderizáveis pelo EnhancedBlockRegistry.
  - O JSON é validado por Zod (`JSONv3TemplateSchema`) no `QuizEditorBridge`/adaptador.
  - Erros comuns: `type` desconhecido em `sections[]` → ver mapeamentos e normalização.

- Export (Editor → JSON v3):
  - Input: `Block[]` em ordem (usa `order` quando presente).
  - Output: JSON v3 com `sections[]`, `navigation` inferido (`nextStep`, `prevStep`) e `validation` derivada de blocks (ex.: `options-grid` com min/max).

## Dicas e pegadinhas ⚠️

- Tipos com hífen vs. espaço: `options-grid` vs. `options grid`. A normalização cobre o caso, mas mantenha um padrão.
- Atomic question blocks (v3): se criar JSON manualmente, prefira os 6 blocos atômicos: `question-progress`, `question-number`, `question-text`, `question-instructions`, `options-grid`, `question-navigation`.
- Ordem de blocos: para export, o adaptador usa `order` (se houver) para ordenar `sections`.
- Navegação/validação: o adaptador infere de `options-grid` e dos blocos de navegação.

## Onde procurar e alterar 🗺️

- Conversores: `src/adapters/BlocksToJSONv3Adapter.ts`
- Registry: `src/services/TemplateRegistry.ts`
- Loader/entrypoint: `src/templates/imports.ts`
- UI de import/export: `src/components/editor/ImportTemplateButton.tsx`, `src/services/QuizEditorBridge.ts`
- Normalização de tipos: `src/utils/blockNormalization.ts`

---

Com isso, a estrutura fica clara: JSON v3 é um formato de interoperabilidade; o editor trabalha em Blocks; os conversores fazem a ponte; e o Registry permite escolher por step se a fonte será JSON v3 ou TS, sem mudar consumidores.
