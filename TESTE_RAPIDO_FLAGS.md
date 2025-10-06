# 🧪 TESTE RÁPIDO - FEATURE FLAGS

**Última atualização:** 06/10/2025

---

## 🎯 TESTE RÁPIDO (30 SEGUNDOS)

### 1. Abrir Editor
```
http://localhost:8080/editor/funnel-1753409877331
```

### 2. Abrir Console
Pressione **F12** ou **Ctrl + Shift + I**

### 3. Colar e Executar
Copie todo o conteúdo de `test-feature-flags.js` e cole no console.

OU execute diretamente:

```javascript
console.log('🧪 Teste:', {
    FORCE: import.meta.env.VITE_FORCE_UNIFIED_EDITOR,
    FACADE: import.meta.env.VITE_ENABLE_UNIFIED_EDITOR_FACADE,
    MODE: import.meta.env.MODE
});
```

---

## ✅ RESULTADO ESPERADO

Você deveria ver:

```javascript
🧪 Teste: {
    FORCE: "true",      // ✅ Correto
    FACADE: "true",     // ✅ Correto
    MODE: "development" // ✅ Correto
}
```

**E no canto superior direito:** Badge verde "✅ FACADE ATIVO"

---

## ❌ SE MOSTRAR UNDEFINED

```javascript
🧪 Teste: {
    FORCE: undefined,   // ❌ Problema!
    FACADE: undefined,  // ❌ Problema!
    MODE: "development"
}
```

**Causa:** Servidor Vite não carregou .env.local

**Solução:**

```bash
# Terminal 1: Parar servidor
pkill -f "vite"

# Terminal 2: Iniciar servidor
npm run dev

# Navegador: Recarregar (limpar cache)
Ctrl + Shift + R
```

---

## 🔧 SOLUÇÃO TEMPORÁRIA (SE NADA FUNCIONAR)

No console do navegador:

```javascript
// Forçar flags via localStorage
localStorage.setItem('flag_forceUnifiedInEditor', 'true');
localStorage.setItem('flag_enableUnifiedEditorFacade', 'true');

// Recarregar página
location.reload();
```

Isso funciona **imediatamente** mas é **temporário** (perdido ao limpar localStorage).

---

## 📋 CHECKLIST

- [ ] Servidor rodando: `npm run dev`
- [ ] .env.local existe: `ls -la .env.local`
- [ ] Contém variáveis: `cat .env.local | grep VITE_`
- [ ] Navegador recarregado: `Ctrl + Shift + R`
- [ ] Console mostra valores corretos
- [ ] Badge mostra "✅ FACADE ATIVO"

---

## 🚨 AINDA NÃO FUNCIONA?

Execute o diagnóstico completo:

```bash
./scripts/diagnostico-flags.sh
```

E leia: `TROUBLESHOOTING_EDITOR_ANTIGO.md`

---

## 📸 COMO SABER SE ESTÁ FUNCIONANDO?

### ✅ Editor NOVO (Facade):
- Badge verde no topo: "✅ FACADE ATIVO"
- Layout diferente (não as 4 colunas antigas)
- Console mostra: `[Facade:steps]`, `[Facade:save/start]`

### ❌ Editor ANTIGO:
- Badge vermelho no topo: "❌ EDITOR ANTIGO"
- 4 colunas: Etapas | Componentes | Canvas | Propriedades
- Sem logs `[Facade:...]` no console

---

**Servidor rodando em:** http://localhost:8080/

**Me diga o que você vê no console quando executa o teste!**
