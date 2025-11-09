# 🔧 FIX: Erro 405 Lovable API - ProjectId Vazio

**Data**: 09/11/2025  
**Status**: ✅ RESOLVIDO  
**Prioridade**: ALTA

---

## 🎯 Problema Identificado

### Erro no Console
```
GET https://api.lovable.dev/projects//collaborators 405 (Method Not Allowed)
```

### Causa Raiz
- URL estava sendo construída com **projectId vazio/undefined**
- Resultado: `/projects//collaborators` (barra dupla)
- O erro 405 ocorre porque o endpoint requer um ID válido entre `projects` e `collaborators`

### Comportamento Esperado
```
GET https://api.lovable.dev/projects/<projectId>/collaborators
```

---

## ✅ Correções Aplicadas

### 1. **Validação Rigorosa do ProjectId** 
**Arquivo**: `src/components/LovableClientProvider.tsx`

```typescript
// 🔧 ANTES (Vulnerável a valores inválidos)
const shouldEnableLovable = isEditor && (inIframe || enableFlag) && !!projectId;

// ✅ DEPOIS (Validação robusta)
const hasValidProjectId = projectId 
  && projectId.trim().length > 0 
  && projectId !== 'undefined' 
  && projectId !== 'null';

const shouldEnableLovable = isEditor 
  && (inIframe || enableFlag) 
  && hasValidProjectId;
```

**Protege contra**:
- `projectId` undefined
- `projectId` null
- String vazia `''`
- String literal `'undefined'` ou `'null'`

---

### 2. **Bloqueio Aprimorado de Requisições**
**Arquivo**: `src/utils/blockLovableInDev.ts`

```typescript
// 🔧 FIX: Bloquear /projects//collaborators (sem ID) e /projects/:id/collaborators
if (urlString.includes('/projects/') && urlString.includes('/collaborators')) {
    console.info('✅ Bloqueada chamada /projects//collaborators - retornando mock vazio');
    return Promise.resolve(new Response(JSON.stringify({ 
        collaborators: [],
        message: 'Lovable API disabled in development',
        status: 'blocked'
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    }));
}
```

**Benefícios**:
- Bloqueia **qualquer** chamada para `/collaborators` (com ou sem ID)
- Retorna mock silencioso (status 200) em vez de erro
- Log informativo para debug

---

### 3. **Logs Diagnósticos Melhorados**

#### ✅ Quando Ativado com Sucesso
```javascript
[Lovable] ✅ Configuração ativada com projectId válido
{
  inIframe: false,
  enableFlag: true,
  projectId: "abc12345...",
  path: "/editor"
}
```

#### ⚠️ Quando Desativado (Com Motivo)
```javascript
[Lovable] ⚠️ Desativado
{
  reason: "projectId inválido/ausente",
  hasValidProjectId: false,
  isEditor: true,
  inIframe: false,
  enableFlag: true
}
```

---

## 🧪 Como Testar

### 1. **Cenário: ProjectId Ausente (Correto)**
```bash
# .env.local SEM VITE_LOVABLE_PROJECT_ID
VITE_ENABLE_LOVABLE=false
```

**Resultado Esperado**:
- ✅ Nenhuma requisição para `api.lovable.dev`
- ✅ Console mostra: `[Lovable] ⚠️ Desativado { reason: "projectId inválido/ausente" }`
- ✅ Sem erro 405

### 2. **Cenário: ProjectId Válido (Ambiente Lovable)**
```bash
# .env.local COM projectId real
VITE_LOVABLE_PROJECT_ID=abc123def456
VITE_ENABLE_LOVABLE=true
```

**Resultado Esperado**:
- ✅ Console mostra: `[Lovable] ✅ Configuração ativada com projectId válido`
- ✅ Requisições são feitas com URL correta: `/projects/abc123def456/collaborators`

### 3. **Cenário: Desenvolvimento Local (Bloqueio Ativo)**
```bash
# Servidor local rodando
npm run dev
```

**Resultado Esperado**:
- ✅ Console mostra: `🚫 Bloqueada requisição para Lovable/SDK em desenvolvimento`
- ✅ Retorna mock com status 200
- ✅ Sem erro 405 no console

---

## 📋 Checklist de Verificação

- [x] Validação de `projectId` implementada
- [x] Bloqueio de requisições aprimorado
- [x] Logs diagnósticos adicionados
- [x] Testes em ambiente local
- [x] Documentação criada

---

## 🚀 Próximos Passos

### Em Desenvolvimento Local
- ✅ Lovable permanece **DESABILITADO** por padrão
- ✅ Sem requisições desnecessárias para API externa
- ✅ Sem erros 405 no console

### Em Ambiente Lovable (Preview)
- ✅ Ativado automaticamente quando em iframe
- ✅ Requer `VITE_LOVABLE_PROJECT_ID` válido
- ✅ Funciona normalmente com SDK

---

## 📖 Referências

- [Erro React #418](./LOVABLE_API_405_FIX.md)
- [Documentação Lovable API](https://docs.lovable.dev)
- [Issue Original](../CORRECOES_APLICADAS.md)

---

## 🔒 Segurança

**IMPORTANTE**: Nunca commitar `VITE_LOVABLE_PROJECT_ID` real no repositório!

```bash
# .env.local (NÃO commitado)
VITE_LOVABLE_PROJECT_ID=seu-project-id-aqui

# .gitignore (verificar se existe)
.env.local
.env*.local
```

---

**Status Final**: ✅ **RESOLVIDO**  
**Impacto**: Sem erros 405 em desenvolvimento  
**Testado**: ✅ Funcionando corretamente
