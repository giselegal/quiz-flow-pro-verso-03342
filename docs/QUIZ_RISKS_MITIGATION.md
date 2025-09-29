# Riscos & Mitigações – Sistema de Quiz Unificado

## Metodologia
Cada risco avaliado por: Probabilidade (P) e Impacto (I) em escala 1–5. Severidade (S) = P * I. Mitigações priorizam S alto. Monitoramento descreve gatilhos de alerta.

| ID | Risco | P | I | S | Sintoma / Sinal | Mitigação Primária | Mitigação Secundária | Monitoramento |
|----|-------|---|---|---|-----------------|--------------------|----------------------|---------------|
| R1 | Divergência entre canonical e projeções (adapters/UI) | 2 | 5 | 10 | Script paridade falha | Teste `quiz:compare` em CI | Snapshot antes de merges | Execução automática no pre-publish |
| R2 | Quebra silenciosa de schema ao editar (dados inválidos) | 3 | 4 | 12 | Erros runtime tardios | Validação incremental Zod por patch | Dry-run de publish (full re-validate) | Contagem de erros de validação / versão bloqueada |
| R3 | Regressão de performance (TTFQ) | 3 | 4 | 12 | Aumento p95 TTFQ | Orçamento de performance (alarme) | Lazy load de partes não críticas | Métrica TTFQ agregada semanal |
| R4 | Edição concorrente (duas abas sobrescrevem) | 3 | 5 | 15 | Perda de alterações | Versionamento com optimistic lock (hash compare) | Merge tool futuro (diff visual) | Eventos de publish com hash divergente |
| R5 | Perda de integridade (hash alterado sem snapshot) | 2 | 5 | 10 | Hash mismatch | Recalcular + bloquear publish | Auditoria de mutações fora do fluxo | Log de `quiz.definition.reload` inesperados |
| R6 | Falha analytics (eventos não enviados) | 3 | 3 | 9 | Gaps em série temporal | Buffer com retry exponencial | Persistência local (IndexDB) | Taxa de envio vs gerados |
| R7 | Crescimento de payload (JSON > 500KB) | 2 | 4 | 8 | Latência de load ↑ | Compressão + splitting (futuro) | Remoção de campos redundantes | Tamanho medido por build script |
| R8 | Testes insuficientes para scoring/offer | 2 | 4 | 8 | Resultado incorreto | Testes determinísticos de matriz respostas | Snapshot testing diffs | Cobertura de caminhos estilos >= 95% |
| R9 | UI de edição gera estado inválido (ordem steps corrompida) | 3 | 4 | 12 | Navegação quebrada | Regras de reorder atômicas + validação | Auto-fix ordem (relink missing next) | Evento warning se gap detectado |
| R10 | Rollback lento ou manual | 2 | 4 | 8 | Atraso mitigação | API rollback idempotente | Cache última versão válida em memória | Tempo de rollback medido |
| R11 | Dependência forte de adaptador legacy persiste | 2 | 3 | 6 | Dificulta refactors | Lista de usos + plano corte | Codemod automatizado | Métrica: nº imports adapter |
| R12 | Erros de publish aumentam (validação) | 2 | 4 | 8 | Bloqueios frequentes | Pre-check incremental UI | Wizard de correção em lote | % erros publish por 30 tentativas |
| R13 | Oferta não exibida (matchValue inconsistente) | 2 | 4 | 8 | Ausência de `quiz.offer.shown` | Verificação de mapa final estratégico | Fallback offer genérica | % sessões sem `offer.shown` |
| R14 | Leakage de memória (listeners não removidos) | 2 | 3 | 6 | Uso de heap ↑ | Retorno unsubscribe obrigatório | Varredura devtool ocasional | Contagem ativa de handlers |
| R15 | Acoplamento excessivo hooks ↔ services | 3 | 3 | 9 | Refactors caros | Interfaces contratuais estáveis | Adaptação via factory injection | Revisão de dependências trimestral |
| R16 | Round-trip salvar lento > 500ms | 3 | 4 | 12 | Reclamações UX | Otimizar validação (delta) | Worker thread (futuro) | p95 latência salvar |
| R17 | Eventos perdidos em page unload | 4 | 3 | 12 | Falta de dados finais | Uso de `navigator.sendBeacon` | Flush antecipado ao close | % eventos flush vs produzidos |
| R18 | Falta de audit trail de mudanças | 3 | 3 | 9 | Dificuldade de debug | Snapshot diffs persistidos | Export histórico JSON | Contagem diffs armazenados |
| R19 | Config incorreta de countedStepIds | 2 | 3 | 6 | Barra progresso errada | Teste unit validando progress | Auto-cálculo fallback | Script checagem build |
| R20 | Erro silencioso na engine offer | 2 | 4 | 8 | Oferta ausente/errada | Teste matriz (resposta→variant) | Log fallback variant | Testes noturnos matriz |

## Top 5 Prioridade (S mais alto)
1. R4 (Concorrência) – Exige lock por hash antes de publicar.
2. R2 (Validação incremental) – Evita sujeira acumulada.
3. R3 (Performance) – Protege experiência inicial.
4. R16 (Salvamento lento) – Impacto direto na adoção do editor.
5. R17 (Eventos perdidos) – Afeta confiabilidade de métricas.

## Planos de Mitigação Detalhados

### Concorrência (R4)
- Ao iniciar edição: capturar `baseHash` do runtime.
- Ao salvar: recalcular hash do draft → se `runtime.hash !== baseHash`, bloquear e pedir refresh.
- Publicar: incluir `expectedHash` na operação; rejeitar se divergir.

### Validação Incremental (R2)
- Pipeline patch: (1) merge raso (2) validar step isolado (3) marcar dirty (4) se publish → full validate.
- Tipos derivados do Zod garantem shape consistente.

### Performance (R3)
- Pré-carregar JSON via `<link rel="preload">` (futuro) ou import estático bundler.
- Memo do mapeamento steps e computed index.
- Evitar recomputar scores em cada seleção (lazy: somente ao final ou sob debounce).

### Salvamento (R16)
- Armazenar índice de steps byId para patch O(1).
- Validar apenas campos alterados (evitar full parse).
- Serializar snapshot usando `structuredClone` rápido (>= Node/Chrome moderno) ou fallback raso.

### Eventos Perdidos (R17)
- Buffer em memória + flush a cada N eventos (N=10) e `beforeunload`.
- Fila com status (pending/flushOk) para métricas de perda.

## Checklist de Implementação de Mitigações (Fases)
| Fase | Mitigações | Done Quando |
|------|------------|-------------|
| F1 | Paridade + KPIs + Riscos (já) | Docs presentes + script ok |
| F2 | Hash optimistic lock (R4) | Salvamento bloqueia se hash divergir |
| F3 | Validação incremental (R2) | Step patch sem erro global |
| F4 | Buffer eventos + flush/unload (R17) | Nenhum evento perdido em teste manual |
| F5 | Métrica TTFQ + lazy scoring (R3) | Log console mostra TTFQ < alvo |
| F6 | Salvamento delta (R16) | p95 salvar < 300ms medido |

## Gatilhos de Revisão
- Qualquer aumento >10% em TTFQ p95 semana a semana.
- Crescimento JSON > 30% sem justificativa.
- Mais de 3 falhas de publish em 24h.

## Encerramento
Este documento deve ser revisado a cada grande incremento (UI de edição, versionamento, analytics remoto). Mantido leve: atualizar/remove riscos obsoletos.
