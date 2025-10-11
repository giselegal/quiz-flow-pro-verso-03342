# ⚡ COMANDOS RÁPIDOS - CHEAT SHEET

## 🚀 **ABERTURA RÁPIDA**

```bash
# Abrir menu do editor
./scripts/open-editor.sh

# Abrir ferramentas
./scripts/template-tools.sh

# Validar template
node scripts/validate-template.js
```

---

## 🎯 **ACESSO DIRETO (URLs)**

```bash
# EDITOR (editar template)
http://localhost:5173/editor?template=quiz21StepsComplete

# QUIZ (testar)
http://localhost:5173/quiz-estilo

# ADMIN (gerenciar)
http://localhost:5173/admin/modelos-funis
```

---

## 💾 **BACKUPS**

```bash
# Backup manual com timestamp
cp src/templates/quiz21StepsComplete.ts backups/quiz21StepsComplete_$(date +%Y%m%d_%H%M%S).ts

# Via script
./scripts/template-tools.sh  # Opção 5
```

---

## 🔍 **BUSCA E ANÁLISE**

```bash
# Buscar em step específico
grep -A 30 "'step-5'" src/templates/quiz21StepsComplete.ts

# Contar blocos
grep -c "type: '" src/templates/quiz21StepsComplete.ts

# Listar tipos de blocos
grep "type: '" src/templates/quiz21StepsComplete.ts | sed "s/.*type: '//" | sed "s/'.*//" | sort | uniq -c
```

---

## 📊 **ESTATÍSTICAS**

```bash
# Linhas de código
wc -l src/templates/quiz21StepsComplete.ts

# Tamanho do arquivo
ls -lh src/templates/quiz21StepsComplete.ts

# Via script (mais completo)
./scripts/template-tools.sh  # Opção 3
```

---

## 🧪 **VALIDAÇÃO**

```bash
# Validação completa
node scripts/validate-template.js

# Verificar se todos os steps existem
for i in {1..20}; do grep -q "'step-$i'" src/templates/quiz21StepsComplete.ts && echo "✅ step-$i" || echo "❌ step-$i"; done

# Verificar componentes críticos
grep -o "type: '[^']*'" src/templates/quiz21StepsComplete.ts | sort | uniq
```

---

## 🖥️ **SERVIDOR**

```bash
# Iniciar servidor
npm run dev

# Verificar se está rodando
pgrep -f "vite"

# Ver logs
tail -f /tmp/vite-server.log

# Parar servidor
pkill -f "vite"
```

---

## 📝 **EDIÇÃO RÁPIDA**

```bash
# Abrir template no VS Code
code src/templates/quiz21StepsComplete.ts

# Buscar e editar step específico
code src/templates/quiz21StepsComplete.ts:1130  # Step 1

# Ver diff das alterações
git diff src/templates/quiz21StepsComplete.ts
```

---

## 🔗 **GIT**

```bash
# Status
git status src/templates/quiz21StepsComplete.ts

# Diff
git diff src/templates/quiz21StepsComplete.ts

# Commit
git add src/templates/quiz21StepsComplete.ts
git commit -m "feat: update quiz template"

# Reverter alterações
git checkout src/templates/quiz21StepsComplete.ts
```

---

## 📚 **DOCUMENTAÇÃO**

```bash
# Ver guia completo
cat GUIA_COMO_EDITAR_NO_EDITOR.md | less

# Ver estrutura JSON
cat TEMPLATE_JSON_QUIZ_21_STEPS.json | jq '.' | less

# Ver conexão quiz-template
cat CONEXAO_QUIZ_ESTILO_E_TEMPLATE.md | less

# Ver resumo dos scripts
cat SCRIPTS_AUTOMACAO_RESUMO.md | less
```

---

## 🎨 **WORKFLOW RECOMENDADO**

```bash
# 1. Validar antes de editar
node scripts/validate-template.js

# 2. Fazer backup
cp src/templates/quiz21StepsComplete.ts backups/backup_$(date +%Y%m%d_%H%M%S).ts

# 3. Abrir editor
./scripts/open-editor.sh

# 4. Testar alterações
# (Fazer edições no navegador)

# 5. Validar novamente
node scripts/validate-template.js

# 6. Commit se tudo OK
git add src/templates/quiz21StepsComplete.ts
git commit -m "feat: update template"
```

---

## 🆘 **TROUBLESHOOTING**

```bash
# Limpar cache
rm -rf node_modules/.vite

# Reinstalar dependências
npm install

# Reiniciar servidor
pkill -f "vite" && npm run dev

# Verificar porta 5173
lsof -i :5173
```

---

## 🎯 **ATALHOS DO TECLADO (No Editor)**

| Atalho | Ação |
|--------|------|
| `Ctrl + S` | Salvar |
| `Ctrl + Z` | Desfazer |
| `Ctrl + Y` | Refazer |
| `Delete` | Deletar bloco |
| `↑ / ↓` | Navegar blocos |
| `← / →` | Navegar steps |
| `Esc` | Fechar painel |

---

## 📋 **ALIASES ÚTEIS**

Adicione ao seu `~/.bashrc` ou `~/.zshrc`:

```bash
# Aliases do Quiz
alias qeditor='cd /workspaces/quiz-quest-challenge-verse && ./scripts/open-editor.sh'
alias qtools='cd /workspaces/quiz-quest-challenge-verse && ./scripts/template-tools.sh'
alias qvalidate='cd /workspaces/quiz-quest-challenge-verse && node scripts/validate-template.js'
alias qbackup='cd /workspaces/quiz-quest-challenge-verse && cp src/templates/quiz21StepsComplete.ts backups/backup_$(date +%Y%m%d_%H%M%S).ts'
alias qstats='cd /workspaces/quiz-quest-challenge-verse && wc -l src/templates/quiz21StepsComplete.ts'
```

Depois de adicionar, execute: `source ~/.bashrc` (ou `source ~/.zshrc`)

**Uso:**
```bash
qeditor    # Abre menu do editor
qtools     # Abre ferramentas
qvalidate  # Valida template
qbackup    # Faz backup
qstats     # Mostra estatísticas
```

---

## 🔥 **COMANDOS MAIS USADOS (TOP 5)**

```bash
# 1. Abrir editor
./scripts/open-editor.sh

# 2. Validar template
node scripts/validate-template.js

# 3. Fazer backup
cp src/templates/quiz21StepsComplete.ts backups/backup_$(date +%Y%m%d_%H%M%S).ts

# 4. Ver estatísticas
./scripts/template-tools.sh  # Opção 3

# 5. Buscar em step
./scripts/template-tools.sh  # Opção 2
```

---

**Salve este arquivo para referência rápida!** 📌
