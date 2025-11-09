# ✅ Checklist de Validação: Quiz 21 Steps Complete Editor

**Data:** 2025-11-03  
**Objetivo:** Validar 100% de funcionalidade do editor para quiz21StepsComplete

---

## 🎯 OBJETIVO DA VALIDAÇÃO

Garantir que:
1. ✅ Todos os 21 steps carregam corretamente
2. ✅ Todos os 26 tipos de blocos têm schemas Zod
3. ✅ Painel de Propriedades funciona para todos os tipos
4. ✅ Renderização condicional de todos os blocos
5. ✅ Integração Supabase completa
6. ✅ Auto-save funcional
7. ✅ Preview modes (live/production) funcionais

---

## 📋 CHECKLIST DE VALIDAÇÃO

### PARTE 1: CARREGAMENTO DO TEMPLATE

#### 1.1 Acesso ao Editor
- [ ] Acessar `http://localhost:5173/editor?template=quiz21StepsComplete`
- [ ] Verificar que não há erros no console
- [ ] Verificar que o editor carrega (sem tela branca)
- [ ] Verificar que o nome do template aparece no header

#### 1.2 Carregamento dos Steps
- [ ] Step 01 carrega
- [ ] Step 02 carrega
- [ ] Step 03 carrega
- [ ] Step 04 carrega
- [ ] Step 05 carrega
- [ ] Step 06 carrega
- [ ] Step 07 carrega
- [ ] Step 08 carrega
- [ ] Step 09 carrega
- [ ] Step 10 carrega
- [ ] Step 11 carrega
- [ ] Step 12 carrega
- [ ] Step 13 carrega
- [ ] Step 14 carrega
- [ ] Step 15 carrega
- [ ] Step 16 carrega
- [ ] Step 17 carrega
- [ ] Step 18 carrega
- [ ] Step 19 carrega
- [ ] Step 20 carrega
- [ ] Step 21 carrega
- [ ] **Total: 21/21 steps carregados**

#### 1.3 Navegação entre Steps
- [ ] StepNavigatorColumn visível
- [ ] Lista de steps exibida
- [ ] Click em step muda canvas
- [ ] Step atual destacado visualmente
- [ ] Scroll funciona na lista de steps

---

### PARTE 2: SCHEMAS E PROPRIEDADES

#### 2.1 Verificação de Schemas (Console)
Verificar no console que todos os tipos têm schema:
```
[SchemaInterpreter] ✅ 26 tipos de blocos base + blocos do editor carregados
```

- [ ] Mensagem de confirmação aparece no console
- [ ] Número correto: 26 tipos

#### 2.2 Painel de Propriedades - Intro Components (Step 01)
- [ ] Selecionar bloco `intro-logo`
  - [ ] Propriedades visíveis no painel
  - [ ] Controles: src (image-upload), alt (text), width (number), height (number)
  - [ ] Controles: padding (number), animationType (dropdown), animationDuration (number)
  - [ ] Edição funciona (muda valor)

- [ ] Selecionar bloco `intro-title`
  - [ ] Propriedades visíveis
  - [ ] Controles: title (textarea), textAlign (dropdown), fontSize (text), fontWeight (text)
  - [ ] Edição funciona

- [ ] Selecionar bloco `intro-image`
  - [ ] Propriedades visíveis
  - [ ] Controles: src (image-upload), alt (text), width (number), height (number)
  - [ ] Controles: objectFit (dropdown), maxWidth (number), borderRadius (text)
  - [ ] Edição funciona

- [ ] Selecionar bloco `intro-description`
  - [ ] Propriedades visíveis
  - [ ] Controles: text (textarea), textAlign (dropdown), padding (number)
  - [ ] Edição funciona

- [ ] Selecionar bloco `intro-form`
  - [ ] Propriedades visíveis
  - [ ] Controles: label (text), placeholder (text), buttonText (text)
  - [ ] Controles: required (toggle), helperText (text), padding (number)
  - [ ] Edição funciona

#### 2.3 Painel de Propriedades - Question Components (Steps 02-11)
Testar em qualquer step de questão (ex: Step 02):

- [ ] Selecionar bloco `question-progress`
  - [ ] Propriedades visíveis
  - [ ] Controles: stepNumber (number), totalSteps (number), showPercentage (toggle)
  - [ ] Controles: barColor (color-picker), backgroundColor (color-picker)
  - [ ] Edição funciona

- [ ] Selecionar bloco `question-title`
  - [ ] Propriedades visíveis
  - [ ] Controles: text (text), subtitle (textarea), backgroundColor (color-picker)
  - [ ] Edição funciona

- [ ] Selecionar bloco `options-grid`
  - [ ] Propriedades visíveis
  - [ ] Controles: options (json-editor), columns (number), gap (number)
  - [ ] Controles: multipleSelection (toggle), minSelections (number), maxSelections (number)
  - [ ] Controles: showImages (toggle), padding (number)
  - [ ] Edição funciona (especialmente json-editor)

- [ ] Selecionar bloco `question-navigation`
  - [ ] Propriedades visíveis
  - [ ] Controles: backLabel (text), nextLabel (text)
  - [ ] Controles: showBack (toggle), showNext (toggle)
  - [ ] Controles: backVariant (dropdown), nextVariant (dropdown)
  - [ ] Edição funciona

#### 2.4 Painel de Propriedades - Transition Components (Steps 12, 19)
Testar no Step 12:

- [ ] Selecionar bloco `transition-hero`
  - [ ] Propriedades visíveis
  - [ ] Controles: title (textarea), subtitle (textarea)
  - [ ] Controles: animationType (dropdown), autoAdvance (toggle), autoAdvanceDelay (number)
  - [ ] Edição funciona

- [ ] Selecionar bloco `transition-text`
  - [ ] Propriedades visíveis
  - [ ] Controles: text (textarea), textAlign (dropdown), animationType (dropdown)
  - [ ] Edição funciona

#### 2.5 Painel de Propriedades - Result Components (Step 20)
- [ ] Selecionar bloco `result-congrats`
  - [ ] Propriedades visíveis
  - [ ] Controles: text (textarea), userName (text)
  - [ ] Edição funciona

- [ ] Selecionar bloco `result-main`
  - [ ] Propriedades visíveis
  - [ ] Controles: title (textarea), styleName (text), percentage (text), description (textarea)
  - [ ] Edição funciona

- [ ] Selecionar bloco `result-image`
  - [ ] Propriedades visíveis
  - [ ] Controles: src (image-upload), alt (text), borderRadius (text)
  - [ ] Edição funciona

- [ ] Selecionar bloco `result-description`
  - [ ] Propriedades visíveis
  - [ ] Controles: text (textarea), textAlign (dropdown)
  - [ ] Edição funciona

- [ ] Selecionar bloco `result-progress-bars`
  - [ ] Propriedades visíveis
  - [ ] Controles: styles (json-editor), showPercentage (toggle), barColor (color-picker)
  - [ ] Edição funciona

- [ ] Selecionar bloco `result-secondary-styles`
  - [ ] Propriedades visíveis
  - [ ] Controles: title (text), styles (json-editor)
  - [ ] Edição funciona

- [ ] Selecionar bloco `result-cta`
  - [ ] Propriedades visíveis
  - [ ] Controles: title (text), description (textarea), buttonText (text), buttonUrl (text)
  - [ ] Edição funciona

- [ ] Selecionar bloco `result-share`
  - [ ] Propriedades visíveis
  - [ ] Controles: title (text), platforms (json-editor)
  - [ ] Edição funciona

#### 2.6 Painel de Propriedades - Offer Components (Step 21)
- [ ] Selecionar bloco `offer-hero`
  - [ ] Propriedades visíveis
  - [ ] Controles: title (textarea), subtitle (textarea), imageUrl (image-upload)
  - [ ] Controles: ctaText (text), ctaUrl (text)
  - [ ] Edição funciona

- [ ] Selecionar bloco `pricing`
  - [ ] Propriedades visíveis
  - [ ] Controles: price (text), oldPrice (text), discount (text), installments (text)
  - [ ] Edição funciona

#### 2.7 Resumo de Cobertura
- [ ] **26/26 tipos de blocos testados**
- [ ] **Todos os controles funcionam**
- [ ] **Sem erros no console durante edição**

---

### PARTE 3: RENDERIZAÇÃO E PREVIEW

#### 3.1 Modo Edição (Edit Mode)
- [ ] Todos os blocos visíveis no canvas
- [ ] Blocos ordenados corretamente (por `order`)
- [ ] Seleção visual de bloco funciona
- [ ] Drag & drop entre blocos funciona
- [ ] Reordenação persiste

#### 3.2 Modo Preview - Live
- [ ] Toggle para "Preview" funciona
- [ ] Canvas muda para modo preview
- [ ] Todos os blocos renderizam
- [ ] Edições refletem em tempo real
- [ ] Voltar para "Edit" funciona

#### 3.3 Modo Preview - Production
- [ ] Toggle para "Production" funciona
- [ ] Canvas renderiza como em produção
- [ ] Animações funcionam
- [ ] Interações funcionam (botões, formulários)
- [ ] Voltar para "Live" funciona

#### 3.4 Renderização Condicional
Verificar se blocos com propriedades condicionais renderizam corretamente:
- [ ] `showBack: false` esconde botão voltar
- [ ] `showNext: false` esconde botão avançar
- [ ] `showPercentage: false` esconde porcentagem
- [ ] `showImages: false` esconde imagens em options-grid
- [ ] `required: false` torna campo opcional

---

### PARTE 4: INTEGRAÇÃO SUPABASE

#### 4.1 Criação de Funnel
- [ ] Criar novo funnel no Supabase (via interface admin)
- [ ] Obter `funnelId`
- [ ] Acessar `/editor?template=quiz21StepsComplete&funnelId={ID}`
- [ ] Verificar que carrega do Supabase

#### 4.2 Salvamento
- [ ] Editar algum bloco
- [ ] Status muda para "📝 Não salvo"
- [ ] Auto-save ativa após 2 segundos
- [ ] Status muda para "🔄 Salvando..."
- [ ] Status muda para "✅ Salvo"
- [ ] Verificar no Supabase que dados foram salvos

#### 4.3 Save Manual
- [ ] Editar algum bloco
- [ ] Clicar botão "Save" no header
- [ ] Verificar que salva imediatamente
- [ ] Verificar no Supabase

#### 4.4 Reload
- [ ] Fazer edições
- [ ] Salvar
- [ ] Recarregar página (F5)
- [ ] Verificar que edições persistiram
- [ ] Verificar que carrega do Supabase

---

### PARTE 5: FUNCIONALIDADES AVANÇADAS

#### 5.1 Drag & Drop
- [ ] Arrastar bloco da biblioteca para canvas
- [ ] Bloco inserido na posição correta
- [ ] Arrastar bloco dentro do canvas
- [ ] Reordenação funciona
- [ ] Estado marca como dirty

#### 5.2 Operações de Bloco
- [ ] Duplicar bloco funciona
- [ ] Remover bloco funciona
- [ ] Adicionar bloco da biblioteca funciona
- [ ] Mover bloco entre steps funciona

#### 5.3 Undo/Redo
- [ ] Fazer edição
- [ ] Ctrl+Z desfaz
- [ ] Ctrl+Shift+Z refaz
- [ ] Histórico mantém 50 ações

#### 5.4 Export/Import JSON
- [ ] Botão "Download" funciona
- [ ] JSON exportado é válido
- [ ] Importar JSON funciona
- [ ] Dados restaurados corretamente

---

### PARTE 6: PERFORMANCE E ESTABILIDADE

#### 6.1 Performance
- [ ] Carregamento inicial < 3 segundos
- [ ] Troca de step < 500ms
- [ ] Edição de propriedade < 100ms
- [ ] Preview mode toggle < 500ms
- [ ] Sem lags ou travamentos

#### 6.2 Estabilidade
- [ ] Sem memory leaks após 10 minutos de uso
- [ ] Sem erros no console durante uso normal
- [ ] Funciona após 100+ edições
- [ ] Funciona em abas múltiplas

#### 6.3 Responsividade
- [ ] Editor funciona em tela 1920x1080
- [ ] Editor funciona em tela 1366x768
- [ ] Colunas redimensionáveis funcionam
- [ ] Scroll funciona em todas as colunas

---

### PARTE 7: EDGE CASES

#### 7.1 Validação
- [ ] Campo obrigatório sem valor mostra erro
- [ ] Campo numérico rejeita texto
- [ ] Color picker valida formato de cor
- [ ] JSON editor valida sintaxe

#### 7.2 Fallbacks
- [ ] Template não encontrado mostra erro amigável
- [ ] Supabase offline usa fallback local
- [ ] Bloco sem schema mostra mensagem
- [ ] Imagem quebrada mostra placeholder

#### 7.3 Limites
- [ ] Máximo de blocos por step: 50
- [ ] Máximo de caracteres em textarea: 5000
- [ ] Máximo de opções em options-grid: 20
- [ ] Upload de imagem máximo: 5MB

---

## 📊 RESULTADO DA VALIDAÇÃO

### Scores

| Categoria | Items | Passou | Falhou | % |
|-----------|-------|--------|--------|---|
| Carregamento | 23 | - | - | - |
| Schemas/Props | 26 | - | - | - |
| Renderização | 15 | - | - | - |
| Supabase | 12 | - | - | - |
| Funcionalidades | 15 | - | - | - |
| Performance | 11 | - | - | - |
| Edge Cases | 12 | - | - | - |
| **TOTAL** | **114** | **-** | **-** | **-%** |

### Critérios de Aceitação

- ✅ **PASSOU:** 95%+ dos items validados com sucesso
- ⚠️ **ATENÇÃO:** 80-94% - Precisa correções menores
- ❌ **FALHOU:** <80% - Precisa revisão completa

---

## 🐛 BUGS ENCONTRADOS

### Template para Relato de Bug

```markdown
**ID:** BUG-001
**Severidade:** P0 (Crítico) / P1 (Alto) / P2 (Médio) / P3 (Baixo)
**Categoria:** Carregamento / Schemas / Renderização / Supabase / etc.
**Descrição:** [Descrever o bug]
**Steps para Reproduzir:**
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]
**Resultado Esperado:** [O que deveria acontecer]
**Resultado Atual:** [O que acontece]
**Console Log:** [Copiar erros do console]
**Screenshot:** [Link para screenshot]
```

### Bugs Identificados
_(Preencher durante validação)_

---

## ✅ APROVAÇÃO FINAL

### Checklist de Aprovação
- [ ] Todos os 21 steps carregam
- [ ] Todos os 26 tipos têm propriedades editáveis
- [ ] Preview funciona para todos os blocos
- [ ] Supabase salva e carrega corretamente
- [ ] Performance aceitável
- [ ] Sem bugs críticos (P0)
- [ ] Documentação completa

### Assinaturas
- **Desenvolvedor:** _________________ Data: _______
- **QA:** _________________ Data: _______
- **Product Owner:** _________________ Data: _______

---

## 📝 NOTAS ADICIONAIS

_(Espaço para observações durante validação)_

---

**Última Atualização:** 2025-11-03  
**Versão:** 1.0  
**Status:** 📋 Pronto para Validação
