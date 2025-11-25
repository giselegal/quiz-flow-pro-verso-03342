# 📐 Plano de Arquitetura — Dynamic Property Renderer

> Referências: `docs/análise/ANALISE_EDITOR_ESTRUTURA_COMPLETA.md`, `docs/reports/RELATORIO_FINAL_PAINEL_PROPRIEDADES.md`, `docs/PAINEL_PROPRIEDADES_PLANO_ACAO.md`, `docs/análise/DIAGNOSTICO_PAINEL_PROPRIEDADES.md`

## 1. Objetivos do redesign

1. **Cobertura completa de tipos** — aceitar 150+ tipos do `BlockRegistry`, incluindo blocos compostos (option grids, CTA, navegação, layouts e containers).
2. **Schema dinâmico** — gerar UI a partir de `BlockDefinition.properties`, sem necessidade de codificar controles manualmente.
3. **Validação incremental** — derivar Zod schemas dos `BlockPropertyDefinition` com mensagens em tempo real, preview temporário e bloqueio de "Aplicar" quando inválido.
4. **UX avançada** — agrupamento por categoria, preview inline, ações em lote, acessibilidade (atalhos, aria, focus ring), feedback visual consistente.
5. **Extensibilidade** — editores especializados para casos complexos, mas com fallback genérico.

## 2. Componentes propostos

### 2.1 `useBlockDefinition`
- Hook que resolve o schema oficial do bloco.
- Fonte única: `BlockRegistry.getDefinition(type)` ou `schemaInterpreter` como fallback.
- Normaliza defaults e categorias.

```ts
interface UseBlockDefinitionResult {
  definition: BlockDefinition | null;
  zodSchema: z.ZodObject<any> | null;
  fields: DynamicFieldDefinition[]; // já expandidos com metadata
}
```

### 2.2 `DynamicPropertyRenderer`
- Recebe `{ block, draft, definition, errors, onFieldChange }`.
- Itera sobre `fields` e delega para `PropertyControlFactory`.
- Controla agrupamento, colapsáveis, badges de obrigatoriedade, tooltips.
- Emite eventos `onDirtyChange`, `onPreviewChange` para integrar com Canvas.

### 2.3 `PropertyControlFactory`
- Mapeia `PropertyTypeEnum` + `controlHints` → componente.
- Suporta tipos atuais e novos: `text`, `textarea`, `number`, `boolean`, `color`, `url`, `select/multiselect`, `range`, `json`, `array`, `object`, `options-grid`, `media`, `layout-grid`, `actions`.
- Fallback genérico (`JsonEditorControl`).

### 2.4 `ValidationBridge`
- Converte `BlockPropertyDefinition` → Zod schema.
- Regras suportadas: obrigatório, min/max, regex (`pattern`), enums (`validation.options`), validações compostas (via `customValidators` definidas no registry).
- Integra com `useDraftProperties` para destacar erros na UI e bloquear o commit.

### 2.5 `PreviewSyncAdapter`
- Aplica draft em memória (apenas no canvas) antes de clicar "Aplicar".
- Usa `useWYSIWYGBridge.previewDraft(blockId, properties)`.
- Reverte automaticamente em `cancelDraft`.

### 2.6 `BatchActionsPanel`
- UI secundária para editar múltiplos blocos compatíveis.
- Mostra apenas campos comuns.
- Opera sobre `useDraftProperties` estendido para array de blocos.

## 3. Fluxo de dados (single block)

```
Canvas (seleção)
   ↓ selectedBlock
PropertiesColumn
   ↓ useBlockDefinition(type)
DynamicPropertyRenderer
   ↓ PropertyControlFactory
Controls → onFieldChange → useDraftProperties → ValidationBridge
   ↘ PreviewSyncAdapter → Canvas preview
```

## 4. Contratos principais

```ts
interface DynamicPropertyRendererProps {
  block: Block;
  draft: Record<string, any>;
  definition: BlockDefinition;
  zodSchema: z.ZodTypeAny;
  errors: Record<string, string>;
  onFieldChange: (key: string, value: any) => void;
  onPreviewChange?: (properties: Record<string, any>) => void;
}

interface DynamicFieldDefinition extends BlockPropertyDefinition {
  control?: 'text' | 'textarea' | 'number' | 'color' | 'toggle' | 'select' | 'multiselect' | 'range' | 'json' | 'options' | 'media' | 'layout';
  group?: 'content' | 'style' | 'behavior' | 'advanced' | string;
  ui?: {
    icon?: ReactNode;
    description?: string;
    actions?: Array<'duplicate' | 'reset' | 'randomize'>;
  };
}
```

## 5. Estratégia de validação

1. **Mapping simples** — `PropertyTypeEnum.TEXT` → `z.string()`, `NUMBER` → `z.number()`, etc.
2. **Constraints extras** — `min`, `max`, `pattern`, `options` → encadeadas no Zod.
3. **Campos compostos** — `ARRAY` e `OBJECT` usam `z.array(z.object(...))`, aproveitando metadata opcional no registry.
4. **Hooks customizados** — cada `BlockDefinition` pode expor `validators` (funções) para validar combinações (ex: `minSelected <= maxSelected`).
5. **Resultado** — `useDraftProperties` recebe `zodSchema`, retornando `errors` em tempo real.

## 6. Roadmap de entrega incremental

1. **Wave A** — Hook + renderer básico (text/textarea/number/boolean/color/select) + integração com `PropertiesColumn`.
2. **Wave B** — Controles avançados (arrays, options grid, media picker, layout editors) + preview.
3. **Wave C** — Batch editing, operações em lote e acessibilidade.
4. **Wave D** — Testes E2E e documentação final.

## 7. Métricas de sucesso
- 100% dos blocos registrados exibem propriedades automaticamente.
- 0 regressões nos testes E2E (`properties-panel.spec.ts`, `properties-panel-edit.spec.ts`).
- 90% das validações cobertas por mensagens inline.
- Diminuição de 80% nos tickets "não aparece campo X" (dados da doc `RELATORIO_FINAL_PAINEL_PROPRIEDADES.md`).

---
**Próximo passo:** implementar Wave A — criar `useBlockDefinition`, `DynamicPropertyRenderer` e conectar `PropertiesColumn` usando `BlockRegistry` em vez de `schemaInterpreter` legado.
