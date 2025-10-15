# 🧪 GUIA DE TESTE - CORREÇÕES DO EDITOR

## 📋 Pré-requisitos

- ✅ Servidor de desenvolvimento rodando (http://localhost:5173)
- ✅ Console do navegador aberto (F12)
- ✅ Template quiz21StepsComplete carregado

---

## 🎯 Teste 1: Verificar Loop do Preview (CRÍTICO)

### Como testar:

1. Abra o editor:
   ```
   http://localhost:5173/editor/quiz21StepsComplete-[seu-funnel-id]
   ```

2. Abra o Console do navegador (F12 → Console)

3. **Observe os logs:**

   ✅ **ESPERADO (CORRETO):**
   ```
   🔄 Loading configuration for quiz-global-config (quiz-estilo-21-steps)
   📥 GET Configuration: quiz-global-config (quiz-estilo-21-steps)
   ✅ Configuration loaded for quiz-global-config
   
   🔄 Loading configuration for quiz-theme-config (quiz-estilo-21-steps)
   📥 GET Configuration: quiz-theme-config (quiz-estilo-21-steps)
   ✅ Configuration loaded for quiz-theme-config
   
   🔄 Loading configuration for quiz-step-1 (quiz-estilo-21-steps)
   📥 GET Configuration: quiz-step-1 (quiz-estilo-21-steps)
   ✅ Configuration loaded for quiz-step-1
   
   [... e depois PARA de logar]
   ```

   ❌ **INCORRETO (SE AINDA HOUVER PROBLEMA):**
   ```
   🔄 Loading configuration for quiz-global-config...
   🔄 Loading configuration for quiz-global-config...
   🔄 Loading configuration for quiz-global-config...
   [... repetindo infinitamente]
   ```

4. **Verificar CPU:**
   - Abra o Task Manager / Monitor de Sistema
   - CPU do navegador deve estar **baixa/normal** (< 20%)
   - Se estiver alta (> 50%), ainda há loop

### ✅ Critério de Sucesso:
- [ ] Logs aparecem 1-2 vezes por componente e param
- [ ] CPU estável (< 20%)
- [ ] Preview não trava ou recarrega continuamente

---

## 🎯 Teste 2: Painel de Propriedades - Campo "Opções"

### Como testar:

1. No editor, **navegue até o Step 02** (primeira pergunta do quiz)
   - Use a navegação lateral de steps

2. **Clique no bloco de opções** no canvas central
   - Geralmente é um grid de cards com imagens

3. **Observe o Painel de Propriedades** (coluna direita)

4. **Procure pelo campo "Opções":**

   ✅ **ESPERADO (CORRETO):**
   - Você vê uma seção chamada "Opções" ou "Options"
   - Dentro dela, há uma lista de opções editáveis
   - Cada opção tem campos:
     - Texto da opção
     - URL da imagem (com preview)
     - Pontos (número)
     - Categoria (texto)
   - Há botão "+" para adicionar nova opção
   - Há botão "🗑️" ou "Remover" em cada opção

   ❌ **INCORRETO (SE AINDA HOUVER PROBLEMA):**
   - Campo "Opções" não aparece
   - Painel mostra apenas campos gerais (cores, layout)
   - Não é possível editar as opções individuais

5. **Teste a edição:**
   - Clique no campo de texto de uma opção
   - Altere o texto (ex: "Opção A" → "Opção Alterada")
   - Aguarde 1-2 segundos (debounce)
   - Verifique se o canvas central atualiza

### ✅ Critério de Sucesso:
- [ ] Campo "Opções" aparece no painel
- [ ] Cada opção mostra: texto, imageUrl, pontos, categoria
- [ ] Botão adicionar/remover funcionam
- [ ] Edições atualizam o canvas após debounce

---

## 🎯 Teste 3: Campos de Cor (Sem Erros)

### Como testar:

1. Selecione qualquer bloco que tenha campo de cor
   - Ex: bloco de título, botão, container

2. **Observe o Console do navegador**

3. **Procure por erros de cor:**

   ✅ **ESPERADO (CORRETO):**
   - Nenhum erro no console
   - Color pickers abrem normalmente
   - Valores de cor aparecem corretamente

   ❌ **INCORRETO (SE AINDA HOUVER PROBLEMA):**
   ```
   The specified value "#ccaa6aff" does not conform to the required format.
   The format is "#rrggbb" where rr, gg, bb are two-digit hexadecimal numbers.
   ```

4. **Teste o color picker:**
   - Clique em um campo de cor
   - Altere a cor
   - Verifique se o canvas atualiza

### ✅ Critério de Sucesso:
- [ ] Nenhum erro de cor no console
- [ ] Color pickers funcionam normalmente
- [ ] Alterações de cor refletem no canvas

---

## 🎯 Teste 4: Schemas Adicionais (intro-hero, welcome-form, question-hero)

### Como testar:

1. **Navegue até o Step 01** (intro/boas-vindas)

2. **Selecione o bloco de header/hero**

3. **Observe o Painel de Propriedades:**

   ✅ **ESPERADO (CORRETO):**
   - Vários campos aparecem:
     - Título / Subtítulo
     - Logo URL
     - Imagem URL
     - Cores (fundo, texto)
     - Padding
     - Progresso (mostrar/ocultar)
   
   ❌ **INCORRETO (SE AINDA HOUVER PROBLEMA):**
   - Painel vazio ou mostra apenas "Tipo: intro-hero"
   - Poucos campos disponíveis
   - Não é possível editar o conteúdo

4. **Teste a edição:**
   - Altere o título
   - Mude uma cor
   - Verifique atualização no canvas

### ✅ Critério de Sucesso:
- [ ] Painel mostra múltiplos campos editáveis
- [ ] Campos de conteúdo, logo, imagem, estilo aparecem
- [ ] Edições refletem no canvas

---

## 📊 Resumo dos Critérios de Sucesso

| Teste | Status | Observações |
|-------|--------|-------------|
| 1. Loop do Preview | ⬜ | Logs devem aparecer 1-2x e parar |
| 2. Campo Opções | ⬜ | Editor de lista com imageUrl/points/category |
| 3. Campos de Cor | ⬜ | Sem erros no console |
| 4. Schemas Adicionais | ⬜ | Múltiplos campos editáveis |

---

## 🐛 Problemas Conhecidos (Não Críticos)

### ⚠️ Aviso sobre outros arquivos

Alguns arquivos ainda têm inputs `type="color"` sem normalização:
- `PropertiesPanel.tsx`
- `Testimonial.tsx`
- `ThemeEditorPanel.tsx`

**Impacto:** Baixo (esses painéis podem não ser usados frequentemente)  
**Solução:** Se houver erros de cor nesses painéis, aplicar a mesma correção.

---

## 📞 O que fazer se algo falhar?

### Se o Teste 1 falhar (ainda há loop):
1. Verifique se o arquivo `useComponentConfiguration.ts` foi salvo corretamente
2. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Limpe o cache do navegador (Ctrl+Shift+R)

### Se o Teste 2 falhar (campo Opções não aparece):
1. Verifique se `blockSchema.ts` foi salvo
2. Inspecione o console e procure por erros de schema
3. Verifique se o tipo do bloco é realmente `options-grid`

### Se o Teste 3 falhar (ainda há erros de cor):
1. Verifique qual arquivo está gerando o erro (olhe o stack trace)
2. Pode ser necessário aplicar a normalização em outros arquivos
3. Informe o arquivo e linha do erro para correção adicional

### Se o Teste 4 falhar (schemas não aparecem):
1. Verifique se o tipo do bloco é `intro-hero`, `welcome-form` ou `question-hero`
2. Inspecione o console e procure por avisos de schema não encontrado
3. Verifique se `blockSchemaMap` foi recriado após adicionar os schemas

---

## ✅ Confirmação Final

Após executar todos os testes, marque:

- [ ] Todos os 4 testes passaram
- [ ] Console sem erros críticos
- [ ] Editor funcional e responsivo
- [ ] CPU estável

Se todos os critérios forem atendidos: **✅ CORREÇÕES VALIDADAS COM SUCESSO!**

---

**Boa sorte nos testes! 🚀**
