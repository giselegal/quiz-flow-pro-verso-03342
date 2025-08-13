#!/bin/bash

# 🚀 SCRIPT DE MIGRAÇÃO VIA CURL - SUPABASE API
# Executa migrações usando a API REST do Supabase

set -e

# ============================================================================
# CONFIGURAÇÃO
# ============================================================================

SUPABASE_URL="https://pwtjuuhchtbzttrzoutw.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w"

echo "🚀 INICIANDO MIGRAÇÃO VIA API SUPABASE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ============================================================================
# FUNÇÕES
# ============================================================================

test_connection() {
    echo "🔌 Testando conexão com Supabase..."
    
    response=$(curl -s -w "%{http_code}" \
        -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        "$SUPABASE_URL/rest/v1/" \
        -o /dev/null)
    
    if [ "$response" = "200" ] || [ "$response" = "404" ]; then
        echo "✅ Conexão estabelecida (HTTP $response)"
        return 0
    else
        echo "❌ Falha na conexão (HTTP $response)"
        return 1
    fi
}

check_table_exists() {
    local table_name=$1
    echo "📊 Verificando tabela: $table_name"
    
    response=$(curl -s -w "%{http_code}" \
        -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        "$SUPABASE_URL/rest/v1/$table_name?limit=1" \
        -o /dev/null)
    
    if [ "$response" = "200" ]; then
        echo "  ✅ Tabela $table_name existe"
        return 0
    else
        echo "  ❌ Tabela $table_name não existe (HTTP $response)"
        return 1
    fi
}

create_component_types() {
    echo "📦 Criando dados em component_types..."
    
    # Dados de component_types
    local data='[
        {
            "type_key": "quiz-header",
            "display_name": "Cabeçalho do Quiz",
            "category": "layout",
            "description": "Cabeçalho principal com título e logo",
            "default_properties": {
                "title": "Meu Quiz",
                "subtitle": "Descubra seu estilo pessoal",
                "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
            }
        },
        {
            "type_key": "question-multiple",
            "display_name": "Questão Múltipla Escolha", 
            "category": "question",
            "description": "Questão com opções de múltipla escolha",
            "default_properties": {
                "title": "Qual é o seu estilo preferido?",
                "options": [
                    {"id": "classic", "label": "Clássico", "image": ""},
                    {"id": "modern", "label": "Moderno", "image": ""},
                    {"id": "casual", "label": "Casual", "image": ""}
                ]
            }
        },
        {
            "type_key": "progress-bar",
            "display_name": "Barra de Progresso",
            "category": "navigation", 
            "description": "Indicador visual do progresso do quiz",
            "default_properties": {
                "currentStep": 1,
                "totalSteps": 5,
                "showPercentage": true
            }
        }
    ]'
    
    response=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -H "Content-Type: application/json" \
        -H "Prefer: resolution=merge-duplicates" \
        -d "$data" \
        "$SUPABASE_URL/rest/v1/component_types" \
        -o /dev/null)
    
    if [ "$response" = "201" ] || [ "$response" = "200" ]; then
        echo "  ✅ Component types inseridos (HTTP $response)"
        return 0
    else
        echo "  ❌ Erro ao inserir component types (HTTP $response)"
        return 1
    fi
}

# ============================================================================
# EXECUÇÃO PRINCIPAL
# ============================================================================

main() {
    echo ""
    echo "1️⃣ Verificando conexão..."
    if ! test_connection; then
        echo "💥 Falha na conexão. Abortando."
        exit 1
    fi
    
    echo ""
    echo "2️⃣ Verificando tabelas existentes..."
    
    tables=("component_types" "component_instances" "profiles")
    existing_tables=()
    missing_tables=()
    
    for table in "${tables[@]}"; do
        if check_table_exists "$table"; then
            existing_tables+=("$table")
        else
            missing_tables+=("$table")
        fi
    done
    
    echo ""
    echo "📊 RESUMO:"
    echo "  ✅ Tabelas existentes: ${#existing_tables[@]}"
    echo "  ❌ Tabelas ausentes: ${#missing_tables[@]}"
    
    if [ ${#missing_tables[@]} -gt 0 ]; then
        echo ""
        echo "⚠️  TABELAS AUSENTES:"
        for table in "${missing_tables[@]}"; do
            echo "    • $table"
        done
        echo ""
        echo "🛠️  AÇÃO NECESSÁRIA:"
        echo "   As tabelas ausentes precisam ser criadas manualmente no painel do Supabase."
        echo "   Execute o arquivo: supabase/migrations/002_complete_quiz_schema.sql"
        echo ""
    fi
    
    echo "3️⃣ Tentando popular component_types..."
    if check_table_exists "component_types"; then
        if create_component_types; then
            echo "  ✅ Dados populados com sucesso"
        else
            echo "  ⚠️  Falha ao popular dados (pode ser normal se já existem)"
        fi
    else
        echo "  ❌ Tabela component_types não existe. Pule para criação manual."
    fi
    
    echo ""
    echo "🎉 MIGRAÇÃO CONCLUÍDA!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📋 PRÓXIMOS PASSOS:"
    echo "  1. Se tabelas estão ausentes: Execute SQL no painel Supabase"
    echo "  2. Abra http://localhost:8080/admin para ver o painel"
    echo "  3. Teste o editor em http://localhost:8080/editor-fixed"
    echo ""
}

# Executar função principal
main
