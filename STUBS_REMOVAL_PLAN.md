# Plano de Remoção de Stubs (Fase 5 e Hook de Performance)

Objetivo: substituir stubs temporários por implementações definitivas, mantendo o build estável e com feature flags claras.

## Escopo

- src/lib/services/phase5DataSimulator.ts (stub de dados)
- src/lib/hooks/usePerformanceTest.ts (hook de métricas de performance)

## Motivações

- Evitar acoplamento permanente a código de demonstração
- Melhorar observabilidade com métricas reais e rastreamento
- Assegurar comportamento determinístico em produção

## Critérios de Saída (Definition of Done)

1) phase5DataSimulator
- Geração/persistência de dados por storage real (ex.: Supabase/IndexedDB) ou remoção completa do simulador nas rotas de produção
- API estável coberta por teste unitário simples (init retorna shape conhecido)
- Remoção do TODO do arquivo e da referência no guia

2) usePerformanceTest
- Implementação com Performance API (PerformanceObserver/measure) e integração opcional com Sentry/Web-Vitals
- Feature flag: VITE_ENABLE_PERF_HOOK (default false em produção)
- Teste leve validando que em NODE_ENV=production o hook não emite alertas

## Plano de Ação

- Etapa 1 (curto prazo)
  - [x] Adicionar TODOs e comentários de contexto nos arquivos
  - [x] Garantir que em produção o hook não gera alertas
  - [ ] Expor flag VITE_ENABLE_PERF_HOOK e respeitar no hook

- Etapa 2 (médio prazo)
  - [ ] Implementar coleta real de métricas (render, long tasks, re-render count) usando PerformanceObserver
  - [ ] Opcional: enviar métricas para Sentry/endpoint próprio em batches
  - [ ] Substituir phase5DataSimulator por provider real de dados ou remover do bundle de produção

- Etapa 3 (finalização)
  - [ ] Remover referências a stubs de docs e comentários
  - [ ] Adicionar testes automatizados cobrindo os fluxos habilitado/desabilitado

## Riscos e Mitigações

- Risco: mudanças de métrica afetarem performance
  - Mitigação: gate por flag, coleta amostral e envio assíncrono

- Risco: simulador tornar-se fonte de verdade
  - Mitigação: remover importações em produção e isolar demo code via árvore de import com condicionais

## Dono e Prazo

- Owner: Eng. Plataforma (Editor/Runtime)
- Prazo sugerido: 1 sprint

## Observações

- O build atual está verde (type-check) com stubs; esta migração não é bloqueadora, mas recomendada para hardening antes de GA.
