# 🚨 INSTRUÇÕES DE TESTE URGENTE

## ⚠️ Ignore os erros 404 de `component_configurations`
Esses erros são de um serviço legado que não está sendo usado. **Não afeta o teste.**

---

## 🎯 TESTE 1: Biblioteca com Valores Padrão

### Passos:
1. **Limpe o console**: Clique com botão direito → "Clear console" OU `Ctrl+L`
2. Abra: `http://localhost:5173/quiz-editor/modular`
3. Na **coluna esquerda** (Biblioteca), procure por **"Opções de Quiz"**
4. **Arraste e solte** no canvas (área central)
5. **Clique** no bloco que acabou de criar
6. No **Painel de Propriedades** (direita), clique no botão roxo: **"🧪 DEBUG: Mostrar JSON do Bloco"**

### O que deve aparecer no console:

```
=== TESTE COMPLETO DO BLOCO ===
Tipo: quiz-options

📦 PROPERTIES: {
  // ... outras propriedades
}

📦 CONTENT: {
  "options": [
    {
      "id": "opt1",
      "text": "Opção 1",
      "imageUrl": "https://res.cloudinary.com/dqljyf76t/...",  ← DEVE TER URL
      "points": 10,                                             ← DEVE TER 10
      "score": 10,                                              ← DEVE TER 10
      "category": "A"                                           ← DEVE TER "A"
    },
    {
      "id": "opt2",
      "text": "Opção 2",
      "imageUrl": "https://res.cloudinary.com/dqljyf76t/...",  ← DEVE TER URL
      "points": 20,                                             ← DEVE TER 20
      "score": 20,                                              ← DEVE TER 20
      "category": "B"                                           ← DEVE TER "B"
    },
    {
      "id": "opt3",
      "text": "Opção 3",
      "imageUrl": "https://res.cloudinary.com/dqljyf76t/...",  ← DEVE TER URL
      "points": 30,                                             ← DEVE TER 30
      "score": 30,                                              ← DEVE TER 30
      "category": "C"                                           ← DEVE TER "C"
    }
  ]
}

✅ OPTIONS encontradas: 3
✅ Tem imageUrl: true/false  ← DEVE SER TRUE
✅ Tem points: true/false    ← DEVE SER TRUE  
✅ Tem category: true/false  ← DEVE SER TRUE
```

### O que espero que você me envie:

**OPÇÃO A - Se estiver OK:**
```
✅ Miniaturas aparecem com imagens
✅ Pontos preenchidos: 10, 20, 30
✅ Categorias preenchidas: A, B, C
```

**OPÇÃO B - Se estiver vazio:**
```
❌ Miniaturas vazias (sem imagem)
❌ Pontos: 0, 0, 0
❌ Categorias: vazias

[Copie a parte do console que mostra content.options]
```

---

## 📸 Screenshots que preciso:

1. **Painel de Propriedades** mostrando os campos
2. **Console** após clicar no botão DEBUG (parte do JSON de options)

---

## ⏱️ Tempo estimado: 2 minutos

**Por favor, execute agora e me envie o resultado!** 🙏

Isso vai nos dizer se o problema é:
- ❌ **Biblioteca** → Se campos vazios no novo bloco
- ❌ **Carregamento** → Se campos vazios só ao carregar funnel existente
- ✅ **Tudo OK** → Se campos preenchidos aparecerem
