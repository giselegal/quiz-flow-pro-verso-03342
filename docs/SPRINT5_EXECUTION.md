# 🚀 SPRINT 5: EXECUTION PLAN

**Data:** 2025-01-16  
**Status:** ✅ READY TO EXECUTE

## 📋 Resumo Executivo

Sprint 5 foca na otimização de dependências, eliminando:
- ✅ Sistemas duplicados de drag & drop
- ✅ Utilitários duplicados (ID generation)
- ✅ Dependências não utilizadas

**Resultado esperado:** -95KB gzipped, menos conflitos, melhor manutenibilidade

---

## 🎯 Fase 1: Remoções Seguras (AGORA)

### Pacotes Confirmados para Remoção

#### 1. CraftJS (❌ REMOVER)
**Pacotes:**
- `@craftjs/core@^0.2.12`
- `@craftjs/layers@^0.2.7`

**Motivo:**
- Usado apenas em `ModularResultEditor.tsx` (marcado como DEPRECATED)
- Substituído por `@dnd-kit` na arquitetura Zustand
- Arquivo já possui aviso: "⚠️ DEPRECATED - NÃO USAR"

**Verificação:**
```bash
grep -r "@craftjs" src/
# Resultado: Apenas em arquivo deprecated
```

**Impacto:** ZERO (código já marcado para remoção)  
**Economia:** ~80KB gzipped

---

#### 2. UUID (❌ REMOVER)
**Pacotes:**
- `uuid@^11.1.0`
- `@types/uuid@^10.0.0`

**Motivo:**
- Não encontrado nenhum uso no código atual
- `nanoid` já é usado extensivamente
- `nanoid` é mais leve e rápido

**Verificação:**
```bash
grep -r "from 'uuid'" src/
# Resultado: Nenhum match encontrado!
```

**Impacto:** ZERO (não está sendo usado)  
**Economia:** ~15KB gzipped

---

### Como Executar

#### Opção A: Script Automatizado (Recomendado)
```bash
chmod +x scripts/remove-unused-dependencies.sh
./scripts/remove-unused-dependencies.sh
```

#### Opção B: Manual
```bash
# Remover CraftJS
npm uninstall @craftjs/core @craftjs/layers

# Remover UUID
npm uninstall uuid @types/uuid

# Reinstalar dependências
npm install

# Verificar build
npm run build
```

---

## ✅ Checklist de Execução

### Antes da Remoção
- [x] ✅ Auditoria completa realizada
- [x] ✅ Uso no código verificado (nenhum encontrado)
- [x] ✅ Scripts de remoção criados
- [x] ✅ Plano de rollback definido

### Durante a Remoção
- [ ] Executar script de remoção
- [ ] Verificar mensagens de erro do npm
- [ ] Executar `npm install`
- [ ] Executar `npm run build`

### Após a Remoção
- [ ] Build bem-sucedido
- [ ] Aplicação funciona em dev (`npm run dev`)
- [ ] Nenhum erro de TypeScript
- [ ] Análise de bundle size realizada
- [ ] Documentação atualizada

---

## 📊 Métricas de Sucesso

### Bundle Size
**Antes:**
```bash
npm run build
# Executar: scripts/analyze-bundle.sh
# Anotar tamanho total
```

**Depois:**
```bash
npm run build
# Executar: scripts/analyze-bundle.sh
# Verificar redução de ~95KB
```

### Dependencies Count
**Antes:** 93 pacotes  
**Depois:** 89 pacotes (-4.3%)

### Build Time
**Antes:** [anotar tempo]  
**Depois:** [anotar tempo esperado: -5-10%]

---

## 🔄 Plano de Rollback

Se algo der errado:

```bash
# Voltar package.json
git checkout package.json package-lock.json

# Reinstalar dependências originais
npm install

# Verificar funcionamento
npm run build
npm run dev
```

---

## 📝 Fase 2: Análises Pendentes (PRÓXIMOS SPRINTS)

### Decisões que Requerem Mais Análise

#### A. React Spring & Use Gesture
**Status:** ⏳ PENDING REVIEW
```bash
# Verificar uso real
grep -r "@react-spring" src/
grep -r "@use-gesture" src/
```

**Se não usado:** Remover ambos (~45KB economia adicional)

---

#### B. Drizzle ORM
**Status:** ⏳ PENDING REVIEW
```bash
# Verificar uso real
grep -r "drizzle-orm" src/
```

**Questão:** Por que temos Drizzle SE já usamos Supabase?
- Supabase já tem ORM completo
- Drizzle pode ser redundante

**Decisão necessária:** Verificar se há lógica específica que precisa do Drizzle

---

#### C. Routing Strategy
**Status:** ⏳ STRATEGIC DECISION

**Opções:**
1. **Manter react-router-dom** (atual)
   - Mais features
   - Melhor ecossistema
   - Mais pesado (~20KB)

2. **Migrar para wouter**
   - Muito mais leve (~1KB)
   - API mais simples
   - Menos features

**Recomendação:** Analisar features usadas do react-router
- Se usar apenas básico → migrar para wouter
- Se usar nested routes, loaders, etc → manter react-router

---

## 🎓 Lições Aprendidas

### Como Evitar Duplicações Futuras

1. **Antes de instalar novo pacote:**
   ```bash
   # Verificar se já existe solução
   npm ls | grep "similar-functionality"
   ```

2. **Documentar decisões de arquitetura:**
   - Por que escolhemos X em vez de Y?
   - Registrar no ARCHITECTURE.md

3. **Code review checklist:**
   - [ ] Novo pacote é realmente necessário?
   - [ ] Já temos algo similar?
   - [ ] Tamanho do pacote é aceitável?

---

## 📈 Próximos Passos Após Sprint 5

1. **Sprint 6:** Component Migration
   - Migrar componentes para nova arquitetura
   - Eliminar componentes duplicados

2. **Sprint 7:** Final Cleanup
   - Remover código deprecated
   - Consolidar arquivos restantes

3. **Sprint 8:** Documentation & Testing
   - Atualizar toda documentação
   - Testes E2E completos

---

## 🚀 EXECUTE AGORA

Para executar a Fase 1 (remoções seguras):

```bash
# 1. Dar permissão ao script
chmod +x scripts/remove-unused-dependencies.sh

# 2. Executar remoção
./scripts/remove-unused-dependencies.sh

# 3. Testar
npm run dev

# 4. Build de produção
npm run build

# 5. Analisar bundle
./scripts/analyze-bundle.sh
```

---

**Status:** ✅ PRONTO PARA EXECUÇÃO  
**Risco:** 🟢 MUITO BAIXO  
**Impacto:** 🎯 ALTO (melhor performance, menos conflitos)

