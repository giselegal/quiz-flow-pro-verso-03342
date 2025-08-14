#!/bin/bash

# Script para extrair todas as imagens das 21 etapas do quiz

echo "# 📸 INVENTÁRIO DE IMAGENS POR ETAPA - QUIZ DE ESTILO"
echo ""
echo "## 📊 ANÁLISE COMPLETA DAS 21 ETAPAS"
echo ""

# Iterar por todas as 21 etapas
for i in {1..21}; do
    step_file="src/config/templates/step-$(printf "%02d" $i).json"
    
    echo "### 🎯 ETAPA $i"
    
    if [ -f "$step_file" ]; then
        # Extrair o nome e descrição da etapa
        step_name=$(grep -o '"name": "[^"]*"' "$step_file" | head -1 | sed 's/"name": "\(.*\)"/\1/' | tr -d '\r')
        step_description=$(grep -o '"description": "[^"]*"' "$step_file" | head -1 | sed 's/"description": "\(.*\)"/\1/' | tr -d '\r')
        
        echo "- **Nome**: $step_name"
        echo "- **Descrição**: $step_description"
        echo ""
        
        # Verificar se tem logo
        logo_count=$(grep -c '"logoUrl":' "$step_file" 2>/dev/null || echo 0)
        if [ $logo_count -gt 0 ]; then
            logo_url=$(grep -o '"logoUrl": "[^"]*"' "$step_file" | head -1 | sed 's/"logoUrl": "\(.*\)"/\1/')
            echo "**🏷️ LOGO**: $logo_url"
            echo ""
        fi
        
        # Verificar se tem imagens inline
        image_count=$(grep -c '"src":' "$step_file" 2>/dev/null || echo 0)
        if [ $image_count -gt 0 ]; then
            echo "**🖼️ IMAGENS INLINE** ($image_count encontradas):"
            grep -o '"src": "[^"]*"' "$step_file" | sed 's/"src": "\(.*\)"/\1/' | while read url; do
                if [ -n "$url" ]; then
                    echo "- $url"
                fi
            done
            echo ""
        fi
        
        # Verificar se tem imageUrl em options
        option_image_count=$(grep -c '"imageUrl":' "$step_file" 2>/dev/null || echo 0)
        if [ $option_image_count -gt 0 ]; then
            echo "**🎨 IMAGENS DE OPÇÕES** ($option_image_count encontradas):"
            
            # Processar arquivo JSON para extrair opções estruturadas
            python3 -c "
import json
import sys

try:
    with open('$step_file', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Buscar por options-grid
    if 'components' in data:
        for comp in data['components']:
            if comp.get('type') == 'options-grid' and 'options' in comp:
                for option in comp['options']:
                    if 'text' in option and 'imageUrl' in option:
                        print(f'  - **Opção**: {option[\"text\"]}')
                        print(f'    - **URL**: {option[\"imageUrl\"]}')
                        if 'styleCategory' in option:
                            print(f'    - **Categoria**: {option[\"styleCategory\"]}')
                        print('')
except Exception as e:
    print(f'  Erro ao processar JSON: {e}')
"
            echo ""
        fi
        
        echo "---"
        echo ""
        
    else
        echo "### ⚠️ ETAPA $i - ARQUIVO NÃO ENCONTRADO"
        echo "- **Arquivo**: $step_file não existe"
        echo ""
        echo "---"
        echo ""
    fi
done

echo ""
echo "## 📈 RESUMO ESTATÍSTICO"
echo ""

# Contar totais
total_files=0
total_logos=0
total_inline_images=0
total_option_images=0

for i in {1..21}; do
    step_file="src/config/templates/step-$(printf "%02d" $i).json"
    if [ -f "$step_file" ]; then
        total_files=$((total_files + 1))
        
        logo_count=$(grep -c '"logoUrl":' "$step_file" 2>/dev/null || echo 0)
        total_logos=$((total_logos + logo_count))
        
        image_count=$(grep -c '"src":' "$step_file" 2>/dev/null || echo 0)
        total_inline_images=$((total_inline_images + image_count))
        
        option_image_count=$(grep -c '"imageUrl":' "$step_file" 2>/dev/null || echo 0)
        total_option_images=$((total_option_images + option_image_count))
    fi
done

echo "- **Arquivos de Template**: $total_files/21 encontrados"
echo "- **Total de Logos**: $total_logos"
echo "- **Total de Imagens Inline**: $total_inline_images"  
echo "- **Total de Imagens de Opções**: $total_option_images"
echo "- **TOTAL GERAL DE IMAGENS**: $((total_logos + total_inline_images + total_option_images))"
echo ""
echo "*Relatório gerado em $(date)*"
