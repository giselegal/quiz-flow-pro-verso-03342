# 🤖 Guia de Integração com TRAE.ai

## 📋 O que é TRAE?

TRAE (Trae.ai) é uma plataforma de IA para desenvolvimento que ajuda a:
- Gerenciar e executar tarefas de desenvolvimento
- Colaborar com agentes de IA
- Automatizar workflows de desenvolvimento
- Integrar com GitHub e outras ferramentas

---

## 🚀 Passos para Conectar este Repositório ao TRAE

### 1️⃣ **Criar Conta no TRAE**

1. Acesse: [https://trae.ai](https://trae.ai)
2. Crie uma conta ou faça login
3. Conecte sua conta do GitHub

### 2️⃣ **Instalar CLI do TRAE (Opcional)**

```bash
# Via npm
npm install -g @trae/cli

# Ou via yarn
yarn global add @trae/cli

# Verificar instalação
trae --version
```

### 3️⃣ **Configurar Workspace no TRAE**

#### Opção A: Via Interface Web
1. No dashboard do TRAE, clique em **"New Workspace"**
2. Selecione **"Connect GitHub Repository"**
3. Escolha este repositório: `giselegal/quiz-flow-pro-verso`
4. Configure as permissões necessárias

#### Opção B: Via CLI
```bash
# Fazer login
trae login

# Conectar repositório
trae workspace create \
  --name "Quiz Flow Pro Verso" \
  --repo "giselegal/quiz-flow-pro-verso" \
  --branch "main"
```

### 4️⃣ **Criar Arquivo de Configuração do TRAE**

Crie um arquivo `.trae.yaml` na raiz do projeto:

```yaml
# .trae.yaml
name: quiz-flow-pro-verso
version: 1.0.0

# Configurações do ambiente
environment:
  node_version: "18.x"
  package_manager: npm
  
# Scripts principais
scripts:
  dev: npm run dev
  build: npm run build
  test: npm test
  lint: npm run lint

# Diretórios importantes
paths:
  source: src
  build: dist
  tests: src/__tests__
  
# Configurações de IA
ai:
  enabled: true
  context_files:
    - "src/**/*.{ts,tsx,js,jsx}"
    - "docs/**/*.md"
    - "README.md"
    - "package.json"
  ignore:
    - "node_modules/**"
    - "dist/**"
    - "build/**"
    - ".git/**"

# Integrações
integrations:
  github:
    enabled: true
    auto_pr: false
  vscode:
    enabled: true
```

### 5️⃣ **Criar Arquivo .traerc (Configuração Local)**

```json
{
  "workspace_id": "SEU_WORKSPACE_ID_AQUI",
  "project_path": "/workspaces/quiz-flow-pro-verso",
  "editor": "vscode",
  "ai_model": "gpt-4",
  "auto_sync": true,
  "features": {
    "code_review": true,
    "auto_complete": true,
    "context_aware": true
  }
}
```

### 6️⃣ **Configurar VS Code (se usando VS Code)**

Instale a extensão do TRAE:
1. Abra VS Code
2. Vá em Extensions (Ctrl+Shift+X)
3. Pesquise "Trae"
4. Instale a extensão oficial
5. Recarregue o VS Code

### 7️⃣ **Adicionar ao .gitignore**

```bash
# Adicione estas linhas ao .gitignore
.trae/
.traerc
.trae-cache/
*.trae.log
```

---

## 🔐 Configurar Variáveis de Ambiente

Crie um arquivo `.env.trae` (não commitar):

```bash
# .env.trae
TRAE_API_KEY=your_api_key_here
TRAE_WORKSPACE_ID=your_workspace_id
TRAE_ENVIRONMENT=development

# Opcional: Configurações avançadas
TRAE_AI_MODEL=gpt-4
TRAE_MAX_CONTEXT_SIZE=8000
TRAE_AUTO_SYNC=true
```

---

## 📝 Comandos Úteis do TRAE

```bash
# Verificar status da conexão
trae status

# Sincronizar com o workspace remoto
trae sync

# Executar uma tarefa
trae task run "nome-da-tarefa"

# Fazer deploy
trae deploy

# Ver logs
trae logs

# Ajuda
trae help
```

---

## 🔗 Conectar via SSH (Remote Development)

Se você está usando **Remote-SSH** no VS Code:

1. **Configurar SSH Config:**
```bash
# ~/.ssh/config
Host trae-remote
    HostName your-trae-workspace.trae.ai
    User your-username
    IdentityFile ~/.ssh/id_rsa_trae
    Port 22
```

2. **Conectar no VS Code:**
   - Pressione `F1`
   - Digite "Remote-SSH: Connect to Host"
   - Selecione `trae-remote`

3. **Abrir o projeto:**
```bash
cd /workspaces/quiz-flow-pro-verso
code .
```

---

## 🎯 Configuração Específica para Este Projeto

### Contexto do Projeto
- **Framework:** React + TypeScript + Vite
- **Roteamento:** Wouter
- **UI:** Tailwind CSS + shadcn/ui
- **Estado:** Context API + Custom Hooks
- **Deploy:** Netlify/Vercel ready

### Arquivos Importantes para o TRAE
```yaml
# Arquivos que o TRAE deve priorizar para contexto
priority_files:
  - src/App.tsx
  - src/main.tsx
  - vite.config.ts
  - package.json
  - tsconfig.json
  - tailwind.config.js
  - src/components/**/*.tsx
  - src/pages/**/*.tsx
  - docs/**/*.md
```

---

## 🛠️ Troubleshooting

### Problema: "Cannot connect to TRAE workspace"
**Solução:**
```bash
# Verificar credenciais
trae auth status

# Re-autenticar
trae logout
trae login
```

### Problema: "Workspace not found"
**Solução:**
```bash
# Listar workspaces disponíveis
trae workspace list

# Re-configurar workspace
trae workspace configure
```

### Problema: "Permission denied"
**Solução:**
- Verifique se você tem permissões no repositório GitHub
- Verifique se o token do TRAE tem as permissões corretas
- Re-autorize a aplicação no GitHub

---

## 📚 Recursos Adicionais

- 📖 [Documentação Oficial do TRAE](https://docs.trae.ai)
- 💬 [Discord do TRAE](https://discord.gg/trae)
- 🎥 [Tutoriais em Vídeo](https://trae.ai/tutorials)
- 🐛 [Reportar Issues](https://github.com/trae-ai/trae/issues)

---

## 🎉 Próximos Passos

Após conectar ao TRAE:

1. ✅ Configure os agentes de IA para ajudar no desenvolvimento
2. ✅ Configure workflows automatizados
3. ✅ Integre com CI/CD
4. ✅ Configure revisões automáticas de código
5. ✅ Explore os templates e snippets da comunidade

---

## ⚠️ Notas Importantes

- **Segurança:** Nunca commite credenciais ou tokens no repositório
- **Performance:** O TRAE pode consumir recursos; monitore o uso
- **Custos:** Verifique os limites do seu plano
- **Backups:** Sempre mantenha backups antes de usar automações

---

## 📞 Suporte

Se precisar de ajuda:
- Email: support@trae.ai
- Discord: [Servidor da Comunidade](https://discord.gg/trae)
- GitHub Discussions: [trae-ai/trae](https://github.com/trae-ai/trae/discussions)

---

**Última atualização:** Outubro 2025  
**Versão do guia:** 1.0.0
