#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${SUPABASE_DB_URL:-}" ]]; then
  echo "❌ SUPABASE_DB_URL não definido. Exemplo: export SUPABASE_DB_URL=postgresql://user:pass@host:5432/db?sslmode=require" >&2
  exit 2
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "❌ psql não encontrado no ambiente. Instale o cliente Postgres (apt install postgresql-client)." >&2
  exit 3
fi

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
SQL_FILE="$SCRIPT_DIR/rls-audit.sql"

echo "➡️ Executando auditoria RLS..."
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$SQL_FILE" | tee reports/rls-audit-$(date +%F).log

