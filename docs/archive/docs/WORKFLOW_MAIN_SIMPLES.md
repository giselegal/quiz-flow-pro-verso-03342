# 🚀 WORKFLOW SIMPLIFICADO - MAIN APENAS

## ✅ Comandos Essenciais para Trabalhar com Main

### 📥 1. Atualizar Local com Remoto

```bash
# Puxar mudanças do origin/main para main local
git pull origin main
```

### 📝 2. Fazer Mudanças no Código

```bash
# Após editar arquivos...
git add .
git status  # verificar arquivos modificados
```

### 🚀 3. Commit e Push Direto para Main

```bash
# Commit com mensagem descritiva
git commit -m "✅ FEAT: Sua descrição da mudança aqui"

# Enviar para origin/main
git push origin main
```

### 🔄 4. Verificar Status

```bash
# Ver status atual
git status

# Ver histórico recente
git log --oneline -5

# Ver diferenças
git diff
```

---

## 🎯 WORKFLOW COMPLETO - EXEMPLO PRÁTICO

```bash
# 1. Atualizar branch main local
git pull origin main

# 2. Fazer mudanças no código
# (editar arquivos...)

# 3. Adicionar mudanças
git add .

# 4. Verificar o que será commitado
git status

# 5. Commit com mensagem clara
git commit -m "✅ FEAT: Implementa nova funcionalidade X
- Adiciona componente Y
- Corrige bug Z
- Melhora performance W"

# 6. Enviar para repositório remoto
git push origin main

# 7. Verificar se enviou corretamente
git log --oneline -3
```

---

## 🛠️ COMANDOS ÚTEIS EXTRAS

### 📊 Verificar Diferenças

```bash
# Ver mudanças não commitadas
git diff

# Ver mudanças entre local e remoto
git diff origin/main

# Ver arquivos modificados
git diff --name-only
```

### 🔍 Informações do Repositório

```bash
# Status detalhado
git status -v

# Ver branches
git branch -a

# Ver último commit
git show --stat
```

### 🆘 Comandos de Emergência

```bash
# Descartar mudanças não commitadas
git restore .

# Voltar ao último commit
git reset --hard HEAD

# Sincronizar forçado com remoto (CUIDADO!)
git reset --hard origin/main
```

---

## ✨ VANTAGENS DESTE WORKFLOW

1. **🎯 Simplicidade**: Apenas uma branch principal
2. **🚀 Rapidez**: Commits diretos sem merge
3. **🔄 Sincronia**: Sempre atualizado com origin/main
4. **📱 Direto**: Sem complexidade de branches extras

---

## ⚠️ CONSIDERAÇÕES IMPORTANTES

- ✅ **Ideal para**: Projetos pessoais, protótipos, desenvolvimento solo
- ✅ **Vantagem**: Fluxo simples e direto
- ⚠️ **Atenção**: Teste bem antes de cada push
- ⚠️ **Cuidado**: Commits vão direto para produção

---

**🎯 Resumo**: Use `git pull origin main` → edite → `git add .` → `git commit -m "mensagem"` → `git push origin main`
