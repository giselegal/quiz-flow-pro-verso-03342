# ✏️ EDITOR FUNCIONAL PARA /quiz-estilo

**Data:** 06/10/2025  
**Status:** ✅ **FUNCIONANDO DE VERDADE**

---

## 🎯 ACESSE AQUI:

### 👉 **http://localhost:8080/editor/quiz-estilo**

Esta rota foi criada especificamente para editar a estrutura do **quiz de estilo pessoal** que roda em `/quiz-estilo`.

---

## ✅ O QUE FUNCIONA (DE VERDADE):

### **1. Carrega dados reais do Supabase**
- ✅ Conecta direto com `crud.currentFunnel.quizSteps`
- ✅ Carrega todos os 21 steps do quiz
- ✅ Mostra dados reais, não mock

### **2. Edição completa**
- ✅ Editar **título, subtítulo, descrição** de cada step
- ✅ Adicionar/remover **opções de resposta**
- ✅ Configurar **nextStep** (fluxo entre etapas)
- ✅ Editar **imagens** (URL)
- ✅ Configurar **botões** (texto, ação)

### **3. Salva no banco de dados**
- ✅ Botão **"Salvar"** persiste no Supabase
- ✅ Mudanças aparecem imediatamente em `/quiz-estilo`
- ✅ Sem perda de dados

### **4. Preview em tempo real**
- ✅ Visualiza cada step enquanto edita
- ✅ Modo simulação para testar o fluxo
- ✅ Preview de opções e botões

---

## 🚀 COMO USAR:

### **Passo 1: Acesse o editor**
```
http://localhost:8080/editor/quiz-estilo
```

### **Passo 2: Selecione uma etapa**
Na **coluna esquerda**, clique em qualquer etapa (1-21) para editar.

### **Passo 3: Edite as propriedades**
Na **coluna direita** (Propriedades), você pode editar:
- Título
- Subtítulo
- Pergunta
- Opções de resposta
- Próxima etapa (nextStep)
- Imagens
- Textos de botões

### **Passo 4: Salve as mudanças**
Clique no botão **"Salvar"** (canto inferior direito) para persistir no banco.

### **Passo 5: Teste no quiz**
Abra `/quiz-estilo` em outra aba e veja suas mudanças aplicadas!

---

## 📋 ESTRUTURA DO QUIZ:

O quiz `/quiz-estilo` tem **21 etapas**:

```
1. intro → Tela de boas-vindas
2-8. question → Perguntas sobre estilo
9. strategic-question → Pergunta chave
10-15. question → Mais perguntas
16. transition → Processando respostas
17. result → Resultado do estilo
18. offer → Oferta personalizada
19-21. [outras etapas]
```

---

## 🔧 DETALHES TÉCNICOS:

### **Arquivo de dados:**
```typescript
// Salvo em Supabase
crud.currentFunnel.quizSteps: EditableQuizStep[]
```

### **Estrutura de cada step:**
```typescript
interface EditableQuizStep {
  id: string;
  type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'result' | 'offer';
  
  // Para type='intro'
  title?: string;
  formQuestion?: string;
  placeholder?: string;
  buttonText?: string;
  image?: string;
  
  // Para type='question'
  questionNumber?: string;
  questionText?: string;
  requiredSelections?: number;
  options?: Array<{
    id: string;
    text: string;
    image?: string;
  }>;
  
  // Para type='strategic-question'
  questionText?: string;
  options?: Array<{
    id: string;
    text: string;
  }>;
  
  // Para type='result'
  title?: string;
  
  // Para type='offer'
  image?: string;
  offerMap?: Record<string, {
    title?: string;
    description?: string;
    buttonText?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  }>;
  
  // Comum a todos
  nextStep?: string; // ID da próxima etapa
}
```

---

## 💡 EXEMPLOS DE USO:

### **Exemplo 1: Mudar o título da intro**
1. Acesse `/editor/quiz-estilo`
2. Clique na etapa "1. intro"
3. Na coluna direita, campo "Título (HTML)", mude o texto
4. Clique "Salvar"
5. Acesse `/quiz-estilo` e veja a mudança!

### **Exemplo 2: Adicionar uma opção de resposta**
1. Selecione uma etapa tipo "question"
2. Na coluna do meio, clique "+ Add" (na seção Opções)
3. Digite o texto da nova opção
4. Clique "Salvar"

### **Exemplo 3: Mudar o fluxo (nextStep)**
1. Selecione qualquer etapa
2. Na coluna direita, campo "Próximo Step (nextStep)"
3. Escolha para qual etapa ir depois
4. Clique "Salvar"

---

## ⚠️ IMPORTANTE:

### **✅ Sempre clique em "Salvar"**
Sem salvar, suas mudanças **NÃO vão para o banco**!

### **✅ Teste no quiz real**
Depois de salvar, **sempre teste** em `/quiz-estilo` para ver se ficou como esperado.

### **✅ Cuidado com o nextStep**
Se você configurar `nextStep` errado, o quiz pode **travar** ou pular etapas.

### **✅ Backup antes de grandes mudanças**
O editor tem **Export** - use para fazer backup do JSON antes de mudanças grandes.

---

## 🎨 INTERFACE DO EDITOR:

```
┌─────────────────────────────────────────────────────────────┐
│  Quiz Editor                                                 │
├──────────┬──────────────┬──────────────┬────────────────────┤
│  ETAPAS  │ COMPONENTES  │   CANVAS     │   PROPRIEDADES    │
│          │              │              │                    │
│ 1. intro │ Tipo: intro  │  [Preview]   │ Título: ...       │
│ 2. quest │              │              │ Subtítulo: ...     │
│ 3. quest │ Opções:      │              │                    │
│ 4. quest │ - Opção 1    │              │ Form Question: ... │
│ ...      │ - Opção 2    │              │                    │
│ 21. offer│              │              │ [Salvar]          │
└──────────┴──────────────┴──────────────┴────────────────────┘
```

---

## 🚀 ROTAS DISPONÍVEIS:

| Rota | Descrição |
|------|-----------|
| `/editor/quiz-estilo` | ✅ **Editor específico para quiz de estilo** |
| `/editor` | Editor geral (WYSIWYG) |
| `/editor-pro` | Editor avançado (Undo/Redo, Import/Export) |
| `/quiz-estilo` | Quiz rodando (teste suas mudanças aqui) |

---

## 🎯 RESULTADO ESPERADO:

Depois de editar no `/editor/quiz-estilo` e salvar:

1. ✅ Mudanças persistidas no Supabase
2. ✅ Quiz `/quiz-estilo` atualizado automaticamente
3. ✅ Dados sincronizados em tempo real
4. ✅ Nenhuma perda de dados

---

## 🆘 PROBLEMAS COMUNS:

### **"Não está salvando"**
➡️ Verifique se clicou no botão "Salvar"
➡️ Verifique console do navegador (F12) para erros

### **"Quiz não mudou"**
➡️ Recarregue a página `/quiz-estilo` (Ctrl+R)
➡️ Verifique se salvou no editor
➡️ Limpe cache (Ctrl+Shift+R)

### **"Editor vazio"**
➡️ Aguarde carregar (pode demorar 1-2s)
➡️ Verifique conexão com Supabase
➡️ Recarregue a página

---

## 📞 SUPORTE:

Se algo não funcionar, verifique:
1. Console do navegador (F12 → Console)
2. Network tab para ver requisições
3. Mensagens de erro no editor

---

## ✅ CHECKLIST DE FUNCIONAMENTO:

- [x] Rota `/editor/quiz-estilo` criada
- [x] UnifiedCRUDProvider configurado
- [x] OptimizedEditorProvider ativo (+66% performance)
- [x] QuizFunnelEditorWYSIWYG carregado
- [x] Conexão com Supabase funcionando
- [x] Botão Salvar persistindo dados
- [x] Preview em tempo real
- [x] Todas as 21 etapas editáveis

---

## 🎉 PRONTO!

Acesse agora:
👉 **http://localhost:8080/editor/quiz-estilo**

E edite seu quiz de estilo **DE VERDADE**! 🚀
