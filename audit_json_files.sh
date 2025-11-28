#!/bin/bash

echo "🔍 AUDITORIA COMPLETA DE ARQUIVOS JSON"
echo "======================================"
echo ""

mkdir -p audit_reports

echo "📋 Listando todos os arquivos JSON no projeto..."
find . -name "*.json" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/build/*" -not -path "*/.next/*" > audit_reports/json_files_list.txt

total_files=$(cat audit_reports/json_files_list.txt | wc -l)
echo "Total de arquivos JSON encontrados: $total_files"
echo ""

echo "✅ Validando sintaxe JSON..."
> audit_reports/json_validation.txt

valid_count=0
invalid_count=0

while IFS= read -r file; do
    if [ -f "$file" ]; then
        if jq empty "$file" 2>/dev/null; then
            echo "✅ $file" >> audit_reports/json_validation.txt
            ((valid_count++))
        else
            error=$(jq empty "$file" 2>&1 | head -n 1)
            echo "❌ $file - ERROR: $error" >> audit_reports/json_validation.txt
            ((invalid_count++))
        fi
    fi
done < audit_reports/json_files_list.txt

echo ""
echo "📊 Resumo da validação:"
echo "✅ Válidos: $valid_count"
echo "❌ Inválidos: $invalid_count"
echo ""

echo "📂 CATEGORIZANDO ARQUIVOS JSON"
echo "==============================="
echo ""

echo "=== CONFIGURAÇÃO ===" > audit_reports/config_files.txt
find . \( -name "package.json" -o -name "package-lock.json" -o -name "tsconfig*.json" -o -name "*.config.json" \) -not -path "*/node_modules/*" -not -path "*/.next/*" >> audit_reports/config_files.txt 2>/dev/null
config_count=$(tail -n +2 audit_reports/config_files.txt | wc -l)
echo "Configs: $config_count"

echo "=== DADOS DE QUIZ ===" > audit_reports/quiz_files.txt
find . \( -name "*quiz*.json" -o -name "*question*.json" \) -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/audit_reports/*" >> audit_reports/quiz_files.txt 2>/dev/null
quiz_count=$(tail -n +2 audit_reports/quiz_files.txt | wc -l)
echo "Quiz files: $quiz_count"

echo ""
echo "🔬 ANALISANDO ESTRUTURA DOS ARQUIVOS DE QUIZ"
echo "============================================="
echo ""

quiz_analyzed=0
for file in $(find . -name "*quiz*.json" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/audit_reports/*" | head -10); do
    if [ -f "$file" ]; then
        echo "📄 $file"
        if jq empty "$file" 2>/dev/null; then
            echo "   Versão: $(jq -r '.version // "N/A"' "$file" 2>/dev/null)"
            echo "   Metadata: $(jq 'has("metadata")' "$file" 2>/dev/null)"
            echo "   Sections: $(jq '.sections | length // 0' "$file" 2>/dev/null)"
            ((quiz_analyzed++))
        fi
        echo ""
    fi
done

echo "✅ Fase 1 concluída: $quiz_analyzed quiz analisados"
