# 🤖 Scripts de Automação para Editor do Quiz

Ferramentas automatizadas para facilitar o acesso e edição do template `quiz21StepsComplete`.

## 📦 **SCRIPTS DISPONÍVEIS**

### **1️⃣ `open-editor.sh` - Abrir Editor Interativo**
Script principal para abrir o editor no navegador.

**Uso:**
```bash
./scripts/open-editor.sh
```

**Menu interativo:**
- **Opção 1**: Abrir EDITOR (editar template)
- **Opção 2**: Abrir QUIZ (testar em produção)
- **Opção 3**: Abrir DASHBOARD ADMIN (gerenciar modelos)
- **Opção 4**: Abrir TODOS (3 abas)
- **Opção 5**: Ver LOGS do servidor
- **Opção 0**: Sair

**Recursos:**
- ✅ Detecta se servidor está rodando
- ✅ Inicia servidor automaticamente se necessário
- ✅ Abre URLs no navegador
- ✅ Mostra dicas e guias rápidos

---

### **2️⃣ `template-tools.sh` - Ferramentas de Template**
Utilitários para trabalhar com o template.

**Uso:**
```bash
./scripts/template-tools.sh
```

**Menu interativo:**
- **Opção 1**: Ver estrutura do template (JSON)
- **Opção 2**: Buscar em um step específico
- **Opção 3**: Ver estatísticas do template
- **Opção 4**: Validar estrutura do template
- **Opção 5**: Fazer backup do template
- **Opção 6**: Copiar URL do editor
- **Opção 7**: Abrir editor no navegador
- **Opção 8**: Ver documentação
- **Opção 0**: Sair

---

### **3️⃣ `validate-template.js` - Validador de Template**
Script Node.js para validar a integridade do template.

**Uso:**
```bash
node scripts/validate-template.js
```

**O que valida:**
- ✅ Exportação principal (`QUIZ_STYLE_21_STEPS_TEMPLATE`)
- ✅ Todos os 20 steps (`step-1` até `step-20`)
- ✅ Tipos de blocos e componentes
- ✅ Componentes críticos (result-header-inline, fashion-ai-generator, etc.)
- ✅ Variáveis de personalização (`{userName}`, `{resultStyle}`, etc.)
- ✅ Sistema de pontuação (8 estilos)

**Saída:**
```
════════════════════════════════════════════════════════
   🧪 VALIDADOR DE TEMPLATE - quiz21StepsComplete
════════════════════════════════════════════════════════

✅ Arquivo encontrado
📄 Caminho: src/templates/quiz21StepsComplete.ts

═══ ESTATÍSTICAS BÁSICAS ═══
📏 Linhas: 3742
📝 Caracteres: 245,891
💾 Tamanho: 240.13 KB

═══ VALIDAÇÕES ═══

✅ Export QUIZ_STYLE_21_STEPS_TEMPLATE encontrado
⚠️  IS_TEST detectado - pode afetar carregamento em testes

═══ VERIFICAÇÃO DE STEPS ═══
✅ step-1
✅ step-2
...
✅ step-20

════════════════════════════════════════════════════════
   📊 RESUMO DA VALIDAÇÃO
════════════════════════════════════════════════════════

📦 Total de blocos: 387
🎨 Tipos únicos: 23
🎯 Steps encontrados: 20/20
💎 Estilos encontrados: 8/8

✅ Template válido! Nenhum erro encontrado.
```

---

## 🚀 **ATALHOS NPM (Adicionais)**

Adicione estes scripts ao seu `package.json`:

```json
{
  "scripts": {
    "editor": "./scripts/open-editor.sh",
    "tools": "./scripts/template-tools.sh",
    "editor:open": "./scripts/open-editor.sh",
    "template:validate": "node scripts/validate-template.js",
    "template:backup": "mkdir -p backups && cp src/templates/quiz21StepsComplete.ts backups/quiz21StepsComplete_$(date +%Y%m%d_%H%M%S).ts",
    "template:stats": "echo '📊 Stats:' && wc -l src/templates/quiz21StepsComplete.ts"
  }
}
```

**Uso:**
```bash
npm run editor           # Abre menu interativo do editor
npm run tools            # Abre menu de ferramentas
npm run template:validate # Valida o template
npm run template:backup  # Cria backup com timestamp
npm run template:stats   # Mostra estatísticas
```

---

## 📋 **EXEMPLOS DE USO**

### **Exemplo 1: Abrir editor rapidamente**
```bash
# Opção A: Usar o script
./scripts/open-editor.sh

# Opção B: Usar atalho npm
npm run editor
```

### **Exemplo 2: Validar template antes de editar**
```bash
node scripts/validate-template.js
```

### **Exemplo 3: Fazer backup antes de mudanças grandes**
```bash
# Cria backup em backups/quiz21StepsComplete_20251011_153000.ts
npm run template:backup
```

### **Exemplo 4: Ver estatísticas do template**
```bash
./scripts/template-tools.sh
# Escolha opção 3: Ver estatísticas
```

### **Exemplo 5: Buscar conteúdo de um step específico**
```bash
./scripts/template-tools.sh
# Escolha opção 2: Buscar em step específico
# Digite: 20 (para ver o step de resultado)
```

---

## 🛠️ **INSTALAÇÃO E CONFIGURAÇÃO**

### **1. Tornar scripts executáveis** (já feito)
```bash
chmod +x scripts/*.sh
```

### **2. Verificar Node.js instalado**
```bash
node --version  # Deve ser >= 18.x
```

### **3. Testar scripts**
```bash
# Testar validador
node scripts/validate-template.js

# Testar menu interativo
./scripts/open-editor.sh
```

---

## 📚 **ESTRUTURA DE ARQUIVOS**

```
scripts/
├── open-editor.sh           ← Menu interativo para abrir editor
├── template-tools.sh        ← Ferramentas de template
├── validate-template.js     ← Validador de integridade
└── npm-shortcuts.json       ← Atalhos sugeridos para package.json
```

---

## 🔍 **TROUBLESHOOTING**

### **Problema: "Permission denied"**
```bash
chmod +x scripts/*.sh
```

### **Problema: "Server não está rodando"**
O script detecta automaticamente e inicia o servidor:
```bash
npm run dev > /tmp/vite-server.log 2>&1 &
```

### **Problema: "Navegador não abre automaticamente"**
Configure a variável `$BROWSER`:
```bash
export BROWSER="/usr/bin/google-chrome"
# ou
export BROWSER="/usr/bin/firefox"
```

### **Problema: "Template não encontrado"**
Verifique se o arquivo existe:
```bash
ls -lh src/templates/quiz21StepsComplete.ts
```

---

## 💡 **DICAS PRO**

### **Dica 1: Alias no shell**
Adicione ao seu `~/.bashrc` ou `~/.zshrc`:
```bash
alias editor='cd /workspaces/quiz-quest-challenge-verse && ./scripts/open-editor.sh'
alias validate='cd /workspaces/quiz-quest-challenge-verse && node scripts/validate-template.js'
```

### **Dica 2: Validar antes de commit**
Adicione ao `.git/hooks/pre-commit`:
```bash
#!/bin/bash
echo "🧪 Validando template..."
node scripts/validate-template.js
if [ $? -ne 0 ]; then
    echo "❌ Validação falhou! Corrija os erros antes de commitar."
    exit 1
fi
```

### **Dica 3: Backup automático diário**
Adicione ao crontab:
```bash
0 2 * * * cd /workspaces/quiz-quest-challenge-verse && npm run template:backup
```

---

## 🎯 **WORKFLOW RECOMENDADO**

1. **Antes de editar:**
   ```bash
   npm run template:validate  # Verificar integridade
   npm run template:backup    # Criar backup
   ```

2. **Durante edição:**
   ```bash
   npm run editor             # Abrir editor
   ```

3. **Após edição:**
   ```bash
   npm run template:validate  # Verificar novamente
   git diff src/templates/quiz21StepsComplete.ts  # Revisar mudanças
   ```

4. **Testar:**
   ```bash
   ./scripts/open-editor.sh   # Opção 2: Abrir Quiz
   ```

---

## 📊 **ESTATÍSTICAS DO TEMPLATE**

Execute `./scripts/template-tools.sh` (opção 3) para ver:

- 📏 **Linhas de código**: 3,742
- 🎯 **Total de steps**: 20
- 📦 **Total de blocos**: ~400
- 🎨 **Tipos únicos**: 23
- 💎 **Estilos disponíveis**: 8
- 📊 **Média blocos/step**: ~20

---

## 🤝 **CONTRIBUINDO**

Para adicionar novos scripts:

1. Crie o arquivo em `scripts/`
2. Torne executável: `chmod +x scripts/seu-script.sh`
3. Adicione documentação neste README
4. Teste antes de commitar

---

## 📞 **SUPORTE**

Se tiver problemas com os scripts:

1. Verifique os logs: `tail -f /tmp/vite-server.log`
2. Teste manualmente: `npm run dev`
3. Limpe cache: `rm -rf node_modules/.vite`
4. Reinicie o servidor

---

**Última atualização**: 11 de outubro de 2025

**Criado por**: Sistema de Automação do Quiz Quest Challenge Verse
