# 🎨 Guia: Como Editar Propriedades no Modo NOCODE

## 📋 O que é o Painel de Propriedades NOCODE?

O **Painel de Propriedades** é a interface visual (sem código) para editar blocos do quiz. Ele tem **2 abas**:

1. **🎛️ Propriedades** (NOCODE) - Campos visuais para editar
2. **📄 JSON** - Editor de código avançado

## 🎯 Como Funciona a Edição NOCODE

### Passo a Passo

1. **Selecionar um Bloco**
   - Clique em qualquer bloco no canvas (área de preview)
   - O painel à direita mostrará as propriedades do bloco

2. **Editar Campos**
   - Cada propriedade aparece com seu controle apropriado:
     - **Texto**: Campo de input simples
     - **Número**: Input numérico com min/max
     - **Toggle**: Switch on/off
     - **Dropdown**: Lista de opções
     - **Color Picker**: Seletor de cores
     - **Lista de Opções**: Editor de múltiplas opções (quiz)

3. **Salvar Alterações**
   - Clique no botão **"💾 Salvar"** no topo do painel
   - Alterações são aplicadas ao bloco selecionado
   - Canvas é atualizado em tempo real

### Fluxo Técnico

```
Usuário edita campo
  ↓
PropertyControl onChange → handleChange (com log)
  ↓
PropertiesColumn handlePropertyChange (valida tipo)
  ↓
setEditedProperties (atualiza estado local)
  ↓
setIsDirty(true) (marca como modificado)
  ↓
Usuário clica "Salvar"
  ↓
handleSave → createSynchronizedBlockUpdate
  ↓
onBlockUpdate (callback para QuizModularEditor)
  ↓
updateBlock (SuperUnifiedProvider)
  ↓
Reducer atualiza estado global
  ↓
Canvas re-renderiza com novos dados
```

## 🔍 Logs de Debug Adicionados

Para diagnosticar problemas de edição, foram adicionados logs em **3 pontos**:

### 1. PropertyControl (DynamicPropertyControls.tsx)
```tsx
🎛️ [PropertyControl] onChange: {
  propertyKey: "text",
  oldValue: "Bem-vindo",
  newValue: "Olá Mundo",
  control: "text"
}
```

**O que mostra**: Toda mudança em qualquer campo

### 2. handlePropertyChange (PropertiesColumn/index.tsx)
```tsx
🎛️ [PropertiesColumn] handlePropertyChange
key: "text"
value (raw): "Olá Mundo"
value type: string
editedProperties[key]: "Bem-vindo"
expected type: string
validatedValue: "Olá Mundo"
editedProperties ANTES: { text: "Bem-vindo", level: 1 }
editedProperties DEPOIS: { text: "Olá Mundo", level: 1 }
✅ Propriedade atualizada, isDirty = true
```

**O que mostra**: Validação de tipo e atualização do estado local

### 3. handleSave (PropertiesColumn/index.tsx)
```tsx
💾 [PropertiesColumn] handleSave
selectedBlock: { id: "block-1", type: "heading", ... }
isDirty: true
editedProperties: { text: "Olá Mundo", level: 1 }
synchronizedUpdate criado: { 
  properties: { text: "Olá Mundo", level: 1 },
  content: { text: "Olá Mundo", level: 1 }
}
Chamando onBlockUpdate com: {
  blockId: "block-1",
  updates: { properties: {...}, content: {...} }
}
✅ onBlockUpdate chamado, isDirty = false
```

**O que mostra**: Processo completo de salvamento

## 🧪 Como Testar

### Teste 1: Edição Simples de Texto

1. Abrir editor: `http://localhost:8080/editor?resource=quiz21StepsComplete&step=1`
2. Clicar em um bloco de texto no canvas
3. No painel à direita, mudar o texto
4. **Verificar logs no console** (F12):
   ```
   🎛️ [PropertyControl] onChange: { propertyKey: "text", newValue: "..." }
   🎛️ [PropertiesColumn] handlePropertyChange
   ✅ Propriedade atualizada, isDirty = true
   ```
5. Clicar no botão **"💾 Salvar"**
6. **Verificar logs**:
   ```
   💾 [PropertiesColumn] handleSave
   ✅ onBlockUpdate chamado
   ```
7. Canvas deve atualizar com novo texto

### Teste 2: Edição de Lista de Opções

1. Selecionar bloco de tipo `question-single` ou `options-grid`
2. No painel, procurar propriedade `options`
3. Clicar em **"+ Adicionar Opção"**
4. Editar texto das opções
5. Verificar logs de cada mudança
6. Salvar e verificar no canvas

### Teste 3: Edição de Número/Slider

1. Selecionar bloco com propriedade numérica (ex: `level` em heading)
2. Mover o slider ou digitar número
3. Verificar logs mostrando conversão de tipo
4. Salvar e verificar mudança visual

## ❌ Problemas Comuns e Diagnóstico

### Problema 1: Campo Não Atualiza Visualmente

**Sintoma**: Você digita mas o campo não muda

**Logs esperados**:
```
❌ NENHUM LOG APARECE
```

**Causa**: `onChange` não está conectado ou `value` está hardcoded

**Solução**: Verificar se `PropertyControl` está usando `handleChange`

---

### Problema 2: Campo Atualiza Mas Não Salva

**Sintoma**: Campo muda, botão "Salvar" aparece, mas ao salvar nada acontece

**Logs esperados**:
```
✅ 🎛️ [PropertyControl] onChange
✅ 🎛️ [PropertiesColumn] handlePropertyChange
✅ isDirty = true
💾 [PropertiesColumn] handleSave
❌ Não salvou: { reason: "Não há mudanças (isDirty=false)" }
```

**Causa**: `isDirty` foi resetado antes de salvar ou `editedProperties` não foi atualizado

**Solução**: Verificar `setIsDirty` e `setEditedProperties` no `handlePropertyChange`

---

### Problema 3: Salva Mas Canvas Não Atualiza

**Sintoma**: Salva com sucesso mas canvas não reflete mudanças

**Logs esperados**:
```
✅ 💾 [PropertiesColumn] handleSave
✅ onBlockUpdate chamado
❌ Reducer ou updateBlock não processa
```

**Causa**: `onBlockUpdate` não está conectado ou `updateBlock` tem bug

**Solução**: Verificar logs do `updateBlock` no SuperUnifiedProvider

---

### Problema 4: Tipo Errado (Número vira String)

**Sintoma**: Número é salvo como string `"123"` em vez de `123`

**Logs esperados**:
```
🎛️ [PropertiesColumn] handlePropertyChange
value (raw): "123"
expected type: number
validatedValue: 123  ← ✅ Deve ser number, não string
```

**Causa**: `handlePropertyChange` não está convertendo tipo corretamente

**Solução**: Verificar lógica de validação de tipo

---

### Problema 5: Blocos Inválidos Descartados

**Sintoma**: Salva mas blocos desaparecem do canvas

**Logs esperados**:
```
✅ onBlockUpdate chamado
🔧 [Reducer] SET_STEP_BLOCKS
❌ Bloco INVÁLIDO: block-1
Errors: [{ path: "content.text", message: "Required" }]
❌ 1 blocos inválidos ignorados!
```

**Causa**: Blocos não seguem `blockSchema`, são descartados no reducer

**Solução**: Ajustar dados do bloco para seguir schema ou relaxar validação

## 🎯 Checklist de Validação

Ao testar edições NOCODE, verificar:

- [ ] Logs `🎛️ [PropertyControl]` aparecem ao editar campos
- [ ] Logs `🎛️ [PropertiesColumn] handlePropertyChange` mostram validação
- [ ] `isDirty = true` é setado
- [ ] Botão "Salvar" fica habilitado (não está disabled)
- [ ] Logs `💾 [PropertiesColumn] handleSave` aparecem ao clicar Salvar
- [ ] `onBlockUpdate` é chamado
- [ ] Canvas atualiza visualmente
- [ ] Ao recarregar página, mudanças persistem

## 📊 Próximos Passos

### Se Edição NOCODE Funcionar
- ✅ Remover logs de debug excessivos (ou deixar apenas em modo dev)
- ✅ Adicionar feedback visual de salvamento (toast, spinner)
- ✅ Implementar auto-save (salvar automaticamente após X segundos)

### Se Edição NOCODE NÃO Funcionar
1. **Recarregar editor** com console aberto (F12)
2. **Selecionar bloco** e editar campo
3. **Copiar TODOS os logs** com emojis (🎛️, 💾, ✅, ❌)
4. **Identificar onde o fluxo quebra**:
   - Não aparece `🎛️ PropertyControl`? → Controle não está renderizando
   - Não aparece `handlePropertyChange`? → Callback não conectado
   - Não aparece `handleSave`? → Botão Salvar não funciona
   - Aparece `handleSave` mas não `onBlockUpdate`? → Callback não conectado
5. **Aplicar fix específico** baseado no ponto de falha

---

**Status**: 🔍 Logs de debug adicionados em toda a cadeia de edição NOCODE  
**Data**: 2025-11-19  
**Arquivos modificados**:
- `DynamicPropertyControls.tsx` - Logs em PropertyControl e handleChange
- `PropertiesColumn/index.tsx` - Logs em handlePropertyChange e handleSave

**Próxima etapa**: Testar edição NOCODE e analisar logs no console
