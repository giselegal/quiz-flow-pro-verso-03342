# Relatório Consolidado — Editor `/editor`

> Atualizado em 28 de setembro de 2025.
>
> *Assumimos que o pedido "faça um md disso tudo" refere-se a consolidar em um único documento a análise técnica, o plano de implementação (tickets) e o roteiro de verificação QA já preparados anteriormente.*

---

## 1. Resumo executivo
- Três engines de editor convivem no código (`EditorContext` legado, stack Builder, rota unificada), causando colisões de hooks (`useEditor`) e estados.
- Navegação de etapas e preview dependem de estruturas nunca populadas (`realStages`) e imports incompatíveis (`require` em ambiente Vite/ESM).
- O CRUD unificado expõe operações críticas ainda mockadas, impactando fluxo de salvar/duplicar/publicar.
- Diversos componentes/UI duplicados e acessos diretos a `window`/`localStorage` elevam risco de regressões, especialmente em SSR/testes.
- Recomenda-se consolidar provider único, estabilizar pipeline de etapas/preview, finalizar CRUD real e endurecer guardas/observabilidade antes de evoluções UI.

---

## 2. Mapa da arquitetura atual

| Camada | Arquivos principais | Situação observada |
| --- | --- | --- |
| Editor clássico | `src/context/EditorContext.tsx`, diretório `EditorPro/components/*` | Mantém `TemplateManager` e ações de estágio, porém arrays (`stages`, `realStages`) não são preenchidos. |
| Stack Builder/Unified | `src/components/editor/EditorProvider.tsx`, `PureBuilderProvider.tsx`, `EditorProUnified.tsx` | Controla `stepBlocks` e exporta `useEditor`, colidindo com contexto clássico. |
| Rota principal `/editor` | `src/pages/editor/ModernUnifiedEditor.tsx` | Empilha providers (`UnifiedCRUDProvider`, `FunnelMasterProvider`) e usa `window`/`localStorage` sem guardas. |
| Serviços auxiliares | `src/components/editor/providers/UnifiedCRUDProvider.tsx`, `useUnifiedEditor.ts`, `services/EditorDashboardSyncService.ts` | Métodos essenciais estão em TODO/mock (ex.: `deleteFunnel`, `saveFunnel`). |

---

## 3. Gargalos críticos e impactos
1. **Providers duplicados** — Imports inconsistentes quebram estado do editor e confundem DX.
2. **Pipeline de etapas vazio** — Componentes precisam de gambiarras, preview fica instável.
3. **Preview em ESM** — Uso de `require` gera erro "require is not defined" e bloqueia testes.
4. **CRUD mockado** — Usuário acredita que salvou, mas backend não recebe os dados.
5. **APIs de navegador sem guardas** — SSR/tests headless falham; risco de regressão móvel.
6. **UI duplicada** — Toolbar, sidebar e painéis possuem versões paralelas, dificultando evolução.
7. **Observabilidade ausente** — Falta telemetria real para monitorar uso/erros.

---

## 4. Backlog recomendado (tickets)

| ID | Título | Objetivo | Resultado esperado |
| --- | --- | --- | --- |
| TK-01 | Unificar providers e hooks | Nomear `useEditor` legado vs unificado, remover instâncias paralelas e padronizar provider raiz. | Apenas um provider ativo, sem warnings de contexto duplicado.
| TK-02 | Reativar pipeline de etapas | Popular `realStages`, implementar `stageActions` reais e alinhar `stepHasBlocksRecord`. | Navegação consistente, sem gambiarras de tamanho fixo.
| TK-03 | Corrigir preview ESM | Substituir `require` por `import` dinâmico/estático e revisar `UnifiedPreviewEngine`. | Preview carrega sem erros em dev/build/SSR.
| TK-04 | Finalizar CRUD unificado | Implementar `saveFunnel`, `deleteBlock`, `reorderStages`, `deleteFunnel` com integrações reais/fallbacks. | Operações persistem dados ou exibem fallback claro.
| TK-05 | Harden de ambiente | Envolver acessos a `window`/`localStorage` em guardas e mover lógicas para `useEffect`. | Editor executa em SSR/tests sem `ReferenceError`.
| TK-06 | Consolidar UI principal | Escolher versão canônica de toolbar/sidebar/painéis e arquivar duplicatas. | Bundle carrega apenas componentes ativos; estilos consistentes.
| TK-07 | Instrumentar observabilidade | Substituir `console.log` por eventos/telemetria e expor métricas-chave. | Time consegue monitorar erro, uso e tempo de resposta.

---

## 5. Roteiro de verificação QA (pós-implantações)

### Preparação
- Usar build recente em homologação (ou branch equivalente), limpar cache e ter funis de teste (vazio e com 5+ etapas).

### 1. Consolidação de providers
- Inspecionar React DevTools: garantir apenas um `EditorProvider` ativo.
- Rodar `window.__EDITOR_DEBUG__?.activeProviders` (quando disponível) e validar retorno único.

### 2. Pipeline de etapas
- Abrir funil existente, conferir etapas reais na sidebar.
- Criar e remover etapas verificando atualização de `realStages` e do preview.

### 3. Preview e importação ESM
- Ativar modo preview; não deve aparecer erro "require is not defined".
- Editar propriedades e observar atualização ≤150 ms.
- Simular falha 500 no serviço de dados e verificar fallback amigável.

### 4. CRUD unificado
- Criar funil, renomear, duplicar etapas e salvar; recarregar página e garantir persistência.
- Testar `deleteBlock`, `reorderStages`, `deleteFunnel` e revisar mensagens exibidas.
- Monitorar chamadas ao `funnelUnifiedService`; sem `TODO`/timeouts fictícios.

### 5. Guardas de ambiente
- Executar testes SSR/headless (ex.: Cypress component). Nenhum `ReferenceError` relativo a `window`/`localStorage`.

### 6. UI e componentes únicos
- Comparar toolbar, sidebar e painel de propriedades em desktop/mobile; confirmar ausência de duplicatas legadas.
- Verificar relatório de bundle (quando disponível) para garantir remoção de componentes arquivados.

### 7. Observabilidade e feedback
- Ações críticas (Salvar, Publicar, Sincronizar) devem gerar toasts e eventos de telemetria.
- Falhas de rede precisam informar usuário com opção de retry.

### 8. Regressão rápida
- Rodar `npm run test:editor` (ou suíte equivalente) e validar sucesso.
- Realizar smoke test mobile (≤768 px) assegurando preview funcional.

**Critérios de aprovação:** ausência de erros críticos no console, persistência real de dados, preview estável, UI unificada e telemetria funcional.

---

## 6. Próximos passos sugeridos
- Documentar contrato público do provider único (`useEditor`), expondo métodos suportados.
- Implementar feature flags para rollout controlado das mudanças críticas.
- Planejar evolução do painel de propriedades com base no plano em `docs/PAINEL_PROPRIEDADES_PLANO_ACAO.md`.

---

## 7. Referências
- `ANALISE_EDITOR_COMPLETA.md` — análise detalhada original.
- `docs/PAINEL_PROPRIEDADES_PLANO_ACAO.md` — roadmap específico para o painel de propriedades.
- Tickets TK-01..TK-07 — correspondem ao backlog acima.
