# ✅ Checklist de Auditoria de Acessibilidade

## 📋 Preparação (5 min)

- [ ] Servidor rodando em `http://localhost:8080`
- [ ] Navegador aberto (Chrome/Edge recomendado)
- [ ] DevTools pronto (F12)
- [ ] Papel/editor para anotar resultados

---

## 🚀 Execução da Auditoria (3 min)

### 1. Acessar Auditor

```
http://localhost:8080/debug/accessibility
```

- [ ] Página carregou
- [ ] Vejo card "Auditoria de Acessibilidade"
- [ ] Vejo botão "Executar Auditoria"

### 2. Executar

- [ ] Cliquei em "Executar Auditoria"
- [ ] Aguardei 2-5 segundos
- [ ] Vejo números nos 4 cartões (Críticos/Sérios/Moderados/Menores)

### 3. Anotar Resumo

```
Data: ___/___/2025
Hora: ___:___

┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Críticos   │   Sérios    │  Moderados  │   Menores   │
│    [___]    │    [___]    │    [___]    │    [___]    │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

---

## 📊 Análise dos Resultados (10 min)

### Issues Críticos (Prioridade 1)

Para cada issue crítico (🔴):

- [ ] Anotei ID do issue: _______________
- [ ] Li descrição completa
- [ ] Contei elementos afetados: ___
- [ ] Copiei exemplo de HTML
- [ ] Li documentação (link "Saiba mais")
- [ ] Planejei correção

**Repetir para cada critical issue**

### Issues Sérios (Prioridade 2)

Para cada issue sério (🟠):

- [ ] Anotei ID: _______________
- [ ] Contei elementos: ___
- [ ] Entendi o problema
- [ ] Planejei correção

---

## 🎯 Priorização (5 min)

### Matriz de Prioridade

| Issue ID | Severidade | Elementos | Prazo | Responsável |
|----------|------------|-----------|-------|-------------|
| ________ | Crítico    | ___       | Hoje  | ________    |
| ________ | Crítico    | ___       | Hoje  | ________    |
| ________ | Sério      | ___       | Amanhã| ________    |
| ________ | Sério      | ___       | Amanhã| ________    |

### Estimativa de Tempo

- [ ] Críticos: ___ issues × 15 min = ___ horas
- [ ] Sérios: ___ issues × 10 min = ___ horas
- [ ] Total estimado: ___ horas

---

## 🔧 Plano de Correção

### Hoje (Issues Críticos)

#### Issue 1: [ID]
- [ ] Encontrado no código: arquivo _______________
- [ ] Correção aplicada
- [ ] Testado localmente
- [ ] Commitado

#### Issue 2: [ID]
- [ ] Encontrado no código: arquivo _______________
- [ ] Correção aplicada
- [ ] Testado localmente
- [ ] Commitado

### Amanhã (Issues Sérios)

- [ ] Issue ___: Corrigido
- [ ] Issue ___: Corrigido
- [ ] Issue ___: Corrigido

---

## ✅ Validação (10 min)

### Re-auditoria

- [ ] Todas correções aplicadas
- [ ] Servidor reiniciado
- [ ] Executei nova auditoria
- [ ] Números diminuíram:
  ```
  Antes: [__] críticos, [__] sérios
  Depois: [__] críticos, [__] sérios
  ```

### Teste Manual

- [ ] Navegação por teclado (Tab, Enter, Esc)
- [ ] Foco visível em todos elementos
- [ ] Screen reader teste básico (NVDA/VoiceOver)

---

## 📝 Documentação

### Relatório Final

```markdown
# Auditoria de Acessibilidade - [Data]

## Resumo
- Total de issues: ___
- Críticos: ___ (corrigidos: ___)
- Sérios: ___ (corrigidos: ___)
- Moderados: ___ (pendentes)
- Menores: ___ (backlog)

## Correções Aplicadas

### 1. [Issue ID]
- **Descrição**: 
- **Elementos corrigidos**: ___
- **Arquivos modificados**: 
- **Commit**: 

## Status
- [x] Auditoria executada
- [x] Issues críticos corrigidos
- [x] Issues sérios corrigidos
- [ ] Re-auditoria agendada para ___/___

## Próximos Passos
1. Corrigir moderados (deadline: ___)
2. Revisar menores (backlog)
3. Auditoria mensal agendada
```

---

## 🎉 Meta Atingida?

### Objetivo: WCAG 2.1 AA

- [ ] ✅ 0 issues críticos
- [ ] ✅ 0 issues sérios
- [ ] ⚠️ < 5 issues moderados
- [ ] 📊 Score Lighthouse > 90

**Se SIM**: Parabéns! Aplicação está em conformidade! 🎊

**Se NÃO**: Continue corrigindo até atingir meta.

---

## 📞 Recursos Utilizados

- [ ] `/debug/accessibility` - Auditor
- [ ] `docs/A11Y_QUICK_START.md` - Guia rápido
- [ ] `docs/A11Y_COMMON_FIXES.md` - Correções comuns
- [ ] `docs/A11Y_FIRST_AUDIT_GUIDE.md` - Guia completo
- [ ] https://webaim.org/resources/contrastchecker/ - Contraste
- [ ] https://dequeuniversity.com/rules/axe/ - Documentação

---

## 🚀 Próxima Auditoria

Agendar próxima auditoria:

```
Data: ___/___/2025
Hora: ___:___
Responsável: ___________
```

**Frequência recomendada**: Mensal ou após features grandes

---

**Auditado por**: _______________  
**Data**: ___/___/2025  
**Tempo total**: ___ horas  
**Status**: [ ] Completo [ ] Em andamento
