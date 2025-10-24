# 🔍 Diagnóstico: Por que /editor carrega "ts-template"

**Data:** 24 de outubro de 2025  
**Problema:** `/editor?template=quiz21StepsComplete` carrega "ts-template" ao invés de usar o master JSON

---

## ✅ O que já foi feito:

1. ✅ Criado `.env.local` com `VITE_USE_MASTER_JSON=true`
2. ✅ Adicionados logs detalhados em `templateSources.ts`
3. ✅ Adicionados logs detalhados em `TemplateLoader.ts`
4. ✅ Verificado que `quiz21-complete.json` tem todos os 21 steps
5. ✅ Modificado `loadFromMasterJSON` para logar cada etapa

---

## 🔬 Diagnóstico Passo a Passo

### **Passo 1: Verificar se o servidor está rodando**

```bash
# Parar qualquer Vite existente
pkill -f vite

# Iniciar em foreground para ver os logs
npm run dev
```

**Aguarde a mensagem:**
```
VITE v7.1.11  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

### **Passo 2: Testar se o master JSON está acessível**

**Em outro terminal:**
```bash
curl -I http://localhost:5173/templates/quiz21-complete.json
```

**Resultado esperado:**
```
HTTP/1.1 200 OK
Content-Type: application/json
```

**Se retornar 404:** O arquivo não está na pasta `public/templates/` ou o servidor não está servindo corretamente.

---

### **Passo 3: Abrir o editor no navegador**

```
http://localhost:5173/editor?template=quiz21StepsComplete
```

**Abrir DevTools (F12) → Console**

---

### **Passo 4: Verificar logs no console do navegador**

**1. Logs de Template Sources:**
```
🔧 Template Sources Configuration
  Raw env VITE_USE_MASTER_JSON: "true"
  → useMasterJSON: true
```

**Se mostrar `undefined` ou `false`:** O `.env.local` NÃO está sendo lido pelo Vite.

**Solução:**
- Verifique se o arquivo está na raiz do projeto (não em subpasta)
- Reinicie o servidor **COMPLETAMENTE** (Ctrl+C e npm run dev novamente)
- Variáveis de ambiente só são carregadas no **startup** do Vite

---

**2. Logs do TemplateLoader:**
```
🔍 [TemplateLoader] step-01
  🎯 TEMPLATE_SOURCES: { useMasterJSON: true, ... }
  🔍 Verificando flag useMasterJSON: true
  ✅ Flag useMasterJSON está TRUE - tentando carregar master JSON...
```

**Se aparecer:**
```
❌ Flag useMasterJSON está FALSE - pulando master JSON
```

**Causa raiz:** A flag não está chegando ao runtime.

**Soluções:**
1. Hard refresh no navegador (Ctrl+Shift+R)
2. Limpar cache do Vite: `rm -rf node_modules/.vite`
3. Verificar se há outro `.env` ou `.env.production` sobrescrevendo

---

**3. Logs do fetch do master JSON:**
```
🔍 [loadFromMasterJSON] Fazendo fetch de /templates/quiz21-complete.json...
📊 [loadFromMasterJSON] Response status: 200, ok: true
✅ Master JSON carregado (tentativa 1)
📊 Steps no master: 21
```

**Se aparecer:**
```
📊 [loadFromMasterJSON] Response status: 404, ok: false
```

**Causa:** Arquivo não está acessível via HTTP.

**Soluções:**
1. Verificar se `public/templates/quiz21-complete.json` existe
2. Testar o curl manual (passo 2)
3. Verificar permissões do arquivo

---

**4. Logs da busca do step:**
```
🔍 [loadFromMasterJSON] Procurando step: step-01
✅ [loadFromMasterJSON] Step step-01 encontrado!
📊 [loadFromMasterJSON] Sections no step: 3
📦 Master JSON → step-01: 3 blocos
```

**Se aparecer:**
```
⚠️ Master JSON carregado, mas step não encontrado: step-01
```

**Causa:** O step não existe no JSON ou o ID está errado.

**Solução:** Verificar estrutura do JSON (executar script validador).

---

### **Passo 5: Se ainda cair em ts-template**

**Logs esperados quando falha:**
```
⚠️ loadFromMasterJSON retornou null
🔄 Caindo no fallback TypeScript template
📦 Fallback: TypeScript template → step-01
```

**Possíveis causas:**
1. Fetch retornou erro
2. JSON mal formatado (parse falhou)
3. Step não existe no JSON
4. Erro silencioso no try/catch

---

## 🛠️ Checklist de Troubleshooting

### ✅ Arquivo e Configuração:
- [ ] `.env.local` existe na raiz do projeto
- [ ] `.env.local` contém `VITE_USE_MASTER_JSON=true`
- [ ] `public/templates/quiz21-complete.json` existe
- [ ] JSON é válido (testar com `cat public/templates/quiz21-complete.json | jq .` ou validador online)

### ✅ Servidor:
- [ ] Servidor Vite está rodando na porta 5173
- [ ] Servidor foi reiniciado **APÓS** criar `.env.local`
- [ ] Não há outro servidor rodando na mesma porta
- [ ] Teste manual de fetch funciona: `curl http://localhost:5173/templates/quiz21-complete.json`

### ✅ Navegador:
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Cache limpo (DevTools → Network → Disable cache)
- [ ] Console não mostra erros de CORS ou 404
- [ ] Logs de "Template Sources Configuration" mostram `useMasterJSON: true`

### ✅ Código:
- [ ] `src/config/templateSources.ts` tem os logs de debug
- [ ] `src/services/editor/TemplateLoader.ts` tem os logs detalhados
- [ ] Código foi salvo e servidor reiniciado (HMR pode não funcionar para `.env`)

---

## 🔧 Scripts Auxiliares

### **1. Limpar tudo e reiniciar:**
```bash
# Parar servidor
pkill -f vite

# Limpar cache do Vite
rm -rf node_modules/.vite

# Limpar build anterior (se existir)
rm -rf dist

# Reiniciar
npm run dev
```

### **2. Validar master JSON:**
```bash
node scripts/validate-master-json-steps.mjs
```

Deve mostrar:
```
✅ COMPLETO: Todos os 21 steps estão presentes e com sections válidas!
```

### **3. Testar fetch programaticamente:**

**No console do navegador (F12):**
```javascript
// Testar fetch
fetch('/templates/quiz21-complete.json')
  .then(r => r.json())
  .then(data => console.log('✅ JSON:', data))
  .catch(err => console.error('❌ Erro:', err));

// Verificar flag
console.log('Flag:', import.meta.env.VITE_USE_MASTER_JSON);
```

---

## 🎯 Causa Raiz Mais Provável

**90% dos casos:** O `.env.local` não está sendo lido porque:
1. Servidor não foi reiniciado após criar o arquivo
2. Hot Module Replacement (HMR) não recarrega variáveis de ambiente
3. Arquivo está em local errado (não na raiz)

**Solução definitiva:**
```bash
# 1. Garantir que .env.local existe
cat .env.local

# 2. Parar COMPLETAMENTE o servidor (Ctrl+C no terminal)
# 3. Aguardar 2 segundos
# 4. Iniciar novamente
npm run dev

# 5. Aguardar "ready in XXX ms"
# 6. Abrir navegador em modo anônimo (Ctrl+Shift+N)
# 7. Ir para http://localhost:5173/editor?template=quiz21StepsComplete
# 8. Abrir console (F12)
# 9. Verificar logs de "Template Sources Configuration"
```

---

## 📊 Teste Final

Se **todos** os logs aparecerem corretamente:

```
✅ 🔧 Template Sources Configuration
     → useMasterJSON: true

✅ 🔍 [TemplateLoader] step-01
     ✅ Flag useMasterJSON está TRUE

✅ 🔍 [loadFromMasterJSON] Fazendo fetch...
     📊 Response status: 200, ok: true
     ✅ Master JSON carregado

✅ 🔍 [loadFromMasterJSON] Procurando step: step-01
     ✅ Step step-01 encontrado!
     📊 Sections no step: 3

✅ 📦 Master JSON → step-01: 3 blocos
```

**E AINDA assim mostrar "ts-template":**

Então o problema está no componente que **renderiza** o badge, não no loader.

**Verificar:**
```typescript
// src/pages/EditorBlocksDiagnosticPage.tsx
// A prop 'source' está chegando correta?
console.log('Source:', editor.state.stepSources);
```

---

## 🚨 Se Nada Funcionar

**Criar teste isolado:**

```typescript
// src/test-master-json.ts
import { TemplateLoader } from '@/services/editor/TemplateLoader';

const loader = new TemplateLoader();
const result = await loader.loadStep('step-01');
console.log('Result:', result);
```

Executar:
```bash
npx tsx src/test-master-json.ts
```

Se funcionar aqui mas não no navegador → problema é no build/HMR do Vite.

---

## ✅ Próximo Passo

**Execute este comando e me envie o output completo:**

```bash
# Terminal 1: Reiniciar servidor
pkill -f vite && sleep 2 && npm run dev

# (Aguarde "ready in XXX ms")

# Terminal 2: Testar fetch
curl http://localhost:5173/templates/quiz21-complete.json | head -n 50

# Abra navegador e me envie screenshot dos logs do console
```
