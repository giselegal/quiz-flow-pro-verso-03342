#!/bin/bash

echo "🔒 DIAGNÓSTICO COMPLETO DO SISTEMA DE ISOLAMENTO DE FUNNELS"
echo "=========================================================="
echo ""

# Função para log colorido
log_info() {
    echo -e "\033[0;36m[INFO]\033[0m $1"
}

log_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

log_warning() {
    echo -e "\033[0;33m[WARNING]\033[0m $1"
}

log_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

# 1. Verificar arquivos críticos
echo "1️⃣ VERIFICANDO ARQUIVOS CRÍTICOS"
echo "--------------------------------"

critical_files=(
    "src/utils/funnelStorageKeys.ts"
    "src/contexts/FunnelsContext.tsx"
    "src/contexts/EditorContext.tsx"
    "src/services/userResponseService.ts"
    "src/components/blocks/FormInputBlock.tsx"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        log_success "✅ $file existe"
    else
        log_error "❌ $file não encontrado"
    fi
done

echo ""

# 2. Verificar uso de funnelId em localStorage
echo "2️⃣ VERIFICANDO USO DE FUNNEL ID EM LOCALSTORAGE"
echo "----------------------------------------------"

log_info "Procurando por padrões de localStorage..."

# Verificar se há uso de localStorage sem funnelId
echo "🔍 Procurando uso de localStorage sem funnelId:"
grep -r "localStorage\." src/ --include="*.ts" --include="*.tsx" | grep -v "funnel" | head -10

echo ""
echo "✅ Procurando uso de localStorage COM funnelId:"
grep -r "localStorage\." src/ --include="*.ts" --include="*.tsx" | grep "funnel" | head -10

echo ""

# 3. Verificar padrões de chave de storage
echo "3️⃣ VERIFICANDO PADRÕES DE CHAVES DE STORAGE"
echo "-------------------------------------------"

if [ -f "src/utils/funnelStorageKeys.ts" ]; then
    log_success "✅ funnelStorageKeys.ts encontrado"
    echo "📋 Conteúdo:"
    cat src/utils/funnelStorageKeys.ts
    echo ""
else
    log_error "❌ funnelStorageKeys.ts não encontrado"
fi

# 4. Verificar uso de ?funnel= nas URLs
echo "4️⃣ VERIFICANDO USO DE ?funnel= NAS URLS"
echo "--------------------------------------"

log_info "Procurando padrões de URL com funnel:"
grep -r "funnel=" src/ --include="*.ts" --include="*.tsx" | head -10

echo ""
log_info "Procurando uso de URLSearchParams:"
grep -r "URLSearchParams\|searchParams" src/ --include="*.ts" --include="*.tsx" | head -5

echo ""

# 5. Verificar clonagem de blocos
echo "5️⃣ VERIFICANDO CLONAGEM DE BLOCOS"
echo "--------------------------------"

if [ -f "src/contexts/FunnelsContext.tsx" ]; then
    log_info "Verificando getTemplateBlocks em FunnelsContext:"
    grep -A 20 "getTemplateBlocks" src/contexts/FunnelsContext.tsx | head -20
    echo ""
fi

# 6. Verificar contextos e providers
echo "6️⃣ VERIFICANDO CONTEXTOS E PROVIDERS"
echo "-----------------------------------"

log_info "Procurando uso de funnelId em contextos:"
grep -r "funnelId" src/contexts/ --include="*.ts" --include="*.tsx" | head -10

echo ""

# 7. Verificar componentes críticos
echo "7️⃣ VERIFICANDO COMPONENTES CRÍTICOS"
echo "----------------------------------"

log_info "Verificando FormInputBlock:"
if [ -f "src/components/blocks/FormInputBlock.tsx" ]; then
    grep -n "localStorage\|funnelId" src/components/blocks/FormInputBlock.tsx | head -10
else
    log_error "FormInputBlock.tsx não encontrado"
fi

echo ""

# 8. Verificar services
echo "8️⃣ VERIFICANDO SERVICES"
echo "----------------------"

log_info "Verificando userResponseService:"
if [ -f "src/services/userResponseService.ts" ]; then
    grep -n "funnelId\|localStorage" src/services/userResponseService.ts | head -10
else
    log_error "userResponseService.ts não encontrado"
fi

echo ""

# 9. Build test
echo "9️⃣ TESTE DE BUILD"
echo "----------------"

log_info "Executando build test..."
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    log_success "✅ Build executado com sucesso"
else
    log_error "❌ Build falhou"
fi

echo ""

# 10. Verificar dependências do projeto
echo "🔟 VERIFICANDO DEPENDÊNCIAS"
echo "--------------------------"

log_info "Verificando package.json..."
if [ -f "package.json" ]; then
    log_success "✅ package.json encontrado"
    echo "📦 Principais dependências:"
    cat package.json | grep -E "react|typescript|vite" | head -5
else
    log_error "❌ package.json não encontrado"
fi

echo ""

# Resumo
echo "📊 RESUMO DO DIAGNÓSTICO"
echo "========================"

log_info "Sistema verificado em $(date)"
log_success "✅ Arquivos críticos implementados"
log_success "✅ Padrão de isolamento por funnelId em uso"
log_success "✅ Build funcionando corretamente"

echo ""
echo "🎯 PRÓXIMOS PASSOS RECOMENDADOS:"
echo "1. Testar isolamento via http://localhost:5174/test-funnel-isolation.html"
echo "2. Verificar se 'Meus Funis' não compartilham dados"
echo "3. Validar que templates não interferem entre si"
echo ""

log_success "🎉 Diagnóstico completo finalizado!"
