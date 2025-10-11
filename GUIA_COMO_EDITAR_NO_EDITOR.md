# 🛠️ GUIA COMPLETO: COMO EDITAR O TEMPLATE NO `/editor`

## 🚀 **PASSO A PASSO PARA ABRIR O EDITOR**

### **1️⃣ Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

### **2️⃣ Acesse uma das URLs abaixo:**

#### **Opção A: Com parâmetro `template` (RECOMENDADO)**
```
http://localhost:5173/editor?template=quiz21StepsComplete
```

#### **Opção B: Com parâmetro `funnelId`**
```
http://localhost:5173/editor?funnelId=quiz21StepsComplete
```

#### **Opção C: Criar novo funil baseado no template**
```
http://localhost:5173/admin/modelos-funis
```
Depois clique em **"Editor"** no modelo "Quiz de Estilo Pessoal"

---

## 📊 **O QUE VOCÊ VERÁ NO EDITOR**

### **Interface Principal:**

```
┌─────────────────────────────────────────────────────────────┐
│  [← Voltar]  Quiz de Estilo - 21 Etapas    [💾 Salvar]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Step 1] [Step 2] [Step 3] ... [Step 20] [Step 21]        │
│     ↑                                                        │
│   Aba de navegação entre steps                              │
│                                                              │
├──────────────────────┬──────────────────────────────────────┤
│  📦 BLOCOS           │  🎨 PREVIEW                          │
│                      │                                      │
│  ▶ quiz-intro-header │  ╔═══════════════════════════════╗  │
│  ▶ text              │  ║ [LOGO]                        ║  │
│  ▶ text              │  ║                                ║  │
│  ▶ image             │  ║ Chega de um guarda-roupa...   ║  │
│  ▶ form-container    │  ║                                ║  │
│  ▶ quiz-footer       │  ║ [Digite seu nome]             ║  │
│                      │  ║ [Começar Quiz] ──────────►    ║  │
│  [+ Adicionar Bloco] │  ╚═══════════════════════════════╝  │
│                      │                                      │
└──────────────────────┴──────────────────────────────────────┘
```

---

## 🎯 **ESTRUTURA DO EDITOR**

### **1. Painel de Navegação de Steps (Topo)**
- **20 abas** (Step 1 até Step 20)
- Clique para alternar entre os steps
- Indicador visual do step atual

### **2. Painel de Blocos (Esquerda)**
- Lista de **todos os blocos** do step atual
- Cada bloco tem:
  - **Tipo** (quiz-intro-header, text, image, etc.)
  - **Ordem** (order: 0, 1, 2...)
  - **Ações**: ✏️ Editar | 🗑️ Deletar | ⬆️⬇️ Reordenar

### **3. Preview Canvas (Centro)**
- Visualização **em tempo real** do step
- Exatamente como aparecerá no quiz
- Interativo (pode testar botões, forms)

### **4. Painel de Propriedades (Direita)**
- Aparece ao clicar em um bloco
- Edita **content** e **properties**:
  ```json
  {
    "content": {
      "text": "Chega de um guarda-roupa...",
      "showLogo": true
    },
    "properties": {
      "fontSize": "text-3xl",
      "textAlign": "center",
      "color": "#432818"
    }
  }
  ```

---

## ✏️ **COMO EDITAR CADA PARTE**

### **A) EDITAR TEXTO DE UM BLOCO**

1. **Selecione o step** (ex: Step 1)
2. **Clique no bloco** de texto na lista (ex: `step1-title`)
3. **Painel de propriedades abre à direita**
4. **Edite o campo `content.text`**:
   ```json
   {
     "text": "Novo texto aqui!"
   }
   ```
5. **Salve** com Ctrl+S ou botão 💾

### **B) EDITAR ESTILO DE UM BLOCO**

No painel de propriedades, edite `properties`:
```json
{
  "properties": {
    "fontSize": "text-4xl",        ← Tamanho da fonte
    "fontWeight": "font-bold",     ← Peso da fonte
    "textAlign": "center",         ← Alinhamento
    "color": "#B89B7A",            ← Cor
    "marginTop": 20,               ← Margem superior
    "backgroundColor": "#F8F9FA"   ← Cor de fundo
  }
}
```

### **C) EDITAR IMAGENS**

1. Clique no bloco de **imagem**
2. Edite `content.imageUrl`:
   ```json
   {
     "content": {
       "imageUrl": "https://nova-url-da-imagem.com/foto.jpg",
       "alt": "Descrição da imagem"
     }
   }
   ```

### **D) EDITAR OPÇÕES DE UMA QUESTÃO** (Steps 2-11)

1. Selecione um step de questão (ex: Step 2)
2. Clique no bloco `options-grid`
3. Edite o array de opções:
   ```json
   {
     "content": {
       "options": [
         {
           "id": "opt1",
           "text": "Jeans e t-shirt",
           "imageUrl": "https://...",
           "scores": {
             "Natural": 3,
             "Contemporâneo": 1
           }
         },
         {
           "id": "opt2",
           "text": "Alfaiataria",
           "scores": {
             "Clássico": 3
           }
         }
       ]
     }
   }
   ```

### **E) ADICIONAR UM NOVO BLOCO**

1. Clique em **[+ Adicionar Bloco]** no painel esquerdo
2. Escolha o tipo:
   - `text` → Texto simples
   - `image` → Imagem
   - `button` → Botão
   - `options-grid` → Grade de opções
   - `form-container` → Formulário
3. Configure o bloco no painel de propriedades
4. **Salve**

### **F) REORDENAR BLOCOS**

- Use as setas **⬆️ ⬇️** ao lado de cada bloco
- Ou arraste e solte (drag & drop)
- A propriedade `order` será atualizada automaticamente

### **G) DELETAR UM BLOCO**

1. Clique no ícone **🗑️** ao lado do bloco
2. Confirme a exclusão
3. **Salve** as alterações

---

## 💾 **COMO SALVAR ALTERAÇÕES**

### **Opção 1: Salvar no LocalStorage** (desenvolvimento)
- Clique no botão **💾 Salvar** no topo
- Alterações ficam apenas no navegador
- **Não afeta** o template original (`quiz21StepsComplete.ts`)

### **Opção 2: Exportar JSON**
- Clique em **⬇️ Exportar** (se disponível)
- Baixa um arquivo JSON com as alterações
- Útil para backup ou compartilhar

### **Opção 3: Criar Draft Permanente**
- Clique em **"Salvar como Draft"**
- Cria uma cópia editável no banco de dados
- Pode testar no `/quiz-estilo?draft=ID_DO_DRAFT`

---

## 🧪 **TESTAR ALTERAÇÕES**

### **Modo Preview Interno:**
1. No editor, clique em **"Preview"** ou **▶️**
2. Abre o quiz em modo visualização
3. Pode navegar entre steps
4. **Não salva respostas**

### **Modo Produção (Draft):**
1. Salve o draft no editor
2. Anote o **ID do draft** (ex: `draft-12345`)
3. Acesse:
   ```
   http://localhost:5173/quiz-estilo?draft=draft-12345
   ```
4. Testa o quiz **completo** com suas alterações

---

## 📋 **TIPOS DE BLOCOS DISPONÍVEIS**

| Tipo | Descrição | Usado em |
|------|-----------|----------|
| `quiz-intro-header` | Cabeçalho com logo | Step 1 |
| `text` | Texto formatado (HTML) | Todos os steps |
| `image` | Imagem com legenda | Steps 1, 20 |
| `form-container` | Formulário de captura | Step 1 |
| `options-grid` | Grade de opções (questões) | Steps 2-11, 13-18 |
| `result-header-inline` | Cabeçalho de resultado | Step 20 |
| `secondary-styles` | Estilos secundários | Step 20 |
| `fashion-ai-generator` | Gerador de looks IA | Step 20 |
| `quiz-footer` | Rodapé com botão | Todos os steps |

---

## 🎨 **PROPRIEDADES MAIS COMUNS**

### **Para TEXTO:**
```json
{
  "fontSize": "text-xl | text-2xl | text-3xl | text-4xl",
  "fontWeight": "font-normal | font-bold | font-semibold",
  "textAlign": "left | center | right",
  "color": "#HEXCOLOR",
  "lineHeight": "leading-tight | leading-normal | leading-relaxed",
  "marginTop": 0-100,
  "marginBottom": 0-100,
  "padding": "0-100px"
}
```

### **Para IMAGEM:**
```json
{
  "width": "100% | 50% | 300px",
  "height": "auto | 200px | 400px",
  "borderRadius": "0px | 8px | 16px | 9999px",
  "objectFit": "cover | contain | fill",
  "marginTop": 0-100,
  "boxShadow": "none | sm | md | lg | xl"
}
```

### **Para CONTAINER:**
```json
{
  "backgroundColor": "#HEXCOLOR",
  "padding": "16px | 24px | 32px",
  "borderRadius": "8px | 16px",
  "boxShadow": "sm | md | lg",
  "maxWidth": "640px | 800px | 1024px"
}
```

---

## 🔥 **DICAS AVANÇADAS**

### **1. Personalização com variáveis:**
No Step 20 (resultado), use variáveis dinâmicas:
```json
{
  "text": "Parabéns, {userName}! Seu estilo é {resultStyle}!"
}
```

Variáveis disponíveis:
- `{userName}` → Nome do usuário (Step 1)
- `{resultStyle}` → Estilo predominante calculado
- `{resultPercentage}` → Porcentagem do estilo
- `{secondaryStyle1}`, `{secondaryStyle2}` → Estilos secundários
- `{secondaryPercentage1}`, `{secondaryPercentage2}` → Porcentagens

### **2. Configurar validação de questões:**
No bloco `options-grid`:
```json
{
  "validation": {
    "requiredSelections": 3,      ← Steps 2-11
    "maxSelections": 3,
    "message": "Selecione 3 opções"
  }
}
```

### **3. Auto-advance:**
```json
{
  "behavior": {
    "autoAdvance": true,           ← Avança automaticamente
    "autoAdvanceDelay": 1500       ← Delay em ms
  }
}
```

### **4. Copiar um Step:**
1. Selecione o step que quer copiar
2. Clique em **"Duplicar Step"** (se disponível)
3. Edite a cópia conforme necessário

---

## 🚨 **AVISOS IMPORTANTES**

### ⚠️ **Alterações no editor NÃO modificam o arquivo TypeScript original**
- O template `quiz21StepsComplete.ts` permanece intacto
- Alterações são salvas como **draft** ou no **LocalStorage**
- Para alterar o template original, você precisa editar o arquivo `.ts` manualmente

### ⚠️ **Modo IS_TEST afeta o carregamento**
```typescript
// src/templates/quiz21StepsComplete.ts (linha 1128)
export const QUIZ_STYLE_21_STEPS_TEMPLATE: Record<string, Block[]> = 
  IS_TEST ? MINIMAL_TEST_TEMPLATE : { /* 20 steps completos */ };
```

Se `IS_TEST === true`, apenas 3-4 steps serão carregados.

### ⚠️ **Cache de templates**
O navegador pode cachear o template. Se as alterações não aparecem:
1. **Limpe o cache**: Ctrl+Shift+R
2. **Recarregue o LocalStorage**
3. **Reinicie o servidor de desenvolvimento**

---

## 📱 **ATALHOS DE TECLADO**

| Atalho | Ação |
|--------|------|
| `Ctrl + S` | Salvar |
| `Ctrl + Z` | Desfazer |
| `Ctrl + Y` | Refazer |
| `Ctrl + D` | Duplicar bloco |
| `Delete` | Deletar bloco selecionado |
| `↑ / ↓` | Navegar entre blocos |
| `← / →` | Navegar entre steps |
| `Esc` | Fechar painel de propriedades |

---

## 📚 **DOCUMENTAÇÃO RELACIONADA**

- **Estrutura do Template**: `TEMPLATE_JSON_QUIZ_21_STEPS.json`
- **Conexão Quiz-Template**: `CONEXAO_QUIZ_ESTILO_E_TEMPLATE.md`
- **Análise Completa**: `ANALISE_CONFIGURACAO_QUIZ_21_STEPS.md`
- **Código Fonte**: `src/templates/quiz21StepsComplete.ts` (3,742 linhas)

---

## 🎯 **PRÓXIMOS PASSOS**

1. ✅ **Inicie o servidor**: `npm run dev`
2. ✅ **Acesse o editor**: `http://localhost:5173/editor?template=quiz21StepsComplete`
3. ✅ **Explore os 20 steps** e seus blocos
4. ✅ **Faça uma alteração** simples (ex: mude um texto)
5. ✅ **Salve como draft**
6. ✅ **Teste no quiz**: `http://localhost:5173/quiz-estilo?draft=SEU_DRAFT_ID`

---

## 🆘 **PRECISA DE AJUDA?**

Se o editor não abrir ou der erro:
1. Verifique se o servidor está rodando (`npm run dev`)
2. Confira o console do navegador (F12)
3. Verifique se o template existe no FunnelTypesRegistry
4. Tente limpar o cache e recarregar

**Logs úteis:**
```javascript
// No console do navegador:
localStorage.getItem('quiz21StepsComplete')  // Ver draft salvo
console.log(QUIZ_STYLE_21_STEPS_TEMPLATE)   // Ver template carregado
```

---

## ✨ **EXEMPLO PRÁTICO: MUDAR O TÍTULO DO STEP 1**

1. Acesse: `http://localhost:5173/editor?template=quiz21StepsComplete`
2. Clique na aba **"Step 1"**
3. No painel de blocos (esquerda), clique em **"step1-title"**
4. No painel de propriedades (direita), edite:
   ```json
   {
     "content": {
       "text": "Meu Novo Título Personalizado!"
     }
   }
   ```
5. Clique em **💾 Salvar**
6. Clique em **▶️ Preview** para visualizar
7. Pronto! O título foi alterado!

---

**Bora começar a editar? 🚀**

Quer que eu inicie o servidor e abra o editor para você? 😊
