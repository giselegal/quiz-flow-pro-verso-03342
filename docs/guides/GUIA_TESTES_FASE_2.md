# 🧪 GUIA DE TESTES - FASE 2

## 🎯 Objetivo

Validar que todas as implementações da FASE 2 estão funcionando corretamente antes de avançar para FASE 3.

---

## 🚀 Servidor Iniciado

✅ **Servidor de Desenvolvimento Rodando:**
- Local: http://localhost:5173/
- Network: http://10.0.10.103:5173/

---

## ✅ CHECKLIST DE TESTES

### 1️⃣ **Teste: Feature Flags e Template Loading**

**O que testar:**
- [ ] Feature flag `useJsonTemplates` está ativa
- [ ] Templates JSON estão sendo carregados
- [ ] Prefetch está funcionando
- [ ] Cache está armazenando templates

**Como testar:**
1. Abrir console do navegador (F12)
2. Navegar para uma página do quiz
3. Verificar logs:
   ```
   ⚡ Cache hit: step-X
   📥 Carregando template JSON: step-X
   ✅ Template JSON carregado: step-X
   🚀 Prefetching steps: X, Y
   ```

**Resultado esperado:**
- ✅ Logs indicam carregamento de JSON
- ✅ Cache hit após primeiro carregamento
- ✅ Prefetch de próximas etapas

---

### 2️⃣ **Teste: Loading State**

**O que testar:**
- [ ] Spinner aparece durante carregamento
- [ ] Mensagem "Carregando template..." exibida
- [ ] Indicador "✨ Usando Templates JSON" visível

**Como testar:**
1. Recarregar página do quiz
2. Observar tela de loading (pode ser rápido!)
3. Verificar se spinner animado aparece

**Resultado esperado:**
- ✅ Spinner animado visível
- ✅ Mensagem clara para usuário
- ✅ Indicador JSON presente

---

### 3️⃣ **Teste: Error Handling**

**O que testar:**
- [ ] Erro é capturado corretamente
- [ ] UI de erro é exibida
- [ ] Botão "Tentar Novamente" funciona

**Como testar:**
1. Simular erro (desconectar internet ou bloquear requisição)
2. Verificar tela de erro
3. Clicar em "Tentar Novamente"

**Resultado esperado:**
- ✅ Ícone ⚠️ e mensagem de erro clara
- ✅ Botão reload funciona
- ✅ Fallback para QUIZ_STEPS (se JSON falhar)

---

### 4️⃣ **Teste: JsonTemplateService**

**O que testar:**
- [ ] Cache está funcionando
- [ ] Métricas estão sendo coletadas
- [ ] Fallback funciona

**Como testar (via console do navegador):**
```javascript
// Importar serviço
import { jsonTemplateService } from '/src/services/JsonTemplateService.ts';

// Testar carregamento
await jsonTemplateService.getTemplate(1);

// Ver métricas
jsonTemplateService.logStats();

// Ver cache
jsonTemplateService.getStats();
```

**Resultado esperado:**
- ✅ Template carregado com sucesso
- ✅ Cache hit rate > 0%
- ✅ Load time < 50ms

---

### 5️⃣ **Teste: BlockRenderer**

**O que testar:**
- [ ] Blocos registrados renderizam corretamente
- [ ] Blocos não registrados usam fallback
- [ ] Error boundary funciona

**Como testar:**
1. Navegar pelo quiz (todas as 21 etapas)
2. Verificar renderização de cada bloco
3. Buscar por mensagens "⚠️ Componente não encontrado"

**Resultado esperado:**
- ✅ Blocos principais renderizados (text, button, options-grid, etc)
- ✅ Fallbacks visuais para blocos sem componente
- ✅ Sem crashes ou tela branca

---

### 6️⃣ **Teste: Navigation e Fluxo**

**O que testar:**
- [ ] Navegação entre steps funciona
- [ ] Estado persiste entre mudanças
- [ ] Progresso é mantido

**Como testar:**
1. Iniciar quiz no step 1
2. Responder perguntas
3. Navegar até step 21
4. Voltar para steps anteriores

**Resultado esperado:**
- ✅ Transições suaves
- ✅ Respostas salvas
- ✅ Sem recarregamentos desnecessários

---

## 🐛 TROUBLESHOOTING

### Problema: "Template não carregando"

**Possíveis causas:**
1. Feature flag desativada
2. Arquivo JSON não encontrado
3. Erro no QuizStepAdapter

**Solução:**
```typescript
// Verificar feature flag
const { useJsonTemplates } = useFeatureFlags();
console.log('useJsonTemplates:', useJsonTemplates);

// Verificar se arquivo existe
// templates/quiz-estilo-step-X.json
```

---

### Problema: "Erro de compilação TypeScript"

**Solução:**
```bash
# Verificar erros
npm run type-check

# Limpar cache
rm -rf node_modules/.vite
npm run dev
```

---

### Problema: "Blocos não renderizam"

**Solução:**
1. Verificar se bloco está no BlockComponentRegistry
2. Verificar console por erros
3. Usar fallback temporariamente

---

## 📊 MÉTRICAS ESPERADAS

Após testes completos:

```
📊 JsonTemplateService Stats:
{
  "cache": {
    "size": 5-10,
    "hitRate": "60-90%",
    "ttl": 300000
  },
  "performance": {
    "averageLoadTime": "20-50ms",
    "totalLoads": 10+
  },
  "reliability": {
    "successRate": "95-100%",
    "errors": 0-1
  }
}
```

---

## ✅ CRITÉRIOS DE APROVAÇÃO

Para considerar FASE 2 validada:

- ✅ **Todos os 6 testes** passam sem erros críticos
- ✅ **21 steps** navegáveis sem crashes
- ✅ **Cache hit rate** > 50%
- ✅ **Load time** < 100ms (média)
- ✅ **Zero erros** no console (exceto warnings esperados)

---

## 🚀 APÓS VALIDAÇÃO

Se todos os testes passarem:

### **Opção A: FASE 3 - Componentes Específicos** (8-12h)
Implementar 15 componentes para blocos JSON:
- `image-display-inline`
- `decorative-bar-inline`
- `lead-form`
- `result-card`
- `result-display`
- `offer-*` blocks (7 tipos)

### **Opção B: Testes E2E** (4-6h)
Criar testes automatizados:
- Vitest + Testing Library
- Cypress/Playwright E2E
- Coverage > 80%

### **Opção C: Otimização** (3-4h)
Melhorar performance:
- Lazy loading de componentes
- Service Worker cache
- Bundle size optimization

---

## 📞 SUPORTE

Se encontrar problemas:

1. **Verificar logs:** Console do navegador + Terminal
2. **Verificar commits:** `git log --oneline -10`
3. **Verificar documentação:** `FASE_2_IMPLEMENTACAO_CONCLUIDA.md`
4. **Revisar análise:** `ANALISE_BLOCKRENDERER_JSON_TEMPLATES.md`

---

## 🎯 COMANDOS ÚTEIS

```bash
# Iniciar dev server
npm run dev

# Verificar erros TypeScript
npm run type-check

# Build para produção
npm run build

# Preview build
npm run preview

# Rodar testes
npm test

# Ver logs git
git log --graph --oneline -10

# Ver status
git status

# Ver diff
git diff
```

---

**Data:** $(date)  
**Status:** 🧪 Em Teste  
**Próximo:** Validação → FASE 3
