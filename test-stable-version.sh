#!/bin/bash

# 🧪 SCRIPT DE TESTE - VERSÃO ESTÁVEL 15d24cd75
# Data: 2 de dezembro de 2025
# Propósito: Testar versão estável do editor de forma automatizada

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função de log
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Banner
echo ""
echo "═══════════════════════════════════════════"
echo "   🧪 TESTE DE VERSÃO ESTÁVEL"
echo "   Commit: 15d24cd75 (30 nov 2025)"
echo "═══════════════════════════════════════════"
echo ""

# 1. Verificar branch atual
CURRENT_BRANCH=$(git branch --show-current)
log_info "Branch atual: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "work-from-stable-20251202" ]; then
    log_warning "Você não está na branch de teste!"
    log_info "Criando/mudando para branch de teste..."
    git checkout -b work-from-stable-20251202 15d24cd75 2>/dev/null || git checkout work-from-stable-20251202
fi

# 2. Verificar commit
CURRENT_COMMIT=$(git rev-parse --short HEAD)
log_info "Commit atual: $CURRENT_COMMIT"

if [ "$CURRENT_COMMIT" != "15d24cd75" ]; then
    log_error "Commit atual não é 15d24cd75!"
    log_info "Resetando para commit correto..."
    git reset --hard 15d24cd75
fi

log_success "Posicionado na versão estável"

# 3. Limpar cache
log_info "Limpando cache do Vite..."
rm -rf node_modules/.vite
log_success "Cache limpo"

# 4. Verificar node_modules
if [ ! -d "node_modules" ]; then
    log_warning "node_modules não encontrado"
    log_info "Instalando dependências..."
    npm install
else
    log_success "node_modules existe"
fi

# 5. Verificar arquivos críticos
log_info "Verificando arquivos críticos..."

CRITICAL_FILES=(
    "src/pages/EditorPage.tsx"
    "src/components/editor/ModernQuizEditor.tsx"
    "src/stores/editorStore.ts"
    "src/types/quiz.ts"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        log_success "$file existe"
    else
        log_error "$file não encontrado!"
    fi
done

# 6. Verificar package.json
log_info "Verificando scripts npm..."
if grep -q '"dev":' package.json; then
    log_success "Script 'dev' encontrado"
else
    log_error "Script 'dev' não encontrado em package.json!"
fi

# 7. Verificar porta 8080
log_info "Verificando se porta 8080 está livre..."
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    log_warning "Porta 8080 já está em uso!"
    PID=$(lsof -Pi :8080 -sTCP:LISTEN -t)
    log_info "Matando processo na porta 8080 (PID: $PID)..."
    kill -9 $PID 2>/dev/null || true
    sleep 2
fi
log_success "Porta 8080 livre"

# 8. Informações sobre o teste
echo ""
echo "═══════════════════════════════════════════"
echo "   📋 PRÓXIMOS PASSOS MANUAIS"
echo "═══════════════════════════════════════════"
echo ""
echo "1. Iniciar servidor de desenvolvimento:"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "2. Abrir no navegador:"
echo "   ${GREEN}http://localhost:8080/editor${NC}"
echo ""
echo "3. Testes a realizar (10-15 minutos):"
echo "   ✓ Interface carrega sem erros"
echo "   ✓ 4 colunas visíveis"
echo "   ✓ Template carrega automaticamente"
echo "   ✓ Navegação entre steps funciona"
echo "   ✓ Biblioteca de blocos aparece"
echo "   ✓ Canvas renderiza blocos"
echo "   ✓ Seleção de bloco funciona"
echo "   ✓ Painel de propriedades abre"
echo "   ✓ Edição de propriedades funciona"
echo "   ✓ Console sem erros críticos"
echo ""
echo "4. Após testar, preencher:"
echo "   ${YELLOW}RELATORIO_TESTE_VERSAO_ESTAVEL.md${NC}"
echo ""
echo "═══════════════════════════════════════════"
echo ""

# 9. Criar arquivo de relatório se não existe
if [ ! -f "RELATORIO_TESTE_VERSAO_ESTAVEL.md" ]; then
    log_info "Criando template de relatório..."
    cat > RELATORIO_TESTE_VERSAO_ESTAVEL.md << 'EOF'
# 🧪 RELATÓRIO DE TESTE - VERSÃO ESTÁVEL 15d24cd75

**Data do Teste**: _____/_____/2025  
**Testador**: ________________  
**Duração Total**: _____ minutos  
**Branch**: work-from-stable-20251202  

---

## ✅ RESULTADO GERAL

- [ ] ✅ PASSOU EM TODOS OS TESTES
- [ ] ⚠️ PASSOU COM RESSALVAS
- [ ] ❌ FALHOU

---

## 📊 TESTES INDIVIDUAIS

### 1. Carregamento Básico
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Tempo de carregamento: _____ segundos
- Observações: _________________________________

### 2. Carregamento de Template
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Template carregado: _________________________________
- Observações: _________________________________

### 3. Biblioteca de Blocos
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Quantidade de blocos: _____
- Observações: _________________________________

### 4. Canvas de Edição
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Blocos renderizados: _____
- Observações: _________________________________

### 5. Painel de Propriedades
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Propriedades editadas: _________________________________
- Observações: _________________________________

### 6. Navegação de Steps
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Steps navegados: _____
- Observações: _________________________________

### 7. Edição de Blocos
- Status: [ ] ✅ PASS  [ ] ⚠️ PARCIAL  [ ] ❌ FAIL
- Tipos de edição testados: _________________________________
- Observações: _________________________________

### 8. Console do Navegador
- Status: [ ] ✅ SEM ERROS  [ ] ⚠️ AVISOS APENAS  [ ] ❌ ERROS CRÍTICOS
- Erros encontrados:
```
(colar erros aqui)
```

---

## 🐛 BUGS ENCONTRADOS

### Bug #1
- **Severidade**: [ ] Crítico  [ ] Alto  [ ] Médio  [ ] Baixo
- **Descrição**: _________________________________
- **Passos para reproduzir**:
  1. _________________________________
  2. _________________________________
  3. _________________________________
- **Resultado esperado**: _________________________________
- **Resultado obtido**: _________________________________

### Bug #2
(adicionar mais conforme necessário)

---

## 📈 PERFORMANCE

- **Tempo de carregamento inicial**: _____ segundos
- **Tempo de navegação entre steps**: _____ ms (média)
- **Tempo de resposta ao editar**: _____ ms (média)
- **FPS durante uso**: _____ fps (estimativa)
- **Uso de memória**: _____ MB (aprox.)

---

## ✅ FUNCIONALIDADES QUE FUNCIONAM

- [ ] Interface carrega sem erros
- [ ] 4 colunas visíveis
- [ ] Template carrega automaticamente
- [ ] Lista de steps aparece
- [ ] Navegação entre steps
- [ ] Biblioteca de blocos
- [ ] Canvas renderiza blocos
- [ ] Seleção de blocos
- [ ] Painel de propriedades
- [ ] Edição em tempo real
- [ ] Undo/Redo
- [ ] Estado sujo (isDirty)

---

## ❌ FUNCIONALIDADES QUE NÃO FUNCIONAM

1. _________________________________
2. _________________________________
3. _________________________________

---

## 💡 RECOMENDAÇÃO FINAL

### Esta versão deve ser usada como base?

- [ ] ✅ SIM - Versão estável, usar como base
- [ ] ⚠️ TALVEZ - Funciona mas tem limitações
- [ ] ❌ NÃO - Instável, buscar versão anterior
- [ ] 🔄 TESTAR OUTRA - Tentar commit diferente

### Justificativa:
_________________________________
_________________________________
_________________________________

---

## 📝 PRÓXIMOS PASSOS

1. _________________________________
2. _________________________________
3. _________________________________

---

**Assinatura**: ___________________  
**Data**: _____/_____/2025
EOF
    log_success "Template de relatório criado"
fi

echo ""
log_success "Sistema pronto para teste!"
echo ""
log_info "Para iniciar: ${GREEN}npm run dev${NC}"
echo ""
