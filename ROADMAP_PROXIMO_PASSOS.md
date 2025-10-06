# 🗺️ ROADMAP - PRÓXIMOS PASSOS DO EDITOR UNIFICADO

**Data:** 06/10/2025  
**Status Atual:** Fase 1 em Validação 🧪

---

## 📊 SITUAÇÃO ATUAL

### ✅ O QUE JÁ ESTÁ PRONTO

1. **Sistema de Feature Flags** ✅
   - FeatureFlagManager implementado
   - Variáveis de ambiente configuradas (.env.local)
   - Logs de debug adicionados
   - Badge visual no canto superior direito

2. **Integração da Fachada** ✅
   - FunnelEditingFacade integrada ao ModernUnifiedEditor
   - QuizFunnelEditorWYSIWYG conectado
   - Sistema de autosave configurado (5 segundos)
   - Eventos de publish/save implementados

3. **Infraestrutura** ✅
   - Documentação completa (3 guias)
   - Scripts helper (toggle-editor-flag.sh, open-editor.sh)
   - Build funcionando sem erros
   - Dev server configurado

### 🧪 EM VALIDAÇÃO AGORA

**FASE 1:** Ativação do Editor Unificado com Facade

**O que precisa ser testado:**
1. Abrir http://localhost:8080/editor
2. Verificar badge no canto superior direito (deve mostrar "✅ FACADE ATIVO")
3. Abrir console (F12) e verificar logs de feature flags
4. Testar se o editor carrega corretamente
5. Testar funcionalidade de autosave
6. Testar botão de publicar (se disponível)

**Problema identificado:**
- Logs de debug mostram que as variáveis de ambiente não estão sendo lidas
- Servidor precisa ser reiniciado após criar .env.local
- Possível incompatibilidade entre Vite e carregamento de .env.local

---

## 🎯 PRÓXIMAS FASES (APÓS FASE 1 VALIDADA)

### **FASE 2:** Modularização Completa do Painel de Propriedades 🎨
**Objetivo:** Substituir painéis monolíticos por componentes modulares reutilizáveis

**Implementações:**
1. **Extrair Painéis de Propriedades:**
   ```
   src/components/editor/properties/
   ├── QuestionPropertiesPanel.tsx    (perguntas de quiz)
   ├── ResultPropertiesPanel.tsx      (tela de resultado)
   ├── OfferPropertiesPanel.tsx       (tela de oferta)
   └── CommonPropertiesPanel.tsx      (propriedades comuns)
   ```

2. **Criar Sistema de Registry de Painéis:**
   ```typescript
   // PropertiesPanelRegistry.ts
   interface PropertiesPanel {
     stepType: string;
     component: React.ComponentType<PropertiesPanelProps>;
   }
   ```

3. **Integrar com Facade:**
   - Facade despacha eventos de seleção
   - PropertiesPanel escuta eventos
   - Renderiza painel específico baseado em stepType

**Benefícios:**
- ✅ Reutilização de código entre editores
- ✅ Manutenção mais fácil
- ✅ Adicionar novos tipos de step sem modificar código existente

**Tempo estimado:** 4-6 horas  
**Arquivos afetados:** ~8 arquivos novos + 3 modificações

---

### **FASE 3:** Sistema de Undo/Redo 🔄
**Objetivo:** Permitir desfazer/refazer alterações no editor

**Implementações:**
1. **Command Pattern:**
   ```typescript
   // EditorCommand.ts
   interface EditorCommand {
     execute(): void;
     undo(): void;
   }
   
   class UpdateStepCommand implements EditorCommand {
     // ...
   }
   ```

2. **History Manager:**
   ```typescript
   class EditorHistory {
     private undoStack: EditorCommand[] = [];
     private redoStack: EditorCommand[] = [];
     
     execute(command: EditorCommand): void
     undo(): void
     redo(): void
   }
   ```

3. **Integrar com Facade:**
   - Facade wrapping de comandos
   - Toolbar com botões Undo/Redo
   - Atalhos de teclado (Ctrl+Z, Ctrl+Y)

**Benefícios:**
- ✅ Melhor experiência do usuário
- ✅ Reduz medo de "quebrar" o funil
- ✅ Permite experimentação

**Tempo estimado:** 6-8 horas  
**Arquivos afetados:** ~5 arquivos novos + 4 modificações

---

### **FASE 4:** Otimização de Performance 🚀
**Objetivo:** Melhorar velocidade de carregamento e edição

**Implementações:**
1. **Lazy Loading de Componentes:**
   ```typescript
   const QuestionPropertiesPanel = lazy(() => import('./properties/QuestionPropertiesPanel'));
   ```

2. **Memoização Estratégica:**
   - useMemo em computações pesadas
   - React.memo em componentes puros
   - useCallback em handlers de eventos

3. **Virtual Scrolling:**
   - Lista de etapas virtualizada (react-window)
   - Lista de componentes virtualizada
   - Reduz DOM nodes em funis grandes

4. **Debouncing/Throttling:**
   - Debounce em autosave (já implementado - 5s)
   - Throttle em preview canvas
   - Throttle em validações

**Benefícios:**
- ✅ Editor mais responsivo
- ✅ Suporta funis com 50+ etapas
- ✅ Menor uso de memória

**Tempo estimado:** 4-6 horas  
**Arquivos afetados:** ~10 modificações

---

### **FASE 5:** Validações e Feedback Visual 🎯
**Objetivo:** Melhorar feedback ao usuário durante edição

**Implementações:**
1. **Sistema de Validação:**
   ```typescript
   interface ValidationRule {
     field: string;
     validate: (value: any) => ValidationResult;
     message: string;
   }
   ```

2. **Indicadores Visuais:**
   - ✅ Campos válidos: borda verde
   - ❌ Campos inválidos: borda vermelha + tooltip
   - ⚠️ Avisos: borda amarela
   - 💾 Estado de salvamento: spinner/checkmark

3. **Toast Notifications:**
   - Salvamento automático bem-sucedido
   - Erro ao salvar
   - Publicação bem-sucedida
   - Avisos de validação

**Benefícios:**
- ✅ Reduz erros do usuário
- ✅ Feedback imediato
- ✅ Mais confiança ao editar

**Tempo estimado:** 3-4 horas  
**Arquivos afetados:** ~6 arquivos novos + 5 modificações

---

### **FASE 6:** Testes Automatizados 🧪
**Objetivo:** Garantir qualidade e prevenir regressões

**Implementações:**
1. **Testes Unitários (Vitest):**
   - FunnelEditingFacade
   - FeatureFlagManager
   - PropertiesPanelRegistry
   - EditorHistory

2. **Testes de Integração:**
   - Fluxo completo de edição
   - Autosave funcionando
   - Publicação funcionando
   - Undo/Redo funcionando

3. **Testes E2E (Playwright):**
   - Criar funil do zero
   - Editar funil existente
   - Publicar funil
   - Verificar preview

**Benefícios:**
- ✅ Confiança em mudanças futuras
- ✅ CI/CD mais robusto
- ✅ Documentação viva do comportamento esperado

**Tempo estimado:** 8-10 horas  
**Arquivos afetados:** ~15 arquivos novos

---

### **FASE 7:** Deploy em Produção 🚀
**Objetivo:** Colocar editor unificado disponível para todos os usuários

**Implementações:**
1. **Rollout Gradual:**
   ```typescript
   // Produção: 10% dos usuários veem novo editor
   enableUnifiedEditorFacade: this.isUserInExperiment('unified_editor_facade_rollout_10pct')
   ```

2. **Monitoramento:**
   - Logs de erro no Sentry
   - Métricas de performance
   - Taxa de sucesso de salvamento/publicação

3. **Rollback Plan:**
   - Feature flag desabilitada via admin panel
   - Reversão imediata se houver problemas críticos

4. **Incremento Gradual:**
   - Semana 1: 10% dos usuários
   - Semana 2: 25% dos usuários
   - Semana 3: 50% dos usuários
   - Semana 4: 100% dos usuários

**Benefícios:**
- ✅ Deploy seguro
- ✅ Tempo para corrigir bugs
- ✅ Feedback real de usuários

**Tempo estimado:** 2-3 dias  
**Arquivos afetados:** ~3 modificações + configuração de infra

---

## 📋 CHECKLIST DE VALIDAÇÃO (FASE 1)

**Antes de avançar para Fase 2, validar:**

- [ ] **Badge visual aparece** no canto superior direito
- [ ] **Badge mostra "✅ FACADE ATIVO"** (não "❌ EDITOR ANTIGO")
- [ ] **Console mostra logs** com valores das flags
- [ ] **env_FORCE** e **env_FACADE** são **"true"** no console
- [ ] **Editor carrega** sem erros no console
- [ ] **Autosave funciona** (editar algo, aguardar 5s, ver log de save)
- [ ] **QuizFunnelEditorWYSIWYG renderiza** (não StableEditableStepsEditor)

**Como testar:**
```bash
# 1. Garantir que servidor está rodando
npm run dev

# 2. Abrir navegador
http://localhost:8080/editor

# 3. Abrir console (F12)
# 4. Verificar mensagem: 🎛️ [ModernUnifiedEditor] Feature Flags:
# 5. Verificar badge no canto superior direito
```

---

## ⚠️ PROBLEMAS CONHECIDOS

### Problema 1: Feature Flags não estão sendo lidas
**Sintoma:** Badge mostra "❌ EDITOR ANTIGO"  
**Causa provável:** Servidor não recarregou .env.local  
**Solução:**
```bash
# Matar processo Vite
pkill -f "vite"

# Reiniciar servidor
npm run dev

# Aguardar 5 segundos
# Recarregar navegador (Ctrl+Shift+R para clear cache)
```

### Problema 2: Variáveis de ambiente undefined
**Sintoma:** Console mostra `env_FORCE: undefined`  
**Causa provável:** .env.local não está sendo lido pelo Vite  
**Solução:**
```bash
# Verificar se .env.local existe
ls -la .env.local

# Verificar conteúdo
cat .env.local

# Deve mostrar:
# VITE_ENABLE_UNIFIED_EDITOR_FACADE=true
# VITE_FORCE_UNIFIED_EDITOR=true

# Se não existir, criar:
echo 'VITE_ENABLE_UNIFIED_EDITOR_FACADE=true' > .env.local
echo 'VITE_FORCE_UNIFIED_EDITOR=true' >> .env.local

# Reiniciar servidor
pkill -f "vite"
npm run dev
```

### Problema 3: Editor carrega mas não salva
**Sintoma:** Editar algo não dispara autosave  
**Causa provável:** Facade não está conectada ao CRUD  
**Solução:** Verificar logs no console - deve mostrar `[Facade:save/start]` após 5 segundos de edição

---

## 🎯 PRÓXIMA AÇÃO IMEDIATA

**Você está aqui:** 🧪 Validando Fase 1

**Próximo passo:**
1. ✅ Reiniciar servidor (se não estiver rodando)
2. ✅ Abrir http://localhost:8080/editor
3. ✅ Verificar badge e console
4. ✅ Reportar resultados

**Após validação bem-sucedida:**
- Commit das mudanças de debug
- Decidir se implementar Fase 2 ou fazer ajustes na Fase 1

**Se validação falhar:**
- Investigar logs do console
- Verificar .env.local
- Tentar soluções dos problemas conhecidos
- Adicionar mais logs de debug se necessário

---

## 💡 DICAS

1. **Sempre testar com console aberto** - logs são essenciais
2. **Limpar cache ao testar** - Ctrl+Shift+R no navegador
3. **Reiniciar servidor ao mudar .env.local** - variáveis só carregam no startup
4. **Usar scripts helper** - `./scripts/toggle-editor-flag.sh status`
5. **Commit frequentemente** - facilita rollback se algo quebrar

---

## 📚 REFERÊNCIAS

- **Documentação completa:** `FASE_1_IMPLEMENTACAO_CONCLUIDA.md`
- **Guia rápido:** `GUIA_RAPIDO.md`
- **Resumo executivo:** `RESUMO_EXECUTIVO.md`
- **Toggle flags:** `./scripts/toggle-editor-flag.sh`
- **Abrir editor:** `./scripts/open-editor.sh`

---

**Última atualização:** 06/10/2025  
**Próxima revisão:** Após validação da Fase 1
