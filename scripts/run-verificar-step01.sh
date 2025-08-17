#!/bin/bash

# Script para executar a verificação do Step01 e suas configurações

# Cores para saída no terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RESET='\033[0m'

echo -e "${BLUE}🔎 Iniciando verificação completa da Etapa 01...${RESET}"

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não está instalado. Por favor, instale o Node.js para continuar.${RESET}"
    exit 1
fi

# Instalar dependências necessárias se não existirem
echo -e "${YELLOW}📦 Verificando dependências...${RESET}"
npm list prettier chalk > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}📦 Instalando dependências necessárias...${RESET}"
    npm install --no-save prettier chalk
fi

# Caminho para o script de verificação
SCRIPT_PATH="$(dirname "$0")/verificar-step01.js"

# Verificar se o script existe
if [ ! -f "$SCRIPT_PATH" ]; then
    echo -e "${RED}❌ Script de verificação não encontrado em: $SCRIPT_PATH${RESET}"
    exit 1
fi

# Executar o script de verificação
echo -e "${GREEN}✅ Executando script de verificação...${RESET}"
node "$SCRIPT_PATH"

# Verificar resultado
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Verificação concluída com sucesso!${RESET}"
    
    # Abrir o relatório se existir
    REPORT_PATH="$(dirname "$(dirname "$0")")/step01-verification-report.md"
    if [ -f "$REPORT_PATH" ]; then
        echo -e "${BLUE}📊 Relatório gerado em: $REPORT_PATH${RESET}"
        echo -e "${YELLOW}Deseja abrir o relatório? (s/n)${RESET}"
        read -r resposta
        if [[ "$resposta" =~ ^[Ss]$ ]]; then
            # Tentar abrir o relatório com o editor padrão
            if command -v code &> /dev/null; then
                code "$REPORT_PATH"
            else
                echo -e "${YELLOW}O VS Code não está disponível. Abra o relatório manualmente em: $REPORT_PATH${RESET}"
            fi
        fi
    else
        echo -e "${YELLOW}⚠️ Relatório não foi gerado em: $REPORT_PATH${RESET}"
    fi
else
    echo -e "${RED}❌ A verificação encontrou problemas. Verifique o relatório para detalhes.${RESET}"
fi

echo -e "${BLUE}------------------------------------${RESET}"
echo -e "${BLUE}🔍 Verificação da Etapa 01 concluída${RESET}"
echo -e "${BLUE}------------------------------------${RESET}"
