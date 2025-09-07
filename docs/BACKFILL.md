# Backfill de component_instances

Este guia explica como popular a tabela `component_instances` a partir de `funnel_pages.blocks` de forma segura.

## Requisitos

- Node 18+
- Variáveis do Supabase no `.env` (crie a partir de `.env.example`):
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_KEY` (recomendado para escrita)
  - `SUPABASE_ANON_KEY` (opcional, apenas leitura/diagnóstico)

## Diagnóstico do ambiente (não altera dados)

- Verifica variáveis de ambiente e acesso às tabelas:

```bash
npm run diagnostic:backfill -- --funnel=<id[,id2]>
```

Saída esperada inclui:
- Presença de SUPABASE_URL/keys
- Acesso a `funnels`
- Quantidade de funis-alvo, páginas e instances existentes

## Dry-run (planeja sem escrever)

- Executa o planejamento e estatísticas sem inserir/alterar registros:

```bash
npm run backfill:component-instances:dry -- --funnel=<id[,id2]>
```

Observações:
- Sem `--apply`, o script opera como dry-run por padrão
- Se não houver `SUPABASE_URL`, o script apenas imprime instruções

## Aplicar (escrever no banco)

- Cria registros em `component_instances` para os funis filtrados:

```bash
npm run backfill:component-instances -- --funnel=<id[,id2]>
```

- Para recriar do zero (apagar existentes do(s) funil(is) e inserir novamente):

```bash
npm run backfill:component-instances -- --funnel=<id[,id2]> --force
```

## Flags disponíveis

- `--funnel=<id[,id2,...]>` ou `--only=<...>`: filtra funis por ID
- `--apply`: aplica mudanças; sem esta flag é dry-run
- `--force`: ao aplicar, apaga instances existentes do(s) funil(is) antes de inserir

## Notas de implementação

- O script lê `.env` automaticamente (dotenv)
- Insere em lotes (100 por batch) para evitar payloads grandes
- Gera IDs estáveis com prefixo `ci_` e `crypto.randomUUID`
- Mantém `order_index` pela ordem dos blocos e `step_number` pela página

## Arquivos relevantes

- `scripts/migration/backfillComponentInstances.ts`
- `scripts/diagnostic/checkBackfillReady.ts`
- `.env.example`
