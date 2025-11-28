# Supabase: Tipos e Auditoria RLS

## Variáveis necessárias

- `SUPABASE_DB_URL`: URL Postgres (recomendado para gerar tipos e rodar auditoria RLS)
- Alternativa para gerar tipos via CLI:
  - `VITE_SUPABASE_PROJECT_ID`
  - `SUPABASE_ACCESS_TOKEN`

Defina localmente:

```bash
export SUPABASE_DB_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

Ou via projeto/token:

```bash
export VITE_SUPABASE_PROJECT_ID="xxxx"
export SUPABASE_ACCESS_TOKEN="sbpat_xxx"
```

## Comandos

- Gerar tipos:

```bash
npm run supabase:gen:types
```

- Rodar auditoria RLS (requer `psql` e `SUPABASE_DB_URL`):

```bash
npm run audit:rls
```

Relatório será salvo em `reports/rls-audit-YYYY-MM-DD.log`.

## CI

Workflow `validate-json-and-rls.yml`:
- `validate-json-v4`: sempre roda e falha PRs se JSON V4 inválidos.
- `audit-rls`: roda apenas se `SUPABASE_DB_URL` estiver configurado em `Secrets` do repositório.

Configure `SUPABASE_DB_URL` em Repository Settings → Secrets and variables → Actions.
