# Plano de Remoção do FunnelServiceCompatAdapter

**Objetivo:** Eliminar `FunnelServiceCompatAdapter` e usar apenas `CanonicalFunnelService` com API unificada.

## Inventário e Impacto

- Pontos de entrada:
  - `src/services/adapters/FunnelServiceCompatAdapter.ts`
  - `src/services/ServiceRegistry.ts` (registra `funnelService: funnelServiceCompat`)
  - `src/services/canonical/FunnelService.ts` (reexporta compat como canônico)
- Uso corrente:
  - `ServiceRegistry.get('funnelService')` em camadas que ainda esperam API antiga.

## Estratégia em 3 Fases

1. Fase A — Criação da API Canônica Par-a-Par
   - Garantir que `CanonicalFunnelService` expose métodos equivalentes: `getFunnel`, `createFunnel`, `saveFunnel`, `listFunnels`, etc., delegando internamente à implementação moderna.
   - Adicionar testes de contrato (mínimos) para assegurar compat.

2. Fase B — Migração de Chamadas
   - Substituir usos de `ServiceRegistry.funnelService` por import explícito de `CanonicalFunnelService` onde possível.
   - Em páginas/serviços com alto acoplamento, introduzir um thin wrapper local para reduzir diffs.
   - Checklist de migração por módulo:
     - Pages: Dashboard, Editor, Templates
     - Services: Storage, Template, Persistence
     - Hooks: Persistência/AutoSave

3. Fase C — Desregistrar e Deletar Compat
   - Atualizar `ServiceRegistry` para apontar `funnelService` -> `CanonicalFunnelService`.
   - Remover `FunnelServiceCompatAdapter.ts`.
   - Ajustar `FunnelService.ts` para exportar apenas a classe/instância canônica.

## Critérios de Aceite

- Build passando sem `funnelServiceCompat`.
- Zero referências a `FunnelServiceCompatAdapter`.
- Smoke tests para: criar, carregar, salvar funil; listar funis.

## Riscos e Mitigações

- Risco: divergência de tipos entre API antiga e nova.
  - Mitigação: tipos de retorno uniformizados, zod schemas onde aplicável.
- Risco: efeitos colaterais em auto-save.
  - Mitigação: teste manual em Editor + logs temporários.

## Tarefas

- [ ] Mapear usos de `ServiceRegistry.get('funnelService')`
- [ ] Confirmar paridade de API no `CanonicalFunnelService`
- [ ] Migrar páginas de baixo risco (Templates/Modelos)
- [ ] Migrar Editor e Dashboard
- [ ] Atualizar `ServiceRegistry`
- [ ] Remover arquivo compat e referências
