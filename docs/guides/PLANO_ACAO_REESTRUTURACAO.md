# 🚀 Plano de Ação: Reestruturação do Projeto

## 📋 **CHECKLIST DE MIGRAÇÃO**

### **🧹 FASE 1: LIMPEZA IMEDIATA** (Próximas 2-3 horas)

#### **✅ 1.1 Organizar Documentação**
```bash
# Criar estrutura de docs
mkdir -p docs/{architecture,analysis,reports,status,guides}

# Mover arquivos de análise
mv ANALISE_*.md docs/analysis/
mv RELATORIO_*.md docs/reports/
mv STATUS_*.md docs/status/
mv CHECKLIST_*.md docs/guides/
mv DOCUMENTACAO_*.md docs/guides/
mv GUIA_*.md docs/guides/

# Criar README para docs
echo "# 📚 Documentação do Projeto\n\nEsta pasta contém toda a documentação técnica e análises do projeto." > docs/README.md
```

#### **✅ 1.2 Remover Arquivos Temporários**
```bash
# Remover arquivos temporários na raiz
rm -f src/temp-*.ts
rm -f src/typescript-disable-*.ts
rm -f src/global-suppress.d.ts
rm -f src/temp-global-types.d.ts
rm -f src/skipTypeCheck.ts

# Remover pastas temporárias
rm -rf src/temp/
rm -rf src/legacy/

# Limpar scripts obsoletos
rm -f *.cjs
rm -f *.mjs
rm -f test-*.ts
rm -f test-*.js
rm -f analyze-*.cjs
rm -f fix-*.cjs
rm -f validate-*.js
rm -f verify-*.mjs
```

#### **✅ 1.3 Consolidar Editores**
```bash
# Remover editores legacy das páginas
rm -rf src/pages/backup_editors_*
rm -f src/pages/editor-minimal.jsx
rm -f src/pages/EditorFixedSimple.tsx
rm -f src/pages/EditorRobustPage.tsx
rm -f src/pages/EditorFixed21Stages.tsx
rm -f src/pages/EditorFixedPage.tsx

# Manter apenas o editor principal
# src/pages/editor.tsx (EditorWithPreview)
```

### **🏗️ FASE 2: REESTRUTURAÇÃO GRADUAL** (Próximas 2 semanas)

#### **📁 2.1 Criar Estrutura de Features**
```bash
# Criar estrutura base
mkdir -p src/features/{auth,editor,quiz,templates,results,analytics}
mkdir -p src/shared/{components,hooks,services,types,utils}

# Cada feature terá a mesma estrutura
for feature in auth editor quiz templates results analytics; do
  mkdir -p src/features/$feature/{components,hooks,services,types,pages}
  touch src/features/$feature/index.ts
done
```

#### **🎨 2.2 Migrar Editor Feature**
```bash
# Mover componentes do editor
mv src/components/editor/* src/features/editor/components/
mv src/components/blocks/* src/features/editor/components/blocks/

# Mover hooks relacionados
mv src/hooks/useEditor* src/features/editor/hooks/
mv src/hooks/useBlock* src/features/editor/hooks/
mv src/hooks/useTemplate* src/features/editor/hooks/

# Mover serviços
mv src/services/template* src/features/editor/services/
mv src/services/validation* src/features/editor/services/

# Mover tipos
mv src/types/editor* src/features/editor/types/
mv src/types/block* src/features/editor/types/

# Página principal do editor
mv src/pages/editor.tsx src/features/editor/pages/EditorPage.tsx
```

#### **❓ 2.3 Migrar Quiz Feature**
```bash
# Mover componentes do quiz
mv src/components/quiz/* src/features/quiz/components/
mv src/components/QuizFlow.tsx src/features/quiz/components/
mv src/components/QuizQuestion.tsx src/features/quiz/components/
mv src/components/QuizResult.tsx src/features/quiz/components/

# Mover páginas do quiz
mv src/pages/QuizFlowPage.tsx src/features/quiz/pages/
mv src/pages/QuizEditorPage.tsx src/features/quiz/pages/
mv src/pages/ResultPage.tsx src/features/quiz/pages/

# Mover hooks
mv src/hooks/useQuiz* src/features/quiz/hooks/

# Mover serviços
mv src/services/quiz* src/features/quiz/services/
```

#### **📋 2.4 Migrar Templates Feature**
```bash
# Mover componentes de templates
mv src/components/templates/* src/features/templates/components/

# Mover páginas
mv src/pages/TemplatesIA.tsx src/features/templates/pages/

# Mover serviços
mv src/services/template* src/features/templates/services/

# Mover dados
mv src/data/templates* src/features/templates/data/
```

#### **🔐 2.5 Migrar Auth Feature**
```bash
# Mover componentes de auth
mv src/components/auth/* src/features/auth/components/

# Mover páginas
mv src/pages/AuthPage.tsx src/features/auth/pages/

# Mover contextos
mv src/context/AuthContext.tsx src/features/auth/context/
mv src/context/AdminAuthContext.tsx src/features/auth/context/

# Mover serviços
mv src/services/auth* src/features/auth/services/
```

#### **🔄 2.6 Consolidar Shared Resources**
```bash
# Mover UI components
mv src/components/ui/* src/shared/components/ui/
mv src/components/common/* src/shared/components/common/
mv src/components/layout/* src/shared/components/layout/

# Mover hooks genéricos
mv src/hooks/use* src/shared/hooks/ # (apenas os não específicos de feature)

# Mover serviços genéricos
mv src/services/api* src/shared/services/
mv src/services/storage* src/shared/services/

# Mover utils
mv src/utils/* src/shared/utils/
mv src/lib/* src/shared/utils/

# Mover tipos genéricos
mv src/types/* src/shared/types/ # (apenas os compartilhados)
```

### **⚡ FASE 3: OTIMIZAÇÃO** (1 semana)

#### **🔧 3.1 Configurar Path Aliases**
```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/app': path.resolve(__dirname, './src/app'),
    },
  },
});

// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/app/*": ["./src/app/*"]
    }
  }
}
```

#### **📦 3.2 Implementar Code Splitting por Feature**
```typescript
// src/app/router.tsx
const EditorFeature = lazy(() => import('@/features/editor'));
const QuizFeature = lazy(() => import('@/features/quiz'));
const TemplatesFeature = lazy(() => import('@/features/templates'));
```

#### **📋 3.3 Criar Exports Centralizados**
```typescript
// src/features/editor/index.ts
export { EditorPage } from './pages/EditorPage';
export { EditorCanvas } from './components/EditorCanvas';
export { useEditor } from './hooks/useEditor';
export type { Block, BlockType } from './types/editor';

// src/shared/components/index.ts
export { Button } from './ui/Button';
export { Input } from './ui/Input';
export { Modal } from './ui/Modal';
```

---

## 🛠️ **SCRIPTS DE AUTOMAÇÃO**

### **Script 1: Limpeza Rápida**
```bash
#!/bin/bash
# cleanup-project.sh

echo "🧹 Iniciando limpeza do projeto..."

# Criar docs
mkdir -p docs/{architecture,analysis,reports,status,guides}

# Mover documentação
mv ANALISE_*.md docs/analysis/ 2>/dev/null || true
mv RELATORIO_*.md docs/reports/ 2>/dev/null || true
mv STATUS_*.md docs/status/ 2>/dev/null || true
mv CHECKLIST_*.md docs/guides/ 2>/dev/null || true
mv DOCUMENTACAO_*.md docs/guides/ 2>/dev/null || true
mv GUIA_*.md docs/guides/ 2>/dev/null || true

# Remover temporários
rm -f src/temp-*.ts src/typescript-disable-*.ts src/global-suppress.d.ts
rm -rf src/temp/ src/legacy/
rm -f *.cjs *.mjs test-*.ts test-*.js analyze-*.cjs fix-*.cjs validate-*.js verify-*.mjs

# Remover editores legacy
rm -rf src/pages/backup_editors_*
rm -f src/pages/editor-minimal.jsx
rm -f src/pages/EditorFixedSimple.tsx
rm -f src/pages/EditorRobustPage.tsx

echo "✅ Limpeza concluída!"
```

### **Script 2: Criar Estrutura de Features**
```bash
#!/bin/bash
# create-features.sh

echo "🏗️ Criando estrutura de features..."

# Features principais
features=("auth" "editor" "quiz" "templates" "results" "analytics")

for feature in "${features[@]}"; do
  echo "📁 Criando feature: $feature"
  mkdir -p src/features/$feature/{components,hooks,services,types,pages}
  
  # Criar index.ts para cada feature
  cat > src/features/$feature/index.ts << EOF
// Export all public APIs for $feature feature
export * from './components';
export * from './hooks';
export * from './services';
export * from './types';
export * from './pages';
EOF

  # Criar index.ts para componentes
  touch src/features/$feature/components/index.ts
done

# Shared resources
mkdir -p src/shared/{components,hooks,services,types,utils}
mkdir -p src/shared/components/{ui,layout,forms,common}

echo "✅ Estrutura de features criada!"
```

### **Script 3: Atualizar Imports**
```bash
#!/bin/bash
# update-imports.sh

echo "🔄 Atualizando imports..."

# Substituir imports antigos por novos path aliases
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from.*\.\./\.\./components/editor|from "@/features/editor/components"|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from.*\.\./\.\./components/quiz|from "@/features/quiz/components"|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from.*\.\./\.\./components/ui|from "@/shared/components/ui"|g'

echo "✅ Imports atualizados!"
```

---

## 📊 **VALIDAÇÃO E TESTES**

### **Checklist de Validação**
- [ ] **Build sem erros**: `npm run build`
- [ ] **Testes passando**: `npm test`
- [ ] **Linting limpo**: `npm run lint`
- [ ] **TypeScript sem erros**: `tsc --noEmit`
- [ ] **Bundle size reduzido**: Comparar antes/depois
- [ ] **Performance mantida**: Lighthouse score
- [ ] **Funcionalidades intactas**: Testes manuais

### **Comandos de Verificação**
```bash
# Verificar estrutura
tree src/features/ -L 3

# Verificar imports
grep -r "from.*\.\./\.\./\.\." src/ || echo "✅ Nenhum import relativo longo encontrado"

# Verificar bundle
npm run build && ls -la dist/assets/

# Verificar performance
npm run dev &
lighthouse http://localhost:8080 --only-categories=performance
```

---

## ⚠️ **CUIDADOS E ROLLBACK**

### **Backup Antes da Migração**
```bash
# Criar backup completo
git checkout -b backup-before-restructure
git add .
git commit -m "Backup antes da reestruturação"

# Criar branch para reestruturação
git checkout -b feature/restructure-project
```

### **Rollback em Caso de Problemas**
```bash
# Voltar ao estado anterior
git checkout backup-before-restructure
git checkout -b hotfix/rollback-restructure
```

### **Migração Gradual (Recomendado)**
1. **Semana 1**: Limpeza + Editor feature
2. **Semana 2**: Quiz + Templates features
3. **Semana 3**: Shared resources + Auth
4. **Semana 4**: Otimização + Testes

---

## 🎯 **PRÓXIMOS PASSOS IMEDIATOS**

### **Hoje (2-3 horas)**
1. ✅ Executar script de limpeza
2. ✅ Mover documentação para `docs/`
3. ✅ Remover arquivos temporários
4. ✅ Testar build após limpeza

### **Esta Semana**
1. 🏗️ Criar estrutura de features
2. 🎨 Migrar Editor feature
3. 🔄 Atualizar imports relacionados
4. 🧪 Validar funcionalidade

### **Próxima Semana**
1. ❓ Migrar Quiz feature
2. 📋 Migrar Templates feature
3. 🔐 Migrar Auth feature
4. 🔄 Consolidar shared resources

Este plano garante uma migração **segura, gradual e testável** para a nova estrutura!
