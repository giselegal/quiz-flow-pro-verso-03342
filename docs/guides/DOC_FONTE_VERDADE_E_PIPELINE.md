# Fonte da Verdade e Pipeline de Geração de Templates

Este documento descreve a origem dos dados (source of truth) e o pipeline de geração/normalização dos templates e blocks, para evitar confusões sobre arquivos aparentemente duplicados no repositório.

## Fontes da Verdade

- `src/data/templates/` e `src/data/modularSteps/`
  - Diretórios de trabalho (fonte) para templates e steps modulares.
  - Edita-se aqui quando a intenção é evoluir o conteúdo e a estrutura de templates/steps.

## Artefatos Gerados

- `public/templates/`
  - Normalizações e pacotes prontos para consumo em runtime/preview.
  - Subpastas como `blocks/` e `normalized/` podem conter representações diferentes do mesmo step/template.
  - Duplicatas de ids (ex.: `step-01`) são esperadas entre categorias (ex.: `blocks` vs `normalized`).

- `src/config/optimized21StepsFunnel.json`
  - Agregado otimizado de 21 etapas para composições rápidas.
  - Pode conter referências redundantes por motivos de compatibilidade ou de composição.

## Pipeline (recomendado)

A sequência abaixo descreve a geração padrão de artefatos a partir das fontes:

1. Gerar templates a partir das fontes
   - `npm run generate:templates`
2. Normalizar templates (estruturas canônicas)
   - `npm run normalize:templates`
3. Produzir blocks a partir do master
   - `npm run blocks:from-master`
4. (Opcional) Build de templates para produção
   - `npm run build:templates`

Os scripts exatos podem variar conforme sua necessidade, mas a regra é: edite em `src/data/...` e gere para `public/templates/...` quando precisar de artefatos consumíveis.

## Auditoria e Duplicatas

- A auditoria (`npm run audit:jsons`) trata duplicatas entre categorias como esperadas para ids listados na whitelist em `scripts/audit-jsons.config.json`.
- Se uma duplicata não for intencional, remova-a na fonte (`src/data/...`) e regenere os artefatos.

## CI e Falhas de Auditoria

- Use `npm run audit:jsons:ci` para que a auditoria falhe quando:
  - Existirem JSONs inválidos; e/ou
  - Existirem ids duplicados não-whitelisted.

## Notas sobre `optimized21StepsFunnel.json`

- Se duplicatas de `stepIds` forem intencionais (ex.: para manter compatibilidade com consumidores legados), mantenha-as e documente o motivo aqui.
- Se não forem intencionais, utilize o script de deduplicação (abaixo) em modo dry-run para identificar e corrigir.

## Ferramentas auxiliares

- Auditoria de JSONs: `npm run audit:jsons` | CI: `npm run audit:jsons:ci`
- (Opcional) Deduplicação de steps no funil otimizado: `node scripts/audit/dedupe-optimized21.mjs --dry-run` | `--apply`
