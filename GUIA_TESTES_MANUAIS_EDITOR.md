# 🧪 GUIA DE TESTES MANUAIS - EDITOR QUIZ

**Objetivo:** Validar correção do hook condicional e funcionalidades do editor  
**Tempo Estimado:** 30-45 minutos  
**Pré-requisito:** Servidor dev rodando (`npm run dev`)

---

## 🚀 PREPARAÇÃO

### 1. Iniciar Servidor
```bash
cd /workspaces/quiz-flow-pro-verso
npm run dev
```

### 2. Abrir Editor
- URL: `http://localhost:5173/editor` (ou porta configurada)
- Usuário: Login com credenciais de teste
- Quiz: Criar novo quiz ou abrir existente

### 3. Checkpoint Inicial
- [ ] Editor carrega sem erros no console
- [ ] Layout com 4 colunas visível
- [ ] Nenhum erro vermelho na tela

---

## 📝 ROTEIRO DE TESTES

### 🎨 GRUPO 1: Canvas Tab Básico (5 min)

#### TC-001: Editor Carrega
**Passos:**
1. Abrir editor
2. Observar carregamento inicial

**Resultado Esperado:**
- ✅ Editor abre em < 3 segundos
- ✅ Nenhum erro no console do browser (F12)
- ✅ Canvas Tab ativo por padrão

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-002: Canvas Tab Renderiza
**Passos:**
1. Verificar Coluna 3 (Canvas Area)
2. Verificar tabs "Canvas" e "Preview"
3. Tab "Canvas" deve estar ativa

**Resultado Esperado:**
- ✅ Canvas Tab visível e ativa
- ✅ Área de conteúdo renderizada
- ✅ Header do step visível

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-003: Exibição de Blocos
**Passos:**
1. Selecionar step com blocos existentes
2. Verificar exibição dos blocos

**Resultado Esperado:**
- ✅ Blocos aparecem na ordem correta
- ✅ Cada bloco mostra preview
- ✅ Sem blocos vazios/undefined

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

### 🖱️ GRUPO 2: Interações Básicas (8 min)

#### TC-004: Seleção de Bloco
**Passos:**
1. Clicar em um bloco no canvas
2. Observar destaque visual
3. Verificar Coluna 4 (Painel de Propriedades)

**Resultado Esperado:**
- ✅ Bloco fica destacado (borda azul)
- ✅ Painel de propriedades atualiza
- ✅ Propriedades do bloco corretas

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-005: Drag and Drop Simples
**Passos:**
1. Arrastar um bloco de posição
2. Soltar em nova posição
3. Verificar reordenação

**Resultado Esperado:**
- ✅ Overlay de drag aparece
- ✅ Drop zone visível
- ✅ Bloco muda de posição
- ✅ Ordem salva automaticamente

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-006: Adicionar Bloco
**Passos:**
1. Ir para Coluna 2 (Biblioteca de Componentes)
2. Arrastar componente (ex: "Título")
3. Soltar no Canvas

**Resultado Esperado:**
- ✅ Bloco adicionado ao canvas
- ✅ Aparece na posição correta
- ✅ ID único gerado
- ✅ Propriedades padrão aplicadas

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-007: Remover Bloco
**Passos:**
1. Selecionar um bloco
2. Clicar no ícone de lixeira (🗑️)
3. Confirmar remoção

**Resultado Esperado:**
- ✅ Bloco removido do canvas
- ✅ Sem erro no console
- ✅ Ordem dos blocos restantes preservada

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-008: Duplicar Bloco
**Passos:**
1. Selecionar um bloco
2. Clicar no ícone de duplicar (📋)
3. Escolher step de destino
4. Confirmar

**Resultado Esperado:**
- ✅ Modal de duplicação abre
- ✅ Lista de steps disponíveis
- ✅ Bloco duplicado no step escolhido
- ✅ Propriedades copiadas corretamente

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

### ⚡ GRUPO 3: Virtualização (10 min)

#### TC-009: Virtualização Desabilitada (< 60 blocos)
**Passos:**
1. Selecionar step com 30-50 blocos (criar se necessário)
2. Verificar rodapé do canvas

**Resultado Esperado:**
- ✅ Todos os blocos visíveis
- ✅ Badge de virtualização NÃO aparece
- ✅ Sem top/bottom spacers

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-010: Virtualização Ativa (> 60 blocos)
**Passos:**
1. Criar step com 80+ blocos ou usar ferramenta de geração
2. Verificar rodapé do canvas

**Resultado Esperado:**
- ✅ Badge aparece: "Virtualização ativa · 80 blocos · exibindo 20"
- ✅ Scroll suave
- ✅ Blocos carregam sob demanda

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-011: Badge de Virtualização
**Passos:**
1. Com virtualização ativa (TC-010)
2. Verificar badge no rodapé

**Resultado Esperado:**
- ✅ Badge fixo no bottom
- ✅ Contador de blocos preciso
- ✅ "exibindo X" atualiza ao rolar

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-012: Scroll com Virtualização
**Passos:**
1. Step com 100+ blocos
2. Rolar canvas lentamente do topo ao fim
3. Observar carregamento de blocos

**Resultado Esperado:**
- ✅ Scroll fluido (60 FPS)
- ✅ Blocos aparecem/somem suavemente
- ✅ Sem "jumps" ou flickers
- ✅ Spacers (branco) aparecem no topo/bottom

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-013: Top Spacer
**Passos:**
1. Step com 80+ blocos
2. Rolar para baixo (meio da lista)
3. Inspecionar elemento acima do primeiro bloco visível

**Resultado Esperado:**
- ✅ Div vazia com height calculada (ex: 2800px)
- ✅ Preserva posição de scroll

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-014: Bottom Spacer
**Passos:**
1. Step com 80+ blocos
2. Rolar até metade
3. Inspecionar elemento abaixo do último bloco visível

**Resultado Esperado:**
- ✅ Div vazia com height calculada
- ✅ Preserva scrollbar total height

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-015: Contador de Blocos Preciso
**Passos:**
1. Step com exatamente 75 blocos
2. Verificar badge de virtualização
3. Rolar e observar "exibindo X"

**Resultado Esperado:**
- ✅ Total: 75 blocos
- ✅ Exibindo: ~18-22 blocos (depende de viewport)
- ✅ Contador atualiza ao rolar

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

### 🎭 GRUPO 4: Drag & Drop Avançado (7 min)

#### TC-016: DnD Desabilita Virtualização
**Passos:**
1. Step com 80+ blocos (virtualização ativa)
2. Começar a arrastar um bloco
3. Verificar se badge de virtualização desaparece

**Resultado Esperado:**
- ✅ Durante drag: badge some
- ✅ Todos os blocos ficam visíveis
- ✅ Após drop: virtualização volta

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-017: Drag Dentro do Mesmo Step
**Passos:**
1. Arrastar bloco da posição 1 para posição 5
2. Soltar
3. Verificar nova ordem

**Resultado Esperado:**
- ✅ Ordem atualizada
- ✅ Índices corretos (0-based)
- ✅ Sem duplicações

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-018: Drag Não Quebra ao Soltar
**Passos:**
1. Arrastar bloco
2. Soltar em posição válida
3. Verificar console e UI

**Resultado Esperado:**
- ✅ Nenhum erro no console
- ✅ UI não trava
- ✅ Pode fazer nova ação imediatamente

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-019: Overlay Durante Drag
**Passos:**
1. Iniciar drag de bloco
2. Observar feedback visual

**Resultado Esperado:**
- ✅ Bloco original fica semi-transparente
- ✅ Clone do bloco segue cursor
- ✅ Drop zones destacadas

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-020: Drop Zone "canvas-end"
**Passos:**
1. Arrastar bloco até o fim da lista
2. Verificar zona "Soltar aqui para final"
3. Soltar

**Resultado Esperado:**
- ✅ Drop zone visível ao final
- ✅ Bloco vai para última posição
- ✅ Order correto

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

### 👁️ GRUPO 5: Preview Tab (5 min)

#### TC-021: Troca para Preview
**Passos:**
1. Clicar na tab "Preview"
2. Aguardar carregamento

**Resultado Esperado:**
- ✅ Tab troca sem erro
- ✅ Preview renderiza
- ✅ Botões de modo (📱💊🖥️) visíveis

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-022: Preview Mobile
**Passos:**
1. Na tab Preview, clicar em 📱
2. Verificar largura do preview

**Resultado Esperado:**
- ✅ Preview com max-width: 375px
- ✅ Borda e shadow aplicados
- ✅ Componentes responsivos

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-023: Preview Tablet
**Passos:**
1. Clicar em 💊
2. Verificar largura

**Resultado Esperado:**
- ✅ Preview com max-width: 768px
- ✅ Layout adaptado

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-024: Preview Desktop
**Passos:**
1. Clicar em 🖥️
2. Verificar largura

**Resultado Esperado:**
- ✅ Preview com max-width: 100%
- ✅ Sem bordas/shadow

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-025: Preview Renderiza Componentes
**Passos:**
1. No Canvas, adicionar título + imagem + botão
2. Ir para Preview
3. Verificar renderização

**Resultado Esperado:**
- ✅ Todos os componentes visíveis
- ✅ Estilos aplicados
- ✅ Interatividade funcional (botões clicáveis)

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

### 🎛️ GRUPO 6: Painel de Propriedades (5 min)

#### TC-026: Sincronização com Bloco
**Passos:**
1. Selecionar bloco A
2. Verificar propriedades
3. Selecionar bloco B
4. Verificar se propriedades mudam

**Resultado Esperado:**
- ✅ Painel atualiza ao trocar seleção
- ✅ Propriedades corretas para cada bloco
- ✅ Sem delay perceptível

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-027: Edição Reflete no Canvas
**Passos:**
1. Selecionar bloco de título
2. Mudar texto no painel
3. Verificar canvas

**Resultado Esperado:**
- ✅ Texto atualiza em tempo real
- ✅ Sem necessidade de salvar manual
- ✅ Preview também atualiza

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-028: Validação em Tempo Real
**Passos:**
1. Campo obrigatório vazio
2. Tentar salvar

**Resultado Esperado:**
- ✅ Mensagem de erro aparece
- ✅ Campo destacado em vermelho
- ✅ Save bloqueado até corrigir

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-029: Autosave
**Passos:**
1. Fazer mudança no painel
2. Aguardar 3 segundos
3. Verificar console/network tab

**Resultado Esperado:**
- ✅ Request de save enviado automaticamente
- ✅ Debounce de 3s funcionando
- ✅ Indicador de "salvando..." aparece

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

### 🧭 GRUPO 7: Navegação (5 min)

#### TC-030: Navegar Entre Steps
**Passos:**
1. Selecionar Step 1
2. Fazer mudança no canvas
3. Selecionar Step 2
4. Voltar para Step 1

**Resultado Esperado:**
- ✅ Step troca sem erro
- ✅ Mudança no Step 1 preservada
- ✅ Canvas atualiza corretamente

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-031: Undo/Redo
**Passos:**
1. Adicionar bloco
2. Clicar em Undo (↶)
3. Clicar em Redo (↷)

**Resultado Esperado:**
- ✅ Undo remove bloco
- ✅ Redo adiciona bloco de volta
- ✅ Histórico mantém 50 níveis

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

#### TC-032: Multi-Seleção
**Passos:**
1. Ctrl+Click em múltiplos blocos
2. Verificar seleção
3. Arrastar seleção

**Resultado Esperado:**
- ✅ Múltiplos blocos destacados
- ✅ Painel mostra "Múltiplos selecionados"
- ✅ Pode mover todos juntos

**Status:** [ ] PASS / [ ] FAIL  
**Notas:** _______________________________________________

---

## 📊 RESUMO DOS RESULTADOS

### Contadores
- **Total de Testes:** 32
- **Passou:** _____ / 32
- **Falhou:** _____ / 32
- **Taxa de Sucesso:** _____ %

### Críticos Falhados
Liste aqui testes críticos que falharam (TC-001 a TC-008):

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Bugs Encontrados

| ID | Descrição | Severidade | Passos para Reproduzir |
|----|-----------|------------|------------------------|
| B01 | | 🔴 Alta / 🟡 Média / 🟢 Baixa | |
| B02 | | | |
| B03 | | | |

### Melhorias Sugeridas

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## ✅ ASSINATURA

**Testador:** _____________________  
**Data:** _____________________  
**Ambiente:** Dev / Staging / Prod  
**Navegador:** Chrome / Firefox / Safari  
**OS:** Windows / Mac / Linux  

**Conclusão Final:**  
[ ] ✅ APROVADO - Pronto para produção  
[ ] ⚠️ APROVADO COM RESSALVAS - Lista acima  
[ ] ❌ REPROVADO - Correções necessárias

---

**Próximos Passos:**
- [ ] Reportar bugs encontrados no GitHub Issues
- [ ] Criar testes automatizados para casos críticos
- [ ] Agendar code review
- [ ] Deploy para staging

