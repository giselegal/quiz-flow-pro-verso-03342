# 🎯 METODOLOGIA DE DESENVOLVIMENTO INCREMENTAL

**Data**: 2 de dezembro de 2025  
**Propósito**: Evitar desenvolvimento em círculos e manter base estável  

---

## 🚨 O PROBLEMA QUE ESTAMOS RESOLVENDO

```
❌ CICLO VICIOSO ANTERIOR:

1. Adicionar múltiplas features de uma vez
2. Sistema quebra
3. Tentar consertar tudo junto
4. Adicionar mais código
5. Quebra mais ainda
6. Perder noção do que funciona
7. 🔄 REPETIR até perder o controle

RESULTADO:
- 440 arquivos modificados
- 166 commits em 2 dias
- Sistema não funciona
- Perda de produtividade
```

---

## ✅ A NOVA METODOLOGIA

### Regra de Ouro: **"1 Feature → 1 Teste → 1 Commit"**

```
✅ CICLO VIRTUOSO:

1. Base estável (FUNCIONA)
   ↓
2. Adicionar 1 feature pequena
   ↓
3. Testar (5-10 min)
   ↓
4a. FUNCIONA? → git commit
4b. NÃO? → git reset --hard
   ↓
5. Repetir

RESULTADO:
- Sempre tem versão funcional
- Progresso rastreável
- Fácil reverter se quebrar
- Alta produtividade
```

---

## 📋 PRINCÍPIOS FUNDAMENTAIS

### 1. BASE ESTÁVEL É SAGRADA

```bash
# ANTES de adicionar qualquer coisa:
npm run dev
# Testar no navegador
# Verificar que TUDO funciona
# Se não funciona, PARE e conserte
```

**Nunca** adicione features em cima de código quebrado!

---

### 2. UMA COISA DE CADA VEZ

```
❌ ERRADO:
- Adicionar Drag & Drop
- Refatorar stores
- Mudar estrutura de tipos
- Adicionar persistência
- Melhorar performance
- Testar tudo junto
→ QUEBRA TUDO

✅ CERTO:
- Adicionar Drag & Drop
- Testar
- Commit
→ Refatorar stores
→ Testar
→ Commit
→ (repetir)
```

---

### 3. COMMITS ATÔMICOS

Cada commit deve ser:

- **Independente**: Pode ser revertido sozinho
- **Testado**: Funciona antes de commitar
- **Descritivo**: Título claro do que faz
- **Pequeno**: Máximo 3-5 arquivos (idealmente)

#### Exemplos de Bons Commits:

```bash
✅ feat: adicionar botão de deletar bloco no canvas
✅ fix: corrigir seleção de bloco ao clicar
✅ refactor: extrair lógica de validação para helper
✅ style: melhorar espaçamento do painel de propriedades
✅ docs: adicionar comentários ao editorStore
```

#### Exemplos de Commits RUINS:

```bash
❌ "Changes" (o que mudou?)
❌ "Fix stuff" (o que foi consertado?)
❌ "WIP" (work in progress não é commit!)
❌ "Update 10 files" (muito genérico)
```

---

### 4. TESTES CONTÍNUOS

```bash
# Após CADA mudança:
npm run dev

# No navegador:
# 1. Abrir DevTools Console
# 2. Verificar ausência de erros
# 3. Testar a feature adicionada
# 4. Testar features existentes (smoke test)
# 5. Só então fazer commit
```

**Tempo de teste por feature**: 5-10 minutos  
**Frequência**: Após CADA mudança  

---

## 🔄 CICLO DE DESENVOLVIMENTO DETALHADO

### Fase 1: Preparação (5 min)

```bash
# 1. Confirmar que base funciona
npm run dev
# Testar navegação básica no navegador

# 2. Criar branch de feature (opcional para features grandes)
git checkout -b feature/nome-da-feature

# 3. Documentar objetivo
echo "Feature: [descrição clara]" > FEATURE_ATUAL.md
echo "Arquivos a modificar:" >> FEATURE_ATUAL.md
echo "- src/components/..." >> FEATURE_ATUAL.md
echo "Critérios de sucesso:" >> FEATURE_ATUAL.md
echo "- [ ] ..." >> FEATURE_ATUAL.md
```

---

### Fase 2: Desenvolvimento (15-30 min)

```bash
# 1. Fazer mudanças PEQUENAS
# Editar 1-3 arquivos por vez

# 2. Salvar e testar FREQUENTEMENTE
# A cada 5-10 minutos:
npm run dev
# Verificar no navegador

# 3. Se quebrar, reverter IMEDIATAMENTE
git checkout -- arquivo-que-quebrou.ts
# OU
git reset --hard  # se quebrou tudo
```

**Sinais de que você está indo rápido demais**:

- ⚠️ Mais de 5 arquivos modificados sem testar
- ⚠️ Mais de 30 minutos sem rodar `npm run dev`
- ⚠️ Erros no console que você "vai consertar depois"
- ⚠️ Código que "deveria funcionar" mas não testou

---

### Fase 3: Validação (10 min)

```bash
# 1. Teste completo da feature
npm run dev
# Abrir http://localhost:8080/editor

# 2. Checklist de validação:
# - [ ] Feature funciona como esperado
# - [ ] Sem erros no console
# - [ ] Features existentes ainda funcionam
# - [ ] Interface responsiva
# - [ ] Sem travamentos

# 3. Se TUDO passar:
git add .
git commit -m "feat: [descrição clara da feature]"

# 4. Se NÃO passar:
git reset --hard
# Recomeçar com abordagem diferente
```

---

### Fase 4: Integração (5 min)

```bash
# Se criou branch de feature:
git checkout work-from-stable-20251202
git merge feature/nome-da-feature

# Testar novamente após merge:
npm run dev

# Se funcionar:
git push origin work-from-stable-20251202

# Limpar branch de feature:
git branch -d feature/nome-da-feature
```

---

## 🎯 PRIORIZAÇÃO DE FEATURES

### Core (DEVE funcionar SEMPRE)

Estas são **inegociáveis** - se quebrarem, PARE TUDO:

1. ✅ Carregamento de interface
2. ✅ Navegação de steps
3. ✅ Visualização de blocos
4. ✅ Edição de propriedades

---

### Importante (adicionar incrementalmente)

Adicione **uma de cada vez**, testando entre cada:

5. Drag & Drop básico
6. Undo/Redo
7. Validações
8. Auto-save local

---

### Nice to Have (adicionar por último)

Só adicione se TUDO acima funcionar perfeitamente:

9. Animações
10. Shortcuts avançados
11. Features experimentais
12. Otimizações de performance

---

## 📊 CHECKLIST DIÁRIO

### 🌅 Início do Dia

```bash
- [ ] git pull origin work-from-stable-20251202
- [ ] npm install (se houve mudanças)
- [ ] npm run dev
- [ ] Testar funcionalidades core (5 min)
- [ ] Console limpo (sem erros)
- [ ] Decidir 1-2 features do dia
```

---

### 💼 Durante Desenvolvimento

```bash
- [ ] Trabalhar em 1 feature por vez
- [ ] Testar a cada 15-30 minutos
- [ ] Commit a cada feature completa
- [ ] Commits com mensagens claras
- [ ] Nunca commit de código quebrado
```

---

### 🌆 Fim do Dia

```bash
- [ ] Todos os testes passando
- [ ] Console sem erros
- [ ] Commits com mensagens claras
- [ ] Push para backup
- [ ] Atualizar CHANGELOG.md (o que foi feito)
```

---

## 🚨 SINAIS DE ALERTA

### 🛑 PARE IMEDIATAMENTE se:

```
❌ Mais de 10 arquivos modificados sem testar
❌ Mais de 1 hora sem rodar npm run dev
❌ Erros no console que não entende
❌ Múltiplas features sendo desenvolvidas
❌ Código "temporário" que vai "limpar depois"
❌ Mudanças em arquivos que não entende
❌ "Vou só adicionar mais uma coisinha..."
```

### ✅ Você está no caminho certo quando:

```
✅ Cada mudança é testada em < 15 minutos
✅ Commits frequentes (a cada 30-60 min)
✅ Consegue explicar cada linha que escreveu
✅ Sistema continua funcionando após cada adição
✅ Console limpo (sem erros)
✅ Sente progresso constante
```

---

## 💪 RECUPERAÇÃO DE DESASTRES

### Se você se perdeu:

```bash
# 1. PARAR TUDO
# Fechar editor, respirar fundo

# 2. Fazer backup de emergência
git checkout -b backup-emergency-$(date +%Y%m%d-%H%M%S)
git push origin backup-emergency-$(date +%Y%m%d-%H%M%S)

# 3. Voltar para versão estável
git checkout work-from-stable-20251202
git reset --hard origin/work-from-stable-20251202

# 4. Limpar tudo
rm -rf node_modules/.vite
npm install

# 5. Testar base
npm run dev

# 6. Se funcionar, commitar
git commit -m "chore: reset to stable state"

# 7. Recomeçar com metodologia incremental
```

---

### Se quebrou algo mas sabe o que foi:

```bash
# Reverter arquivo específico
git checkout HEAD -- src/path/to/file.tsx

# Ou últimos N commits
git reset --hard HEAD~3

# Testar
npm run dev

# Se funcionar, continuar dali
```

---

### Se não sabe o que quebrou:

```bash
# Usar git bisect para encontrar
git bisect start
git bisect bad  # commit atual (quebrado)
git bisect good 15d24cd75  # commit que funcionava

# Git vai testar commits até encontrar o problema
# Para cada commit que git bisect selecionar:
npm run dev
# Testar no navegador
git bisect good  # se funciona
# OU
git bisect bad   # se está quebrado

# Quando encontrar, git mostra o commit culpado
git bisect reset
```

---

## 📝 TEMPLATE DE FEATURE

Use este template ao iniciar cada nova feature:

````markdown
# Feature: [NOME DA FEATURE]

**Data**: ___/___/2025  
**Branch**: feature/[nome]  
**Estimativa**: ___ minutos  
**Prioridade**: [ ] Core  [ ] Importante  [ ] Nice to Have  

---

## 🎯 Objetivo

Descrição clara do que esta feature faz:
_________________________________

---

## 📋 Checklist de Implementação

- [ ] Criar branch: `git checkout -b feature/[nome]`
- [ ] Confirmar base funciona: `npm run dev`
- [ ] Implementar mudanças
- [ ] Testar feature específica
- [ ] Testar features existentes (smoke test)
- [ ] Console sem erros
- [ ] Commit: `git commit -m "feat: [descrição]"`
- [ ] Merge: `git checkout main && git merge feature/[nome]`
- [ ] Testar após merge
- [ ] Deletar branch: `git branch -d feature/[nome]`

---

## 📁 Arquivos a Modificar

1. `src/...` - [motivo]
2. `src/...` - [motivo]
3. `src/...` - [motivo]

---

## ✅ Critérios de Sucesso

- [ ] [critério 1]
- [ ] [critério 2]
- [ ] [critério 3]

---

## 🧪 Plano de Teste

1. [passo de teste 1]
2. [passo de teste 2]
3. [passo de teste 3]

---

## 📊 Resultado

- **Status**: [ ] ✅ Completo  [ ] ⚠️ Parcial  [ ] ❌ Falhou
- **Tempo real**: ___ minutos
- **Commits**: [hash]
- **Observações**: _________________________________
````

---

## 🎓 EXEMPLOS PRÁTICOS

### Exemplo 1: Adicionar botão de deletar bloco

```bash
# 1. Preparação
git checkout -b feature/delete-block-button
npm run dev  # Confirmar que funciona

# 2. Desenvolvimento
# Editar: src/components/editor/Canvas/BlockRenderer.tsx
# Adicionar botão de delete com onClick handler

# 3. Testar (5 min)
npm run dev
# Clicar em bloco → ver botão → clicar em deletar → bloco some
# Verificar console sem erros

# 4. Commit
git add src/components/editor/Canvas/BlockRenderer.tsx
git commit -m "feat: adicionar botão de deletar bloco no canvas"

# 5. Integração
git checkout work-from-stable-20251202
git merge feature/delete-block-button
npm run dev  # Testar novamente
git branch -d feature/delete-block-button
```

**Tempo total**: 20-30 minutos  
**Arquivos modificados**: 1  
**Risco**: Baixo  

---

### Exemplo 2: Implementar Drag & Drop

```bash
# 1. Preparação
git checkout -b feature/drag-and-drop
npm run dev

# 2. Desenvolvimento INCREMENTAL
# Passo 1: Instalar biblioteca (se necessário)
npm install react-dnd react-dnd-html5-backend
git add package.json package-lock.json
git commit -m "chore: instalar react-dnd para drag and drop"

# Testar que não quebrou
npm run dev

# Passo 2: Adicionar DndProvider
# Editar: src/pages/EditorPage.tsx
git add src/pages/EditorPage.tsx
git commit -m "feat: adicionar DndProvider ao EditorPage"
npm run dev  # Testar

# Passo 3: Tornar blocos draggable
# Editar: src/components/editor/Canvas/BlockRenderer.tsx
git add src/components/editor/Canvas/BlockRenderer.tsx
git commit -m "feat: tornar blocos draggable no canvas"
npm run dev  # Testar

# Passo 4: Adicionar drop zone
# Editar: src/components/editor/Canvas/Canvas.tsx
git add src/components/editor/Canvas/Canvas.tsx
git commit -m "feat: adicionar drop zone no canvas"
npm run dev  # Testar

# Passo 5: Implementar lógica de reordenação
# Editar: src/stores/editorStore.ts
git add src/stores/editorStore.ts
git commit -m "feat: adicionar lógica de reordenação no editorStore"
npm run dev  # Testar COMPLETAMENTE

# 3. Integração
git checkout work-from-stable-20251202
git merge feature/drag-and-drop
npm run dev  # Testar novamente
git branch -d feature/drag-and-drop
```

**Tempo total**: 60-90 minutos  
**Arquivos modificados**: 5  
**Commits**: 5 (um por passo)  
**Risco**: Médio (mas mitigado por commits incrementais)  

---

## 📈 MÉTRICAS DE SUCESSO

### Diárias

- **Commits**: 3-8 por dia (mais = melhor, se testados)
- **Tempo por feature**: 15-45 minutos
- **Features completadas**: 2-5 por dia
- **Reverts necessários**: 0-1 por dia (idealmente 0)

---

### Semanais

- **Linhas de código**: Não importa (qualidade > quantidade)
- **Features funcionando**: 100% das commitadas
- **Bugs introduzidos**: 0-2 por semana
- **Tempo em debugging**: < 20% do tempo total

---

### Sinais de Sucesso

```
✅ Sistema sempre funcional
✅ Progresso visível diário
✅ Commits com mensagens claras
✅ Fácil reverter se necessário
✅ Confiança no código
✅ Menos estresse
✅ Mais produtividade
```

---

## 🎯 MANTRA DO DESENVOLVEDOR

```
🧘 Repita mentalmente:

"Base estável primeiro"
"Uma coisa de cada vez"
"Testar antes de commitar"
"Commits pequenos e claros"
"Se quebrou, reverter e repensar"
"Progresso incremental é progresso real"
```

---

## 📚 RECURSOS ADICIONAIS

### Aliases úteis para git:

```bash
# Adicionar ao ~/.gitconfig

[alias]
    # Commit rápido com mensagem
    c = commit -m
    
    # Status curto
    s = status -s
    
    # Log bonito
    l = log --oneline --graph --decorate --all -10
    
    # Desfazer último commit (mantém mudanças)
    undo = reset --soft HEAD~1
    
    # Descartar todas as mudanças
    nuke = reset --hard HEAD
    
    # Ver diferenças
    d = diff
    
    # Ver branches
    b = branch -v
```

---

### Scripts úteis:

```bash
# ~/quick-test.sh
#!/bin/bash
npm run dev &
sleep 5
"$BROWSER" http://localhost:8080/editor
```

---

## 🏆 CONCLUSÃO

**Lembre-se**:

- 🐢 **Devagar e sempre** vence a corrida
- 🧪 **Código não testado** não existe
- 💾 **Commits frequentes** evitam perdas
- 🎯 **Base estável** > Features quebradas
- 🔄 **É melhor reverter** do que insistir no erro

---

**"A perfeição é inimiga do progresso, mas o caos também é."**

**Encontre o equilíbrio**: Progresso incremental + Testes constantes = Sucesso

---

*Metodologia criada em: 2 de dezembro de 2025*  
*Baseada em: Experiência real de desenvolvimento em círculos*  
*Objetivo: Nunca mais andar em círculos*
