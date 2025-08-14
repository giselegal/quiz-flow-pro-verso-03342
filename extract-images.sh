#!/bin/bash

# Script para extrair informações de imagens de todas as etapas
echo "# 📸 INVENTÁRIO DE IMAGENS POR ETAPA - QUIZ DE ESTILO"
echo ""
echo "## 📊 ANÁLISE COMPLETA DAS 21 ETAPAS"
echo ""

for i in {1..21}; do
    step_file="src/config/templates/step-$(printf "%02d" $i).json"
    
    if [ -f "$step_file" ]; then
        echo "### 🎯 ETAPA $i"
        
        # Extrair nome da etapa
        name=$(grep -o '"name": "[^"]*"' "$step_file" | head -1 | sed 's/"name": "\(.*\)"/\1/')
        description=$(grep -o '"description": "[^"]*"' "$step_file" | head -1 | sed 's/"description": "\(.*\)"/\1/')
        
        echo "- **Nome**: $name"
        echo "- **Descrição**: $description"
        echo ""
        
        # Verificar se tem logoUrl
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
            grep -n -A 2 -B 2 '"src":' "$step_file" | while read line; do
                if [[ $line == *"src"* ]]; then
                    url=$(echo "$line" | sed 's/.*"src": "\([^"]*\)".*/\1/')
                    echo "- $url"
                fi
            done
            echo ""
        fi
        
        # Verificar se tem imageUrl em options
        option_image_count=$(grep -c '"imageUrl":' "$step_file" 2>/dev/null || echo 0)
        if [ $option_image_count -gt 0 ]; then
            echo "**🎨 IMAGENS DE OPÇÕES** ($option_image_count encontradas):"
            
            # Extrair informações das opções com imagens
            grep -n -A 3 -B 3 '"imageUrl":' "$step_file" | while IFS= read -r line; do
                if [[ $line == *"text"* ]]; then
                    text=$(echo "$line" | sed 's/.*"text": "\([^"]*\)".*/\1/')
                    echo "  - **Opção**: $text"
                elif [[ $line == *"imageUrl"* ]]; then
                    url=$(echo "$line" | sed 's/.*"imageUrl": "\([^"]*\)".*/\1/')
                    echo "    - **URL**: $url"
                elif [[ $line == *"styleCategory"* ]]; then
                    category=$(echo "$line" | sed 's/.*"styleCategory": "\([^"]*\)".*/\1/')
                    echo "    - **Categoria**: $category"
                    echo ""
                fi
            done
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
