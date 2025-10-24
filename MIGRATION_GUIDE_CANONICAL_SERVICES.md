# Guia de Migração para Serviços Canônicos

Este guia descreve como migrar dos serviços legados para a camada canônica baseada em `BaseCanonicalService`, com telemetria, resultado padronizado e delegação por subserviços.

## Objetivos
- Consolidar N serviços legados em 12 serviços canônicos.
- Padronizar tratamento de erros via Result pattern.
- Facilitar adoção incremental com aliases e wrappers deprecatórios.
- Adicionar telemetria de adoção (CanonicalServicesMonitor).

## Estrutura canônica
- `src/services/canonical/DataService.ts` (façade)
- Subserviços:
  - `data/FunnelDataService.ts`
  - `data/ParticipantDataService.ts`
  - `data/SessionDataService.ts`
  - `data/ResultDataService.ts`
  - `data/AnalyticsDataService.ts`
- Utilitários:
  - `CacheService`, `monitoring.ts`, `types.ts`

## Aliases e wrappers
- Aliases de compatibilidade expõem serviços canônicos sob nomes legados.
- Wrappers (e.g., `HybridTemplateService`, `UnifiedTemplateService`) emitem avisos e delegam para canônicos.

## Passos de migração
1. Atualize imports para os aliases de compatibilidade se necessário.
2. Em seguida, migre dos aliases diretamente para os serviços canônicos em `@/services/canonical/...`.
3. Substitua chamadas diretas a serviços legados por métodos no `DataService` façade quando aplicável.
4. Remova usos de serviços legados conforme telemetria indicar adoção suficiente.

### Aliases e configuração (Vite/Vitest)
- O projeto define alias `@` para `src` e `@templates` para suportar o `UnifiedTemplateRegistry`.
- Garanta que Vite e Vitest estejam alinhados com os mesmos aliases.
- Em caso de erro de import como `@templates/embedded`, verifique as configurações de alias no build e no test runner.

### Wrappers deprecatórios
- `HybridTemplateService` e `UnifiedTemplateService` agora são shims que delegam para `TemplateService` (canônico) e emitem avisos de depreciação.
- Procure por imports desses serviços e direcione-os para `@/services/canonical/TemplateService` quando possível.

### Delegação por subserviço
- `DataService` atua como façade e delega por domínio:
  - Funis → `FunnelDataService`
  - Sessões → `SessionDataService`
  - Resultados → `ResultDataService`
  - Participantes → `ParticipantDataService`
  - Analytics → `AnalyticsDataService`
- Essa divisão facilita testes, telemetria e manutenção.

### Como medir adoção
- Toda entrada no façade e chamadas nos subserviços registram uso via `CanonicalServicesMonitor.trackUsage`.
- Consulte estatísticas agregadas:
  ```ts
  import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';
  const { totalCanonical, totalLegacy, adoptionRate, recent } = CanonicalServicesMonitor.getStats();
  ```
- Use esses números para decidir quando remover definitivamente serviços legados.

### Exemplos de uso (façade)
```ts
import { dataService } from '@/services/canonical/DataService';

// Funis
await dataService.funnels.create({ name: 'Quiz X', context: 'quiz' as any });
await dataService.funnels.list({ search: 'Quiz' }, { limit: 20, sortBy: 'updatedAt' });

// Sessões
const s = await dataService.sessions.create({ funnelId: 'f1', quizUserId: 'u1' });

// Participantes
await dataService.participants.create({ sessionId: 's1', email: 'a@b.com' });

// Resultados
await dataService.results.create({ sessionId: 's1', funnelId: 'f1', userId: 'u1', score: 10, maxScore: 100, answers: [] });

// Analytics
await dataService.analytics.getDashboardMetrics();
```

### Testes e validação
- Testes de delegação por domínio asseguram compatibilidade de API.
- Um teste E2E (mockado) verifica o encadeamento sessão → participante → resultado.
- Healthcheck agregado no `DataService` cobre subserviços e conexão com o banco.

### Executando apenas a suíte canônica
Para validar rapidamente a camada canônica sem rodar toda a suíte do projeto (evitando OOM e falhas não relacionadas):

- `npm run test:canonical`

Essa suíte utiliza um Vitest config dedicado (`vitest.config.canonical.ts`) com aliases alinhados (`@` e `@templates`), ambiente `jsdom` (para `localStorage` em integrações do Supabase) e execução single-thread para reduzir consumo de memória.

### Localizando imports legados (Hybrid/Unified/ServiceAliases)
Use o script de varredura para mapear pontos de migração para os aliases canônicos centralizados e, depois, para os serviços canônicos diretos:

- Relatório (somente leitura):
  - npm run migrate:canonical-imports
- Aplicação (experimental, substitui apenas o módulo do import para `@/services/aliases` e deixa comentário-guia):
  - npm run migrate:canonical-imports:apply

Recomendação de jornada:
- Fase A: migrar importações para `@/services/aliases` (ponte compatível com depreciação + telemetria legacy).
- Fase B: substituir gradualmente pelos canônicos definitivos (ex.: `templateService` em `@/services/canonical/TemplateService`).

### Solução de problemas
- Erro de import `@templates/embedded`: alinhe aliases em Vite e Vitest.
- Falhas de tipo: cheque contratos `ServiceResult<T>` e tipos `Funnel`, `QuizSession`, `QuizResult`.
- Telemetria não aparece: confirme que o façade do `DataService` está sendo utilizado (e não o subserviço diretamente) quando a intenção for medir o ponto de entrada.

## Contratos e tipos
- Retornos seguem o tipo `ServiceResult<T>`, evite `throw` em fluxos de domínio.
- Tipos principais:
  - `Funnel`, `QuizParticipant`, `QuizSession`, `QuizResult`, `DashboardMetrics`.

## Telemetria
- Entradas do façade e subserviços chamam `CanonicalServicesMonitor.trackUsage`.
- Consulte métricas em tempo de execução:
  ```ts
  import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';
  const stats = CanonicalServicesMonitor.getStats();
  // { totalCanonical, totalLegacy, adoptionRate, recent }
  ```

## Testes
- Delegação: testes por domínio (funnels, sessions, results, participants, analytics).
- E2E (mock): sessão → participante → resultado.
- Healthcheck agregado no `DataService`.

## Dicas
- Migre módulos de alto tráfego primeiro para maximizar sinal da telemetria.
- Use os métodos especializados do façade (`dataService.funnels/...`, `dataService.results/...`) para manter consistência.

## Checklist de migração por módulo
- [ ] Substituir import do serviço legado por alias de compatibilidade
- [ ] Substituir alias por import canônico
- [ ] Ajustar chamadas para API padronizada (ServiceResult)
- [ ] Verificar logs de depreciação
- [ ] Confirmar métricas no `CanonicalServicesMonitor.getStats()`

