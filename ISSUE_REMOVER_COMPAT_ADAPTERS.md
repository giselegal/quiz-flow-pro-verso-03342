# Issue: Remover Adapters de Compatibilidade (FunnelServiceCompatAdapter)

**Milestone:** Editor Hooks Migration — Concluída
**Data de abertura:** 2025-12-03
**Responsável:** @giselegal

## Contexto

Após a migração total para `useEditor`, seguimos para remover compat layers remanescentes. O principal alvo é `FunnelServiceCompatAdapter`, ainda registrado em `ServiceRegistry`.

## Escopo

- Substituir usos de `ServiceRegistry.get('funnelService')` por `CanonicalFunnelService`.
- Atualizar `src/services/ServiceRegistry.ts` para apontar para a implementação canônica.
- Remover `src/services/adapters/FunnelServiceCompatAdapter.ts` e referências.

## Referência

- Plano detalhado: `PLANO_REMOVER_COMPAT_FUNNEL_SERVICE.md`
- Build atual: ✅ passando; editor atualizado; chunking refinado.

## Critérios de Aceite

- Build passando sem `funnelServiceCompat`.
- Zero referências a `FunnelServiceCompatAdapter`.
- Smoke tests (criar/carregar/salvar/listar funil) passam.

## Tarefas

- [ ] Mapear usos de `ServiceRegistry.get('funnelService')` e substituir por canônico
- [ ] Confirmar paridade de API no `CanonicalFunnelService`
- [ ] Migrar páginas e serviços (Templates, Editor, Dashboard)
- [ ] Atualizar `ServiceRegistry`
- [ ] Remover compat adapter e referências
- [ ] Rodar smoke tests e validar

## Notas

- Risco de divergência de tipos: mitigar com zod schemas e testes de contrato.
- Changes devem ser pequenos e focados por módulo.
