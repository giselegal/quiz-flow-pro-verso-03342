# ✅ CHECKLIST DE AÇÃO - Resolução de Duplicações

**Status Inicial**: 🔴 39 Providers para 13 Responsabilidades  
**Meta**: 🟢 13 Providers para 13 Responsabilidades (1:1)  
**Data Início**: ___________  
**Data Meta**: ___________

---

## 🚨 FASE 0 - EMERGÊNCIA (CONCLUÍDA ✅)

**Prioridade**: P0 - Risco de Segurança  
**Status**: ✅ **COMPLETA** - 21/Nov/2025

- [x] **SecurityProvider Stub - CORRIGIDO**
  - [x] Revisar 3 arquivos que importam SecurityProvider
  - [x] Identificar requisitos de segurança reais
  - [x] Implementar validação de acesso real com:
    - Rate limiting (60 tentativas/minuto)
    - Validação de recursos restritos
    - Logging de eventos de segurança
    - Histórico de tentativas de acesso
  - [x] Remover stub temporário
  - [ ] Testes de segurança (pendente)
  - **Responsável**: GitHub Copilot
  - **Concluído em**: 21/Nov/2025

---

## 🎯 FASE 1 - DECISÃO ESTRATÉGICA (48H)

**Prioridade**: P0 - Bloqueia outras fases

### Reunião de Alinhamento
- [ ] Agendar reunião com stakeholders
- [ ] Apresentar `SUMARIO_EXECUTIVO_DUPLICACOES.md`
- [ ] Apresentar `ANALISE_ESTRUTURAS_DUPLICADAS.md`
- [ ] Discutir 3 opções (Completar/Reverter/Híbrida)
- [ ] **Decisão documentada**: _________

### Opção Escolhida
- [ ] Opção A: Completar FASE 2.1
- [ ] Opção B: Reverter FASE 2.1
- [ ] Opção C: Estratégia Híbrida
- [ ] Criar issue no GitHub P0
- [ ] Criar milestone no projeto

---

## 📦 FASE 2 - CLEANUP IMEDIATO (3-5 dias)

**Se escolher Opção A (Completar)**: Pule para FASE 3  
**Se escolher Opção B (Reverter)**: Execute abaixo

### Reverter FASE 2.1
- [ ] Backup de branch atual
- [ ] Deletar `SuperUnifiedProviderV2.tsx`
- [ ] Deletar 12 providers modulares:
  - [ ] `/contexts/auth/AuthProvider.tsx`
  - [ ] `/contexts/theme/ThemeProvider.tsx`
  - [ ] `/contexts/editor/EditorStateProvider.tsx`
  - [ ] `/contexts/funnel/FunnelDataProvider.tsx`
  - [ ] `/contexts/navigation/NavigationProvider.tsx`
  - [ ] `/contexts/quiz/QuizStateProvider.tsx`
  - [ ] `/contexts/result/ResultProvider.tsx`
  - [ ] `/contexts/storage/StorageProvider.tsx`
  - [ ] `/contexts/sync/SyncProvider.tsx`
  - [ ] `/contexts/validation/ValidationProvider.tsx`
  - [ ] `/contexts/collaboration/CollaborationProvider.tsx`
  - [ ] `/contexts/versioning/VersioningProvider.tsx`
- [ ] Atualizar `src/contexts/index.ts` (remover exports V2)
- [ ] Atualizar `FASE_2.1_COMPLETE_REPORT.md` (marcar como revertido)
- [ ] Build funcional
- [ ] Testes passando
- [ ] Commit com mensagem: "Revert FASE 2.1 - Migration incomplete"

---

## 🚀 FASE 3 - MIGRAÇÃO V1 → V2 (2-3 semanas)

**Se escolher Opção B (Reverter)**: Pule esta fase  
**Se escolher Opção A (Completar)**: Execute abaixo

### Wave 1 - Infraestrutura (Semana 1)
- [ ] Criar hook de compatibilidade `useLegacySuperUnified()`
- [ ] Migrar `App.tsx` para SuperUnifiedProviderV2
- [ ] Validar build
- [ ] Testes de smoke

### Wave 2 - Hooks Principais (Semana 1-2)
- [ ] Migrar `useSuperUnified()` → hooks individuais
- [ ] Atualizar 20+ arquivos:
  - [ ] `src/hooks/useBlockMutations.ts`
  - [ ] `src/hooks/useStepBlocks.ts`
  - [ ] `src/hooks/useEditorHistory.ts`
  - [ ] `src/hooks/useSuperUnified.ts`
  - [ ] `src/hooks/useEditor.ts`
  - [ ] `src/hooks/usePureBuilderCompat.ts`
  - [ ] `src/components/ui/ThemeToggle.tsx`
  - [ ] `src/components/editor/layouts/UnifiedEditorLayout.tsx`
  - [ ] `src/components/editor/quiz/ModularPreviewContainer.tsx`
  - [ ] `src/components/admin/UnifiedAdminLayout.tsx`
  - [ ] `src/pages/Home.tsx`
  - [ ] `src/pages/editor/QuizEditorIntegratedPage.tsx`
  - [ ] `src/pages/editor/index.tsx`
  - [ ] `src/pages/MainEditorUnified.new.tsx`
  - [ ] `src/editor/components/StepCanvas.tsx`
  - [ ] `src/contexts/AuthContext.ts`
  - [ ] `src/contexts/index.ts`
  - [ ] Testes em `src/components/editor/__tests__/`
- [ ] Build funcional após cada arquivo
- [ ] Testes de regressão

### Wave 3 - Cleanup (Semana 2-3)
- [ ] Deletar `SuperUnifiedProvider.tsx` V1
- [ ] Deletar slices órfãos:
  - [ ] `/contexts/providers/AuthProvider.tsx`
  - [ ] `/contexts/providers/ThemeProvider.tsx`
  - [ ] `/contexts/providers/EditorProvider.tsx`
  - [ ] `/contexts/providers/FunnelProvider.tsx`
- [ ] Deletar providers legados:
  - [ ] `/contexts/auth/AuthContext.tsx`
  - [ ] `/contexts/ui/ThemeContext.tsx`
  - [ ] `/contexts/validation/ValidationContext.tsx`
- [ ] Atualizar `src/contexts/index.ts`
- [ ] Remover exports legados
- [ ] Build final
- [ ] Testes completos
- [ ] Commit: "Complete FASE 2.1 migration - All components using V2"

---

## 📝 FASE 4 - DOCUMENTAÇÃO (3-5 dias)

### Atualizar Documentação
- [ ] Marcar `FASE_2.1_COMPLETE_REPORT.md` como "REALMENTE concluída"
- [ ] Criar `MIGRATION_V1_TO_V2_GUIDE.md`
- [ ] Atualizar `README.md` com nova arquitetura
- [ ] Documentar 4 providers não documentados:
  - [ ] LivePreviewProvider
  - [ ] PerformanceProvider
  - [ ] SecurityProvider (após implementação real)
  - [ ] UIProvider
- [ ] Criar diagrama de arquitetura atualizado
- [ ] Guia de onboarding para novos desenvolvedores

### Code Comments
- [ ] Adicionar JSDoc em todos providers V2
- [ ] Adicionar warnings em código legado (se mantido)
- [ ] Exemplos de uso de cada hook

---

## 🛡️ FASE 5 - GOVERNANÇA (Ongoing)

### Prevenção de Regressão
- [ ] ESLint rules:
  - [ ] Bloquear imports de `@/contexts/providers/SuperUnifiedProvider` (V1)
  - [ ] Bloquear imports de `*ProviderLegacy`
  - [ ] Bloquear stubs em produção (como SecurityProvider)
- [ ] Pre-commit hooks
- [ ] CI checks para duplicações
- [ ] Documentar padrão de criação de providers

### Monitoramento
- [ ] Dashboard de métricas de arquitetura
- [ ] Alert para novos providers não documentados
- [ ] Code review checklist

---

## 📊 MÉTRICAS DE SUCESSO

### Antes (Estado Atual)
- Providers Total: 39
- Duplicação Média: 3x
- Código Órfão: ~3000 linhas
- Security Stubs: 1
- Arquivos em V1: 20+
- Arquivos em V2: 0

### Meta (Após Conclusão)
- [ ] Providers Total: ≤ 15 (13 + 2 utilitários)
- [ ] Duplicação Média: 1x
- [ ] Código Órfão: 0 linhas
- [ ] Security Stubs: 0
- [ ] Arquivos em V1: 0
- [ ] Arquivos em V2: 100%

---

## 👥 RESPONSÁVEIS

| Fase | Responsável | Revisor | Status |
|------|-------------|---------|--------|
| FASE 0 - Security | _________ | _________ | 🔴 Não iniciado |
| FASE 1 - Decisão | _________ | _________ | 🔴 Não iniciado |
| FASE 2 - Cleanup | _________ | _________ | ⏸️ Pendente decisão |
| FASE 3 - Migração | _________ | _________ | ⏸️ Pendente decisão |
| FASE 4 - Docs | _________ | _________ | ⏸️ Pendente conclusão |
| FASE 5 - Governança | _________ | _________ | ⏸️ Pendente conclusão |

---

## 📅 CRONOGRAMA ESTIMADO

**Se Opção A (Completar FASE 2.1)**:
```
Semana 1: FASE 0 + FASE 1 + Wave 1
Semana 2: Wave 2 (migração bulk)
Semana 3: Wave 3 (cleanup)
Semana 4: FASE 4 (documentação)
Ongoing: FASE 5 (governança)
```

**Se Opção B (Reverter FASE 2.1)**:
```
Dia 1-2: FASE 0 (security)
Dia 1-2: FASE 1 (decisão)
Dia 3-5: FASE 2 (cleanup/reverter)
Semana 2: FASE 4 (documentação)
Ongoing: FASE 5 (governança)
```

---

## 📎 ANEXOS

**Documentos de Referência**:
- `ANALISE_ESTRUTURAS_DUPLICADAS.md` - Relatório técnico completo
- `SUMARIO_EXECUTIVO_DUPLICACOES.md` - Resumo executivo
- `FASE_2.1_COMPLETE_REPORT.md` - Documentação original (incorreta)

**Links Úteis**:
- Issue GitHub: _________
- Milestone: _________
- Branch de trabalho: _________

---

**Última Atualização**: ___________  
**Progresso Global**: 0% (___/52 tarefas)
