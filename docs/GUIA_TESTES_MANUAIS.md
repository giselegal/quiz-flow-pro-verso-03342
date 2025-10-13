# 🧪 GUIA DE TESTES MANUAIS - Sistema JSON v3.0

**Data:** 13 de outubro de 2025  
**Fase:** FASE 4 - Validação e Testes  
**Objetivo:** Validar funcionamento completo do sistema de templates

---

## 📋 Pré-requisitos

1. ✅ Servidor de desenvolvimento rodando
2. ✅ localStorage vazio (limpar antes dos testes)
3. ✅ Console do navegador aberto (F12)
4. ✅ React DevTools instalado (opcional)

### Comandos de Preparação

```bash
# 1. Limpar localStorage via console
localStorage.clear();
console.log('✅ localStorage limpo');

# 2. Verificar se servidor está rodando
curl http://localhost:8080/health || npm run dev

# 3. Abrir aplicação
# Navegue para: http://localhost:8080
```

---

## 🧪 TESTE 1: Carregamento Inicial do Master Template

### Objetivo
Verificar se o master JSON (101.87 KB) carrega corretamente

### Passos

1. **Abrir console do navegador** (F12 → Console)

2. **Executar comando**
   ```javascript
   // Importar service
   const { default: HybridTemplateService } = await import('/src/services/HybridTemplateService.ts');
   
   // Carregar master
   const master = await HybridTemplateService.getMasterTemplate();
   console.log('Master:', master);
   ```

3. **Verificar logs esperados**
   ```
   🔄 Carregando master template...
   ✅ Master template válido (21 steps)
   📦 Master template carregado do JSON
   ```

### Critérios de Sucesso

- [ ] Master template carrega sem erros
- [ ] Log mostra "21 steps"
- [ ] `master.steps` contém objetos
- [ ] Tempo de carregamento < 500ms

### Possíveis Problemas

**Erro:** "Failed to fetch"
- **Solução:** Verificar se arquivo `/public/templates/quiz21-complete.json` existe
- **Comando:** `ls -lh public/templates/quiz21-complete.json`

**Erro:** "Validação falhou"
- **Solução:** Verificar estrutura do JSON
- **Comando:** `node scripts/consolidate-json-v3.mjs`

---

## 🧪 TESTE 2: Carregamento de Step Individual

### Objetivo
Verificar fallback hierarchy (Master → Individual → TypeScript)

### Passos

1. **Carregar step-01**
   ```javascript
   const step01 = await HybridTemplateService.getTemplate('step-01');
   console.log('Step 01:', step01);
   ```

2. **Carregar step-20**
   ```javascript
   const step20 = await HybridTemplateService.getTemplate('step-20');
   console.log('Step 20:', step20);
   ```

3. **Tentar step inválido**
   ```javascript
   const invalid = await HybridTemplateService.getTemplate('step-99');
   console.log('Step inválido:', invalid);
   ```

### Critérios de Sucesso

- [ ] Step-01 carrega com sucesso
- [ ] Step-20 (resultado personalizado) carrega
- [ ] Step inválido retorna `null` ou fallback
- [ ] Cada carregamento < 100ms

---

## 🧪 TESTE 3: Salvamento de Alterações

### Objetivo
Testar fluxo completo de edição e salvamento

### Passos

1. **Importar TemplateEditorService**
   ```javascript
   const { default: TemplateEditorService } = await import('/src/services/TemplateEditorService.ts');
   ```

2. **Modificar step-01**
   ```javascript
   const modified = {
     metadata: {
       id: 'step-01',
       name: 'Step 01 - TESTE MANUAL',
       description: 'Modificado via console'
     },
     theme: {
       primaryColor: '#FF5722',
       testFlag: true
     },
     sections: [
       {
         type: 'hero',
         blocks: [
           {
             type: 'heading',
             content: 'TESTE MANUAL'
           }
         ]
       }
     ]
   };
   
   const result = await TemplateEditorService.saveStepChanges('step-01', modified);
   console.log('Resultado:', result);
   ```

3. **Verificar localStorage**
   ```javascript
   const saved = localStorage.getItem('quiz-master-template-v3');
   console.log('Tamanho salvo:', (saved.length / 1024).toFixed(2), 'KB');
   
   const parsed = JSON.parse(saved);
   console.log('Step-01 salvo:', parsed.steps['step-01'].metadata.name);
   ```

### Critérios de Sucesso

- [ ] `result.success === true`
- [ ] localStorage contém dados
- [ ] Nome do step foi alterado
- [ ] Log mostra "💾 Storage: X KB / Y KB"
- [ ] Tempo de salvamento < 1s

### Logs Esperados

```
💾 Salvando alterações do step-01...
✅ Master template salvo no localStorage
✅ Step step-01 salvo com sucesso
💾 Storage: 102.45 KB / 5120 KB (2.0%)
```

---

## 🧪 TESTE 4: Reload e Persistência

### Objetivo
Verificar se alterações persistem após reload

### Passos

1. **Limpar cache**
   ```javascript
   HybridTemplateService.clearCache();
   console.log('✅ Cache limpo');
   ```

2. **Recarregar template**
   ```javascript
   await HybridTemplateService.reload();
   const reloaded = await HybridTemplateService.getTemplate('step-01');
   console.log('Recarregado:', reloaded.metadata.name);
   ```

3. **Recarregar página (F5)**
   - Abrir console
   - Verificar se dados persistiram

4. **Recarregar após F5**
   ```javascript
   const { default: HybridTemplateService } = await import('/src/services/HybridTemplateService.ts');
   const after = await HybridTemplateService.getTemplate('step-01');
   console.log('Após F5:', after.metadata.name);
   ```

### Critérios de Sucesso

- [ ] Nome modificado persiste após `clearCache()`
- [ ] Nome modificado persiste após `reload()`
- [ ] Nome modificado persiste após F5
- [ ] localStorage mantém dados

---

## 🧪 TESTE 5: Export e Import

### Objetivo
Testar download e upload de templates

### Passos Export

1. **Exportar master template**
   ```javascript
   const json = await TemplateEditorService.exportMasterTemplate();
   console.log('Tamanho:', (json.length / 1024).toFixed(2), 'KB');
   
   // Download manual
   const blob = new Blob([json], { type: 'application/json' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = `quiz21-export-${Date.now()}.json`;
   a.click();
   ```

2. **Verificar arquivo baixado**
   - Abrir em editor de texto
   - Verificar estrutura JSON válida
   - Confirmar 21 steps presentes

### Passos Import

1. **Modificar JSON exportado**
   - Editar no editor de texto
   - Alterar `step-01.metadata.name` para "TESTE IMPORT"
   - Salvar arquivo

2. **Importar modificado**
   ```javascript
   // Ler arquivo (ou colar conteúdo)
   const modifiedJson = `...cole o JSON aqui...`;
   
   const result = await TemplateEditorService.importMasterTemplate(modifiedJson);
   console.log('Import:', result);
   ```

3. **Verificar persistência**
   ```javascript
   HybridTemplateService.clearCache();
   const imported = await HybridTemplateService.getTemplate('step-01');
   console.log('Nome após import:', imported.metadata.name);
   ```

### Critérios de Sucesso

- [ ] Export gera arquivo válido
- [ ] Tamanho exportado ≈ 101.87 KB
- [ ] Import aceita JSON válido
- [ ] Import rejeita JSON inválido
- [ ] Modificações persistem após import

---

## 🧪 TESTE 6: Validação de Estrutura

### Objetivo
Validar todos os 21 steps

### Passos

1. **Executar validação completa**
   ```javascript
   const validation = await TemplateEditorService.validateAllSteps();
   console.log('Válidos:', validation.valid);
   console.log('Inválidos:', validation.invalid);
   console.log('Erros:', validation.errors);
   ```

2. **Analisar erros (se houver)**
   ```javascript
   if (validation.errors.length > 0) {
     validation.errors.forEach(err => {
       console.warn(`❌ ${err.stepId}:`, err.errors);
     });
   }
   ```

### Critérios de Sucesso

- [ ] `validation.valid >= 18` (mínimo 85%)
- [ ] `validation.invalid <= 3`
- [ ] Erros são descritivos
- [ ] Validação completa < 1s

---

## 🧪 TESTE 7: Monitoramento de Storage

### Objetivo
Verificar uso do localStorage e alertas

### Passos

1. **Verificar uso atual**
   ```javascript
   const usage = TemplateEditorService.getStorageUsage();
   console.log(`
   📊 STORAGE USAGE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Used:      ${(usage.used / 1024).toFixed(2)} KB
   Limit:     ${(usage.limit / 1024).toFixed(0)} KB
   Percentage: ${usage.percentage.toFixed(1)}%
   Migrate?:  ${usage.shouldMigrate ? '⚠️ YES' : '✅ NO'}
   `);
   ```

2. **Simular uso alto**
   ```javascript
   // Adicionar dados grandes
   const largeData = 'x'.repeat(2 * 1024 * 1024); // 2 MB
   localStorage.setItem('quiz21-test-large', largeData);
   
   const newUsage = TemplateEditorService.getStorageUsage();
   console.log('Após adicionar 2MB:', newUsage.percentage.toFixed(1) + '%');
   console.log('Alerta migração:', newUsage.shouldMigrate);
   ```

3. **Limpar dados de teste**
   ```javascript
   localStorage.removeItem('quiz21-test-large');
   console.log('✅ Dados de teste removidos');
   ```

### Critérios de Sucesso

- [ ] Uso inicial < 5% (< 256 KB)
- [ ] Cálculo preciso de bytes
- [ ] Alerta aos 60% funciona
- [ ] Apenas conta chaves `quiz21-*` e `quiz-master-*`

---

## 🧪 TESTE 8: Performance

### Objetivo
Validar métricas de performance

### Passos

1. **Medir carregamento do master**
   ```javascript
   console.time('Master Load');
   const master = await HybridTemplateService.getMasterTemplate();
   console.timeEnd('Master Load');
   // Esperado: < 500ms
   ```

2. **Medir carregamento de step**
   ```javascript
   console.time('Step Load');
   const step = await HybridTemplateService.getTemplate('step-01');
   console.timeEnd('Step Load');
   // Esperado: < 100ms
   ```

3. **Medir salvamento**
   ```javascript
   console.time('Save');
   await TemplateEditorService.saveStepChanges('step-01', {
     metadata: { id: 'step-01', name: 'Test' },
     sections: []
   });
   console.timeEnd('Save');
   // Esperado: < 1000ms
   ```

4. **Medir validação**
   ```javascript
   console.time('Validation');
   await TemplateEditorService.validateAllSteps();
   console.timeEnd('Validation');
   // Esperado: < 1000ms
   ```

### Critérios de Sucesso

- [ ] Master load < 500ms
- [ ] Step load < 100ms
- [ ] Save < 1000ms
- [ ] Validation < 1000ms

---

## 🧪 TESTE 9: Editor Visual (UI)

### Objetivo
Testar integração com interface visual

### Passos

1. **Navegar para o editor**
   ```
   http://localhost:8080/editor
   ```

2. **Selecionar step-01**
   - Clicar no step na lista

3. **Editar propriedades**
   - Alterar título
   - Alterar cor primária
   - Modificar descrição

4. **Salvar alterações**
   - Clicar em "Salvar"
   - Verificar toast de sucesso
   - Verificar loading state

5. **Verificar console**
   ```javascript
   // Verificar localStorage
   const saved = localStorage.getItem('quiz-master-template-v3');
   const data = JSON.parse(saved);
   console.log('Step-01 UI:', data.steps['step-01'].metadata.name);
   ```

### Critérios de Sucesso

- [ ] UI carrega sem erros
- [ ] Edições refletem em tempo real
- [ ] Botão "Salvar" funciona
- [ ] Toast de sucesso aparece
- [ ] Dados persistem no localStorage

---

## 🧪 TESTE 10: Fallback TypeScript

### Objetivo
Verificar que sistema nunca quebra completamente

### Passos

1. **Simular falha do master JSON**
   ```javascript
   // Renomear arquivo temporariamente (simular)
   // ou mockar fetch
   
   const originalFetch = window.fetch;
   window.fetch = () => Promise.reject(new Error('Network error'));
   
   HybridTemplateService.clearCache();
   const step = await HybridTemplateService.getTemplate('step-01');
   
   console.log('Com erro fetch:', step ? 'SUCESSO' : 'FALHOU');
   
   // Restaurar
   window.fetch = originalFetch;
   ```

2. **Verificar fallback**
   - Sistema deve retornar template TypeScript
   - Logs devem indicar fallback

### Critérios de Sucesso

- [ ] Sistema não quebra
- [ ] Retorna template válido
- [ ] Logs indicam fallback

---

## 📊 Checklist Final de Validação

### Funcionalidade

- [ ] ✅ Master JSON carrega (TESTE 1)
- [ ] ✅ Steps individuais carregam (TESTE 2)
- [ ] ✅ Salvamento persiste dados (TESTE 3)
- [ ] ✅ Reload mantém alterações (TESTE 4)
- [ ] ✅ Export/Import funcionam (TESTE 5)
- [ ] ✅ Validação identifica erros (TESTE 6)
- [ ] ✅ Monitoramento de storage (TESTE 7)
- [ ] ✅ Performance dentro do esperado (TESTE 8)
- [ ] ✅ UI integrada funciona (TESTE 9)
- [ ] ✅ Fallback previne quebras (TESTE 10)

### Performance

- [ ] Master load < 500ms
- [ ] Step load < 100ms
- [ ] Save < 1000ms
- [ ] Validation < 1000ms
- [ ] Storage usage < 5%

### Qualidade

- [ ] Zero erros no console
- [ ] Zero warnings críticos
- [ ] Logs são informativos
- [ ] Error handling robusto

---

## 🐛 Troubleshooting

### Problema: "Master template não disponível"

**Causa:** Arquivo JSON não encontrado

**Solução:**
```bash
# Verificar arquivo
ls -lh public/templates/quiz21-complete.json

# Regenerar se necessário
node scripts/consolidate-json-v3.mjs
```

### Problema: localStorage cheio

**Causa:** Dados excederam 5 MB

**Solução:**
```javascript
// Limpar storage
TemplateEditorService.clearStorage();

// Ou limpar tudo
localStorage.clear();
```

### Problema: Import falha

**Causa:** JSON inválido ou malformado

**Solução:**
```bash
# Validar JSON
cat arquivo.json | jq . > /dev/null && echo "✅ Válido" || echo "❌ Inválido"

# Ou usar validador online
https://jsonlint.com
```

---

## ✅ Conclusão dos Testes

**Data do Teste:** _______________  
**Testado por:** _______________  
**Resultado Geral:** ⬜ Aprovado  ⬜ Reprovado  

**Observações:**
```
(Anotar problemas encontrados, sugestões de melhoria, etc.)
```

---

**Próximo Passo:** Após completar todos os testes, marcar FASE 4 como concluída e gerar relatório final.

**Desenvolvido por:** GitHub Copilot  
**Projeto:** Quiz Flow Pro v3.0  
**Data:** 13 de outubro de 2025
