#!/bin/bash

# Script para configurar Railway via API
# Uso: ./railway-api-config.sh <RAILWAY_API_TOKEN>

set -e

if [ -z "$1" ]; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔧 CONFIGURAÇÃO RAILWAY VIA API"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Uso: ./railway-api-config.sh <RAILWAY_API_TOKEN>"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔑 COMO OBTER API TOKEN"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "1. Acesse: https://railway.app/account/tokens"
  echo ""
  echo "2. Clique 'Create New Token'"
  echo ""
  echo "3. Copie o token e execute:"
  echo "   ./railway-api-config.sh SEU_TOKEN_AQUI"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  exit 1
fi

RAILWAY_TOKEN="$1"
PROJECT_ID="3d373d60-1788-48ca-b701-5fcf86fa9277"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 CONFIGURANDO RAILWAY VIA API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Função para fazer queries GraphQL
railway_query() {
  local query="$1"
  curl -s -X POST \
    -H "Authorization: Bearer $RAILWAY_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"query\":\"$query\"}" \
    https://backboard.railway.app/graphql
}

# 1. Verificar autenticação
echo "1️⃣  Verificando autenticação..."
ME_QUERY='query { me { id name email } }'
ME_RESPONSE=$(railway_query "$ME_QUERY")

if echo "$ME_RESPONSE" | grep -q '"errors"'; then
  echo "❌ Erro de autenticação!"
  echo "$ME_RESPONSE"
  exit 1
fi

echo "✅ Autenticado com sucesso!"
echo ""

# 2. Listar projetos
echo "2️⃣  Buscando projetos..."
PROJECTS_QUERY='query { projects { edges { node { id name } } } }'
PROJECTS_RESPONSE=$(railway_query "$PROJECTS_QUERY")

echo "$PROJECTS_RESPONSE" | jq -r '.data.projects.edges[].node | "\(.id) - \(.name)"'
echo ""

# 3. Obter detalhes do projeto
echo "3️⃣  Obtendo detalhes do projeto $PROJECT_ID..."
PROJECT_QUERY="query { project(id: \\\"$PROJECT_ID\\\") { id name services { edges { node { id name } } } } }"
PROJECT_RESPONSE=$(railway_query "$PROJECT_QUERY")

if echo "$PROJECT_RESPONSE" | grep -q '"errors"'; then
  echo "❌ Projeto não encontrado ou sem permissão!"
  echo "$PROJECT_RESPONSE"
  exit 1
fi

SERVICE_ID=$(echo "$PROJECT_RESPONSE" | jq -r '.data.project.services.edges[0].node.id')
echo "✅ Service ID: $SERVICE_ID"
echo ""

# 4. Configurar variáveis de ambiente
echo "4️⃣  Configurando variáveis de ambiente..."

# Ler .env para pegar valores
SUPABASE_URL=$(grep VITE_SUPABASE_URL .env | cut -d '=' -f2)
SUPABASE_KEY=$(grep VITE_SUPABASE_ANON_KEY .env | cut -d '=' -f2)

# Mutation para adicionar variáveis
VAR_MUTATION="mutation {
  variableUpsert(input: {
    serviceId: \\\"$SERVICE_ID\\\",
    name: \\\"VITE_SUPABASE_URL\\\",
    value: \\\"$SUPABASE_URL\\\"
  }) {
    id
  }
}"

railway_query "$VAR_MUTATION" > /dev/null
echo "✅ VITE_SUPABASE_URL configurada"

VAR_MUTATION2="mutation {
  variableUpsert(input: {
    serviceId: \\\"$SERVICE_ID\\\",
    name: \\\"VITE_SUPABASE_ANON_KEY\\\",
    value: \\\"$SUPABASE_KEY\\\"
  }) {
    id
  }
}"

railway_query "$VAR_MUTATION2" > /dev/null
echo "✅ VITE_SUPABASE_ANON_KEY configurada"

VAR_MUTATION3="mutation {
  variableUpsert(input: {
    serviceId: \\\"$SERVICE_ID\\\",
    name: \\\"NODE_ENV\\\",
    value: \\\"production\\\"
  }) {
    id
  }
}"

railway_query "$VAR_MUTATION3" > /dev/null
echo "✅ NODE_ENV configurada"

VAR_MUTATION4="mutation {
  variableUpsert(input: {
    serviceId: \\\"$SERVICE_ID\\\",
    name: \\\"PORT\\\",
    value: \\\"5000\\\"
  }) {
    id
  }
}"

railway_query "$VAR_MUTATION4" > /dev/null
echo "✅ PORT configurada"
echo ""

# 5. Gerar domínio público
echo "5️⃣  Gerando domínio público..."
DOMAIN_MUTATION="mutation {
  serviceDomainCreate(input: {
    serviceId: \\\"$SERVICE_ID\\\"
  }) {
    domain {
      domain
    }
  }
}"

DOMAIN_RESPONSE=$(railway_query "$DOMAIN_MUTATION")
DOMAIN=$(echo "$DOMAIN_RESPONSE" | jq -r '.data.serviceDomainCreate.domain.domain')

if [ "$DOMAIN" != "null" ]; then
  echo "✅ Domínio gerado: https://$DOMAIN"
else
  # Buscar domínio existente
  DOMAINS_QUERY="query {
    service(id: \\\"$SERVICE_ID\\\") {
      domains {
        serviceDomains {
          domain
        }
      }
    }
  }"
  
  DOMAINS_RESPONSE=$(railway_query "$DOMAINS_QUERY")
  DOMAIN=$(echo "$DOMAINS_RESPONSE" | jq -r '.data.service.domains.serviceDomains[0].domain')
  echo "✅ Domínio existente: https://$DOMAIN"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ CONFIGURAÇÃO COMPLETA!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 URL do Backend: https://$DOMAIN"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 PRÓXIMO PASSO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Vou atualizar automaticamente o vercel.json com esta URL..."
echo ""

# Atualizar vercel.json
sed -i "s|https://seu-backend.railway.app|https://$DOMAIN|g" vercel.json

echo "✅ vercel.json atualizado!"
echo ""
echo "Commit e push:"
echo "  git add vercel.json"
echo "  git commit -m 'chore: adicionar URL do backend Railway'"
echo "  git push"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
