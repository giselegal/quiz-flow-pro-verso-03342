# 🚀 Guia Rápido - Editor Unificado

## ⚡ Início Rápido (3 comandos)

```bash
# 1. Iniciar servidor
npm run dev

# 2. Em outro terminal, abrir editor
./scripts/open-editor.sh

# 3. (Opcional) Verificar status da flag
./scripts/toggle-editor-flag.sh status
```

## 🎯 URL do Editor

**Editor vazio**: http://localhost:8080/editor

**Editor com funil existente**: http://localhost:8080/editor/funnel-1753409877331

## ✅ Checklist - O que você deve ver

Quando acessar o editor, você deve ver:

- [ ] Interface do QuizFunnelEditorWYSIWYG (3 colunas)
- [ ] Coluna 1: Lista de steps (sequência do funil)
- [ ] Coluna 2: Biblioteca de componentes
- [ ] Coluna 3: Canvas visual
- [ ] Coluna 4: Painel de propriedades (à direita)
- [ ] No console (F12): Mensagens `[Facade:...]`

## 🔍 Como verificar se está funcionando?

### 1. Console do Browser (F12)
Procure por:
```
[Facade:steps] ...
[Facade:select] ...
[Facade:dirty] { dirty: true }
[Facade:save/start] ...
[Facade:save/success] ...
```

### 2. LocalStorage
No console, execute:
```javascript
FeatureFlagManager.getInstance().getAllFlags()
```

Deve retornar:
```javascript
{
  enableUnifiedEditorFacade: true,
  forceUnifiedInEditor: true,
  ...
}
```

### 3. Autosave
1. Edite qualquer propriedade
2. Aguarde 5 segundos
3. Veja no console: `[Facade:save/start]` seguido de `[Facade:save/success]`

## 🛠️ Scripts Disponíveis

### Gerenciar Feature Flags
```bash
# Ver status
./scripts/toggle-editor-flag.sh status

# Ativar editor unificado
./scripts/toggle-editor-flag.sh enable

# Desativar (voltar ao antigo)
./scripts/toggle-editor-flag.sh disable
```

### Abrir Editor
```bash
# Abre automaticamente no browser
./scripts/open-editor.sh
```

### Desenvolvimento
```bash
# Iniciar servidor
npm run dev

# Build de produção
npm run build

# Rodar testes
npm run test:run:editor
```

## 🐛 Problemas Comuns

### "Nada mudou, continua igual"
**Solução:**
1. Verificar flag: `./scripts/toggle-editor-flag.sh status`
2. Limpar cache: Ctrl+Shift+R no browser
3. Reiniciar servidor: `npm run dev`

### "Erro no console"
**Solução:**
1. Copiar mensagem de erro completa
2. Verificar se é relacionado a:
   - Network (problema de conexão)
   - Supabase (problema de autenticação)
   - Facade (problema no código)

### "Editor aparece vazio"
**Solução:**
1. Verificar se UnifiedCRUDProvider está carregando
2. Verificar console por erro de `currentFunnel`
3. Tentar carregar funil específico: `/editor/funnel-1753409877331`

## 📚 Documentação Completa

- `RESUMO_EXECUTIVO.md` - Overview geral
- `FASE_1_IMPLEMENTACAO_CONCLUIDA.md` - Detalhes técnicos
- `README.md` - Documentação do projeto

## 💡 Dicas

### Para Debug
```javascript
// No console do browser

// Ver todas as flags
FeatureFlagManager.getInstance().getAllFlags()

// Ativar debug
localStorage.setItem('debug', 'true')

// Ver estado do facade
// (quando estiver no editor)
console.log(window.__FACADE__)
```

### Para Desenvolvimento
```javascript
// Recarregar apenas a flag sem restart
FeatureFlagManager.getInstance().resetFlags()
window.location.reload()
```

## 🎯 Próximos Passos

Depois de validar que está funcionando:

1. ✅ Testar edição de steps
2. ✅ Testar autosave
3. ✅ Testar publicação
4. 📋 Reportar bugs encontrados
5. 🚀 Avançar para Fase 2 (se necessário)

---

**Dúvidas?** Consulte a documentação completa nos arquivos `.md` na raiz do projeto.
