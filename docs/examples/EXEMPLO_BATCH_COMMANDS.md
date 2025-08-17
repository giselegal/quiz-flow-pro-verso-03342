# 🚀 WORKFLOW COM BATCH COMMANDS - EXEMPLO PRÁTICO

## ✅ Scripts Disponíveis

- **`git-batch-commands-v2.sh`** - Novo script com funções específicas
- **`git-batch-commands.sh`** - Script original interativo

---

## 🎯 WORKFLOW EXATO QUE VOCÊ PEDIU

```bash
# 1. Atualizar main
./git-batch-commands-v2.sh update_main

# 2. Criar branch para nova feature
./git-batch-commands-v2.sh create_branch feature/nova-funcionalidade

# 3. Fazer mudanças no código...
# (editar seus arquivos aqui)

# 4. Commit e push
./git-batch-commands-v2.sh commit_and_push "Adiciona nova funcionalidade X"

# 5. Voltar para main
./git-batch-commands-v2.sh back_to_main
```

---

## 🔧 FUNÇÕES DISPONÍVEIS

### 📥 Atualizar Main

```bash
./git-batch-commands-v2.sh update_main
```

- Muda para branch main
- Puxa mudanças do origin/main
- Confirma atualização

### 🌿 Criar Branch

```bash
./git-batch-commands-v2.sh create_branch nome-da-branch
```

- Cria nova branch a partir da main
- Faz push da branch para o repositório
- Deixa você na nova branch

### 📝 Commit e Push

```bash
./git-batch-commands-v2.sh commit_and_push "Sua mensagem aqui"
```

- Adiciona todos os arquivos (git add .)
- Faz commit com a mensagem fornecida
- Faz push para a branch atual

### 🏠 Voltar para Main

```bash
./git-batch-commands-v2.sh back_to_main
```

- Muda para a branch main
- Confirma a mudança

### 🔄 Merge para Main

```bash
./git-batch-commands-v2.sh merge_to_main
```

- Faz commit de mudanças pendentes
- Muda para main e puxa atualizações
- Faz merge da branch atual
- Oferece opção de deletar a branch

---

## 🚀 WORKFLOW COMPLETO AUTOMATIZADO

```bash
# Opção 1: Workflow manual (como você pediu)
./git-batch-commands-v2.sh update_main
./git-batch-commands-v2.sh create_branch feature/minha-feature
# (fazer mudanças)
./git-batch-commands-v2.sh commit_and_push "Implementa minha feature"
./git-batch-commands-v2.sh back_to_main

# Opção 2: Workflow automatizado
./git-batch-commands-v2.sh full_workflow feature/minha-feature "Implementa minha feature"
# (fazer mudanças)
./git-batch-commands-v2.sh commit_and_push "Implementa minha feature"
./git-batch-commands-v2.sh back_to_main
```

---

## 📊 Ver Ajuda e Status

```bash
# Ver todas as opções disponíveis
./git-batch-commands-v2.sh

# Resultado mostra:
# - Todas as funções disponíveis
# - Status atual do repositório
# - Branch atual
```

---

## 💡 EXEMPLOS PRÁTICOS

### Exemplo 1: Nova Feature

```bash
./git-batch-commands-v2.sh update_main
./git-batch-commands-v2.sh create_branch feature/login-system
# Editar código...
./git-batch-commands-v2.sh commit_and_push "✅ FEAT: Adiciona sistema de login completo"
./git-batch-commands-v2.sh back_to_main
```

### Exemplo 2: Bug Fix

```bash
./git-batch-commands-v2.sh update_main
./git-batch-commands-v2.sh create_branch bugfix/header-responsivo
# Corrigir bug...
./git-batch-commands-v2.sh commit_and_push "🐛 FIX: Corrige responsividade do header"
./git-batch-commands-v2.sh merge_to_main  # Merge direto + cleanup
```

### Exemplo 3: Experimento

```bash
./git-batch-commands-v2.sh update_main
./git-batch-commands-v2.sh create_branch experiment/new-ui
# Experimentar...
./git-batch-commands-v2.sh commit_and_push "🧪 EXPERIMENT: Testa nova interface"
# Se não gostar, só fazer: ./git-batch-commands-v2.sh back_to_main
```

---

## ✨ VANTAGENS

1. **🎯 Exatamente como pediu**: Comandos específicos que você queria
2. **🚀 Rápido**: Um comando para cada ação
3. **🔒 Seguro**: Confirmações e validações automáticas
4. **📱 Flexível**: Use manual ou automatizado
5. **🎨 Claro**: Emojis e mensagens descritivas

---

**🎯 Agora você pode usar exatamente o workflow que pediu!** ✅
