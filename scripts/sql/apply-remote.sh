#!/usr/bin/env bash
set -euo pipefail

# Aplica migrações locais (supabase/migrations) no projeto remoto via Supabase CLI
# Pré-requisitos:
#   - supabase CLI instalado (https://supabase.com/docs/guides/cli/getting-started)
#   - SUPABASE_ACCESS_TOKEN exportado (Perfil > Access Tokens)
#   - Projeto configurado em supabase/config.toml (project_id)
# Uso:
#   scripts/sql/apply-remote.sh [--with-rls]
#   --with-rls: também adiciona uma migração com as políticas RLS de scripts/sql/2025-11-01_rls_policies_template.sql

ROOT_DIR=$(cd "$(dirname "$0")/../.." && pwd)
PROJECT_REF=$(grep -E '^project_id' "$ROOT_DIR/supabase/config.toml" | sed -E 's/.*"([^"]+)".*/\1/')
WITH_RLS=${1:-}

if ! command -v supabase >/dev/null 2>&1; then
  echo "Erro: supabase CLI não encontrado no PATH." >&2
  echo "Instale: curl -fsSL https://get.supabase.com | sh" >&2
  exit 127
fi

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "Erro: SUPABASE_ACCESS_TOKEN não definido." >&2
  echo "Crie um token em https://supabase.com/dashboard/account/tokens e exporte SUPABASE_ACCESS_TOKEN." >&2
  exit 2
fi

if [[ -z "$PROJECT_REF" ]]; then
  echo "Erro: project_id não encontrado em supabase/config.toml" >&2
  exit 3
fi

# Gera migração para índices + RPC se ainda não existir
MIGR_DIR="$ROOT_DIR/supabase/migrations"
mkdir -p "$MIGR_DIR"
MIGR_FILE_RPC=$(ls -1 "$MIGR_DIR"/*_indices_and_rpc.sql 2>/dev/null | head -n1 || true)
if [[ -z "$MIGR_FILE_RPC" ]]; then
  TS=$(date +%Y%m%d%H%M%S)
  MIGR_FILE_RPC="$MIGR_DIR/${TS}_indices_and_rpc.sql"
  cp "$ROOT_DIR/scripts/sql/2025-11-01_indices_and_rpc.sql" "$MIGR_FILE_RPC"
  echo "Criada migração: $MIGR_FILE_RPC"
else
  echo "Migração de índices/RPC já existente: $MIGR_FILE_RPC"
fi

# Opcional: gerar migração de RLS
if [[ "$WITH_RLS" == "--with-rls" ]]; then
  MIGR_FILE_RLS=$(ls -1 "$MIGR_DIR"/*_rls_policies.sql 2>/dev/null | head -n1 || true)
  if [[ -z "$MIGR_FILE_RLS" ]]; then
    TS=$(date +%Y%m%d%H%M%S)
    MIGR_FILE_RLS="$MIGR_DIR/${TS}_rls_policies.sql"
    cp "$ROOT_DIR/scripts/sql/2025-11-01_rls_policies_template.sql" "$MIGR_FILE_RLS"
    echo "Criada migração: $MIGR_FILE_RLS"
  else
    echo "Migração de RLS já existente: $MIGR_FILE_RLS"
  fi
fi

# Linka ao projeto e aplica
supabase link --project-ref "$PROJECT_REF" --workdir "$ROOT_DIR" --debug || true
supabase db push --workdir "$ROOT_DIR" --debug

echo "Migrações aplicadas ao projeto $PROJECT_REF."
