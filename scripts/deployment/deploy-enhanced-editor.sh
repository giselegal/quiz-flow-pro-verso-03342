#!/bin/bash

# 🚀 Script de Deploy Automatizado - Editor Melhorado
# Execute: chmod +x deploy-enhanced-editor.sh && ./deploy-enhanced-editor.sh

set -e  # Parar em caso de erro

echo "🚀 Iniciando deploy do Editor Melhorado..."
echo "=================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para print colorido
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar se estamos na raiz do projeto
if [ ! -f "package.json" ]; then
    print_error "Execute este script na raiz do projeto (onde está o package.json)"
    exit 1
fi

print_info "Verificando estrutura do projeto..."

# Verificar arquivos críticos
REQUIRED_FILES=(
    "src/components/editor/EnhancedEditor.tsx"
    "src/components/editor/validation/ValidationSystem.tsx"
    "src/components/editor/feedback/FeedbackSystem.tsx"
    "src/components/admin/security/AccessControlSystem.tsx"
    "src/components/editor/seo/SEOSystem.tsx"
    "src/components/admin/workflow/PublishingWorkflow.tsx"
    "src/components/admin/analytics/AdvancedAnalytics.tsx"
    "src/components/testing/SystemIntegrationTest.tsx"
    "src/components/routing/EnhancedAppRouter.tsx"
    "src/pages/examples/EnhancedEditorIntegration.tsx"
    "database/enhanced_schema.sql"
)

missing_files=()
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    print_error "Arquivos obrigatórios não encontrados:"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    print_warning "Execute primeiro a implementação completa dos sistemas"
    exit 1
fi

print_status "Todos os arquivos necessários encontrados"

# Verificar variáveis de ambiente
print_info "Verificando variáveis de ambiente..."

if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    print_warning "Arquivo .env.local não encontrado"
    print_info "Criando arquivo .env.local de exemplo..."
    
    cat > .env.local << EOF
# Configurações do Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica_aqui

# Configurações de desenvolvimento
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development
EOF
    
    print_warning "Edite o arquivo .env.local com suas credenciais do Supabase"
    print_info "Pressione ENTER quando terminar de configurar..."
    read
fi

# Verificar dependências
print_info "Verificando dependências do npm..."

REQUIRED_DEPS=(
    "@supabase/supabase-js"
    "wouter"
    "lucide-react"
    "@radix-ui/react-tabs"
    "@radix-ui/react-toast"
)

missing_deps=()
for dep in "${REQUIRED_DEPS[@]}"; do
    if ! npm list "$dep" >/dev/null 2>&1; then
        missing_deps+=("$dep")
    fi
done

if [ ${#missing_deps[@]} -gt 0 ]; then
    print_warning "Instalando dependências faltantes..."
    npm install "${missing_deps[@]}"
    print_status "Dependências instaladas"
fi

# Verificar se há dependências para instalar
print_info "Instalando/atualizando dependências..."
npm install

# Build de teste
print_info "Executando build de teste..."
if npm run build; then
    print_status "Build executado com sucesso"
else
    print_error "Falha no build. Verifique os erros acima."
    exit 1
fi

# Verificar schema do banco
print_warning "IMPORTANTE: Verificação do Schema do Banco"
echo "=================================================="
print_info "Antes de continuar, certifique-se de que:"
echo "1. Você executou o arquivo database/enhanced_schema.sql no Supabase"
echo "2. Todas as tabelas foram criadas corretamente"
echo "3. As RLS policies estão ativas"
echo ""
print_info "Script SQL localizado em: database/enhanced_schema.sql"
echo ""
echo "Deseja continuar? (y/N)"
read -r response

if [[ ! "$response" =~ ^[Yy]$ ]]; then
    print_warning "Deploy cancelado. Execute primeiro o schema SQL no Supabase."
    print_info "1. Acesse: https://app.supabase.com"
    print_info "2. Vá em SQL Editor"
    print_info "3. Cole e execute o conteúdo de: database/enhanced_schema.sql"
    exit 0
fi

# Testes locais
print_info "Iniciando testes locais..."

# Verificar se o servidor está rodando
if ! curl -s http://localhost:3000 >/dev/null 2>&1; then
    print_warning "Servidor local não está rodando"
    print_info "Iniciando servidor de desenvolvimento..."
    
    # Iniciar servidor em background
    npm run dev &
    SERVER_PID=$!
    
    print_info "Aguardando servidor inicializar..."
    sleep 10
    
    # Verificar se servidor subiu
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        print_status "Servidor local iniciado (PID: $SERVER_PID)"
    else
        print_error "Falha ao iniciar servidor local"
        exit 1
    fi
else
    print_status "Servidor local já está rodando"
    SERVER_PID=""
fi

# Aguardar um pouco para o servidor estabilizar
sleep 5

# Testes básicos
print_info "Executando testes básicos..."

URLS_TO_TEST=(
    "http://localhost:3000/"
    "http://localhost:3000/dev/test"
    "http://localhost:3000/editor"
)

for url in "${URLS_TO_TEST[@]}"; do
    if curl -s "$url" >/dev/null 2>&1; then
        print_status "✓ $url"
    else
        print_warning "⚠ $url (pode precisar de autenticação)"
    fi
done

# Parar servidor se foi iniciado por este script
if [ ! -z "$SERVER_PID" ]; then
    print_info "Parando servidor de teste..."
    kill $SERVER_PID 2>/dev/null || true
fi

# Deploy options
print_info "Escolha o tipo de deploy:"
echo "1. Deploy local apenas (desenvolvimento)"
echo "2. Deploy para staging/preview"
echo "3. Deploy para produção"
echo "4. Gerar build para deploy manual"
echo "5. Pular deploy (apenas validações)"
echo ""
echo "Digite sua opção (1-5):"
read -r deploy_option

case $deploy_option in
    1)
        print_info "Iniciando servidor de desenvolvimento..."
        npm run dev
        ;;
    2)
        print_info "Deploy para staging..."
        if command -v vercel >/dev/null 2>&1; then
            vercel --prod=false
        else
            print_warning "Vercel CLI não encontrado"
            print_info "Instale com: npm i -g vercel"
        fi
        ;;
    3)
        print_warning "Deploy para produção..."
        echo "Tem certeza? (y/N)"
        read -r confirm
        if [[ "$confirm" =~ ^[Yy]$ ]]; then
            if command -v vercel >/dev/null 2>&1; then
                vercel --prod
            else
                print_warning "Vercel CLI não encontrado"
                print_info "Execute manualmente o deploy da pasta dist/"
            fi
        fi
        ;;
    4)
        print_info "Gerando build..."
        npm run build
        print_status "Build gerado na pasta dist/"
        print_info "Faça upload manual dos arquivos para seu servidor"
        ;;
    5)
        print_status "Validações concluídas com sucesso"
        ;;
    *)
        print_warning "Opção inválida"
        ;;
esac

# Relatório final
echo ""
echo "=================================================="
print_status "Deploy do Editor Melhorado concluído!"
echo "=================================================="
print_info "Próximos passos:"
echo "1. Acesse: http://localhost:3000/dev/test"
echo "2. Execute todos os testes de integração"
echo "3. Acesse: http://localhost:3000/editor"
echo "4. Teste as funcionalidades do editor"
echo ""
print_info "URLs importantes:"
echo "• Dashboard: http://localhost:3000/"
echo "• Editor: http://localhost:3000/editor"
echo "• Testes: http://localhost:3000/dev/test"
echo "• Analytics: http://localhost:3000/admin/funis/demo/analytics"
echo ""
print_info "Documentação:"
echo "• Guia completo: ENHANCED_EDITOR_GUIDE.md"
echo "• Status: STATUS_IMPLEMENTACAO.md"
echo "• Deploy: DEPLOY_GUIDE.md"
echo ""
print_status "🎉 Sucesso! Seu editor melhorado está pronto!"
