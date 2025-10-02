# Decisão de Arquitetura: Pivot para QuizFunnelEditor como Editor Principal

Data: 2025-10-02  
Status: ATIVO (Pivot aplicado)  
Responsável: Equipe de Arquitetura / Editor

---
## 1. Contexto Original
O `ModernUnifiedEditor` (monólito) acumulou:
- Múltiplos caminhos de bootstrap (template, funil existente, AI, testes)
- Camadas sobrepostas de providers e hooks (bootstrap, unified editor core, CRUD unificado, detecção de tipo, orquestração de dashboard)
- Duplicação de lógica de steps para funis de quiz (quizSteps) vs. representação genérica
- Crescente complexidade para pequenos incrementos (risco alto de regressão)

## 2. Problema
Tempo de entrega para evoluções de Quiz era penalizado pela necessidade de tocar áreas legadas frágeis. O esforço para “unificar tudo agora” criava gargalo e risco de paralisar entregas de produto.

## 3. Decisão
Aplicar estratégia de Strangler/Façade:  
- Tornar `QuizFunnelEditor` o editor padrão imediato.  
- Manter `ModernUnifiedEditor.legacy` acessível via `?legacy=1` como fallback.  
- Introduzir uma **FunnelEditingFacade** desacoplada (contrato padronizado de steps/blocos/eventos/persistência).  
- Injetar a fachada apenas no fluxo novo; legacy permanece isolado até remoção.

## 4. Motivação / Benefícios
| Objetivo | Benefício Concreto |
|----------|--------------------|
| Redução de risco | Rollback instantâneo via query param |
| Velocidade | Novas features de quiz não dependem do monólito |
| Observabilidade | Eventos estruturados (steps/blocks/save/dirty) para futura instrumentação |
| Evolução incremental | Outras modalidades de funil podem aderir ao contrato futuramente |
| Simplificação | Wrapper leve substitui renderização pesada + múltiplos estados intermediários |

## 5. Escopo Atual Entregue
- Wrapper limpo `ModernUnifiedEditor.tsx` com banner de transição + fallback legacy.
- `FunnelEditingFacade` + implementação `QuizFunnelEditingFacade` com:
  - CRUD completo de steps e blocks
  - Reordenação steps/blocks
  - Dirty tracking e snapshot serializável
  - Eventos: `steps/changed`, `blocks/changed`, `step/selected`, `dirty/changed`, `save/*`
- Persistência real mapeada para `quizSteps` via `useUnifiedCRUD.saveFunnel`.
- Autosave (debounce 5s) baseado em evento de dirty.
- Testes Vitest cobrindo mutações e ciclo de save.

## 6. Fora de Escopo (por ora)
- Generalização para outros tipos de funil (somente quiz agora)
- Observabilidade real (apenas console structured logs)
- Publicação final de funil (stub em implementação)
- Remoção física do código legacy (fase posterior ao checklist de métricas)

## 7. Riscos e Mitigações
| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Divergência funcional entre legacy e novo | Inconsistências de UX | Comparação supervisionada em período de convivência |
| Falhas ocultas no mapeamento `quizSteps` | Perda parcial de dados em save | Testes + logs + validação de snapshot antes de persistir |
| Crescimento não controlado da fachada | Novo acoplamento rígido | Revisões de contrato + limitar superfície a casos reais |
| Autosave interferindo em fluxo de publicação | Condições de corrida | Debounce + evento de save isolado + futura fila de operações |

## 8. Rollback Plan
Simples: adicionar `?legacy=1` na URL do editor.  
Fallback permanece carregando o `ModernUnifiedEditor.legacy` intacto.  
Critério para acionar rollback: erro crítico de persistência ou regressão bloqueante detectada em produção sem correção rápida.

## 9. Métricas a Monitorar (Baseline pós-pivot)
| Métrica | Origem | Objetivo Inicial |
|---------|--------|------------------|
| TTF (Time to First Interactive) | Medição manual + futura RUM | Reduzir vs legacy (>15% melhoria) |
| Latência save (ms) | Logs persistFn | < 800ms p95 |
| Erros save (%) | Contagem console / Sentry futuro | < 0.5% |
| Taxa autosave cancelado | Contagem timers limpos | < 30% (indicador de excesso de churn) |
| Uso fallback legacy (%) | Query param tracking | < 5% após 2 semanas |

## 10. Critérios de Sucesso do Pivot
- >90% dos fluxos de edição de quiz executados sem `?legacy=1` na primeira semana.
- Nenhuma perda de dados reportada (comparação snapshots vs estado persistido). 
- Equipe consegue adicionar bloco ou mutação nova apenas tocando a fachada e editor de quiz (sem editar legacy).

## 11. Próximos Passos
1. Botão / fluxo de Publicação (stub → serviço real)  
2. Deprecar símbolos legacy (@deprecated)  
3. Checklist de remoção + coleta de baseline de métricas  
4. Instrumentação (substituir logs por pipeline de eventos)  
5. Extensão do contrato para funis não-quiz (se validado)  

## 12. Plano de Remoção Futura (High-Level)
- Fase A: Coleta de métricas + estabilização (esta semana)
- Fase B: Desativar fallback em staging (feature flag)
- Fase C: Remover importações residuais e referências indiretas
- Fase D: Deletar `ModernUnifiedEditor.legacy.tsx` e assets exclusivos

## 13. Impacto em Dependências
- `useUnifiedCRUD`: ponto único de persistência → permanecerá; considerar thin adapter futuro.
- `QuizFunnelEditor`: agora dependente de contexto da fachada (próxima etapa: consumir diretamente para seleção/mutações UI).

## 14. Notas Técnicas de Implementação
- Snapshot serializado mapeia `blocks[].data` → `block.config` original (compatibilidade mantida)
- IDs preservados quando existentes; fallback gera `step-${idx}` / `blk-${timestamp}`.
- Autosave ignora se não houver `currentFunnel` (proteção inicial).

## 15. Decisões que NÃO Tomamos (Explícito)
- Não migramos imediatamente todos os funis para novo contrato genérico.
- Não refatoramos a árvore de providers legacy (evitamos custo antes de validar pivot).
- Não introduzimos ainda um event bus global (uso local simplifica rollback).

## 16. Ações de Follow-up (Rastreáveis nos TODOs)
- [ ] Publicar stub (botão + evento publish/start)
- [ ] Deprecar símbolos legacy
- [ ] Checklist de remoção e baseline métricas

---
## 17. FAQ Rápido
**Q:** Por que não remover direto o legacy?  
**A:** Garantia operacional + comparativo controlado + rollback zero friction.  
**Q:** Vale generalizar a fachada agora?  
**A:** Não. Prematuro sem outro tipo de funil ativo no mesmo fluxo.  
**Q:** Onde extender eventos?  
**A:** Adicionar chave em enum livre (string union) na própria implementação e documentar aqui.

---
## 18. Revisões Futuras
Documento deve ser atualizado ao:  
- Introduzir publish real  
- Alterar contrato de snapshot  
- Remover fallback legacy

---
Fim.
