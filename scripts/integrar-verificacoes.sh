#!/bin/bash

# Script para integrar as funções adicionais ao verificador da Etapa 01

# Cores para saída no terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RESET='\033[0m'

echo -e "${BLUE}🔧 Integrando verificações adicionais da Etapa 01...${RESET}"

# Caminhos para os arquivos
SCRIPT_PRINCIPAL="/workspaces/quiz-quest-challenge-verse/scripts/verificar-step01.js"
SCRIPT_ADICIONAL="/workspaces/quiz-quest-challenge-verse/scripts/verificar-step01-additions.js"
SCRIPT_NAVEGACAO="/workspaces/quiz-quest-challenge-verse/scripts/verificar-step01-nav-validacoes.js"
SCRIPT_INTEGRADO="/workspaces/quiz-quest-challenge-verse/scripts/verificar-step01-completo.js"

# Verificar se os arquivos existem
if [ ! -f "$SCRIPT_PRINCIPAL" ]; then
    echo -e "${RED}❌ Script principal não encontrado em: $SCRIPT_PRINCIPAL${RESET}"
    exit 1
fi

if [ ! -f "$SCRIPT_ADICIONAL" ]; then
    echo -e "${RED}❌ Script adicional não encontrado em: $SCRIPT_ADICIONAL${RESET}"
    exit 1
fi

if [ ! -f "$SCRIPT_NAVEGACAO" ]; then
    echo -e "${RED}❌ Script de navegação não encontrado em: $SCRIPT_NAVEGACAO${RESET}"
    exit 1
fi

# Combinar os arquivos
echo -e "${YELLOW}📦 Combinando os scripts...${RESET}"

# Copiar o conteúdo do script principal até antes da última função (compararComStepsComplete)
sed '/async function compararComStepsComplete/,$d' "$SCRIPT_PRINCIPAL" > "$SCRIPT_INTEGRADO"

# Adicionar as funções adicionais
cat "$SCRIPT_ADICIONAL" >> "$SCRIPT_INTEGRADO"

# Adicionar as funções de navegação e validações visuais
cat "$SCRIPT_NAVEGACAO" >> "$SCRIPT_INTEGRADO"

# Adicionar as funções de navegação e validações visuais
cat "$SCRIPT_NAVEGACAO" >> "$SCRIPT_INTEGRADO"

# Adicionar a função compararComStepsComplete e a chamada para verificarStep01
# Substituir a sequência de funções com a nova sequência correta
awk '/async function compararComStepsComplete/,/verificarStep01()/ {
    if (/verificarValidacoes\(\);/) {
        print "    // 7. Verificar navegação e CTA";
        print "    verificarNavegacao();";
        print "";
        print "    // 8. Verificar validações visuais e funcionais";
        print "    verificarValidacoesVisuais();";
        print "";
        print "    // 9. Verificar hooks configurados";
        print "    verificarHooks();";
        print "";
        print "    // 10. Verificar schema de dados";
        print "    verificarSchema();";
        print "";
        print "    // 11. Verificar integração com Supabase";
        print "    verificarSupabase();";
        print "";
        print "    // 12. Verificar index e layout";
        print "    verificarIndexELayout();";
        print "";
        print "    // 13. Comparar com quiz21StepsComplete";
    } else {
        print;
    }
}' "$SCRIPT_PRINCIPAL" >> "$SCRIPT_INTEGRADO"

# Tornar o script integrado executável
chmod +x "$SCRIPT_INTEGRADO"

echo -e "${GREEN}✅ Script integrado criado com sucesso em: $SCRIPT_INTEGRADO${RESET}"

# Executar o script integrado
echo -e "${BLUE}🚀 Executando verificação completa...${RESET}"
node "$SCRIPT_INTEGRADO"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Verificação concluída com sucesso!${RESET}"
else
    echo -e "${RED}❌ A verificação encontrou problemas.${RESET}"
fi
