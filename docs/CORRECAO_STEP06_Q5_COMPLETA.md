# 🎯 MAPEAMENTO ATUALIZADO DE QUESTÕES NOS TEMPLATES

## 📊 **MAPEAMENTO OFICIAL CONFIRMADO**

| Step       | Questão | Título                                  | Tipo                  | Progress | Status           |
| ---------- | ------- | --------------------------------------- | --------------------- | -------- | ---------------- |
| **Step02** | **q1**  | QUAL O SEU TIPO DE ROUPA FAVORITA?      | both (texto + imagem) | 10%      | ✅ Correto       |
| **Step03** | **q2**  | RESUMA A SUA PERSONALIDADE              | text only             | 20%      | ✅ Correto       |
| **Step04** | **q3**  | QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?    | both (texto + imagem) | 30%      | ✅ Correto       |
| **Step05** | **q4**  | QUAIS DETALHES VOCÊ GOSTA?              | text only             | 40%      | ✅ Correto       |
| **Step06** | **q5**  | QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA? | both (texto + imagem) | 50%      | ✅ **Corrigido** |
| **Step07** | **q6**  | QUAL CASACO É SEU FAVORITO?             | both (texto + imagem) | 60%      | ✅ **Corrigido** |

---

## ✅ **CORREÇÃO REALIZADA NO STEP06**

### **ANTES:**

- ❌ **Questão q6**: "QUAL CASACO É SEU FAVORITO?"
- ❌ Progress: 60%
- ❌ Opções sobre casacos (6a-6h)

### **DEPOIS:**

- ✅ **Questão q5**: "QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?"
- ✅ Progress: 50% (questão 5 de 10)
- ✅ **8 opções**: 5a-5h (estampas)
- ✅ **Tipo**: both (texto + imagem)
- ✅ **multiSelect**: 3 opções

---

## 📋 **DETALHES DA QUESTÃO Q5 (STEP06)**

```typescript
Opções implementadas:
- 5a: "Estampas clean, com poucas informações" → Natural
  Image: 20_oh44vh.webp

- 5b: "Estampas clássicas e atemporais" → Clássico
  Image: 21_o7wkte.webp

- 5c: "Atemporais, mas que tenham uma pegada de atual e moderna" → Contemporâneo
  Image: 22_siebw2.webp

- 5d: "Estampas clássicas e atemporais, mas sofisticadas" → Elegante
  Image: 23_bdfxrh.webp

- 5e: "Estampas florais e/ou delicadas como bolinhas, borboletas e corações" → Romântico
  Image: 24_nptszu.webp

- 5f: "Estampas de animal print, como onça, zebra e cobra" → Sexy
  Image: 25_motk6b.webp

- 5g: "Estampas geométricas, abstratas e exageradas como grandes poás" → Dramático
  Image: 26_dptanw.webp

- 5h: "Estampas diferentes do usual, como africanas, xadrez grandes" → Criativo
  Image: 27_wxmklx.webp
```

---

## 🔄 **PRÓXIMOS STEPS A IMPLEMENTAR**

Sequência correta continuando:

- **Step08** → **q7** (Calças)
- **Step09** → **q8** (Sapatos)
- **Step10** → **q9** (Acessórios - tipo)
- **Step11** → **q10** (Acessórios - valor)

---

## ✅ **VALIDAÇÃO**

- ✅ Step06Template corrigido com questão q5 (estampas)
- ✅ Step07Template corrigido com questão q6 (casacos)
- ✅ Sem erros TypeScript
- ✅ Todas as opções com imagens corretas do Cloudinary
- ✅ Configurações adequadas (multiSelect: 3, both type)
- ✅ Progress values corretos (50%, 60%)
- ✅ Textos exatos do `correctQuizQuestions.ts`

**Status**: Step06 e Step07 agora estão corretos com questões q5 e q6!
