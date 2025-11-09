# 🔌 Conectar ao TRAE via Remote-SSH

## 📋 Informações sobre sua conexão atual

Você mencionou: `[7cc32681-f566-4d8e-bd9e-842ed5066b11][Remote -SSH(TRAE)]`

Isso indica que você está usando **VS Code Remote-SSH** conectado a um ambiente TRAE.

---

## 🎯 Configuração Completa do Remote-SSH com TRAE

### 1️⃣ **Arquivo SSH Config**

Edite ou crie: `~/.ssh/config`

```ssh
# TRAE Remote Development
Host trae-remote
    HostName your-workspace.trae.ai
    User your-username
    IdentityFile ~/.ssh/id_rsa_trae
    Port 22
    ForwardAgent yes
    ServerAliveInterval 60
    ServerAliveCountMax 3
    
# Ou usando o ID do workspace
Host trae-7cc32681
    HostName 7cc32681-f566-4d8e-bd9e-842ed5066b11.trae.ai
    User dev
    IdentityFile ~/.ssh/id_rsa_trae
    Port 22
```

### 2️⃣ **Gerar Chave SSH (se não tiver)**

```bash
# Gerar nova chave SSH
ssh-keygen -t rsa -b 4096 -C "your-email@example.com" -f ~/.ssh/id_rsa_trae

# Copiar chave pública
cat ~/.ssh/id_rsa_trae.pub
```

### 3️⃣ **Adicionar Chave ao TRAE**

1. Acesse o dashboard do TRAE
2. Vá em **Settings → SSH Keys**
3. Clique em **Add SSH Key**
4. Cole a chave pública copiada acima
5. Salve

### 4️⃣ **Conectar no VS Code**

#### Método 1: Via Command Palette
1. Pressione `F1` ou `Ctrl+Shift+P`
2. Digite: `Remote-SSH: Connect to Host`
3. Selecione `trae-remote` (ou `trae-7cc32681`)

#### Método 2: Via SSH Config
1. Clique no ícone verde no canto inferior esquerdo do VS Code
2. Selecione **"Connect to Host"**
3. Escolha sua configuração TRAE

#### Método 3: Via Terminal
```bash
# Testar conexão
ssh trae-remote

# Se funcionar, conecte via VS Code
code --remote ssh-remote+trae-remote /workspaces/quiz-flow-pro-verso
```

---

## 🔍 Identificando seu Workspace TRAE

Baseado no ID que você forneceu: `7cc32681-f566-4d8e-bd9e-842ed5066b11`

### Possíveis URLs de conexão:
```
# Formato 1: ID completo
7cc32681-f566-4d8e-bd9e-842ed5066b11.trae.ai

# Formato 2: ID curto
7cc32681.trae.ai

# Formato 3: Nome do workspace
quiz-flow-pro-verso.trae.ai
```

### Como descobrir a URL correta:

1. **Via CLI do TRAE:**
```bash
trae workspace list
trae workspace info 7cc32681-f566-4d8e-bd9e-842ed5066b11
```

2. **Via Dashboard Web:**
   - Acesse: https://trae.ai/dashboard
   - Vá em "Workspaces"
   - Encontre seu workspace
   - Copie a URL de conexão SSH

---

## ⚙️ Configuração do VS Code para Remote-SSH

### Instalar Extensão:
```
Nome: Remote - SSH
ID: ms-vscode-remote.remote-ssh
```

### Configurar settings.json:
```json
{
  "remote.SSH.configFile": "~/.ssh/config",
  "remote.SSH.showLoginTerminal": true,
  "remote.SSH.remotePlatform": {
    "trae-remote": "linux"
  },
  "remote.SSH.enableDynamicForwarding": true,
  "remote.SSH.enableRemoteCommand": true
}
```

---

## 🚀 Sincronizar Repositório Local com TRAE Remote

### Opção 1: Git Clone no Remote
```bash
# No terminal remoto (já conectado ao TRAE)
cd /workspaces
git clone https://github.com/giselegal/quiz-flow-pro-verso.git
cd quiz-flow-pro-verso
npm install
```

### Opção 2: Rsync (sincronização bidirecional)
```bash
# Do local para remoto
rsync -avz --exclude 'node_modules' \
  /workspaces/quiz-flow-pro-verso/ \
  trae-remote:/workspaces/quiz-flow-pro-verso/

# Do remoto para local
rsync -avz \
  trae-remote:/workspaces/quiz-flow-pro-verso/ \
  /workspaces/quiz-flow-pro-verso/
```

### Opção 3: SSHFS (montar pasta remota localmente)
```bash
# Instalar SSHFS (se não tiver)
# Ubuntu/Debian: sudo apt install sshfs
# macOS: brew install macfuse && brew install sshfs

# Montar
mkdir -p ~/trae-remote
sshfs trae-remote:/workspaces/quiz-flow-pro-verso ~/trae-remote

# Desmontar
umount ~/trae-remote
```

---

## 🔧 Troubleshooting

### Erro: "Connection timeout"
**Causas possíveis:**
- Firewall bloqueando porta 22
- URL de conexão incorreta
- Workspace pausado/desligado

**Solução:**
```bash
# Verificar conectividade
ping 7cc32681.trae.ai

# Testar porta SSH
nc -zv 7cc32681.trae.ai 22

# Ativar workspace (se desligado)
trae workspace start 7cc32681-f566-4d8e-bd9e-842ed5066b11
```

### Erro: "Permission denied (publickey)"
**Solução:**
```bash
# Verificar se a chave está sendo usada
ssh -vvv trae-remote

# Adicionar chave ao ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa_trae

# Verificar permissões
chmod 600 ~/.ssh/id_rsa_trae
chmod 644 ~/.ssh/id_rsa_trae.pub
```

### Erro: "Host key verification failed"
**Solução:**
```bash
# Remover entrada antiga
ssh-keygen -R 7cc32681.trae.ai

# Ou editar manualmente
nano ~/.ssh/known_hosts
```

---

## 📊 Monitorar Conexão

### Verificar status da conexão:
```bash
# No terminal local
ssh trae-remote "uptime && df -h && free -h"

# Ver processos rodando
ssh trae-remote "ps aux | grep node"
```

### Logs de conexão:
```bash
# Ver logs do SSH
tail -f ~/.ssh/ssh_debug.log

# Ver logs do VS Code Remote
code --log trace
```

---

## 🎯 Workflow Recomendado

1. **Conectar ao Remote via VS Code**
   ```
   F1 → Remote-SSH: Connect to Host → trae-remote
   ```

2. **Abrir o projeto**
   ```
   File → Open Folder → /workspaces/quiz-flow-pro-verso
   ```

3. **Instalar extensões necessárias no remote:**
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript and JavaScript Language Features

4. **Configurar terminal integrado:**
   ```json
   {
     "terminal.integrated.defaultProfile.linux": "bash",
     "terminal.integrated.cwd": "/workspaces/quiz-flow-pro-verso"
   }
   ```

5. **Iniciar desenvolvimento:**
   ```bash
   npm run dev
   ```

---

## 📚 Recursos Adicionais

- [VS Code Remote-SSH Docs](https://code.visualstudio.com/docs/remote/ssh)
- [TRAE Remote Development Guide](https://docs.trae.ai/remote)
- [SSH Config File Manual](https://man.openbsd.org/ssh_config)

---

## 🆘 Suporte

Se precisar de ajuda específica com sua conexão:

1. **Verifique seu workspace ID:**
   ```bash
   trae workspace info 7cc32681-f566-4d8e-bd9e-842ed5066b11
   ```

2. **Entre em contato com suporte TRAE:**
   - Email: support@trae.ai
   - Com o workspace ID: `7cc32681-f566-4d8e-bd9e-842ed5066b11`

---

**Última atualização:** Outubro 2025  
**Seu Workspace ID:** `7cc32681-f566-4d8e-bd9e-842ed5066b11`
