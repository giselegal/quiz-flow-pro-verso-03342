# 🧪 Teste do Editor - Diagnóstico Rápido

## ✅ Status Atual

- **Servidor**: Rodando em http://localhost:8080/
- **Supabase**: Configurado (https://pwtjuuhchtbzttrzoutw.supabase.co)
- **Template Base**: `/public/templates/quiz21-v4-saas.json` (existe)

---

## 🔍 Como Testar o Editor

### 1️⃣ Acesse o Editor
```
http://localhost:8080/editor
```

### 2️⃣ O que deve acontecer:

**Primeira vez:**
- ✅ Carrega o template base `quiz21-v4-saas.json`
- ✅ Mostra 21 steps na barra lateral
- ✅ Canvas central mostra o step selecionado
- ✅ Painel de propriedades à direita

**Editando:**
- ✅ Clique em um step → propriedades aparecem
- ✅ Modifique um texto → AutoSave em 3 segundos
- ✅ Console mostra: `💾 [EditorPage] Salvando funnel via FunnelService`

**Reabrir:**
- ✅ Fecha e abre `/editor` novamente
- ✅ Suas mudanças foram preservadas (veio do Supabase draft)

---

## 🐛 Se Não Funcionar

### Abra o Console do Browser (F12)

**Erros comuns:**

1. **❌ "Failed to fetch template"**
   - Template não existe ou JSON inválido
   - Verifique: `public/templates/quiz21-v4-saas.json`

2. **❌ "Supabase error"**
   - Credenciais inválidas ou tabela não existe
   - Verifique: `.env` tem `VITE_SUPABASE_URL`

3. **❌ "Cannot read properties of undefined"**
   - Estrutura do JSON diferente do esperado
   - Verifique: schema do quiz (metadata, steps, blocks)

4. **❌ Tela branca / Loading infinito**
   - Erro no componente ModernQuizEditor
   - Olhe o console para ver qual componente falhou

---

## 🔧 Debug Rápido

### No Console do Browser (F12 → Console):

```javascript
// Ver se template carrega
fetch('/templates/quiz21-v4-saas.json')
  .then(r => r.json())
  .then(d => console.log('✅ Template:', d))
  .catch(e => console.error('❌ Erro:', e))

// Ver store do editor
console.log(window.__ZUSTAND_DEVTOOLS__)
```

### Logs esperados no console:

```
🎯 [EditorPage] Carregando funnel via FunnelService: { funnelId: 'quiz21StepsComplete' }
📂 Carregando quiz inicial (RAW): { stepsType: 'array', stepsLength: 21 }
✅ Template válido!
🎯 Auto-selecionando primeiro step: { stepId: 'intro', stepTitle: 'Introdução' }
```

---

## 📊 Fluxo Completo

```
┌─────────────────────────────────────────────────────────┐
│  1. Usuário acessa /editor                              │
└─────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  2. EditorPage chama funnelService.loadFunnel()         │
└─────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  3. FunnelService verifica Supabase                     │
│     - Existe draft? → Carrega draft                     │
│     - Não existe? → Carrega template base               │
└─────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  4. ModernQuizEditor recebe quiz                        │
│     - Renderiza layout 4 colunas                        │
│     - Auto-seleciona primeiro step                      │
└─────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  5. Usuário edita → AutoSave salva no Supabase          │
│     - Intervalo: 3 segundos                             │
│     - Cria/atualiza row na tabela funnels               │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Próximos Passos

### Se estiver funcionando:
1. ✅ Teste adicionar/remover steps
2. ✅ Teste editar propriedades de blocos
3. ✅ Teste drag & drop (se implementado)

### Se NÃO estiver funcionando:
1. Cole aqui os **erros do console**
2. Cole aqui a **mensagem da tela** (se houver)
3. Cole aqui o **network tab** (requests HTTP)

---

## 💡 Dica Importante

**Você NÃO precisa "publicar" para testar!**

O editor funciona assim:
- **Durante desenvolvimento**: edita e salva drafts localmente (Supabase)
- **Publicação** (futuro): transforma draft em funil público com URL

Por enquanto, foque em:
1. ✅ Carregar template base
2. ✅ Editar propriedades
3. ✅ Salvar no Supabase
4. ✅ Reabrir e ver mudanças preservadas
