#!/bin/bash

echo "🧹 LIMPEZA SISTÊMICA DOS TEMPLATES - REMOVENDO IMPORTS INVÁLIDOS"
echo "================================================================"

# Lista de arquivos de templates
templates=(
  "src/components/steps/Step01Template.tsx"
  "src/components/steps/Step02Template.tsx" 
  "src/components/steps/Step03Template.tsx"
  "src/components/steps/Step04Template.tsx"
  "src/components/steps/Step05Template.tsx"
  "src/components/steps/Step06Template.tsx"
  "src/components/steps/Step07Template.tsx"
  "src/components/steps/Step08Template.tsx"
  "src/components/steps/Step09Template.tsx"
  "src/components/steps/Step10Template.tsx"
  "src/components/steps/Step11Template.tsx"
  "src/components/steps/Step12Template.tsx"
  "src/components/steps/Step13Template.tsx"
  "src/components/steps/Step14Template.tsx"
  "src/components/steps/Step15Template.tsx"
  "src/components/steps/Step16Template.tsx"
  "src/components/steps/Step17Template.tsx"
  "src/components/steps/Step18Template.tsx"
  "src/components/steps/Step19Template.tsx"
  "src/components/steps/Step20Template.tsx"
  "src/components/steps/Step21Template.tsx"
)

echo "🔍 Verificando e limpando ${#templates[@]} templates..."

for template in "${templates[@]}"; do
  if [ -f "$template" ]; then
    echo "📄 Processando: $template"
    
    # Verificar se tem import inválido
    if grep -q "import.*use-mobile" "$template"; then
      echo "  ❌ Import use-mobile encontrado - removendo..."
      sed -i '/import.*use-mobile/d' "$template"
      echo "  ✅ Import removido"
    else
      echo "  ✅ Sem import use-mobile"
    fi
    
    # Verificar se tem interface ou componente React inválido
    if grep -q "export interface.*Props" "$template"; then
      echo "  ❌ Interface React encontrada - removendo..."
      # Remover desde a interface até o componente React
      sed -i '/^export interface.*Props/,/^export const getStep.*Template = () => {$/{ /^export const getStep.*Template = () => {$/!d; }' "$template"
      echo "  ✅ Interface removida"
    fi
    
    # Verificar se tem componente React inválido
    if grep -q "export const Step[0-9]* = " "$template"; then
      echo "  ❌ Componente React encontrado - removendo..."
      # Remover o componente React completo
      sed -i '/^export const Step[0-9]* = /,/^export const getStep.*Template = () => {$/{ /^export const getStep.*Template = () => {$/!d; }' "$template"
      echo "  ✅ Componente React removido"
    fi
    
    # Garantir que o arquivo comece com o export correto
    if ! head -1 "$template" | grep -q "// 🎯"; then
      echo "  🔧 Adicionando comentário padrão no início..."
      template_num=$(echo "$template" | grep -o '[0-9]\+')
      sed -i '1i // 🎯 TEMPLATE DE BLOCOS DA ETAPA '$template_num'' "$template"
    fi
    
    echo "  ✅ $template processado"
    echo ""
  else
    echo "  ❌ $template não encontrado"
  fi
done

echo ""
echo "🔍 VERIFICAÇÃO FINAL:"
echo "==================="

# Verificar se ainda há problemas
problems=0
for template in "${templates[@]}"; do
  if [ -f "$template" ]; then
    if grep -q "import.*use-mobile" "$template"; then
      echo "❌ $template ainda tem import use-mobile"
      problems=$((problems + 1))
    fi
    
    if grep -q "export interface.*Props" "$template"; then
      echo "❌ $template ainda tem interface React"
      problems=$((problems + 1))
    fi
    
    if grep -q "export const Step[0-9]* = " "$template"; then
      echo "❌ $template ainda tem componente React"
      problems=$((problems + 1))
    fi
    
    if ! grep -q "export const getStep.*Template" "$template"; then
      echo "❌ $template não tem função getStepTemplate"
      problems=$((problems + 1))
    fi
  fi
done

if [ "$problems" -eq 0 ]; then
  echo "🎉 TODOS OS TEMPLATES LIMPOS E CORRETOS!"
  echo ""
  echo "📋 PRÓXIMO PASSO: Verificar se o build funciona"
  echo "npm run build"
else
  echo "⚠️ $problems problemas ainda encontrados"
fi

echo ""
echo "🏁 LIMPEZA CONCLUÍDA"
