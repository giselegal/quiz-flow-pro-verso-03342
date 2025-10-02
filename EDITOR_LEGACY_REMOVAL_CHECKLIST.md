# Checklist Pré-Remoção Final do Legacy ModernUnifiedEditor

Data inicial: 2025-10-02
Responsável: Equipe Editor
Status: Em andamento

---
## 1. Objetivo
Garantir que o código legacy (`ModernUnifiedEditor.legacy.tsx` + `EditorProUnified`) possa ser removido com risco mínimo após estabilização do pivot para `QuizFunnelEditor` via wrapper + FunnelEditingFacade.

## 2. Itens de Verificação Funcional
- [ ] CRUD de steps (add/update/remove/reorder) funciona em produção
- [ ] CRUD de blocks (add/update/remove/reorder) funciona em produção
- [ ] Seleção de step sincronizada com UI (sem saltos)
- [ ] Autosave executa somente em dirty transitions (sem salva redundante contínuo)
- [ ] Save manual (via façade) persiste quizSteps corretamente
- [ ] Botão Publicar (stub) não gera erros silenciosos
- [ ] Rollback `?legacy=1` continua funcional até desativação planejada

## 3. Itens Técnicos
- [ ] Nenhum novo import direto de `EditorProUnified` em código não-test
- [ ] Export `EditorProUnified` marcado como `@deprecated`
- [ ] Nenhum consumidor exige APIs exclusivas do legacy para quiz
- [ ] Facade cobre 100% das mutações hoje usadas pelo QuizFunnelEditor
- [ ] Console não apresenta warnings recorrentes ligados à fachada

## 4. Métricas Baseline (capturar após 24h)
Preencher com dados reais:
| Métrica | Valor | Fonte | Observação |
|---------|-------|-------|------------|
| TTF novo editor (ms) | _pendente_ | medição manual | /editor/:id sem cache |
| TTF legacy (ms) | _pendente_ | medição manual | /editor/:id?legacy=1 |
| Diferença (%) | _pendente_ | cálculo | (legacy-novo)/legacy |
| Latência save p95 (ms) | _pendente_ | logs console | >= 50 saves |
| Erros save (%) | _pendente_ | contagem | erros / tentativas |
| Autosaves/hora (média) | _pendente_ | logs | evitar > 12 se pouca edição |
| Uso fallback (%) | _pendente_ | query param tracking | < 5% alvo |

## 5. Critérios para REMOVER Legacy
Todos verdadeiros:
- [ ] 3 dias sem regressões críticas registradas
- [ ] > 90% sessões sem `?legacy=1`
- [ ] Nenhum diff estrutural inesperado em quizSteps persistidos
- [ ] Latência save p95 <= 800ms
- [ ] Erros save < 0.5%
- [ ] Aprovação explícita da equipe de produto

## 6. Plano de Remoção (Execução)
1. Remover export @deprecated do índice `editor/index.ts`
2. Deletar `EditorProUnified.tsx` e assets dependentes exclusivos
3. Deletar `ModernUnifiedEditor.legacy.tsx`
4. Rodar busca por `legacy` e limpar referências de fallback
5. Atualizar documentação: remover seção de rollback
6. Executar build + testes CI
7. Monitorar métricas 48h pós-remoção

## 7. Risco Residual e Mitigação
| Risco | Mitigação |
|-------|-----------|
| Componente oculto dependia de API legacy | Grep abrangente + validação QA antes do merge final |
| Edge case de reorder não coberto | Adicionar teste unit reordenando >10 steps variados |
| Regressão de publicação futura | Publicação real usará fachada; planejar contrato publish antes de remoção |

## 8. Próximos Incrementos (após remover legacy)
- Introduzir event bus externo e telemetria (substituir console.log)
- Adicionar validação de schema em persistFn (zod / io-ts)
- Implementar publish real e estender eventos: `publish/start|success|error`
- Extensão multi-funnel types via adapters → novas implementações de IFunnelEditingFacade

## 9. Estado Atual (snapshot)
- Pivot aplicado
- Facade ativa com autosave e testes
- Legacy isolado apenas por query param

---
Checklist será revisado diariamente até completar critérios de remoção.
