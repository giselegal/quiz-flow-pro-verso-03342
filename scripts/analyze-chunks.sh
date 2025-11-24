#!/bin/bash
# 📊 Análise de Chunks - Quiz Flow Pro
# Compara chunks antes/depois do refinamento

echo "📊 ANÁLISE DE CODE SPLITTING - REFINADO"
echo "========================================"
echo ""

if [ ! -d "dist/assets" ]; then
    echo "❌ Diretório dist/assets não encontrado. Execute 'npm run build' primeiro."
    exit 1
fi

echo "🎯 CHUNKS DO EDITOR (subdivididos):"
echo "-----------------------------------"
ls -lh dist/assets/editor-*.js 2>/dev/null | awk '{printf "%-50s %10s\n", $9, $5}' | sed 's|dist/assets/||' || echo "Nenhum chunk de editor encontrado"

echo ""
echo "🎯 CHUNKS DE VENDORS (isolados):"
echo "---------------------------------"
ls -lh dist/assets/vendor-*.js 2>/dev/null | awk '{printf "%-50s %10s\n", $9, $5}' | sed 's|dist/assets/||' | sort -k2 -h || echo "Nenhum chunk de vendor encontrado"

echo ""
echo "🎯 CHUNKS DE APLICAÇÃO:"
echo "-----------------------"
ls -lh dist/assets/app-*.js 2>/dev/null | awk '{printf "%-50s %10s\n", $9, $5}' | sed 's|dist/assets/||' | sort -k2 -h || echo "Nenhum chunk de app encontrado"

echo ""
echo "📈 RESUMO ESTATÍSTICO:"
echo "----------------------"

# Total de chunks
total_chunks=$(ls -1 dist/assets/*.js 2>/dev/null | wc -l)
echo "Total de chunks JS: $total_chunks"

# Tamanho total
total_size=$(du -sh dist/assets/*.js 2>/dev/null | tail -1 | awk '{print $1}')
echo "Tamanho total: $total_size"

# Maior chunk
echo ""
echo "🔴 MAIOR CHUNK:"
ls -lh dist/assets/*.js 2>/dev/null | sort -k5 -h | tail -1 | awk '{printf "%-50s %10s\n", $9, $5}' | sed 's|dist/assets/||'

echo ""
echo "✅ MENOR CHUNK:"
ls -lh dist/assets/*.js 2>/dev/null | grep -v "\.js\s*0" | sort -k5 -h | head -1 | awk '{printf "%-50s %10s\n", $9, $5}' | sed 's|dist/assets/||'

echo ""
echo "📊 TOP 10 MAIORES CHUNKS:"
echo "-------------------------"
ls -lh dist/assets/*.js 2>/dev/null | sort -k5 -hr | head -10 | awk '{printf "%-50s %10s\n", $9, $5}' | sed 's|dist/assets/||'

echo ""
echo "✅ Análise completa!"
