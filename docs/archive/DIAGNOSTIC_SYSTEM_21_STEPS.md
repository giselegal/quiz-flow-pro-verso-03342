# 🔍 Sistema de Diagnósticos - Editor de 21 Etapas

## Visão Geral

Este documento descreve o sistema de diagnósticos implementado para investigar e resolver os 10 gargalos principais identificados no funil de 21 etapas do `/editor`.

## ⚡ Uso Rápido

### No Navegador (Desenvolvimento)

1. **Acesse o editor**: Navegue para `/editor`
2. **Abra DevTools**: Pressione F12
3. **Execute diagnósticos**:
   - `Ctrl+Shift+D`: Executa diagnóstico completo
   - `Ctrl+Shift+R`: Limpa dados de diagnóstico
4. **Console JavaScript**:
   ```javascript
   // Executa diagnóstico completo
   await window.runEditorDiagnostics()
   
   // Acessa estado atual do editor
   console.log(window.__EDITOR_CONTEXT__)
   
   // Vê último resultado de diagnóstico
   console.log(window.__EDITOR_DIAGNOSTICS__)
   ```

### Diagnósticos Individuais

```javascript
// 1. Diagnóstico do contexto do editor
window.diagnoseEditorContext()

// 2. Validação da etapa atual
window.diagnoseCurrentStep()

// 3. Carregamento de blocos
window.diagnoseBlockLoading()

// 4. Lógica de cálculo de etapas
window.diagnoseStepCalculation()

// 5. Sistema de eventos globais
window.diagnoseGlobalEvents()

// 6. Teste de navegação rápida
await window.testRapidNavigation()
```

## 🎯 Pontos de Investigação

### 1. Context Loading (Carregamento do Contexto)
**Problema**: Editor não carrega se EditorProvider ausente
**Diagnóstico**: Verifica disponibilidade do contexto e estado válido
**Globals**: `window.__EDITOR_CONTEXT_ERROR__`

### 2. Current Step Identification (Identificação da Etapa Atual)
**Problema**: currentStep fora do intervalo 1-21
**Diagnóstico**: Valida range e handlers de setCurrentStep
**Globals**: `window.__EDITOR_INVALID_STEPS__`

### 3. Block Loading (Carregamento de Blocos)
**Problema**: getBlocksForStep retorna vazio ou falha
**Diagnóstico**: Testa todas as 21 etapas e validação de stepBlocks
**Globals**: `window.__EDITOR_FAILED_BLOCK_LOOKUPS__`

### 4. Step Calculation Logic (Lógica de Cálculo de Etapas)
**Problema**: stepHasBlocks inconsistente com realidade
**Diagnóstico**: Compara stepValidation com blocos reais
**Globals**: `window.__EDITOR_STEP_ANALYSIS__`

### 5. Global State Validation (Validação do Estado Global)
**Problema**: useEditor hook não disponível
**Diagnóstico**: Verifica contexto e restauração de estado
**Globals**: `window.__EDITOR_CONTEXT__`

### 6. Events System (Sistema de Eventos)
**Problema**: Eventos não atualizando estado
**Diagnóstico**: Testa navigate-to-step e quiz-navigate-to-step
**Globals**: `window.__EDITOR_INVALID_NAVIGATION__`

### 7. Final Steps Processing (Processamento Etapas Finais)
**Status**: 🚧 A implementar
**Escopo**: Etapas 19-21, cálculo de pontuação e agregação

### 8. Results Rendering (Renderização de Resultados)
**Status**: 🚧 A implementar
**Escopo**: Componentes finais e fluxo de dados

### 9. Rapid Navigation Testing (Teste de Navegação Rápida)
**Problema**: Race conditions na navegação
**Diagnóstico**: Simula navegação entre múltiplas etapas rapidamente
**Detecção**: Inconsistências de estado

### 10. Comprehensive Error Logging (Log de Erros Abrangente)
**Implementado**: Logs detalhados e globals para debugging
**Uso**: Monitore console e globals window.__EDITOR_*__

## 📊 Resultados de Diagnóstico

### Estrutura de Resultado
```typescript
interface DiagnosticResult {
  success: boolean;
  message: string;
  data?: any;
  timestamp: number;
}
```

### Interpretação
- ✅ **success: true** - Sistema funcionando corretamente
- ❌ **success: false** - Problema detectado, verificar message/data
- ⚠️ **Parcial** - Alguns testes passaram, outros falharam

## 🔧 Implementação Técnica

### Arquivos Modificados
1. **`src/utils/editorDiagnostics.ts`** - Sistema principal de diagnósticos
2. **`src/components/editor/EditorProvider.tsx`** - Exposição global do contexto
3. **`src/components/editor/EditorPro.tsx`** - Atalhos de teclado e logs
4. **`src/config/quizStepsComplete.ts`** - Logs em getBlocksForStep

### Melhorias Aplicadas
- ✅ Validação de range currentStep (1-21) com auto-correção
- ✅ Logs detalhados em getBlocksForStep
- ✅ Exposição global do contexto para debugging
- ✅ Detecção de race conditions em navegação
- ✅ Sistema de eventos monitorado
- ✅ Atalhos de teclado para diagnósticos rápidos

## 🚀 Como Executar Testes

### Teste Automatizado
```bash
# Execute o script de teste
node test-diagnostics.mjs
```

### Teste Manual no Navegador
1. Inicie o servidor: `npm run dev`
2. Navegue para `/editor`
3. Use Ctrl+Shift+D para diagnóstico
4. Monitore console para resultados

### Cenários de Teste
- [ ] **Navegação básica**: Etapa 1 → 2 → 3
- [ ] **Navegação extrema**: Etapa 1 → 21 → 1
- [ ] **Navegação rápida**: Múltiplas etapas em sequência
- [ ] **Adição de blocos**: Testar em diferentes etapas
- [ ] **Recarregamento**: Estado persistido corretamente
- [ ] **Estados inválidos**: currentStep < 1 ou > 21

## 🐛 Resolução de Problemas

### "Contexto não encontrado"
- Verifique se está em `/editor`
- Confirme que EditorProvider está montado
- Reinicie a página

### "Diagnóstico falha"
- Abra DevTools e verifique erros no console
- Use Ctrl+Shift+R para limpar estado
- Tente diagnósticos individuais

### "Etapas vazias"
- Verifique se template foi carregado
- Force reload do template
- Inspecione `window.__EDITOR_CONTEXT__.stepBlocks`

## 📈 Métricas de Sucesso

### Indicadores de Saúde
- ✅ **100%** das etapas com diagnóstico positivo
- ✅ **0** discrepâncias em stepHasBlocks
- ✅ **0** falhas na navegação rápida
- ✅ **Contexto sempre disponível**

### Alertas de Problema
- ❌ Etapas com blocos zerados inesperadamente
- ❌ currentStep fora do range 1-21
- ❌ Eventos não atualizando estado
- ❌ Race conditions detectadas

## 🔮 Próximos Passos

### Melhorias Planejadas
- [ ] Diagnósticos para etapas finais 19-21
- [ ] Testes de renderização de resultados
- [ ] Métricas de performance
- [ ] Integração com testes automatizados
- [ ] Dashboard visual de diagnósticos

### Monitoramento Contínuo
- [ ] Logs agregados para análise
- [ ] Alertas automáticos para problemas
- [ ] Métricas de uso em produção
- [ ] Feedback de usuários sobre problemas

---

**📝 Nota**: Este sistema foi implementado para resolver os gargalos específicos identificados no problema original. Use os diagnósticos regularmente durante desenvolvimento para detectar e resolver problemas rapidamente.