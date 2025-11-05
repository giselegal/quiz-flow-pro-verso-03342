# 🧪 Guia Rápido de Teste - Cache System

**Objetivo**: Validar que o cache está funcionando após as correções

---

## 🌐 Teste no Browser

### 1️⃣ Abrir o Editor

```
URL: http://localhost:8080/editor?template=quiz21StepsComplete
```

---

### 2️⃣ Abrir Console do Desenvolvedor

**Atalhos**:
- Chrome/Edge: `F12` ou `Ctrl+Shift+I`
- Firefox: `F12` ou `Ctrl+Shift+K`
- Safari: `Cmd+Option+I`

---

### 3️⃣ Limpar Cache Antigo

**No console, executar**:
```javascript
// Limpar localStorage
localStorage.clear();

// Verificar versão do cache (deve estar vazio agora)
console.log('Cache version:', localStorage.getItem('registry-cache-version'));

// Recarregar página
location.reload();
```

---

### 4️⃣ Verificar Logs de Carregamento

**Primeira Navegação (Esperado)**:
```
🌐 Carregando step-01 diretamente dos templates JSON locais
❌ MISS: step-01 - carregando do servidor...
✅ Step step-01 carregado com 5 blocos
✅ Carregado e normalizado: step-01 (5 blocos)
⏱️ [Registry] getStep(step-01): XXms
```

**Navegação para Step 2**:
```
⚡ L1 HIT: step-01 (5 blocos)  ← Cache funcionando!
❌ MISS: step-02 - carregando do servidor...
✅ Step step-02 carregado com 4 blocos
```

---

### 5️⃣ Testar Cache Hit

**Voltar para Step 1**:
```
⚡ L1 HIT: step-01 (5 blocos)  ← ✅ SUCESSO!
⏱️ [Registry] getStep(step-01): ~1ms  ← Muito rápido
```

**Indicadores de Sucesso**:
- ✅ Emoji `⚡` (raio) antes de "L1 HIT"
- ✅ Tempo < 5ms
- ✅ Sem chamadas de rede para templates

---

## 🔍 Diagnóstico de Problemas

### Se ver "❌ Erro ao carregar"

**Possíveis causas**:
```javascript
// 1. Verificar se templates existem
fetch('/templates/step-01.json')
  .then(r => r.json())
  .then(d => console.log('Template encontrado:', d))
  .catch(e => console.error('Template não encontrado:', e));

// 2. Verificar import path
// Deve estar em: src/config/templates/step-01.json
```

---

### Se ver apenas MISS (nunca HIT)

**Possíveis causas**:
1. Cache não está sendo populado
2. stepId diferente entre requests

**Debug**:
```javascript
// Verificar L1 cache manualmente
// (Requer acesso ao registry instance)
```

---

### Se ver "blocks is not iterable"

**Causa**: Template sem array de blocos

**Verificar**:
```bash
# No terminal:
cat src/config/templates/step-01.json | jq '.blocks | length'
# Deve retornar: 5 (ou outro número > 0)
```

---

## ✅ Checklist de Validação

### Cache Funcionando

- [ ] Primeira navegação mostra MISS
- [ ] Template carregado com X blocos
- [ ] Segunda navegação mostra HIT (⚡)
- [ ] Tempo de cache HIT < 5ms
- [ ] Blocos renderizam na tela
- [ ] Navegação entre steps é rápida

### Estrutura OK

- [ ] Sem erros no console
- [ ] Sem warnings de "blocks undefined"
- [ ] Sem erros 404 para templates
- [ ] Estilos aplicados corretamente

---

## 📊 Métricas Esperadas

### Performance

| Métrica | Primeira Carga | Cache Hit |
|---------|----------------|-----------|
| Tempo carregamento | ~50-200ms | < 5ms |
| Network requests | 1 por step | 0 |
| Console logs | MISS + Carregado | HIT |

### Cache Behavior

```
Step 1 (primeira vez):  ❌ MISS → ✅ Carregado
Step 2 (primeira vez):  ❌ MISS → ✅ Carregado
Step 1 (voltar):        ⚡ HIT ← Cache funcionando!
```

---

## 🎯 Resultado Esperado

**Se tudo funcionou**:
```
✅ Cache L1 (Memory) funcionando
✅ Templates carregados de src/config/templates/
✅ 102 blocos disponíveis nos 21 steps
✅ Performance otimizada (HIT < 5ms)
```

**Próximo passo**: Comitar mudanças! 🎉

---

## 🐛 Troubleshooting

### Problema: "Cannot find module @/config/templates/step-XX.json"

**Solução**:
```bash
# Verificar se sincronização foi executada
ls -la src/config/templates/step-*.json | wc -l
# Deve retornar: 21

# Se não, executar:
node scripts/sync-templates-to-config.mjs
```

---

### Problema: Cache sempre MISS

**Possível causa**: L1 cache não persiste

**Verificar**:
```javascript
// Console:
console.log('Registry instance:', window.templateRegistry);
// Deve existir e ter l1Cache
```

---

### Problema: Blocos não renderizam

**Não relacionado ao cache**, verificar:
1. UnifiedBlockRegistry tem componentes registrados
2. Tipos de blocos são válidos
3. Console mostra erros de renderização

---

## 📞 Suporte

**Se problemas persistirem**:

1. Executar diagnóstico:
   ```bash
   node scripts/diagnose-cache.mjs
   ```

2. Executar testes:
   ```bash
   node scripts/test-cache-validation.mjs
   ```

3. Verificar logs completos:
   ```javascript
   // Console, ativar modo debug:
   localStorage.setItem('debug', 'cache');
   location.reload();
   ```

---

**Última atualização**: 2025-11-05 19:35  
**Autor**: GitHub Copilot
