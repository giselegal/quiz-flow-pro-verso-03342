# Fluxograma – Funil de 21 Etapas com Cálculo de Resultados

Este fluxograma resume o fluxo principal do funil (21 etapas) e o pipeline unificado de cálculo de resultados, incluindo gates de dados, desempate determinístico e persistência.

Observações importantes:
- Gate mínimo de dados: ≥ 8 seleções válidas e nome do usuário para cálculo final.
- Etapa 19 (pré-processamento): retorna fallback não persistido quando os dados são insuficientes.
- Etapa 20 (resultado final): executa a orquestração, aplica desempate determinístico e persiste no armazenamento unificado.
- Empates: estabilizados por ordenação determinística para reprodutibilidade.
- Percentual primário: se ausente/inválido, a UI usa fallback visual de 70% (apenas apresentação).

```mermaid
flowchart TD
    %% Agrupamento das 21 etapas
    subgraph COLETA[Etapas 1–18: Coleta de dados]
      direction TB
      S1[Etapa 1] --> S2[Etapa 2] --> S3[Etapa 3]
      S3 --> S4[Etapa 4] --> S5[Etapa 5] --> S6[Etapa 6]
      S6 --> S7[Etapa 7] --> S8[Etapa 8] --> S9[Etapa 9]
      S9 --> S10[Etapa 10] --> S11[Etapa 11] --> S12[Etapa 12]
      S12 --> S13[Etapa 13] --> S14[Etapa 14] --> S15[Etapa 15]
      S15 --> S16[Etapa 16] --> S17[Etapa 17] --> S18[Etapa 18]
    end

    subgraph P19[Etapa 19: Processamento/Pré-validação]
      D19[Unificar dados | UnifiedQuizStorage\n- seleções\n- formData (nome etc.)\n- metadados]
      GATE{Dados suficientes?\n(≥8 seleções e nome)}

      D19 --> GATE
    end

    subgraph P20[Etapa 20: Resultado Final]
      ORCH[ResultOrchestrator.run\n- pontuação determinística\n- desempate estável]
      PERC[Computar percentual primário\n(UI fallback = 70% se inválido)]
      SAVE[Salvar resultado\nUnifiedQuizStorage.saveResult]

      ORCH --> PERC --> SAVE
    end

    subgraph P21[Etapa 21: Pós-resultado]
      A21[Encerramento e ações\n(recomendações/CTA/export)]
    end

    %% Editor (Etapa 20) – Fallback de Template
    subgraph E20[Editor Etapa 20 (design/preview)]
      direction TB
      TPL[Carregar Template Step 20\n(stepTemplateService → JSON)]
      CHK{Tem result-header-inline\ne cálculo OK?}
      FB[Step20EditorFallback\n(usa Step20FallbackTemplate)]
      DZ[CanvasDropZone\n(render normal)]
      TPL --> CHK
      CHK -- "Não" --> FB
      CHK -- "Sim" --> DZ
    end

    %% Fluxo principal
    COLETA --> P19

    GATE -- "Não" --> FBACK[Fallback não-persistido\n(sem orquestração)\nexibir preview informativo]
    FBACK --> NEXTD[Usuário ajusta respostas\nou avança conforme regras]
    NEXTD -->|continua fluxo| COLETA

    GATE -- "Sim" --> P20
    P20 --> P21

    %% Persistência remota (opcional)
    SAVE -. opcional: sessão válida .-> REM[Persistência remota\n(quando habilitada)]

    %% Legenda
    classDef store fill:#2a3a4d,stroke:#1b2430,color:#fff
    classDef io fill:#e4f0fb,stroke:#9ec7f2,color:#0b2542
    classDef step fill:#f7f7f7,stroke:#d0d0d0,color:#222

    class D19,SAVE,REM store
    class ORCH,PERC io
  class S1,S2,S3,S4,S5,S6,S7,S8,S9,S10,S11,S12,S13,S14,S15,S16,S17,S18,P19,P20,P21,FBACK,NEXTD,COLETA,A21,E20,TPL,CHK,FB,DZ step
```

## Pontos de controle e regras
- Threshold de cálculo: ≥ 8 seleções válidas + nome do usuário.
- Etapa 19: valida unificação e aplica o gate. Se “Não”, retorna fallback não persistido (sem chamar orquestrador).
- Etapa 20: chama ResultOrchestrator, estabiliza empate, calcula percentual e persiste localmente.
- Persistência remota: apenas quando sessão/ambiente válidos; não é pré-requisito.
- UI: cabeçalho personalizado e proteção contra recálculo duplo (StrictMode) na Etapa 20.
 - Editor Etapa 20: carrega template via `stepTemplateService` (JSON). Se faltar `result-header-inline` ou houver erro/cálculo inválido, ativa `Step20EditorFallback` com `Step20FallbackTemplate` para garantir conteúdo.

Para detalhes das chamadas e eventos, veja também os testes em `src/utils/__tests__/quizResultCalculator.step19to20.test.ts` e os serviços `quizResultCalculator`, `ResultOrchestrator` e `UnifiedQuizStorage`.
