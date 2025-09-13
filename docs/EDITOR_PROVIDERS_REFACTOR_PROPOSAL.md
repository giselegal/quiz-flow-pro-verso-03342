## Refatoração da Estrutura de Providers do Editor

### Objetivos

1. Reduzir profundidade de aninhamento (complexidade cognitiva / React DevTools)
2. Eliminar estados duplicados (principalmente currentStep, funnel e blocos)
3. Definir fronteiras claras entre camadas (Data / Editor / Quiz / UI / Compat)
4. Facilitar migração gradual sem quebrar componentes legados
5. Preparar terreno para lazy loading de features (melhor TTFB / preview)

### Mapa Atual (Estado Antes - MainEditorUnified)

```
UnifiedFunnelProvider        (estado unificado de funil + permissões)
  FunnelsProvider            (legacy steps + templates hardcoded)
    EditorProvider           (estado legacy de blocos, history, supabase sync)
      LegacyCompatibilityWrapper (wrap + UnifiedContextProvider interno)
        EditorQuizProvider   (estado de quiz simplificado p/ perguntas)
          Quiz21StepsProvider (estado de fluxo + analytics + respostas avançadas)
            QuizFlowProvider (estado de navegação simples 21 steps)
              <Editor/Children>
```

### Redundâncias Identificadas

| Domínio             | Providers Hoje                          | Problema |
|---------------------|------------------------------------------|----------|
| Funil (dados)       | UnifiedFunnelProvider + FunnelsProvider  | Duplicação de fonte e cache separado |
| Passo atual         | EditorProvider.currentStep + Quiz21StepsProvider.currentStep + QuizFlowProvider.currentStep | Divergência potencial / renders extras |
| Blocos              | EditorProvider + UnifiedContext (legacy bridge) | Dois caminhos de mutação |
| Persistência / Save | EditorProvider (draft) + UnifiedContext (save) + FunnelsProvider.saveFunnelToDatabase | Três mecanismos paralelos |

### Riscos Atuais

* Dificuldade de rastrear origem de bugs de step / blocos
* Custo de renderização adicional em cada alteração de passo
* Superfície de API maior para novos contribuidores
* Crescimento exponencial de efeitos / listeners duplicados

### Arquitetura Alvo (Macro)

```
<EditorRuntimeProviders>
  ├─ FunnelLayer            (UnifiedFunnelProvider)               
  ├─ EditorLayer            (future: UnifiedEditor OR merged EditorProvider)
  ├─ QuizLayer              (CombinedQuizStepsProvider)           
  ├─ CompatibilityLayer     (LegacyBridgeProvider se necessário)  
  └─ UI/Children
</EditorRuntimeProviders>
```

### Plano de Migração por Fases

| Fase | Ação | Estado | Critério de Conclusão |
|------|------|--------|-----------------------|
| 1 | Encapsular árvore atual (feito) | NÃO QUEBRA | MainEditorUnified opcional via flag |
| 2 | Criar CombinedQuizStepsProvider unificando QuizFlow + Quiz21Steps | PARCIAL | API compatível: useQuizFlow e useQuiz21Steps delegam |
| 3 | Expor currentStep único -> derivar nos legacy | PARCIAL | EditorProvider passa a observar fonte única |
| 4 | Migrar EditorProvider para UnifiedContext (ou vice-versa) | PARCIAL | Uma única store de blocos |
| 5 | Retirar FunnelsProvider (usar adapter lendo UnifiedFunnel) | FINAL | Nenhum acesso direto a FUNNEL_TEMPLATES fora de adapter |
| 6 | Remover LegacyCompatibilityWrapper (substituir por shims pontuais) | FINAL | Nenhuma importação nova do hook legacy |

### Decisões de Design

1. Feature flag (query param `providerRefactor=true`) para ativar novo encapsulador sem alterar fluxo padrão.
2. Começar com "zero behavior change" (apenas encapsular) para reduzir risco inicial.
3. Documentar pontos de acoplamento antes de fundir estados (currentStep + blocks + funnel).
4. Evitar reescrever EditorProvider enquanto Supabase integration estiver em uso ativo.

### Métricas de Sucesso (propostas)

* Profundidade máxima de providers no DevTools: de 7 → <=4
* Redução de renders ao navegar steps: -20% (medir profiler após Fase 3)
* Eliminação de 100% dos warnings de contexto duplicado após Fase 4

### Próximos Passos Técnicos

1. Implementar CombinedQuizStepsProvider (derivar APIs de ambos contextos) – Fase 2
2. Introduzir contrato StepStateSource (interface) consumido por EditorProvider & Quiz layer
3. Criar adapter FunnelsLegacyAdapter que gera steps a partir de UnifiedFunnelData
4. Converter EditorProvider para usar StepStateSource e remover currentStep local
5. Apagar listeners globais redundantes (window.dispatchEvent) substituindo por callbacks diretos

### Retrocompatibilidade

| Elemento | Status Fase 1 | Mudança Futuras | Ação Requerida por Times Externos |
|----------|---------------|-----------------|-----------------------------------|
| useQuizFlow | Intocado | Delegado para Combined provider | Nenhuma (hook continua) |
| useQuiz21Steps | Intocado | Delegado | Nenhuma |
| useEditor (legacy wrapper) | Intocado | Deprecado e depois removido | Migrar para useUnifiedContext |
| FunnelsProvider | Intocado | Substituído por adapter | Parar de importar steps direto |

### Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Divergência de steps durante transição | Fonte única definida antes da fusão (StepStateSource) |
| Quebra de testes com mocks de múltiplos providers | Criar mocks para EditorRuntimeProviders no setup de testes |
| Supabase integração depende de EditorProvider atual | Adiar fusão EditorProvider até contrato de persistência definido |

### Conclusão

Esta primeira entrega apenas encapsula a árvore para permitir refactor seguro. As próximas fases podem ser realizadas incrementalmente sem bloquear desenvolvimento de features. A flag permite rollback instantâneo.

---
Documento gerado automaticamente (Fase 1). Atualizar conforme avançar.
