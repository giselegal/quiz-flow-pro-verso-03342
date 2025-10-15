# 🧪 GUIA DE TESTE - Implementação Fase 1 e 2

## 📍 Acesse a Página de Teste

Navegue para: **`/test-implementation`**

---

## 🎯 O Que Será Testado

### ✅ FASE 1: SuperUnifiedProvider (Auth)
**O que testar:**
1. Status de autenticação
2. Signup de novo usuário
3. Login com credenciais
4. Logout
5. Persistência de sessão

**Como testar:**
1. Clique em "Sign Up" com email/senha de teste
2. Verifique se aparece mensagem de confirmação
3. Use "Sign In" para fazer login
4. Verifique se User ID e Email aparecem
5. Clique "Sign Out" e verifique se desconecta

**Indicadores de Sucesso:**
- ✅ Badge verde "Authenticated" quando logado
- ✅ User ID e Email exibidos
- ✅ Toasts de confirmação aparecem
- ✅ Estado persiste ao recarregar página (quando logado)

---

### ✅ FASE 1: UnifiedCRUDProvider (CRUD)
**O que testar:**
1. Criar funnel
2. Listar funnels
3. Atualizar lista
4. Verificar contagem
5. Ver detalhes de funnel

**Como testar:**
1. **Pré-requisito:** Estar logado (teste anterior)
2. Digite nome do funnel no input
3. Clique "Create Funnel"
4. Verifique se aparece na lista abaixo
5. Clique "Refresh Funnels" para atualizar
6. Verifique a contagem de funnels

**Indicadores de Sucesso:**
- ✅ Contador "Funnels Count" aumenta após criar
- ✅ Funnel aparece na lista com nome e ID
- ✅ Badge de status ("draft") aparece
- ✅ Toasts de confirmação aparecem
- ✅ Refresh funciona sem erros

---

### ✅ FASE 2: Enhanced Block Registry
**O que testar:**
1. Estatísticas do registry
2. Busca de componentes
3. Lista de componentes disponíveis
4. Teste de importação

**Como testar:**
1. Verifique números em "Total", "Unique", "Aliases"
2. Digite um tipo de componente (ex: "button-inline")
3. Clique "Test Component"
4. Verifique se toast confirma encontrado
5. Clique em componentes da lista para testar
6. Tente aliases (ex: "button" ao invés de "button-inline")

**Indicadores de Sucesso:**
- ✅ Total > 40 componentes
- ✅ Available Components = ~18
- ✅ Toast "Component found!" ao testar
- ✅ Aliases funcionam (ex: "button" encontra componente)
- ✅ Todos os componentes da lista são clicáveis

---

## 📊 Test Summary

No final da página, você verá um resumo:

**✅ All Systems Operational** = Tudo funcionando  
**⚠️ Some Systems Need Attention** = Algo precisa atenção

---

## 🚨 Problemas Comuns

### Auth não funciona:
- ❌ **Problema:** Supabase não configurado
- ✅ **Solução:** Verificar .env tem VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY

### CRUD não funciona:
- ❌ **Problema:** RLS policies bloqueiam
- ✅ **Solução:** Verificar políticas na tabela funnels no Supabase

### Registry vazio:
- ❌ **Problema:** Imports falhando
- ✅ **Solução:** Verificar console do browser para erros de import

### "Component not found":
- ❌ **Problema:** Tipo incorreto ou componente não mapeado
- ✅ **Solução:** Usar tipos da lista AVAILABLE_COMPONENTS

---

## 🎓 Fluxo de Teste Completo

### Cenário 1: Usuário Novo (Fluxo Completo)
```bash
1. Acessar /test-implementation
2. Verificar que está deslogado
3. Preencher email e senha
4. Clicar "Sign Up"
5. Verificar toast de sucesso
6. Fazer "Sign In"
7. Verificar badge verde "Authenticated"
8. Criar funnel "Meu Primeiro Funnel"
9. Verificar aparece na lista
10. Testar componente "button-inline"
11. Verificar toast "Component found!"
12. Conferir Summary: "All Systems Operational"
```

### Cenário 2: Teste Rápido (Já Logado)
```bash
1. Acessar /test-implementation
2. Verificar já está logado
3. Criar funnel novo
4. Refresh funnels
5. Testar 3 componentes diferentes
6. Verificar Summary OK
```

---

## 📸 Screenshots Esperados

### Quando Deslogado:
- Badge cinza "Not Authenticated"
- Inputs de email/senha visíveis
- Botões "Sign Up" e "Sign In"
- CRUD section com aviso "Please sign in"

### Quando Logado:
- Badge verde "Authenticated"
- User ID e Email exibidos
- Botão vermelho "Sign Out"
- CRUD section com controles ativos
- Lista de funnels (se houver)

### Registry Section:
- 4 badges com números (Total, Unique, Aliases, Available)
- Grid com ~18 componentes
- Cada item com nome, código e categoria
- Input para teste de componentes

---

## 🔧 Debug Tools

### Console do Browser:
```javascript
// Ver registry completo
import { ENHANCED_BLOCK_REGISTRY } from '@/components/editor/blocks/enhancedBlockRegistry';
console.log(Object.keys(ENHANCED_BLOCK_REGISTRY));

// Ver stats
import { getRegistryStats } from '@/components/editor/blocks/enhancedBlockRegistry';
console.log(getRegistryStats());

// Ver auth state
import { useAuth } from '@/providers/SuperUnifiedProvider';
const { user, session } = useAuth();
console.log({ user, session });
```

---

## ✅ Checklist de Validação

### Auth:
- [ ] Sign Up funciona
- [ ] Sign In funciona
- [ ] Sign Out funciona
- [ ] User info exibido corretamente
- [ ] Sessão persiste após reload

### CRUD:
- [ ] Create Funnel funciona
- [ ] Funnels aparecem na lista
- [ ] Contador aumenta corretamente
- [ ] Refresh funciona
- [ ] Dados persistem no Supabase

### Registry:
- [ ] Stats exibidos corretamente
- [ ] Componentes listados (~18)
- [ ] Busca encontra componentes
- [ ] Aliases funcionam
- [ ] Nenhum erro no console

### Geral:
- [ ] Toasts aparecem em operações
- [ ] Loading states funcionam
- [ ] Erros são tratados gracefully
- [ ] UI responsiva
- [ ] Summary mostra "All Systems Operational"

---

**Última Atualização:** 2025-10-15  
**Versão:** 1.0 - Teste Fase 1 e 2
