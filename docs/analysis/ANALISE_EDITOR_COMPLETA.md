# Análise Completa do Sistema de Editor

## Visão Geral

- **Escopo analisado:** diretório `src/components/editor/**/*`, contexto global em `src/context/EditorContext.tsx`, provedores alternativos (`EditorProvider`, `PureBuilderProvider`, `UnifiedCRUDProvider`) e a rota consolidada `src/pages/editor/ModernUnifiedEditor.tsx`.
- **Objetivo:** mapear a arquitetura real em código, identificar gargalos estruturais e pontos cegos que impedem o editor de operar 100%.
- **Síntese:** a base atual reúne pelo menos três engines diferentes de editor, múltiplos providers concorrentes e integrações inacabadas. Há conflitos diretos de estado, funcionalidades críticas marcadas como TODO e dependências desacopladas sem guardas.

## Topologia Ativa do Editor

| Camada | Arquivos principais | Observações |
| --- | --- | --- |
| **Editor clássico** | `src/context/EditorContext.tsx` + `EditorPro/components/*` | Usa `TemplateManager`/`stageActions`. `stages` permanece vazio, exigindo gambiarras nos componentes.
| **Builder System / EditorProUnified** | `src/components/editor/EditorProvider.tsx`, `PureBuilderProvider.tsx`, `EditorProUnified.tsx` | Carrega templates via `unifiedTemplateService`, controla `stepBlocks`. Exporta `useEditor`, colidindo com o contexto anterior.
| **Rota principal /editor** | `src/pages/editor/ModernUnifiedEditor.tsx` | Empilha `UnifiedCRUDProvider` + `FunnelMasterProvider` + `EditorProUnified`. Usa `window` diretamente, espera CRUD unificado e modo "Real Experience".
| **Serviços auxiliares** | `UnifiedCRUDProvider.tsx`, `useUnifiedEditor.ts`, `EditorDashboardSyncService.ts` | Vários métodos são mocks ou TODO. Dependem de `funnelUnifiedService`, `UnifiedDataService`, etc., nem sempre disponíveis.

## Gargalos Críticos (Alta Prioridade)

1. **Conflito de providers e hooks duplicados**  
   - `useEditor` existe em `@/context/EditorContext` **e** em `@/components/editor/EditorProvider`. Quem importa o hook errado quebra silenciosamente.  
   - `PureBuilderProvider` e `EditorProUnified` dependem da versão "builder"; `ModularEditorPro` espera o contexto "global".

2. **Navegação de etapas inconsistente**  
   - Em `EditorContext.tsx`, o array `realStages` nunca é populado; `stageActions.addStage/removeStage` são no-op.  
   - `ModularEditorPro` usa `Math.max(21, context.stages.length)` para mascarar o vazio, mas `stepHasBlocksRecord` marca todas as etapas como "sem conteúdo".

3. **Preview quebra em runtime**  
   - `UnifiedPreviewEngine.tsx` usa `require('./InteractivePreviewEngine')` num projeto Vite/ESM, causando "require is not defined" no navegador.  
   - O modo preview do `EditorCanvas` depende desse import.

4. **Hook unificado incompleto**  
   - `useUnifiedEditor.ts` retorna placeholders: `deleteFunnel` retorna `false`, `deleteBlock`/`reorderStages` são TODO, `saveFunnel` simula `setTimeout`.  
   - Mesmo assim, `ModernUnifiedEditor` espera que essas operações sejam reais (CRUD, undo/redo, result metrics).

5. **Dependências críticas mockadas ou sem fallback**  
   - `UnifiedCRUDProvider` chama `funnelUnifiedService`, `enhancedFunnelService`, `normalizeFunnelId`; ausência dessas implementações derruba todo o carregamento.  
   - `EditorDashboardSyncService` usa `UnifiedDataService.saveFunnel`, `crypto.randomUUID()` e toasts; sem backend funcional, a sincronização falha silenciosamente.

6. **Uso direto de APIs de navegador em rotas**  
   - `ModernUnifiedEditor` chama `window.location` dentro de `useMemo`. Em SSR ou testes, gera ReferenceError.  
   - Diversos componentes (`useResizableColumns`, `CanvasDropZone.simple`) leem `localStorage`/`window` sem checar ambiente.

## Pontos Cegos Operacionais

- **Estado "Real Experience" incompleto:** `ModernUnifiedEditor` ativa `realExperienceMode`, mas `EditorProUnified` delega ao `PureBuilder` que não repassa esse estado ao `InteractivePreviewEngine` global; comportamento final é imprevisível.
- **Observabilidade inexistente:** logs abundantes (`console.log`) mas sem guardas; não há telemetry real. Serviços prometem analytics/cache mas não expõem métricas.
- **Fallbacks silenciosos:** `PureBuilderProvider` tenta carregar templates em paralelo; ao falhar, cria blocos "fallback" estáticos, mascarando a falta de dados reais.
- **Duplicação de UI:** sidebars (`ComponentsSidebar`), toolbars e painéis de propriedades têm versões paralelas (`components/` vs `EditorPro/components/`); difícil garantir consistência.
- **Carregamento em cascata:** `ModernUnifiedEditor` empilha `Suspense` dentro de `Suspense` no fallback, o que não é suportado. Pode travar o boundary inicial.

## Impactos

- **Manutenibilidade:** qualquer refatoração toca múltiplos providers. Import errado provoca bugs intermitentes.
- **Performance:** bundle carrega dois engines completos + serviços de IA, mesmo se metade não for usada.
- **Confiabilidade:** botões críticas (Salvar, Duplicar, Publicar) dependem de serviços mockados. Usuário pode achar que salvou sem persistir.
- **DX:** desenvolvedores enfrentam logs enormes e nomes repetidos; é difícil saber qual fonte de verdade usar.

## Recomendações Prioritárias

1. **Escolher e padronizar um provider/site de estado.**  
   - Renomear hooks (`useLegacyEditor`, `useBuilderEditor`) e encapsular os demais via adaptadores.  
   - Desligar modules mortos (`PureBuilderProvider_backup`, `.broken`).

2. **Corrigir pipeline de etapas/previews.**  
   - Implementar `realStages` e `stageActions` reais no `EditorContext`.  
   - Substituir `require` por `await import` ou import estático em `UnifiedPreviewEngine`.

3. **Finalizar (ou isolar) o CRUD unificado.**  
   - Implementar de fato `useUnifiedEditor` antes de expor na UI.  
   - Garantir que `UnifiedCRUDProvider` tenha fallbacks claros quando `funnelUnifiedService` não estiver configurado.

4. **Rever rota `/editor`.**  
   - Proteger acessos a `window` e `localStorage`.  
   - Simplificar `Suspense` aninhados; garantir fallback funcional.

5. **Higienizar duplicações.**  
   - Manter apenas uma versão de `ComponentsSidebar`, `EditorToolbar`, `EditorCanvas`.  
   - Mover backups para `archive/` ou removê-los do bundle.

## Próximos Passos Sugeridos

1. **Auditoria de imports**: mapear quem usa `useEditor` e corrigir para o provider escolhido.  
2. **Testes rápidos**: rodar o editor em modo preview e verificar erros de runtime (`require`, `window`).  
3. **Mapa de serviços**: documentar status real de `funnelUnifiedService`, `UnifiedDataService`, IA, Supabase.  
4. **Roadmap de consolidação**: definir qual engine serve produção e planejar migração/remoção das demais.

---

> Esta análise foi produzida exclusivamente a partir do código-fonte vigente, sem recorrer às documentações em markdown existentes no repositório.
