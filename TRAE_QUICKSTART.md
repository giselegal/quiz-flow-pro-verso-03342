# 🚀 Quick Start - TRAE Integration

## ⚡ Integração Rápida (5 minutos)

### 1. Execute o script de configuração automática:

```bash
./setup-trae.sh
```

Este script irá:
- ✅ Verificar dependências (Node.js, npm, git)
- ✅ Instalar TRAE CLI (opcional)
- ✅ Criar arquivos de configuração
- ✅ Fazer login no TRAE (opcional)

### 2. Configure suas credenciais:

Edite o arquivo `.env.trae`:
```bash
nano .env.trae
```

Adicione:
```env
TRAE_API_KEY=sua_api_key_aqui
TRAE_WORKSPACE_ID=seu_workspace_id
```

### 3. Edite `.traerc`:

```bash
nano .traerc
```

Adicione seu `workspace_id`:
```json
{
  "workspace_id": "seu-workspace-id-aqui",
  ...
}
```

### 4. Conecte ao TRAE:

```bash
# Fazer login
trae login

# Criar workspace
trae workspace create \
  --name "Quiz Flow Pro Verso" \
  --repo "giselegal/quiz-flow-pro-verso" \
  --branch "main"

# Sincronizar
trae sync
```

### 5. Verificar conexão:

```bash
trae status
```

---

## 📋 Arquivos Criados

- ✅ `.trae.yaml` - Configuração principal do TRAE
- ✅ `TRAE_INTEGRATION_GUIDE.md` - Guia completo de integração
- ✅ `setup-trae.sh` - Script de configuração automática

### Arquivos que você precisa criar:

- ⚠️ `.traerc` - Configuração local (criado pelo script)
- ⚠️ `.env.trae` - Credenciais (criado pelo script, adicione suas chaves)

---

## 🔐 Segurança

**NUNCA commite estes arquivos:**
- `.traerc`
- `.env.trae`
- `.trae/`
- `*.trae.log`

✅ Eles já estão no `.gitignore`

---

## 📚 Comandos Úteis

```bash
# Status da conexão
trae status

# Listar workspaces
trae workspace list

# Sincronizar código
trae sync

# Executar tarefa
trae task run "nome-da-tarefa"

# Ver logs
trae logs

# Ajuda
trae help
```

---

## 🆘 Problemas Comuns

### "Command not found: trae"
**Solução:**
```bash
npm install -g @trae/cli
# ou
./setup-trae.sh
```

### "Authentication failed"
**Solução:**
```bash
trae logout
trae login
```

### "Workspace not found"
**Solução:**
Verifique se você adicionou o `workspace_id` correto no `.traerc`

---

## 📖 Documentação Completa

Leia: [TRAE_INTEGRATION_GUIDE.md](./TRAE_INTEGRATION_GUIDE.md)

---

## 🎯 Próximos Passos

1. ✅ Configure credenciais
2. ✅ Conecte ao workspace
3. ✅ Sincronize o código
4. ✅ Configure VS Code extension (opcional)
5. ✅ Explore recursos de IA

---

**Última atualização:** Outubro 2025
