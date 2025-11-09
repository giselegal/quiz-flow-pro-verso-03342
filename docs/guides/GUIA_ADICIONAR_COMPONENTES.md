# 🎯 COMO ADICIONAR COMPONENTES ENTRE BLOCOS NO /editor

## ✅ GUIA PASSO A PASSO

### 📍 **URL:** `/editor?template=quiz21StepsComplete`

---

## 🎨 MÉTODO 1: Usando Drop Zones (RECOMENDADO)

### **Passo 1: Abrir o Editor**

1. Acesse: `http://localhost:8080/editor?template=quiz21StepsComplete`
2. Aguarde o editor carregar
3. Você verá 4 colunas:
   - **Coluna 1:** Lista de Steps
   - **Coluna 2:** Biblioteca de Componentes
   - **Coluna 3:** Canvas (área central)
   - **Coluna 4:** Painel de Propriedades

### **Passo 2: Selecionar um Step**

1. Na **Coluna 1** (Steps), clique em qualquer step
   - Exemplo: `step-01`, `step-02`, etc.
2. O canvas mostrará os blocos desse step
3. Você verá **linhas tracejadas cinzas** entre os blocos ← **ESSAS SÃO AS DROP ZONES!**

### **Passo 3: Arrastar Componente da Biblioteca**

1. Na **Coluna 2** (Biblioteca), escolha um componente:
   - 📝 Título (heading)
   - 📄 Texto (text)
   - 🔘 Botão (button)
   - 🖼️ Imagem (image)
   - ❓ Quiz Options (quiz-options)
   - 📦 Container (container)
   - Etc.

2. **Clique e segure** o componente
3. **Arraste** até o canvas (Coluna 3)

### **Passo 4: Soltar na Drop Zone**

1. Enquanto arrasta, você verá as **drop zones ficarem AZUIS**
2. Cada linha tracejada representa uma posição:
   - 🎯 **Antes do primeiro bloco**
   - 🎯 **Entre blocos existentes**
   - 🎯 **Depois do último bloco**

3. **Passe o mouse** sobre a drop zone desejada
   - Ela ficará **AZUL** com texto **"⬇ Soltar aqui"**

4. **Solte** o componente (solte o botão do mouse)

### **Passo 5: Confirmar Inserção**

1. ✅ O componente será inserido **EXATAMENTE** onde você soltou
2. ✅ Um toast aparecerá: "Componente adicionado"
3. ✅ O novo bloco aparecerá no canvas
4. ✅ A ordem será recalculada automaticamente (0, 1, 2, 3...)

---

## 🎨 MÉTODO 2: Usando o Botão "+" (Adicionar ao Final)

### **Opção Alternativa:**

Se não quiser usar drag & drop, você pode:

1. Clicar no botão **"+"** na biblioteca
2. Escolher o componente
3. Ele será adicionado **AO FINAL** do step atual

⚠️ **Limitação:** Só adiciona no final, não entre blocos específicos

---

## 🔍 VISUAL: Como Identificar as Drop Zones

### **Antes das Correções (NÃO funcionava):**
```
▣ Block 1
▣ Block 2  ← Sem indicação visual
▣ Block 3
```

### **Depois das Correções (FUNCIONANDO):**
```
🎯 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈ ← Drop Zone (linha tracejada cinza)
▣ Block 1
🎯 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈ ← Drop Zone (fica AZUL ao passar mouse)
▣ Block 2
🎯 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈ ← Drop Zone
▣ Block 3
🎯 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈ ← Drop Zone (final)
```

---

## 🎯 EXEMPLO PRÁTICO

### **Cenário:** Adicionar um "Texto" entre o "Título" e o "Botão"

#### **Situação Inicial:**
```
Step: step-01
├── Block 1: Título ("Descubra seu estilo")
└── Block 2: Botão ("Começar")
```

#### **Ação:**
1. Clique em **step-01** (Coluna 1)
2. Na biblioteca (Coluna 2), encontre **"Texto"**
3. **Arraste** o componente "Texto"
4. **Passe** sobre a drop zone ENTRE o Título e o Botão
   - Ela ficará **AZUL** ✨
5. **Solte** o componente

#### **Resultado:**
```
Step: step-01
├── Block 1: Título ("Descubra seu estilo") [order: 0]
├── Block 2: Texto ("") [order: 1] ← NOVO!
└── Block 3: Botão ("Começar") [order: 2]
```

---

## 🧪 COMO TESTAR SE ESTÁ FUNCIONANDO

### **Checklist de Verificação:**

- [ ] **1. Vejo linhas tracejadas cinzas entre blocos?**
  - ✅ SIM → Drop zones estão visíveis
  - ❌ NÃO → Algo errado (ver troubleshooting)

- [ ] **2. Ao arrastar, as linhas ficam AZUIS?**
  - ✅ SIM → Drag & drop detectado
  - ❌ NÃO → Verificar DndContext

- [ ] **3. Ao soltar, vejo logs no console?**
  - ✅ `🎯 DROP ZONE detectado:` → Funciona!
  - ✅ `✅ Inserindo ANTES do bloco...` → Sucesso!
  - ❌ Sem logs → handleDragEnd não disparou

- [ ] **4. Componente foi inserido na posição correta?**
  - ✅ SIM → Tudo funcionando!
  - ❌ NÃO → Verificar insertPosition

- [ ] **5. Toast de sucesso apareceu?**
  - ✅ "Componente adicionado" → Confirmado!

---

## 🐛 TROUBLESHOOTING

### **Problema 1: Não vejo as drop zones**

**Sintomas:**
- Linhas tracejadas cinzas não aparecem entre blocos

**Soluções:**
```bash
# 1. Verificar se as correções foram aplicadas
grep "h-8 -my-2" src/components/editor/quiz/components/BlockRow.tsx

# 2. Recarregar o navegador
Ctrl + R  (ou F5)

# 3. Verificar se há blocos no step
# Drop zones só aparecem se houver blocos para exibir
```

**Esperado:**
- Linhas tracejadas cinzas de **32px de altura**
- Sempre visíveis, mesmo sem hover

---

### **Problema 2: Drop zones aparecem mas não funciona**

**Sintomas:**
- Vejo as linhas tracejadas
- Ao arrastar, elas ficam azuis
- Mas ao soltar, nada acontece

**Soluções:**
```bash
# 1. Abrir DevTools (F12) → Console
# 2. Arrastar e soltar um componente
# 3. Verificar logs:

# ESPERADO:
🎯 DROP ZONE detectado: { targetBlockId: "...", allBlocks: [...] }
✅ Inserindo ANTES do bloco "..." na posição 0

# SE NÃO APARECER:
# - handleDragEnd não está sendo chamado
# - Verificar DndContext no QuizModularProductionEditor
```

---

### **Problema 3: Inserção na posição errada**

**Sintomas:**
- Componente é inserido, mas na posição errada

**Soluções:**
```bash
# Verificar logs no console:
# - insertPosition deve ser o número correto
# - order deve ser sequencial (0, 1, 2, 3...)

# Se order estiver errado:
# - Verificar reordenação em handleDragEnd
# - updatedBlocks.forEach((block, idx) => { block.order = idx; })
```

---

### **Problema 4: Componente não aparece no canvas**

**Sintomas:**
- Toast de sucesso aparece
- Mas componente não renderiza

**Soluções:**
```bash
# 1. Verificar se o bloco foi adicionado ao estado
console.log('Steps após inserção:', steps);

# 2. Verificar se o componente está no COMPONENT_LIBRARY
# QuizModularProductionEditor.tsx, linha ~140

# 3. Verificar renderBlockPreview
# Deve ter um case para o tipo do componente
```

---

## 📝 COMPONENTES DISPONÍVEIS

### **Lista Completa na Biblioteca:**

| Componente | Tipo | Descrição |
|------------|------|-----------|
| 📝 **Título** | `heading` | Texto grande (H1-H6) |
| 📄 **Texto** | `text` | Parágrafo de texto |
| 🔘 **Botão** | `button` | Botão clicável |
| 🖼️ **Imagem** | `image` | Imagem com URL |
| ❓ **Quiz Options** | `quiz-options` | Opções de múltipla escolha |
| 📊 **Barra de Progresso** | `progress-bar` | Indicador visual |
| 🎨 **Espaçador** | `spacer` | Espaço em branco |
| 📦 **Container** | `container` | Agrupa outros blocos |
| 🏷️ **Badge** | `badge` | Etiqueta/tag |
| 📋 **Card** | `card` | Cartão com conteúdo |
| 🎯 **CTA** | `cta` | Call-to-action destacado |
| ⭐ **Review** | `review` | Depoimento/avaliação |
| 🏆 **Header Progresso** | `progress-header` | Cabeçalho com barra |

---

## 🎬 FLUXO COMPLETO (Técnico)

### **1. Usuário arrasta componente**
```javascript
// DndContext detecta drag
active.id = "lib:heading"  // Prefixo lib: = biblioteca
```

### **2. Passa sobre drop zone**
```javascript
// DropZoneBefore detecta hover
over.id = "drop-before-step1-block2"
isOver = true  // Fica AZUL
```

### **3. Solta o componente**
```javascript
// handleDragEnd é chamado
event = {
  active: { id: "lib:heading" },
  over: { id: "drop-before-step1-block2" }
}
```

### **4. Lógica de inserção**
```javascript
// QuizModularProductionEditor.tsx

// 1. Detecta que é da biblioteca
if (String(active.id).startsWith('lib:')) {
  
  // 2. Extrai tipo do componente
  const componentType = String(active.id).slice(4); // "heading"
  
  // 3. Busca template na biblioteca
  const component = COMPONENT_LIBRARY.find(c => c.type === componentType);
  
  // 4. Cria novo bloco
  const newBlock = {
    id: `${stepId}-${component.type}-${Date.now()}`,
    type: component.type,
    order: 0, // Será recalculado
    properties: { ...component.defaultProps },
    content: { ...component.defaultContent }
  };
  
  // 5. Detecta drop zone
  if (String(over.id).startsWith('drop-before-')) {
    const targetBlockId = String(over.id).replace('drop-before-', '');
    const targetBlockIndex = currentStep.blocks.findIndex(b => b.id === targetBlockId);
    insertPosition = targetBlockIndex; // Inserir ANTES
  }
  
  // 6. Insere na posição
  const updatedBlocks = [...currentStep.blocks];
  updatedBlocks.splice(insertPosition, 0, newBlock);
  
  // 7. Reordena todos
  updatedBlocks.forEach((block, idx) => {
    block.order = idx;
  });
  
  // 8. Atualiza estado
  setSteps(updatedSteps);
  pushHistory(updatedSteps);
}
```

---

## 🎯 RESUMO RÁPIDO

### **Para adicionar um componente ENTRE blocos:**

1. ✅ Selecione o step (Coluna 1)
2. ✅ Arraste componente da biblioteca (Coluna 2)
3. ✅ Passe sobre a drop zone desejada (fica AZUL)
4. ✅ Solte o componente
5. ✅ Pronto! Inserido na posição exata

### **Visual:**
```
ANTES:                    DEPOIS:
┈┈┈┈┈┈                    ┈┈┈┈┈┈
Block 1                   Block 1
┈┈┈┈┈┈ ← SOLTAR AQUI      ┈┈┈┈┈┈
Block 2                   NOVO! ← Componente adicionado
                          ┈┈┈┈┈┈
                          Block 2
```

---

## 🚀 PRÓXIMOS PASSOS

Depois de adicionar o componente:

1. **Editar propriedades** → Coluna 4 (Painel de Propriedades)
2. **Reordenar blocos** → Arrastar blocos entre si
3. **Testar no Preview** → Clicar na aba "Preview"
4. **Salvar mudanças** → Botão "Salvar" no topo
5. **Publicar** → Botão "Publicar" para produção

---

## 📞 SUPORTE

### **Se algo não funcionar:**

1. **Abrir DevTools** (F12)
2. **Ir para Console**
3. **Procurar por:**
   - ❌ Erros em vermelho
   - 🎯 Logs "DROP ZONE detectado"
   - ✅ Logs "Inserindo ANTES do bloco"

4. **Copiar logs e enviar** para análise

---

## ✅ CHECKLIST FINAL

Antes de usar, confirme:

- [ ] Drop zones visíveis (linhas tracejadas cinzas)
- [ ] Altura de 32px (h-8) - não mais 12px
- [ ] Ficam azuis ao passar componente
- [ ] Logs aparecem no console ao soltar
- [ ] Toast de sucesso aparece
- [ ] Componente inserido na posição correta
- [ ] Order sequencial (0, 1, 2, 3...)

**Se todos os itens estiverem OK, o sistema está funcionando perfeitamente!** 🎉
