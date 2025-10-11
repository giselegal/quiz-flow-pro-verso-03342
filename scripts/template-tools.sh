#!/bin/bash

# 🎨 Script de Automação: Edição Rápida de Templates
# Comandos úteis para trabalhar com o template quiz21StepsComplete

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${CYAN}════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}   🎨 FERRAMENTAS DE EDIÇÃO DO TEMPLATE${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════${NC}\n"

# Menu principal
while true; do
    echo -e "${BLUE}═══ MENU PRINCIPAL ═══${NC}\n"
    echo -e "${YELLOW}1)${NC}  📝 Ver estrutura do template (JSON)"
    echo -e "${YELLOW}2)${NC}  🔍 Buscar em um step específico"
    echo -e "${YELLOW}3)${NC}  📊 Ver estatísticas do template"
    echo -e "${YELLOW}4)${NC}  🧪 Validar estrutura do template"
    echo -e "${YELLOW}5)${NC}  💾 Fazer backup do template"
    echo -e "${YELLOW}6)${NC}  📋 Copiar URL do editor"
    echo -e "${YELLOW}7)${NC}  🚀 Abrir editor no navegador"
    echo -e "${YELLOW}8)${NC}  📚 Ver documentação"
    echo -e "${YELLOW}0)${NC}  ❌ Sair\n"
    
    read -p "Escolha uma opção: " option
    echo ""
    
    case $option in
        1)
            echo -e "${GREEN}📝 Abrindo JSON do template...${NC}\n"
            
            if [ -f "TEMPLATE_JSON_QUIZ_21_STEPS.json" ]; then
                cat TEMPLATE_JSON_QUIZ_21_STEPS.json | jq '.' 2>/dev/null || cat TEMPLATE_JSON_QUIZ_21_STEPS.json
                echo ""
            else
                echo -e "${RED}❌ Arquivo TEMPLATE_JSON_QUIZ_21_STEPS.json não encontrado${NC}\n"
            fi
            
            read -p "Pressione ENTER para continuar..."
            clear
            ;;
            
        2)
            echo -e "${GREEN}🔍 Buscar em step específico${NC}\n"
            read -p "Digite o número do step (1-20): " step_num
            
            if [ "$step_num" -ge 1 ] && [ "$step_num" -le 20 ]; then
                echo -e "\n${BLUE}📦 Buscando step-$step_num...${NC}\n"
                
                grep -A 50 "\"step-$step_num\"" src/templates/quiz21StepsComplete.ts | head -60
                echo ""
            else
                echo -e "${RED}❌ Número inválido. Use 1-20${NC}\n"
            fi
            
            read -p "Pressione ENTER para continuar..."
            clear
            ;;
            
        3)
            echo -e "${GREEN}📊 ESTATÍSTICAS DO TEMPLATE${NC}\n"
            
            TEMPLATE_FILE="src/templates/quiz21StepsComplete.ts"
            
            if [ -f "$TEMPLATE_FILE" ]; then
                LINES=$(wc -l < "$TEMPLATE_FILE")
                STEPS=$(grep -c "^  'step-" "$TEMPLATE_FILE" || echo "0")
                BLOCKS=$(grep -c "type: '" "$TEMPLATE_FILE" || echo "0")
                
                echo -e "${BLUE}📄 Arquivo:${NC} $TEMPLATE_FILE"
                echo -e "${BLUE}📏 Linhas de código:${NC} $LINES"
                echo -e "${BLUE}🎯 Total de steps:${NC} $STEPS"
                echo -e "${BLUE}📦 Total de blocos:${NC} $BLOCKS"
                echo -e "${BLUE}📊 Média de blocos/step:${NC} $((BLOCKS / STEPS))\n"
                
                echo -e "${CYAN}Tipos de blocos encontrados:${NC}"
                grep "type: '" "$TEMPLATE_FILE" | sed "s/.*type: '//" | sed "s/'.*//" | sort | uniq -c | sort -rn
                echo ""
            else
                echo -e "${RED}❌ Template não encontrado${NC}\n"
            fi
            
            read -p "Pressione ENTER para continuar..."
            clear
            ;;
            
        4)
            echo -e "${GREEN}🧪 Validando estrutura do template...${NC}\n"
            
            TEMPLATE_FILE="src/templates/quiz21StepsComplete.ts"
            
            if [ -f "$TEMPLATE_FILE" ]; then
                echo -e "${BLUE}✅ Verificações:${NC}\n"
                
                # Verificar exportação
                if grep -q "export const QUIZ_STYLE_21_STEPS_TEMPLATE" "$TEMPLATE_FILE"; then
                    echo -e "  ✅ Export QUIZ_STYLE_21_STEPS_TEMPLATE encontrado"
                else
                    echo -e "  ${RED}❌ Export QUIZ_STYLE_21_STEPS_TEMPLATE não encontrado${NC}"
                fi
                
                # Verificar steps
                for i in {1..20}; do
                    if grep -q "'step-$i'" "$TEMPLATE_FILE"; then
                        echo -e "  ✅ step-$i definido"
                    else
                        echo -e "  ${RED}❌ step-$i não encontrado${NC}"
                    fi
                done
                
                echo ""
            else
                echo -e "${RED}❌ Template não encontrado${NC}\n"
            fi
            
            read -p "Pressione ENTER para continuar..."
            clear
            ;;
            
        5)
            echo -e "${GREEN}💾 Fazendo backup do template...${NC}\n"
            
            TEMPLATE_FILE="src/templates/quiz21StepsComplete.ts"
            BACKUP_DIR="backups"
            TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
            BACKUP_FILE="$BACKUP_DIR/quiz21StepsComplete_$TIMESTAMP.ts"
            
            mkdir -p "$BACKUP_DIR"
            
            if [ -f "$TEMPLATE_FILE" ]; then
                cp "$TEMPLATE_FILE" "$BACKUP_FILE"
                echo -e "${BLUE}✅ Backup criado:${NC}"
                echo -e "   $BACKUP_FILE\n"
                
                ls -lh "$BACKUP_FILE"
                echo ""
            else
                echo -e "${RED}❌ Template não encontrado${NC}\n"
            fi
            
            read -p "Pressione ENTER para continuar..."
            clear
            ;;
            
        6)
            echo -e "${GREEN}📋 URLs úteis:${NC}\n"
            
            EDITOR_URL="http://localhost:5173/editor?template=quiz21StepsComplete"
            QUIZ_URL="http://localhost:5173/quiz-estilo"
            
            echo -e "${CYAN}EDITOR (para editar):${NC}"
            echo -e "  $EDITOR_URL\n"
            
            echo -e "${CYAN}QUIZ (para testar):${NC}"
            echo -e "  $QUIZ_URL\n"
            
            echo -e "${YELLOW}💡 Copie e cole no navegador${NC}\n"
            
            read -p "Pressione ENTER para continuar..."
            clear
            ;;
            
        7)
            echo -e "${GREEN}🚀 Abrindo editor...${NC}\n"
            
            # Verificar servidor
            if ! pgrep -f "vite" > /dev/null; then
                echo -e "${YELLOW}⚠️  Servidor não está rodando${NC}"
                echo -e "${BLUE}Iniciando servidor...${NC}\n"
                npm run dev > /tmp/vite-server.log 2>&1 &
                sleep 15
            fi
            
            EDITOR_URL="http://localhost:5173/editor?template=quiz21StepsComplete"
            
            if [ -n "$BROWSER" ]; then
                "$BROWSER" "$EDITOR_URL" 2>/dev/null &
                echo -e "${GREEN}✅ Editor aberto no navegador${NC}\n"
            else
                echo -e "${YELLOW}📋 Abra esta URL no navegador:${NC}"
                echo -e "${GREEN}$EDITOR_URL${NC}\n"
            fi
            
            read -p "Pressione ENTER para continuar..."
            clear
            ;;
            
        8)
            echo -e "${GREEN}📚 DOCUMENTAÇÃO DISPONÍVEL:${NC}\n"
            
            DOCS=(
                "GUIA_COMO_EDITAR_NO_EDITOR.md"
                "TEMPLATE_JSON_QUIZ_21_STEPS.json"
                "CONEXAO_QUIZ_ESTILO_E_TEMPLATE.md"
                "ANALISE_CONFIGURACAO_QUIZ_21_STEPS.md"
            )
            
            for doc in "${DOCS[@]}"; do
                if [ -f "$doc" ]; then
                    echo -e "  ✅ $doc"
                else
                    echo -e "  ${YELLOW}⚠️  $doc (não encontrado)${NC}"
                fi
            done
            
            echo -e "\n${YELLOW}Deseja abrir algum documento? (1-4, ou 0 para voltar)${NC}"
            read -p "Escolha: " doc_choice
            
            if [ "$doc_choice" -ge 1 ] && [ "$doc_choice" -le 4 ]; then
                selected_doc="${DOCS[$((doc_choice-1))]}"
                if [ -f "$selected_doc" ]; then
                    echo ""
                    cat "$selected_doc" | less
                fi
            fi
            
            clear
            ;;
            
        0)
            echo -e "${BLUE}👋 Até logo!${NC}\n"
            exit 0
            ;;
            
        *)
            echo -e "${RED}❌ Opção inválida!${NC}\n"
            sleep 2
            clear
            ;;
    esac
done
