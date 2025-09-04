# 🧭 Plano de Ação — Painel de Propriedades mais intuitivo e funcional

## 🎯 Objetivo
Deixar o Painel de Propriedades do /editor mais claro, rápido e seguro para configurar as questões (com foco em "options-grid" das Etapas 2–11), reduzindo cliques, evitando erros de validação e dando feedback em tempo real.

---

## ✅ Requisitos (alvo)
- Tornar edição de layout e opções mais intuitiva (como no print: Layout/Direção/Disposição + lista de opções com miniaturas).
- Editar propriedades críticas sem navegar por abas: seleção/validação, auto-avanço, pontuação, aparência.
- Operações em lote (duplicar/ordenar/importar/exportar opções com imagens).
- Feedback imediato no preview e validação inline.
- Acessível via teclado e com rótulos claros.

---

## 🗺️ Arquitetura da UI (nova IA do painel)
Organizar o painel em seções colapsáveis, com ordem e microcópias pensadas para tarefas reais:

1) Layout
- Layout (1 col / 2 col) — presets rápidos
- Direção: Vertical | Horizontal
- Disposição: Imagem | Texto | Imagem + Texto
- Responsividade: "Ajustar colunas no mobile" (toggle)

2) Seleção e Validação
- Seleções obrigatórias (required/min/max) com chips "Exatamente 3" / "Mín 1, Máx 3"
- Modo seleção múltipla (toggle)
- Feedback de validação + mensagem personalizada
- Contador de seleção (exibir/ocultar) e texto do progresso

3) Auto‑avanço
- Auto-avanço (toggle)
- Delay (ms) com presets: 250 / 800 / 1500
- Ajuda contextual: "Dê um tempo para o usuário revisar a escolha"

4) Pontuação
- Tabela 8 estilos (natural, classico, ...) com preenchimento automático de `scoreValues`
- Botão "Usar padrão (1 ponto)"
- Validação de consistência: alerta se alguma opção não tem score

5) Aparência
- Estilo de seleção: Border | Background | Glow
- Cores: selecionado/hover
- Espaçamento (gridGap)
- Tamanho da imagem (quando houver)

6) Opções (lista compacta)
- Miniatura + título + id
- Reordenar por arrastar (drag handle)
- Edição inline (duplo-clique) e modal avançado (ícone lápis)
- Ações em lote: duplicar, remover, colar múltiplas, upload múltiplo de imagens
- Gerador automático de IDs (ex.: `natural_q7`), com verificador de unicidade

7) Assistente
- Presets de questão: "Texto 1 coluna (8 op)", "Imagem 2 col (8 op)"
- "Aplicar padrão Etapas 2–11" (preenche required=3, auto‑advance=1.5s, scores=1)
- Dicas contextuais baseadas no tipo (texto vs imagem)

8) Ações
- Duplicar questão • Resetar para padrão • Exportar/Importar JSON • Ver histórico/Undo

---

## 🚀 Fases de Entrega

### Fase 0 — Diagnóstico rápido (0,5 dia)
- Mapear componentes do painel atual e eventos de sincronização com o preview.
- Levantar métricas de uso (quantos cliques, tempo para configurar, erros comuns).

### Fase 1 — Quick Wins (1–2 dias)
- Agrupar campos nas 6 seções acima (Layout, Seleção, Auto, Pontuação, Aparência, Opções).
- Presets visíveis (colunas, delay, seleção exata de 3) com 1 clique.
- Sticky header/footer do painel com título da etapa e status de validação.
- Contador "3/3 selecionadas" no próprio painel.

### Fase 2 — Editor de Opções (3–4 dias)
- Lista compacta com miniaturas, arrastar para reordenar, edição inline.
- Modal avançado da opção (imagem, texto, id, tag de estilo, pontuação).
- Bulk actions: colar lista (A…H), upload múltiplo, duplicar/remover múltiplas.
- Gerador/validador de IDs + preenchimento automático de `scoreValues` por estilo.

### Fase 3 — Regras e Pontuação (2–3 dias)
- Card de Seleção/Validação com chips de presets e validação em tempo real.
- Card de Pontuação com tabela 8 estilos e botão "Padrão (1)".
- Avisos automáticos: falta score, min>max, required>max.

### Fase 4 — UX avançada (2–3 dias)
- Presets completos de questão (texto/imagem). Aplicação com 1 clique.
- Duplicar etapa e Reset rápido.
- Preview lado a lado com destaque da mudança.

### Fase 5 — A11y & i18n (1–2 dias)
- Reordenar por teclado, labels ARIA, foco visível.
- Strings externas para tradução.

### Fase 6 — Telemetria, QA e Doc (2–3 dias)
- Eventos: “aplicou preset”, “editou opção”, “erros de validação prevenidos”.
- Testes e2e das operações críticas (Playwright): reordenar, editar inline, bulk paste.
- Guia rápido no painel (tooltip com "?" abre mini docs).

---

## 🔌 Integração Técnica

- Eventos do editor → preview: emitir `customEvent('editor:properties:update', { blockId, props })` com debounce (120ms) reutilizando `useOptimizedScheduler`.
- Validação: centralizar via `SelectionRules.computeSelectionValidity()` para refletir exatamente o runtime.
- Persistência: escrever via `TemplateManager` no bloco selecionado.
- Arquivos-alvo típicos:
  - `src/components/editor/quiz/*Properties*.tsx` (painel)
  - `src/components/editor/blocks/UniversalBlockRenderer.tsx`
  - `src/pages/QuizModularPage.tsx` (preview e eventos)
  - `src/services/core/FlowCore.ts` (regras) e `ResultEngine.ts` (resultado)

---

## 📏 Critérios de Sucesso (métricas)
- −40% no tempo médio para configurar uma questão com imagens (baseline vs pós‑mudança).
- −50% nos erros de validação (min/max/required inconsistentes).
- +30% na taxa de uso de presets e bulk actions.
- Satisfação (NPS) do editor > 8/10 em feedback interno.

---

## 🧩 Backlog (tickets atômicos)
- [ ] Criar seções do painel com colapsar/expandir e sticky header/footer.
- [ ] Chips de presets (Layout/Direção/Disposição/Delay/Seleção exata de 3).
- [ ] Lista de opções compacta com drag-and-drop e edição inline.
- [ ] Modal avançado da opção (inclui pontuação e tag de estilo).
- [ ] Bulk paste e upload múltiplo; gerador/validador de IDs.
- [ ] Card de Regras (required/min/max/múltipla) com validação ao vivo.
- [ ] Card de Pontuação com tabela dos 8 estilos e botão "Padrão (1)".
- [ ] Presets completos de questão + Duplicar/Reset etapa.
- [ ] Eventos de sincronização com preview + debounce.
- [ ] A11y (teclado/ARIA) + i18n strings.
- [ ] Telemetria e docs embutidas.

---

## 📝 Microcópias (sugestões)
- "Selecione exatamente 3 opções para continuar."
- "Auto‑avanço: damos 1,5s para você revisar a escolha."
- "IDs únicos ajudam a calcular corretamente os pontos."
- "Use o padrão das Etapas 2–11 para configurar tudo em 1 clique."

---

## ⚠️ Riscos e Mitigações
- Complexidade do painel → Dividir por fases e lançar primeiros ganhos rápido.
- Divergência preview x editor → Unificar regras via `SelectionRules` + testes e2e.
- Regressões de performance → Debounce/Throttle + lazy render de listas longas.

---

## 🧠 Observações finais
O plano mantém 100% de compatibilidade com o template unificado (`quiz21StepsComplete.ts`) e com o fluxo atual de auto‑avanço, validação e pontuação. Prioriza operações reais do dia a dia (ordenar, editar, duplicar, presets) e dá segurança com validação e feedback contínuos.
