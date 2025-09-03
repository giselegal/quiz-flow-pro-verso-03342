# Diagrama de Sequência – Cálculo e Persistência do Resultado

Este diagrama detalha as trocas entre UI (Step20Template), calculadora unificada, orquestrador e camada de armazenamento.

```mermaid
sequenceDiagram
  autonumber
  participant UI as Step20Template (UI)
  participant QC as quizResultCalculator
  participant UQS as UnifiedQuizStorage
  participant ORC as ResultOrchestrator
  participant REM as Persistência Remota (opcional)

  Note over UI: Montagem da Etapa 20
  UI->>QC: recalculateQuizResult() / calculateAndSaveQuizResult()
  QC->>UQS: loadUnifiedData()
  UQS-->>QC: { selections, formData, meta }

  alt Dados insuficientes (threshold)
    QC-->>UI: FallbackResult { persisted: false }
    Note over UI: Exibir fallback (percentual UI default=70%)
  else Dados suficientes
    QC->>ORC: run(unifiedData)
    ORC-->>QC: ResultPayload { scores ordenados, stylePrimário }
    QC->>UQS: saveResult(payload)
    UQS-->>QC: ok
    opt sessão válida e config habilitada
      QC->>REM: persist(payload)
      REM-->>QC: ok
    end
    QC-->>UI: FinalResult { persisted: true }
  end

  Note over UI: UI aplica desempate determinístico já vindo do ORC
```

Notas:
- Gate de dados (≥8 seleções + nome) é aplicado no `quizResultCalculator` antes de chamar o orquestrador.
- Orquestrador garante ordenação determinística para desempate.
- Persistência remota é opcional e somente quando ambiente/sessão permitirem.
