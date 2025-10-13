#!/bin/bash

# 🤖 Script de Configuração Rápida do TRAE.ai
# Para o projeto Quiz Flow Pro Verso

set -e  # Para em caso de erro

echo "🤖 =============================================="
echo "   TRAE.ai - Configuração Rápida"
echo "   Quiz Flow Pro Verso"
echo "=============================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para perguntar sim/não
ask_yes_no() {
    while true; do
        read -p "$1 (s/n): " yn
        case $yn in
            [Ss]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Por favor, responda s ou n.";;
        esac
    done
}

# Verificar se Node.js está instalado
echo -e "${BLUE}📦 Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Por favor, instale Node.js primeiro.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) encontrado${NC}"
echo ""

# Verificar se npm está instalado
echo -e "${BLUE}📦 Verificando npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado. Por favor, instale npm primeiro.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v) encontrado${NC}"
echo ""

# Verificar se git está instalado
echo -e "${BLUE}📦 Verificando git...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ git não encontrado. Por favor, instale git primeiro.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ git $(git --version | cut -d' ' -f3) encontrado${NC}"
echo ""

# Instalar TRAE CLI
if ask_yes_no "Deseja instalar o TRAE CLI?"; then
    echo -e "${BLUE}📥 Instalando TRAE CLI...${NC}"
    npm install -g @trae/cli 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Falha ao instalar globalmente. Tentando localmente...${NC}"
        npm install --save-dev @trae/cli
    }
    echo -e "${GREEN}✅ TRAE CLI instalado${NC}"
else
    echo -e "${YELLOW}⏭️  Pulando instalação do TRAE CLI${NC}"
fi
echo ""

# Verificar se arquivo de configuração existe
if [ -f ".trae.yaml" ]; then
    echo -e "${GREEN}✅ Arquivo .trae.yaml já existe${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo .trae.yaml não encontrado (deveria ter sido criado)${NC}"
fi
echo ""

# Criar arquivo .traerc se não existir
if [ ! -f ".traerc" ]; then
    if ask_yes_no "Deseja criar o arquivo .traerc de configuração local?"; then
        echo -e "${BLUE}📝 Criando .traerc...${NC}"
        cat > .traerc << EOF
{
  "workspace_id": "",
  "project_path": "$(pwd)",
  "editor": "vscode",
  "ai_model": "gpt-4",
  "auto_sync": true,
  "features": {
    "code_review": true,
    "auto_complete": true,
    "context_aware": true
  }
}
EOF
        echo -e "${GREEN}✅ Arquivo .traerc criado${NC}"
        echo -e "${YELLOW}⚠️  Lembre-se de adicionar seu workspace_id no arquivo .traerc${NC}"
    fi
else
    echo -e "${GREEN}✅ Arquivo .traerc já existe${NC}"
fi
echo ""

# Criar arquivo .env.trae se não existir
if [ ! -f ".env.trae" ]; then
    if ask_yes_no "Deseja criar o arquivo .env.trae para variáveis de ambiente?"; then
        echo -e "${BLUE}📝 Criando .env.trae...${NC}"
        cat > .env.trae << EOF
# TRAE.ai Configuration
TRAE_API_KEY=
TRAE_WORKSPACE_ID=
TRAE_ENVIRONMENT=development

# Optional: Advanced Settings
TRAE_AI_MODEL=gpt-4
TRAE_MAX_CONTEXT_SIZE=8000
TRAE_AUTO_SYNC=true
EOF
        echo -e "${GREEN}✅ Arquivo .env.trae criado${NC}"
        echo -e "${YELLOW}⚠️  Lembre-se de adicionar suas credenciais no arquivo .env.trae${NC}"
    fi
else
    echo -e "${GREEN}✅ Arquivo .env.trae já existe${NC}"
fi
echo ""

# Login no TRAE
if command -v trae &> /dev/null; then
    if ask_yes_no "Deseja fazer login no TRAE agora?"; then
        echo -e "${BLUE}🔐 Fazendo login no TRAE...${NC}"
        trae login || echo -e "${YELLOW}⚠️  Login falhou ou foi cancelado${NC}"
    fi
    echo ""
    
    # Verificar status
    if ask_yes_no "Deseja verificar o status da conexão?"; then
        echo -e "${BLUE}🔍 Verificando status...${NC}"
        trae status || echo -e "${YELLOW}⚠️  Não conectado ao TRAE${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  TRAE CLI não está disponível. Execute 'npm install -g @trae/cli' primeiro.${NC}"
fi
echo ""

# Informações finais
echo ""
echo -e "${GREEN}=============================================="
echo "   ✅ Configuração Concluída!"
echo "=============================================="
echo ""
echo -e "${BLUE}📚 Próximos passos:${NC}"
echo ""
echo "1. Configure suas credenciais:"
echo "   - Edite .env.trae com suas chaves de API"
echo "   - Edite .traerc com seu workspace_id"
echo ""
echo "2. Conecte seu repositório:"
echo "   trae workspace create --name 'Quiz Flow Pro Verso' --repo 'giselegal/quiz-flow-pro-verso'"
echo ""
echo "3. Sincronize com o workspace:"
echo "   trae sync"
echo ""
echo "4. Leia o guia completo:"
echo "   cat TRAE_INTEGRATION_GUIDE.md"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE: Nunca commite arquivos com credenciais!${NC}"
echo "   Os seguintes arquivos já estão no .gitignore:"
echo "   - .traerc"
echo "   - .env.trae"
echo "   - .trae/"
echo ""
echo -e "${GREEN}Documentação completa: TRAE_INTEGRATION_GUIDE.md${NC}"
echo ""
