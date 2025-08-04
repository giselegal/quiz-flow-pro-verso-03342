#!/bin/bash

# 🎨 SCRIPT PARA APLICAR CORES DA MARCA
# Substitui todas as cores não-brand por cores da marca

echo "🎨 Aplicando cores da marca nos componentes..."

# Lista de arquivos para processar
FILES=(
  "src/components/blocks/CheckboxBlock.tsx"
  "src/components/blocks/DateBlock.tsx"
  "src/components/blocks/ImageBlock.tsx"
  "src/components/blocks/NumberBlock.tsx"
  "src/components/blocks/QuizBlock.tsx"
  "src/components/blocks/SelectBlock.tsx"
  "src/components/blocks/SliderBlock.tsx"
  "src/components/blocks/TextBlock.tsx"
  "src/components/blocks/UIGridCardBlock.tsx"
  "src/components/blocks/WebsiteBlock.tsx"
  "src/components/blocks/EmailBlock.tsx"
  "src/components/editor/StepsColumn.tsx"
  "src/components/editor/PropertiesPanel.tsx"
  "src/components/editor/UniversalBlockRenderer.tsx"
  "src/components/QuizEditor.tsx"
  "src/components/index.ts"
)

# Função para aplicar substituições
apply_color_migration() {
  local file="$1"
  
  if [ ! -f "$file" ]; then
    echo "⚠️  Arquivo não encontrado: $file"
    return
  fi
  
  echo "🔄 Processando: $(basename $file)"
  
  # Backup do arquivo original
  cp "$file" "${file}.backup"
  
  # Substituições de cores azuis
  sed -i 's/bg-blue-50/bg-[#B89B7A]\/10/g' "$file"
  sed -i 's/bg-blue-100/bg-[#B89B7A]\/20/g' "$file"
  sed -i 's/bg-blue-500/bg-[#B89B7A]/g' "$file"
  sed -i 's/bg-blue-600/bg-[#B89B7A]/g' "$file"
  sed -i 's/bg-blue-700/bg-[#A38A69]/g' "$file"
  
  sed -i 's/text-blue-600/text-[#B89B7A]/g' "$file"
  sed -i 's/text-blue-700/text-[#A38A69]/g' "$file"
  sed -i 's/text-blue-900/text-[#432818]/g' "$file"
  
  sed -i 's/border-blue-200/border-[#B89B7A]\/30/g' "$file"
  sed -i 's/border-blue-300/border-[#B89B7A]\/40/g' "$file"
  sed -i 's/border-blue-400/border-[#B89B7A]/g' "$file"
  sed -i 's/border-blue-500/border-[#B89B7A]/g' "$file"
  
  sed -i 's/ring-blue-500/ring-[#B89B7A]/g' "$file"
  sed -i 's/focus:ring-blue-500/focus:ring-[#B89B7A]/g' "$file"
  
  # Substituições de cores amarelas (para neutro)
  sed -i 's/bg-yellow-100/bg-stone-100/g' "$file"
  sed -i 's/text-yellow-800/text-stone-700/g' "$file"
  
  # Substituições de cores laranjas
  sed -i 's/bg-orange-50/bg-[#B89B7A]\/10/g' "$file"
  sed -i 's/border-orange-300/border-[#B89B7A]\/40/g' "$file"
  sed -i 's/text-orange-600/text-[#B89B7A]/g' "$file"
  
  # Substituições de cores roxas
  sed -i 's/text-purple-600/text-[#B89B7A]/g' "$file"
  
  # Cores indigo → brand
  sed -i 's/bg-indigo-50/bg-[#B89B7A]\/10/g' "$file"
  sed -i 's/bg-indigo-100/bg-[#B89B7A]\/20/g' "$file"
  sed -i 's/bg-indigo-500/bg-[#B89B7A]/g' "$file"
  sed -i 's/bg-indigo-600/bg-[#B89B7A]/g' "$file"
  sed -i 's/text-indigo-600/text-[#B89B7A]/g' "$file"
  sed -i 's/border-indigo-500/border-[#B89B7A]/g' "$file"
  
  # Verificar se houve mudanças
  if ! cmp -s "$file" "${file}.backup"; then
    echo "✅ Cores atualizadas em: $(basename $file)"
  else
    echo "ℹ️  Nenhuma cor para atualizar em: $(basename $file)"
    rm "${file}.backup"
  fi
}

# Processar todos os arquivos
echo "📁 Processando arquivos de componentes..."
for file in "${FILES[@]}"; do
  if [ -f "/workspaces/quiz-quest-challenge-verse/$file" ]; then
    apply_color_migration "/workspaces/quiz-quest-challenge-verse/$file"
  fi
done

# Processar arquivos de templates de steps
echo "📁 Processando templates de steps..."
if [ -d "/workspaces/quiz-quest-challenge-verse/src/data/stepTemplates" ]; then
  find "/workspaces/quiz-quest-challenge-verse/src/data/stepTemplates" -name "*.ts" -type f | while read -r file; do
    apply_color_migration "$file"
  done
fi

# Cores específicas que devem permanecer estratégicas
echo "🎯 Verificando cores estratégicas..."

# Verde deve ser usado apenas para CTAs de sucesso
echo "🟢 Verificando uso de verde (deve ser estratégico)..."
grep -r "bg-green\|text-green\|border-green" /workspaces/quiz-quest-challenge-verse/src --include="*.tsx" --include="*.ts" | head -5

# Vermelho deve ser usado apenas para CTAs de urgência
echo "🔴 Verificando uso de vermelho (deve ser estratégico)..."
grep -r "bg-red\|text-red\|border-red" /workspaces/quiz-quest-challenge-verse/src --include="*.tsx" --include="*.ts" | head -5

echo ""
echo "✨ Migração de cores concluída!"
echo "📋 Resumo:"
echo "   • Azul → Cores da marca (#B89B7A)"
echo "   • Amarelo → Tons neutros (stone)"
echo "   • Laranja → Cores da marca"
echo "   • Roxo → Cores da marca"
echo "   • Verde/Vermelho → Mantidos para uso estratégico"
echo ""
echo "🔍 Próximos passos:"
echo "   1. Revisar arquivos .backup se necessário"
echo "   2. Testar a aplicação"
echo "   3. Ajustar cores estratégicas conforme necessário"
