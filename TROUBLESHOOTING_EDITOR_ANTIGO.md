# 🔧 TROUBLESHOOTING - EDITOR MOSTRANDO "EDITOR ANTIGO"

**Data:** 06/10/2025  
**Problema:** Badge mostra "❌ EDITOR ANTIGO" em vez de "✅ FACADE ATIVO"

---

## 🎯 DIAGNÓSTICO RÁPIDO

### 1. Abrir Editor e Console

```bash
# URL para testar
http://localhost:8080/editor
# ou com funil
http://localhost:8080/editor/funnel-1753409877331
```

1. Abra a URL acima
2. Pressione **F12** para abrir o console
3. Procure por: `🎛️ [ModernUnifiedEditor] Feature Flags:`
4. Verifique os valores:

```javascript
{
    forceUnified: false,    // ❌ Deveria ser true
    enableFacade: false,    // ❌ Deveria ser true
    shouldUseFacade: false, // ❌ Deveria ser true
    env_FORCE: undefined,   // ❌ Deveria ser "true"
    env_FACADE: undefined,  // ❌ Deveria ser "true"
    mode: "development"     // ✅ OK
}
```

### 2. Identificar o Problema

| Valor no Console | Diagnóstico | Solução |
|-----------------|-------------|---------|
| `env_FORCE: undefined` | .env.local não está sendo lido | **Reiniciar servidor** |
| `env_FORCE: "false"` | Variável configurada como false | **Editar .env.local** |
| `forceUnified: false` mas `env_FORCE: "true"` | FeatureFlagManager não está lendo | **Verificar código** |

---

## ✅ SOLUÇÃO 1: REINICIAR SERVIDOR (MAIS COMUM)

O Vite **só lê .env.local no startup**. Se você criou/editou o arquivo, precisa reiniciar:

```bash
# Matar processo Vite
pkill -f "vite"

# Reiniciar servidor
npm run dev

# Aguardar mensagem:
# VITE v5.4.20  ready in 190 ms
# ➜  Local:   http://localhost:8080/
```

Depois:
1. Recarregue o navegador: **Ctrl + Shift + R** (clear cache)
2. Verifique o console novamente
3. Agora `env_FORCE` e `env_FACADE` devem mostrar `"true"`

---

## ✅ SOLUÇÃO 2: VERIFICAR .env.local

```bash
# Verificar se arquivo existe
ls -la .env.local

# Ver conteúdo
cat .env.local

# Deve mostrar:
# VITE_ENABLE_UNIFIED_EDITOR_FACADE=true
# VITE_FORCE_UNIFIED_EDITOR=true
```

Se o arquivo não existir ou estiver incorreto:

```bash
# Criar/sobrescrever .env.local
cat > .env.local << 'EOF'
# 🚀 FEATURE FLAGS - EDITOR UNIFICADO
VITE_ENABLE_UNIFIED_EDITOR_FACADE=true
VITE_FORCE_UNIFIED_EDITOR=true
EOF

# Reiniciar servidor
pkill -f "vite"
npm run dev
```

---

## ✅ SOLUÇÃO 3: LIMPAR CACHE DO NAVEGADOR

Às vezes o navegador cache JS antigo:

1. **Chrome/Edge:**
   - Pressione **Ctrl + Shift + Delete**
   - Selecione "Cached images and files"
   - Clique em "Clear data"
   - OU simplesmente: **Ctrl + Shift + R** na página

2. **Firefox:**
   - Pressione **Ctrl + Shift + Delete**
   - Selecione "Cache"
   - Clique em "Clear Now"

3. **Safari:**
   - Pressione **Cmd + Option + E**
   - Recarregue a página

Depois recarregue: http://localhost:8080/editor

---

## ✅ SOLUÇÃO 4: FORÇAR FLAG VIA LOCALSTORAGE (TEMPORÁRIO)

Se nada funcionar, você pode forçar via console do navegador:

```javascript
// Abrir console (F12) e executar:
localStorage.setItem('flag_forceUnifiedInEditor', 'true');
localStorage.setItem('flag_enableUnifiedEditorFacade', 'true');

// Recarregar página
location.reload();
```

Isso é **temporário** e será perdido se limpar o localStorage, mas permite testar imediatamente.

---

## 🔍 DIAGNÓSTICO AVANÇADO

### Verificar se FeatureFlagManager está funcionando

No console do navegador (F12):

```javascript
// Importar (se possível)
import { FeatureFlagManager } from '@/utils/FeatureFlagManager';

// Ou acessar globalmente (se exposto)
const manager = FeatureFlagManager.getInstance();

// Verificar flags
console.log('forceUnified:', manager.shouldForceUnifiedInEditor());
console.log('enableFacade:', manager.shouldEnableUnifiedEditorFacade());

// Verificar todas as flags
console.log('All flags:', manager.getAll());
```

### Verificar import.meta.env

No console:

```javascript
// Ver todas as variáveis disponíveis
console.log('Vite env:', import.meta.env);

// Verificar específicas
console.log('FORCE:', import.meta.env.VITE_FORCE_UNIFIED_EDITOR);
console.log('FACADE:', import.meta.env.VITE_ENABLE_UNIFIED_EDITOR_FACADE);
console.log('MODE:', import.meta.env.MODE);
```

Se mostrar `undefined`, significa que:
1. Variáveis não foram definidas em `.env.local`, OU
2. Servidor não foi reiniciado após criar `.env.local`, OU
3. Nome da variável está incorreto (deve começar com `VITE_`)

---

## 📋 CHECKLIST DE VALIDAÇÃO

Use este checklist para garantir que tudo está correto:

- [ ] ✅ Arquivo `.env.local` existe na raiz do projeto
- [ ] ✅ Arquivo contém `VITE_FORCE_UNIFIED_EDITOR=true`
- [ ] ✅ Arquivo contém `VITE_ENABLE_UNIFIED_EDITOR_FACADE=true`
- [ ] ✅ Servidor Vite foi **reiniciado** após criar/editar `.env.local`
- [ ] ✅ Navegador foi recarregado com **Ctrl + Shift + R**
- [ ] ✅ Console mostra `env_FORCE: "true"` (não `undefined`)
- [ ] ✅ Console mostra `env_FACADE: "true"` (não `undefined`)
- [ ] ✅ Console mostra `forceUnified: true`
- [ ] ✅ Console mostra `shouldUseFacade: true`
- [ ] ✅ Badge no canto superior direito mostra "✅ FACADE ATIVO" (verde)

---

## 🐛 PROBLEMAS CONHECIDOS

### Problema: "Mode: production mas flags undefined"

Se `mode: "production"`, o Vite pode não carregar `.env.local`. 

**Solução:** Use `.env.production.local` ou force development mode:

```bash
NODE_ENV=development npm run dev
```

### Problema: "Git ignora .env.local"

Isso é **correto** e **intencional**. `.env.local` não deve ser commitado no git (contém configurações locais).

Para outros desenvolvedores, crie um `.env.example` com:

```bash
# VITE_ENABLE_UNIFIED_EDITOR_FACADE=true
# VITE_FORCE_UNIFIED_EDITOR=true
```

### Problema: "Editor funciona local mas não em produção"

Em produção, use **variáveis de ambiente do servidor** (Vercel, Netlify, etc), não `.env.local`.

**Vercel:**
- Settings → Environment Variables
- Adicione `VITE_FORCE_UNIFIED_EDITOR` = `true`

**Netlify:**
- Site settings → Build & deploy → Environment
- Adicione `VITE_FORCE_UNIFIED_EDITOR` = `true`

---

## 🚀 SCRIPT DE DIAGNÓSTICO AUTOMÁTICO

Use o script criado para diagnóstico rápido:

```bash
./scripts/diagnostico-flags.sh
```

Saída esperada:

```
🔍 DIAGNÓSTICO DE FEATURE FLAGS
================================

📁 Verificando arquivos...
✅ .env.local existe

📄 Conteúdo do .env.local:
VITE_ENABLE_UNIFIED_EDITOR_FACADE=true
VITE_FORCE_UNIFIED_EDITOR=true

🌐 Servidor Vite:
✅ Servidor rodando
   PID: 12345
```

---

## 📞 ÚLTIMA INSTÂNCIA

Se **nada funcionar**, tente isto:

```bash
# 1. Limpar tudo
rm -rf node_modules/.vite
rm -rf dist

# 2. Garantir que .env.local existe
cat > .env.local << 'EOF'
VITE_ENABLE_UNIFIED_EDITOR_FACADE=true
VITE_FORCE_UNIFIED_EDITOR=true
EOF

# 3. Matar todos os processos Node
pkill -9 node

# 4. Reinstalar dependências (só se necessário)
# npm install

# 5. Iniciar servidor limpo
npm run dev

# 6. Abrir em nova aba anônima (para evitar cache)
# Chrome: Ctrl + Shift + N
# Firefox: Ctrl + Shift + P
```

Depois vá para: http://localhost:8080/editor

---

## ✅ VALIDAÇÃO FINAL

Quando tudo estiver funcionando, você verá:

1. **No canto superior direito:** Badge verde "✅ FACADE ATIVO"
2. **No console:**
   ```javascript
   🎛️ [ModernUnifiedEditor] Feature Flags: {
       forceUnified: true,     // ✅
       enableFacade: true,     // ✅
       shouldUseFacade: true,  // ✅
       env_FORCE: "true",      // ✅
       env_FACADE: "true",     // ✅
       mode: "development"     // ✅
   }
   ```
3. **Interface:** Editor diferente (não mais as 4 colunas antigas)

---

**Se ainda não funcionar após tentar tudo isso, me avise e vou investigar o código do FeatureFlagManager!**
