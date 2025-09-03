# 🚀 GUIA RÁPIDO - COMANDOS GIT

================================

## Scripts Criados:

### 1. **Script Interativo**: `./scripts/git-quick-commands.sh`

Menu interativo com 9 opções principais:

- Status, pull, rebase, squash, merge, commit, reset, limpeza

### 2. **Aliases Úteis**: `source scripts/git-aliases.sh`

Carrega 40+ aliases e funções para comandos git rápidos

---

## 🔥 COMANDOS MAIS USADOS:

### **Commits Rápidos:**

```bash
gqc "feat: nova funcionalidade"  # add + commit + push
gqc "fix: corrigir bug login"    # tudo numa linha só
```

### **Branches:**

```bash
gnb "feature/nova-feature"       # criar nova branch + push
gco main                        # mudar para main
gbd nome-branch                 # deletar branch local
```

### **Rebase & Merge:**

```bash
grbm                           # rebase com main (da feature branch)
gmtm                           # merge para main + opção deletar branch
gsq 3                          # squash últimos 3 commits
```

### **Status & Logs:**

```bash
gst                           # status resumido
glog                          # log bonito com graph
gs                            # status completo
```

### **Push Seguro:**

```bash
gsp                           # push com confirmação se for main
gpsf                          # force push with lease
```

---

## ⚡ WORKFLOWS COMPLETOS:

### **Nova Feature:**

```bash
gnb "feature/minha-feature"    # 1. Criar branch
# fazer alterações...          # 2. Desenvolver
gqc "feat: implementar X"      # 3. Commit e push
gmtm                          # 4. Merge para main
```

### **Bug Fix:**

```bash
gnb "fix/corrigir-login"       # 1. Criar branch
# fazer correções...           # 2. Corrigir
gqc "fix: resolver problema Y" # 3. Commit e push
gmtm                          # 4. Merge para main
```

### **Rebase Feature:**

```bash
# Na sua feature branch:
grbm                          # 1. Rebase com main
gsp                           # 2. Push seguro
```

### **Limpar Projeto:**

```bash
gcleanup                      # Limpar branches mergeadas
gstash                        # Guardar alterações
gundo                         # Desfazer último commit
```

---

## 🛠️ INSTALAÇÃO:

### **Opção 1: Temporário**

```bash
source scripts/git-aliases.sh
```

### **Opção 2: Permanente**

```bash
echo 'source /caminho/para/scripts/git-aliases.sh' >> ~/.bashrc
source ~/.bashrc
```

### **Script Interativo:**

```bash
chmod +x scripts/git-quick-commands.sh
./scripts/git-quick-commands.sh
```

---

## 📋 LISTA COMPLETA DE ALIASES:

| Alias    | Comando                     | Descrição           |
| -------- | --------------------------- | ------------------- |
| `gs`     | `git status`                | Status completo     |
| `gst`    | `git status --short`        | Status resumido     |
| `ga`     | `git add`                   | Adicionar arquivo   |
| `gaa`    | `git add .`                 | Adicionar tudo      |
| `gc`     | `git commit`                | Commit              |
| `gcm`    | `git commit -m`             | Commit com mensagem |
| `gp`     | `git push`                  | Push                |
| `gl`     | `git pull`                  | Pull                |
| `gco`    | `git checkout`              | Mudar branch        |
| `gcb`    | `git checkout -b`           | Criar branch        |
| `gb`     | `git branch`                | Listar branches     |
| `gbd`    | `git branch -d`             | Deletar branch      |
| `glog`   | `git log --oneline --graph` | Log bonito          |
| `grb`    | `git rebase`                | Rebase              |
| `grbi`   | `git rebase -i`             | Rebase interativo   |
| `gm`     | `git merge`                 | Merge               |
| `gstash` | `git stash`                 | Stash               |
| `gundo`  | `git reset --soft HEAD~1`   | Desfazer commit     |

### **Funções Avançadas:**

- `gqc "msg"` - Quick commit (add + commit + push)
- `gnb "branch"` - New branch (create + push upstream)
- `gmtm` - Merge to main (checkout + pull + merge + push)
- `grbm` - Rebase with main
- `gsp` - Safe push (confirms if on main)
- `gcleanup` - Clean merged branches
- `gsq N` - Squash last N commits

---

## 🎯 EXEMPLO PRÁTICO:

```bash
# 1. Carregar aliases
source scripts/git-aliases.sh

# 2. Ver status
gst

# 3. Criar nova feature
gnb "feature/botao-compartilhar"

# 4. Fazer alterações e commit
gqc "feat: adicionar botão de compartilhar"

# 5. Fazer mais commits...
gqc "style: melhorar CSS do botão"
gqc "test: adicionar testes"

# 6. Squash commits
gsq 3

# 7. Merge para main
gmtm

# 8. Limpar branches
gcleanup
```

**✅ Resultado:** Feature desenvolvida, commitada, mergeada e projeto limpo em 8 comandos!

---

## 🔧 DICAS EXTRAS:

- Use `./scripts/git-quick-commands.sh` para menu interativo
- `glog` mostra histórico visual dos commits
- `gsp` sempre confirma antes de push na main
- `gcleanup` remove branches já mergeadas
- `gsq N` ajuda a manter histórico limpo

**🎉 Agora você tem git superpowers!**
