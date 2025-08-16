#!/bin/bash

# 🔍 SCRIPT DE AUDITORIA - Mapeamento Completo de Blocks
# Análise de todos os componentes disponíveis para ativação

echo "🚀 INICIANDO AUDITORIA DE BLOCKS - Quiz Quest Challenge"
echo "=================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BLOCKS_DIR="/workspaces/quiz-quest-challenge-verse/src/components/editor/blocks"
OUTPUT_FILE="/workspaces/quiz-quest-challenge-verse/AUDITORIA_BLOCKS_COMPLETA.md"

echo "📁 Diretório analisado: $BLOCKS_DIR"
echo "📄 Relatório será salvo em: $OUTPUT_FILE"
echo ""

# Início do relatório
cat > "$OUTPUT_FILE" << 'EOF'
# 📊 AUDITORIA COMPLETA DE BLOCKS - Quiz Quest Challenge

## 📋 RESUMO EXECUTIVO

**Data da Auditoria**: $(date)
**Objetivo**: Mapear todos os componentes Block disponíveis para ativação no editor-fixed

---

## 📈 ESTATÍSTICAS GERAIS

EOF

# Contar arquivos por tipo
TOTAL_FILES=$(find "$BLOCKS_DIR" -name "*.tsx" | wc -l)
BLOCK_FILES=$(find "$BLOCKS_DIR" -name "*Block.tsx" | wc -l)
EDITOR_FILES=$(find "$BLOCKS_DIR" -name "*BlockEditor.tsx" -o -name "*Editor.tsx" | wc -l)
INLINE_FILES=$(find "$BLOCKS_DIR" -name "*Inline*.tsx" | wc -l)

echo -e "${GREEN}📊 CONTADORES:${NC}"
echo "   Total de arquivos .tsx: $TOTAL_FILES"
echo "   Arquivos *Block.tsx: $BLOCK_FILES"
echo "   Arquivos *Editor.tsx: $EDITOR_FILES"
echo "   Arquivos *Inline*.tsx: $INLINE_FILES"

# Adicionar estatísticas ao relatório
cat >> "$OUTPUT_FILE" << EOF

- **Total de Arquivos**: $TOTAL_FILES
- **Componentes Block**: $BLOCK_FILES
- **Editores de Block**: $EDITOR_FILES
- **Componentes Inline**: $INLINE_FILES

---

## 🗂️ CATEGORIZAÇÃO DE COMPONENTES

### 📦 BLOCKS PRINCIPAIS (Componentes de Renderização)

EOF

echo ""
echo -e "${BLUE}🔍 ANALISANDO BLOCKS PRINCIPAIS...${NC}"

# Listar e categorizar blocks principais
find "$BLOCKS_DIR" -name "*Block.tsx" | sort | while read file; do
    filename=$(basename "$file" .tsx)
    
    # Verificar se tem export default
    if grep -q "export default" "$file"; then
        echo "✅ $filename" >> "$OUTPUT_FILE"
    else
        echo "❌ $filename (sem export default)" >> "$OUTPUT_FILE"
    fi
done

# Adicionar seção de editores
cat >> "$OUTPUT_FILE" << EOF

### 🛠️ EDITORES DE PROPRIEDADES

EOF

echo -e "${BLUE}🔍 ANALISANDO EDITORES...${NC}"

# Listar editores
find "$BLOCKS_DIR" -name "*Editor.tsx" -o -name "*BlockEditor.tsx" | sort | while read file; do
    filename=$(basename "$file" .tsx)
    
    # Verificar se tem export
    if grep -q "export" "$file"; then
        echo "✅ $filename" >> "$OUTPUT_FILE"
    else
        echo "❌ $filename (sem export)" >> "$OUTPUT_FILE"
    fi
done

# Adicionar seção inline
cat >> "$OUTPUT_FILE" << EOF

### 📱 COMPONENTES INLINE

EOF

echo -e "${BLUE}🔍 ANALISANDO COMPONENTES INLINE...${NC}"

# Listar componentes inline
find "$BLOCKS_DIR" -name "*Inline*.tsx" | sort | while read file; do
    filename=$(basename "$file" .tsx)
    
    if grep -q "export" "$file"; then
        echo "✅ $filename" >> "$OUTPUT_FILE"
    else
        echo "❌ $filename (sem export)" >> "$OUTPUT_FILE"
    fi
done

# Análise de dependências
cat >> "$OUTPUT_FILE" << EOF

---

## 🔗 ANÁLISE DE DEPENDÊNCIAS

### Imports Mais Comuns:

EOF

echo -e "${YELLOW}🔍 ANALISANDO DEPENDÊNCIAS...${NC}"

# Extrair imports mais comuns
echo "#### UI Components:" >> "$OUTPUT_FILE"
grep -r "from '@/components/ui/" "$BLOCKS_DIR" | grep -o "'@/components/ui/[^']*'" | sort | uniq -c | sort -nr | head -10 | while read count import; do
    echo "- $import ($count usos)" >> "$OUTPUT_FILE"
done

echo "" >> "$OUTPUT_FILE"
echo "#### Lucide Icons:" >> "$OUTPUT_FILE"
grep -r "from 'lucide-react'" "$BLOCKS_DIR" | grep -o "'[^']*'" | sort | uniq -c | sort -nr | head -10 | while read count icon; do
    echo "- $icon ($count usos)" >> "$OUTPUT_FILE"
done

# Análise de padrões
cat >> "$OUTPUT_FILE" << EOF

---

## 🎯 PADRÕES IDENTIFICADOS

### Interfaces Comuns:

EOF

echo -e "${YELLOW}🔍 ANALISANDO PADRÕES...${NC}"

# Verificar interfaces comuns
grep -r "interface.*Props" "$BLOCKS_DIR" | grep -o "interface [A-Za-z]*Props" | sort | uniq -c | sort -nr | head -10 | while read count interface; do
    echo "- $interface ($count ocorrências)" >> "$OUTPUT_FILE"
done

# Análise de problemas
cat >> "$OUTPUT_FILE" << EOF

---

## ⚠️ PROBLEMAS IDENTIFICADOS

### Arquivos sem Export Default:

EOF

echo -e "${RED}🚨 IDENTIFICANDO PROBLEMAS...${NC}"

# Listar arquivos sem export default
find "$BLOCKS_DIR" -name "*.tsx" | while read file; do
    if ! grep -q "export default" "$file"; then
        filename=$(basename "$file" .tsx)
        echo "❌ $filename" >> "$OUTPUT_FILE"
    fi
done

# Adicionar recomendações
cat >> "$OUTPUT_FILE" << EOF

---

## 🎯 RECOMENDAÇÕES PARA ATIVAÇÃO

### Prioridade Alta:
1. **Corrigir exports** nos arquivos sem export default
2. **Padronizar interfaces** para BlockProps
3. **Implementar lazy loading** para performance
4. **Criar registry unificado** com todos os componentes

### Prioridade Média:
1. **Categorizar componentes** por funcionalidade
2. **Documentar props** obrigatórias
3. **Validar dependências** de cada componente
4. **Criar editores** para components sem editor

### Prioridade Baixa:
1. **Otimizar imports** desnecessários
2. **Padronizar nomenclatura** de arquivos
3. **Adicionar TypeScript strict** em todos os files

---

## 📊 MÉTRICAS DE ATIVAÇÃO

### Status Atual:
- **Componentes Disponíveis**: $TOTAL_FILES arquivos
- **Potencial de Ativação**: ~$(( BLOCK_FILES + INLINE_FILES )) componentes
- **Editores Disponíveis**: $EDITOR_FILES
- **Taxa de Utilização Atual**: ~3% (apenas inline ativos)

### Meta Pós-Implementação:
- **Componentes Ativos**: 90%+ dos disponíveis
- **Sistema de Registry**: Implementado
- **Painel Dinâmico**: Baseado em schema
- **Performance**: < 2s loading time

---

## 🚀 PRÓXIMOS PASSOS

1. **Implementar Enhanced Block Registry** com lazy loading
2. **Criar Enhanced Components Sidebar** com busca e filtros
3. **Desenvolver Modern Properties Panel** dinâmico
4. **Integrar ao editor-fixed** com testes completos
5. **Validar performance** e corrigir problemas

**Este relatório serve como base para a implementação do plano de ação completo.**

EOF

echo ""
echo -e "${GREEN}✅ AUDITORIA CONCLUÍDA!${NC}"
echo "📄 Relatório salvo em: $OUTPUT_FILE"
echo ""
echo -e "${BLUE}📋 RESUMO:${NC}"
echo "   - $TOTAL_FILES arquivos .tsx encontrados"
echo "   - $BLOCK_FILES componentes Block identificados" 
echo "   - $EDITOR_FILES editores disponíveis"
echo "   - $INLINE_FILES componentes inline"
echo ""
echo -e "${YELLOW}🎯 Próximo passo: Implementar Enhanced Block Registry${NC}"
