#!/bin/bash

echo "🔍 AUDITORIA COMPLETA DA ESTRUTURA DO PROJETO"
echo "=============================================="
echo ""

OUTPUT_DIR="audit_reports"
mkdir -p "$OUTPUT_DIR"

# ============================================================================
# 1. SCHEMAS E VALIDAÇÃO
# ============================================================================
echo "📋 1. AUDITANDO SCHEMAS E VALIDAÇÃO..."
{
  echo "# 📋 SCHEMAS E VALIDAÇÃO"
  echo ""
  echo "## Arquivos Zod Schema"
  find . -name "*.schema.ts" -o -name "*Schema.ts" -not -path "*/node_modules/*" | while read f; do
    echo "- $f ($(wc -l < "$f") linhas)"
  done
  
  echo ""
  echo "## JSON Schemas"
  find . -name "*.schema.json" -not -path "*/node_modules/*" | while read f; do
    echo "- $f ($(du -h "$f" | cut -f1))"
  done
  
  echo ""
  echo "## Arquivos de Validação"
  find . -name "*validation*.ts" -o -name "*validator*.ts" -not -path "*/node_modules/*" | while read f; do
    echo "- $f ($(wc -l < "$f") linhas)"
  done
} > "$OUTPUT_DIR/01_schemas.txt"

# ============================================================================
# 2. TYPES E INTERFACES
# ============================================================================
echo "📋 2. AUDITANDO TYPES E INTERFACES..."
{
  echo "# 📋 TYPES E INTERFACES"
  echo ""
  echo "## Arquivos de Types"
  find src/types -name "*.ts" -o -name "*.d.ts" 2>/dev/null | while read f; do
    lines=$(wc -l < "$f" 2>/dev/null || echo "0")
    interfaces=$(grep -c "^export interface" "$f" 2>/dev/null || echo "0")
    types=$(grep -c "^export type" "$f" 2>/dev/null || echo "0")
    echo "- $f: $lines linhas, $interfaces interfaces, $types types"
  done
  
  echo ""
  echo "## Duplicações Potenciais (mesmo nome)"
  echo "### Interfaces Block*"
  grep -r "^export interface Block" src/types --include="*.ts" | cut -d: -f1,2 | sort
  
  echo ""
  echo "### Types Quiz*"
  grep -r "^export type Quiz" src/types --include="*.ts" | cut -d: -f1,2 | sort
  
  echo ""
  echo "### Interfaces Section*"
  grep -r "^export interface.*Section" src/types --include="*.ts" | cut -d: -f1,2 | sort
} > "$OUTPUT_DIR/02_types.txt"

# ============================================================================
# 3. REGISTRIES E MAPAS
# ============================================================================
echo "📋 3. AUDITANDO REGISTRIES..."
{
  echo "# 📋 REGISTRIES E COMPONENT MAPS"
  echo ""
  echo "## Block Registries"
  find . -name "*registry*.ts" -o -name "*Registry*.ts" -not -path "*/node_modules/*" | while read f; do
    echo "### $f"
    echo "Linhas: $(wc -l < "$f")"
    echo "Exports: $(grep -c "^export" "$f" 2>/dev/null || echo "0")"
    echo ""
  done
  
  echo "## Component Maps"
  find . -name "*ComponentMap*.ts" -o -name "*component-map*.ts" -not -path "*/node_modules/*" | while read f; do
    echo "### $f"
    echo "Linhas: $(wc -l < "$f")"
    components=$(grep -c ":" "$f" 2>/dev/null || echo "0")
    echo "Componentes mapeados: ~$components"
    echo ""
  done
} > "$OUTPUT_DIR/03_registries.txt"

# ============================================================================
# 4. COMPONENTES
# ============================================================================
echo "📋 4. AUDITANDO COMPONENTES..."
{
  echo "# 📋 COMPONENTES REACT"
  echo ""
  echo "## Estrutura de Diretórios"
  find src/components -type d -maxdepth 2 | sort | while read d; do
    count=$(find "$d" -maxdepth 1 -name "*.tsx" -o -name "*.ts" | wc -l)
    echo "- $d ($count arquivos)"
  done
  
  echo ""
  echo "## Componentes de Blocos"
  find src/components -name "*Block*.tsx" | while read f; do
    echo "- $f ($(wc -l < "$f") linhas)"
  done
  
  echo ""
  echo "## Renderers"
  find . -name "*Renderer*.tsx" -not -path "*/node_modules/*" | while read f; do
    echo "- $f ($(wc -l < "$f") linhas)"
  done
  
  echo ""
  echo "## Editores"
  find . -name "*Editor*.tsx" -not -path "*/node_modules/*" | while read f; do
    echo "- $f ($(wc -l < "$f") linhas)"
  done
} > "$OUTPUT_DIR/04_components.txt"

# ============================================================================
# 5. HOOKS
# ============================================================================
echo "📋 5. AUDITANDO HOOKS..."
{
  echo "# 📋 HOOKS REACT"
  echo ""
  echo "## Todos os Hooks"
  find src -name "use*.ts" -o -name "use*.tsx" | sort | while read f; do
    lines=$(wc -l < "$f")
    exports=$(grep -c "^export" "$f" 2>/dev/null || echo "0")
    echo "- $f: $lines linhas, $exports exports"
  done
  
  echo ""
  echo "## Hooks Duplicados (mesmo nome)"
  find src -name "use*.ts" -o -name "use*.tsx" | xargs -I {} basename {} | sort | uniq -d | while read hook; do
    echo "### $hook (duplicado em:)"
    find src -name "$hook"
  done
} > "$OUTPUT_DIR/05_hooks.txt"

# ============================================================================
# 6. SERVICES E API
# ============================================================================
echo "📋 6. AUDITANDO SERVICES E API..."
{
  echo "# 📋 SERVICES E API"
  echo ""
  echo "## Services"
  find . -path "*/services/*.ts" -not -path "*/node_modules/*" | sort | while read f; do
    lines=$(wc -l < "$f")
    functions=$(grep -c "^export.*function\|^export const.*=" "$f" 2>/dev/null || echo "0")
    echo "- $f: $lines linhas, ~$functions funções"
  done
  
  echo ""
  echo "## API Endpoints"
  find . -path "*/api/*.ts" -not -path "*/node_modules/*" | sort | while read f; do
    echo "- $f ($(wc -l < "$f") linhas)"
  done
  
  echo ""
  echo "## Clients (Supabase, etc)"
  find . -name "*client*.ts" -not -path "*/node_modules/*" | grep -E "(supabase|api)" | while read f; do
    echo "- $f ($(wc -l < "$f") linhas)"
  done
} > "$OUTPUT_DIR/06_services.txt"

# ============================================================================
# 7. UTILS E HELPERS
# ============================================================================
echo "📋 7. AUDITANDO UTILS E HELPERS..."
{
  echo "# 📋 UTILS E HELPERS"
  echo ""
  echo "## Utils"
  find src -path "*/utils/*.ts" -not -path "*/node_modules/*" | sort | while read f; do
    lines=$(wc -l < "$f")
    exports=$(grep -c "^export" "$f" 2>/dev/null || echo "0")
    echo "- $f: $lines linhas, $exports exports"
  done
  
  echo ""
  echo "## Helpers"
  find src -path "*/helpers/*.ts" -not -path "*/node_modules/*" | sort | while read f; do
    echo "- $f ($(wc -l < "$f") linhas)"
  done
  
  echo ""
  echo "## Lib"
  find src/lib -name "*.ts" -maxdepth 2 2>/dev/null | while read f; do
    echo "- $f ($(wc -l < "$f") linhas)"
  done
} > "$OUTPUT_DIR/07_utils.txt"

# ============================================================================
# 8. STORES E STATE MANAGEMENT
# ============================================================================
echo "📋 8. AUDITANDO STORES..."
{
  echo "# 📋 STORES E STATE MANAGEMENT"
  echo ""
  echo "## Zustand Stores"
  find . -name "*store*.ts" -o -name "*Store*.ts" -not -path "*/node_modules/*" | grep -v "test" | while read f; do
    lines=$(wc -l < "$f")
    actions=$(grep -c ":" "$f" 2>/dev/null || echo "0")
    echo "- $f: $lines linhas, ~$actions actions"
  done
  
  echo ""
  echo "## Contexts"
  find . -name "*Context*.tsx" -o -name "*context*.tsx" -not -path "*/node_modules/*" | while read f; do
    echo "- $f ($(wc -l < "$f") linhas)"
  done
  
  echo ""
  echo "## Providers"
  find . -name "*Provider*.tsx" -not -path "*/node_modules/*" | while read f; do
    echo "- $f ($(wc -l < "$f") linhas)"
  done
} > "$OUTPUT_DIR/08_stores.txt"

# ============================================================================
# 9. CONFIGURAÇÕES
# ============================================================================
echo "📋 9. AUDITANDO CONFIGURAÇÕES..."
{
  echo "# 📋 CONFIGURAÇÕES"
  echo ""
  echo "## Config Files TypeScript"
  find src/config -name "*.ts" 2>/dev/null | sort | while read f; do
    lines=$(wc -l < "$f")
    exports=$(grep -c "^export" "$f" 2>/dev/null || echo "0")
    echo "- $f: $lines linhas, $exports exports"
  done
  
  echo ""
  echo "## Environment e Settings"
  find . -name "*env*.ts" -o -name "*settings*.ts" -o -name "*config*.ts" -not -path "*/node_modules/*" | grep -E "src/" | while read f; do
    echo "- $f ($(wc -l < "$f") linhas)"
  done
} > "$OUTPUT_DIR/09_configs.txt"

# ============================================================================
# 10. TEMPLATES E DATA
# ============================================================================
echo "📋 10. AUDITANDO TEMPLATES E DATA..."
{
  echo "# 📋 TEMPLATES E DATA"
  echo ""
  echo "## Templates JSON"
  find src/templates -name "*.json" 2>/dev/null | while read f; do
    size=$(du -h "$f" | cut -f1)
    echo "- $f ($size)"
  done
  
  echo ""
  echo "## Data Files"
  find src -path "*/data/*.ts" -o -path "*/data/*.json" | grep -v node_modules | while read f; do
    echo "- $f ($(du -h "$f" | cut -f1))"
  done
  
  echo ""
  echo "## Mock Data"
  find . -name "*mock*.ts" -o -name "*fixture*.ts" -not -path "*/node_modules/*" | while read f; do
    echo "- $f ($(wc -l < "$f") linhas)"
  done
} > "$OUTPUT_DIR/10_templates.txt"

# ============================================================================
# 11. CORE E ARCHITECTURE
# ============================================================================
echo "📋 11. AUDITANDO CORE..."
{
  echo "# 📋 CORE E ARCHITECTURE"
  echo ""
  echo "## Core Modules"
  find src/core -name "*.ts" -o -name "*.tsx" 2>/dev/null | while read f; do
    lines=$(wc -l < "$f")
    echo "- $f: $lines linhas"
  done
  
  echo ""
  echo "## Sistema de Schema Interpreter"
  find . -name "*interpreter*.ts" -o -name "*Interpreter*.ts" -not -path "*/node_modules/*" | while read f; do
    echo "- $f ($(wc -l < "$f") linhas)"
  done
} > "$OUTPUT_DIR/11_core.txt"

# ============================================================================
# 12. ANÁLISE DE DUPLICAÇÕES
# ============================================================================
echo "📋 12. ANALISANDO DUPLICAÇÕES..."
{
  echo "# 📋 ANÁLISE DE DUPLICAÇÕES"
  echo ""
  
  echo "## Interfaces com mesmo nome"
  echo "### BlockData"
  grep -r "interface BlockData" src --include="*.ts" | cut -d: -f1 | sort
  
  echo ""
  echo "### BlockDefinition"
  grep -r "interface BlockDefinition" src --include="*.ts" | cut -d: -f1 | sort
  
  echo ""
  echo "### QuizStep"
  grep -r "interface QuizStep" src --include="*.ts" | cut -d: -f1 | sort
  
  echo ""
  echo "### Section"
  grep -r "interface.*Section[^a-zA-Z]" src --include="*.ts" | cut -d: -f1 | sort | uniq
  
  echo ""
  echo "## Functions com mesmo nome"
  echo "### createBlock"
  grep -r "function createBlock\|const createBlock" src --include="*.ts" | cut -d: -f1 | sort
  
  echo ""
  echo "### getBlockComponent"
  grep -r "function getBlockComponent\|const getBlockComponent" src --include="*.ts" | cut -d: -f1 | sort
  
  echo ""
  echo "### validateQuiz"
  grep -r "function validate.*Quiz\|const validate.*Quiz" src --include="*.ts" | cut -d: -f1 | sort
} > "$OUTPUT_DIR/12_duplications.txt"

# ============================================================================
# 13. CÓDIGOS DEPRECATED E PERDIDOS
# ============================================================================
echo "📋 13. BUSCANDO CÓDIGOS DEPRECATED..."
{
  echo "# 📋 CÓDIGOS DEPRECATED E PERDIDOS"
  echo ""
  
  echo "## Arquivos com @deprecated"
  grep -r "@deprecated" src --include="*.ts" --include="*.tsx" | cut -d: -f1 | sort | uniq | while read f; do
    count=$(grep -c "@deprecated" "$f")
    echo "- $f ($count deprecated)"
  done
  
  echo ""
  echo "## Arquivos LEGACY"
  find . -name "*legacy*" -o -name "*Legacy*" -o -name "*old*" -not -path "*/node_modules/*" | while read f; do
    echo "- $f"
  done
  
  echo ""
  echo "## Arquivos em archive/backup"
  find . -path "*archive*" -o -path "*backup*" -not -path "*/node_modules/*" | head -20 | while read f; do
    echo "- $f"
  done
  
  echo ""
  echo "## TODOs e FIXMEs"
  echo "### TODOs"
  grep -r "// TODO\|//TODO" src --include="*.ts" --include="*.tsx" | wc -l
  echo "### FIXMEs"
  grep -r "// FIXME\|//FIXME" src --include="*.ts" --include="*.tsx" | wc -l
  echo "### Warnings"
  grep -r "⚠️\|WARNING" src --include="*.ts" --include="*.tsx" | wc -l
} > "$OUTPUT_DIR/13_deprecated.txt"

# ============================================================================
# 14. ANÁLISE DE IMPORTS
# ============================================================================
echo "📋 14. ANALISANDO IMPORTS..."
{
  echo "# 📋 ANÁLISE DE IMPORTS"
  echo ""
  
  echo "## Imports mais usados"
  echo "### React"
  grep -r "from 'react'" src --include="*.tsx" --include="*.ts" | wc -l
  
  echo "### Zod"
  grep -r "from 'zod'" src --include="*.ts" | wc -l
  
  echo "### Lucide Icons"
  grep -r "from 'lucide-react'" src --include="*.tsx" | wc -l
  
  echo ""
  echo "## Imports de Types internos"
  echo "### @/types/blocks"
  grep -r "from '@/types/blocks'" src --include="*.ts" --include="*.tsx" | wc -l
  
  echo "### @/types/editor"
  grep -r "from '@/types/editor'" src --include="*.ts" --include="*.tsx" | wc -l
  
  echo "### @/types/quiz"
  grep -r "from '@/types/quiz'" src --include="*.ts" --include="*.tsx" | wc -l
  
  echo ""
  echo "## Imports de Registry"
  echo "### UnifiedBlockRegistry"
  grep -r "from.*UnifiedBlockRegistry" src --include="*.ts" --include="*.tsx" | wc -l
  
  echo "### blockRegistry"
  grep -r "from.*blockRegistry" src --include="*.ts" --include="*.tsx" | wc -l
} > "$OUTPUT_DIR/14_imports.txt"

# ============================================================================
# 15. ESTATÍSTICAS GERAIS
# ============================================================================
echo "📋 15. COLETANDO ESTATÍSTICAS..."
{
  echo "# 📋 ESTATÍSTICAS GERAIS"
  echo ""
  
  echo "## Contagem de Arquivos"
  echo "TypeScript (.ts): $(find src -name "*.ts" | wc -l)"
  echo "TypeScript React (.tsx): $(find src -name "*.tsx" | wc -l)"
  echo "JSON: $(find src -name "*.json" | wc -l)"
  echo "Definition (.d.ts): $(find src -name "*.d.ts" | wc -l)"
  
  echo ""
  echo "## Linhas de Código"
  echo "Total TS/TSX: $(find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1)"
  
  echo ""
  echo "## Top 20 Maiores Arquivos"
  find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -rn | head -20
  
  echo ""
  echo "## Diretórios com mais arquivos"
  find src -type d | while read d; do
    count=$(find "$d" -maxdepth 1 -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l)
    echo "$count $d"
  done | sort -rn | head -20
} > "$OUTPUT_DIR/15_statistics.txt"

echo ""
echo "✅ AUDITORIA COMPLETA FINALIZADA!"
echo ""
echo "📊 Relatórios gerados em: $OUTPUT_DIR/"
ls -lh "$OUTPUT_DIR/"/*.txt 2>/dev/null | awk '{print "   -", $9, "("$5")"}'
