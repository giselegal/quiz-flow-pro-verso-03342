#!/bin/bash

# Script para executar a verificação completa da Etapa 01 e gerar relatório com todas as verificações adicionais

# Cores para saída no terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RESET='\033[0m'

echo -e "${BLUE}🔍 Iniciando verificação completa da Etapa 01 com todas as verificações...${RESET}"

# Integrar os scripts primeiro
./scripts/integrar-verificacoes.sh

# Verificar se o script integrado foi criado com sucesso
if [ ! -f "./scripts/verificar-step01-completo.js" ]; then
    echo -e "${RED}❌ O script integrado não foi criado corretamente.${RESET}"
    exit 1
fi

# Executar o script integrado e salvar o resultado em um arquivo HTML
echo -e "${YELLOW}📊 Gerando relatório HTML...${RESET}"

# Caminho para o relatório HTML
REPORT_PATH="./step01-verification-report.html"

# Executar o script e converter Markdown para HTML
node ./scripts/verificar-step01-completo.js && 
echo -e "${GREEN}✅ Relatório Markdown gerado com sucesso!${RESET}" &&
echo -e "${YELLOW}🔄 Convertendo para HTML...${RESET}" &&
if command -v npx &> /dev/null; then
    # Instalar markdown-it se necessário
    if ! npm list -g markdown-it &> /dev/null; then
        echo -e "${YELLOW}📦 Instalando markdown-it...${RESET}"
        npm install --no-save markdown-it
    fi
    
    # Converter para HTML com estilo
    npx markdown-it ./step01-verification-report.md > "$REPORT_PATH" &&
    
    # Adicionar estilos ao HTML
    sed -i '1s/^/<html><head><meta charset="UTF-8"><title>Relatório de Verificação da Etapa 01<\/title><style>body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;line-height:1.6;max-width:1000px;margin:0 auto;padding:20px;color:#333}h1{color:#2563eb;border-bottom:2px solid #2563eb;padding-bottom:10px}h2{color:#4f46e5;margin-top:30px}h3{color:#7c3aed}pre{background:#f3f4f6;padding:15px;border-radius:5px;overflow:auto}code{background:#f3f4f6;padding:2px 5px;border-radius:3px;font-family:monospace}ul{padding-left:25px}li{margin:5px 0}.error{color:#ef4444;font-weight:bold}.success{color:#22c55e;font-weight:bold}table{border-collapse:collapse;width:100%;margin:20px 0}table,th,td{border:1px solid #e5e7eb}th,td{padding:10px;text-align:left}th{background:#f9fafb}<\/style><\/head><body>/' "$REPORT_PATH" &&
    echo '</body></html>' >> "$REPORT_PATH" &&
    
    # Substituir marcadores por ícones de emoji
    sed -i 's/✅/<span class="success">✅<\/span>/g' "$REPORT_PATH" &&
    sed -i 's/❌/<span class="error">❌<\/span>/g' "$REPORT_PATH" &&
    
    echo -e "${GREEN}✅ Relatório HTML gerado com sucesso em: $REPORT_PATH${RESET}" &&
    
    # Perguntar se deseja abrir o relatório
    echo -e "${YELLOW}Deseja abrir o relatório HTML? (s/n)${RESET}"
    read -r resposta
    if [[ "$resposta" =~ ^[Ss]$ ]]; then
        # Tentar abrir o relatório com o browser padrão
        if command -v xdg-open &> /dev/null; then
            xdg-open "$REPORT_PATH"
        elif command -v open &> /dev/null; then
            open "$REPORT_PATH"
        else
            echo -e "${YELLOW}Não foi possível abrir o relatório automaticamente. Abra-o manualmente em: $REPORT_PATH${RESET}"
        fi
    fi
else
    echo -e "${YELLOW}npx não encontrado. Relatório disponível apenas em formato Markdown em: ./step01-verification-report.md${RESET}"
fi

echo -e "${BLUE}------------------------------------${RESET}"
echo -e "${BLUE}🔍 Verificação da Etapa 01 concluída${RESET}"
echo -e "${BLUE}------------------------------------${RESET}"
