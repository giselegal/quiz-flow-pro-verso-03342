# 🔧 COMANDOS DE GIT REBASE - GUIA COMPLETO

## 📋 **COMANDOS BÁSICOS DE REBASE**

### 1. **Rebase Interativo (Mais Usado)**

```bash
# Rebase dos últimos N commits
git rebase -i HEAD~3  # Para os últimos 3 commits
git rebase -i HEAD~5  # Para os últimos 5 commits

# Rebase desde um commit específico
git rebase -i <commit-hash>

# Rebase desde o início da branch
git rebase -i --root
```

### 2. **Rebase com Branch Principal**

```bash
# Rebase da branch atual com main
git rebase main

# Rebase da branch atual com main (interativo)
git rebase -i main

# Rebase com origem remota
git rebase origin/main
```

### 3. **Comandos Durante o Rebase Interativo**

```bash
# Opções no editor (vi/nano):
pick    # Usar commit como está
reword  # Usar commit mas editar mensagem
edit    # Usar commit mas parar para amendas
squash  # Mesclar com commit anterior
fixup   # Como squash mas descartar mensagem
drop    # Remover commit completamente
```

## 🛠️ **COMANDOS DE CONTROLE DO REBASE**

### 4. **Continuar/Parar Rebase**

```bash
# Continuar após resolver conflitos
git rebase --continue

# Pular commit atual
git rebase --skip

# Abortar rebase e voltar ao estado original
git rebase --abort

# Parar rebase no commit atual
git rebase --edit-todo
```

### 5. **Resolver Conflitos Durante Rebase**

```bash
# 1. Ver arquivos com conflito
git status

# 2. Resolver conflitos manualmente nos arquivos

# 3. Adicionar arquivos resolvidos
git add <arquivo-resolvido>

# 4. Continuar rebase
git rebase --continue
```

## 🚀 **COMANDOS AVANÇADOS**

### 6. **Rebase com Estratégias**

```bash
# Rebase preferindo mudanças da branch atual
git rebase -X ours main

# Rebase preferindo mudanças da branch principal
git rebase -X theirs main

# Rebase ignorando whitespace
git rebase --ignore-whitespace main
```

### 7. **Rebase Específico**

```bash
# Rebase apenas um range de commits
git rebase --onto main commit1 commit2

# Rebase preservando merges
git rebase --preserve-merges main

# Rebase sem fast-forward
git rebase --no-ff main
```

## 📝 **FLUXO TÍPICO DE REBASE**

### 8. **Workflow Completo**

```bash
# 1. Fazer backup da branch (recomendado)
git branch backup-branch

# 2. Começar rebase interativo
git rebase -i HEAD~5

# 3. Editar no editor:
#    - pick para manter
#    - squash para mesclar
#    - reword para editar mensagem
#    - drop para remover

# 4. Salvar e fechar editor

# 5. Se houver conflitos:
git status              # Ver conflitos
# Resolver conflitos nos arquivos
git add .              # Adicionar resoluções
git rebase --continue  # Continuar

# 6. Se der problema:
git rebase --abort     # Cancelar tudo
```

## 🔍 **COMANDOS DE INSPEÇÃO**

### 9. **Ver Estado do Rebase**

```bash
# Ver commits que serão afetados
git log --oneline HEAD~5..HEAD

# Ver status atual do rebase
git status

# Ver diferenças durante rebase
git diff

# Ver log de reflog (histórico de mudanças)
git reflog
```

## ⚠️ **COMANDOS DE SEGURANÇA**

### 10. **Backup e Recuperação**

```bash
# Criar backup antes de rebase
git branch backup-$(date +%Y%m%d-%H%M%S)

# Recuperar estado anterior (se algo der errado)
git reset --hard ORIG_HEAD

# Ver todos os estados anteriores
git reflog

# Voltar para um estado específico
git reset --hard HEAD@{2}
```

## 🎯 **COMANDOS ESPECÍFICOS PARA SEU PROJETO**

### 11. **Para Quiz Quest Challenge Verse**

```bash
# Rebase da branch atual com main
git checkout main
git pull origin main
git checkout sua-branch
git rebase main

# Rebase interativo para limpar commits
git rebase -i HEAD~10

# Push forçado após rebase (CUIDADO!)
git push --force-with-lease origin sua-branch
```

## 🚨 **COMANDOS DE EMERGÊNCIA**

### 12. **Se Tudo Der Errado**

```bash
# Abortar rebase em andamento
git rebase --abort

# Voltar ao estado antes do rebase
git reset --hard ORIG_HEAD

# Ver histórico completo para recuperar
git reflog --all

# Recuperar commit específico
git cherry-pick <commit-hash>

# Recriar branch do zero
git checkout main
git checkout -b nova-branch
git cherry-pick <commits-que-quer>
```

## 📚 **COMANDOS ÚTEIS EXTRAS**

### 13. **Verificações e Limpeza**

```bash
# Ver diferença entre branches
git log main..sua-branch --oneline

# Ver commits únicos da sua branch
git cherry main

# Limpar referências antigas
git gc --prune=now

# Ver tamanho do repositório
git count-objects -vH
```

---

## 💡 **DICAS IMPORTANTES**

1. **SEMPRE** faça backup antes de rebase: `git branch backup-$(date +%Y%m%d)`
2. **NUNCA** faça rebase em branches públicas/compartilhadas
3. Use `--force-with-lease` em vez de `--force` para push
4. `git reflog` é seu amigo para recuperar commits perdidos
5. Teste em branch separada primeiro se não tiver certeza

## 🔧 **ALIAS ÚTEIS PARA .gitconfig**

```bash
git config --global alias.rb "rebase -i"
git config --global alias.rbc "rebase --continue"
git config --global alias.rba "rebase --abort"
git config --global alias.rbs "rebase --skip"
```
