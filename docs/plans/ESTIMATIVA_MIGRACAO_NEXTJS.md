# ⏱️ Estimativa de Tempo: Migração para Next.js (Versão Pública)

## 📊 Análise do Código Atual

### Componentes a Migrar
```
Modulares (Editor):
  - ModularIntroStep.tsx              508 linhas → ~150 linhas (SSR)
  - ModularQuestionStep.tsx           508 linhas → ~180 linhas (SSR)
  - ModularStrategicQuestionStep.tsx  366 linhas → ~140 linhas (SSR)
  - ModularTransitionStep.tsx         267 linhas → ~80 linhas (SSR)
  - ModularResultStep.tsx             339 linhas → ~200 linhas (SSR)
  - ModularOfferStep.tsx              365 linhas → ~180 linhas (SSR)

Total: 2.353 linhas → ~930 linhas (60% redução)
```

### Blocos Atômicos
- **32 blocos atômicos** em `src/components/editor/blocks/atomic/`
- Precisam ser adaptados para SSR (remover dependências de editor)
- Cada bloco: ~50-150 linhas

---

## 🗓️ Estimativa Detalhada (Desenvolvedor Sênior)

### **FASE 1: Setup Inicial Next.js** ⏱️ 4-6 horas

#### 1.1 Criar Projeto Next.js (1h)
- [ ] `npx create-next-app@latest quiz-flow-nextjs`
- [ ] Configurar TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Configurar paths alias (@/*)

#### 1.2 Estrutura de Diretórios (1h)
- [ ] Criar `app/(public)/` e `app/(editor)/`
- [ ] Criar `components/quiz/` e `components/editor/`
- [ ] Criar `lib/quiz/` para lógica compartilhada
- [ ] Configurar `next.config.js` (code splitting)

#### 1.3 Setup Supabase (2-4h)
- [ ] Instalar `@supabase/ssr`
- [ ] Configurar client/server components
- [ ] Criar `app/api/quiz/[quizId]/route.ts`
- [ ] Criar `app/api/funnels/[funnelId]/route.ts`
- [ ] Testar conexão e queries

**Subtotal Fase 1: 4-6 horas**

---

### **FASE 2: Extrair Lógica de Negócio** ⏱️ 6-8 horas

#### 2.1 Criar Utilitários Compartilhados (3-4h)
```typescript
lib/quiz/
├── validation.ts         (1h)   ← validateAnswer, validateStep
├── scoring.ts            (1-2h) ← computeScore, computeResult
├── navigation.ts         (0.5h) ← computeProgress, getNextStep
└── types.ts              (0.5h) ← QuizData, StepData, etc
```

**Tarefas:**
- [ ] Extrair funções de validação de `ModularQuestionStep.tsx`
- [ ] Extrair lógica de scoring de `ModularResultStep.tsx`
- [ ] Extrair lógica de navegação
- [ ] Criar tipos compartilhados
- [ ] Escrever testes unitários (importante!)

#### 2.2 Adaptar Template JSON (3-4h)
- [ ] Criar função de parse/hydration do template
- [ ] Adaptar estrutura para SSR (sem refs de editor)
- [ ] Criar cache de templates
- [ ] Testar com quiz21-complete.json

**Subtotal Fase 2: 6-8 horas**

---

### **FASE 3: Componentes Públicos (SSR)** ⏱️ 16-24 horas

#### 3.1 Blocos Atômicos SSR (8-12h)
**32 blocos × 15-20min/bloco = 8-12h**

Prioridade Alta (8 blocos essenciais × 30min):
- [ ] IntroLogoBlock → SSR-safe
- [ ] IntroTitleBlock → SSR-safe
- [ ] IntroDescriptionBlock → SSR-safe
- [ ] QuestionHeaderBlock → SSR-safe
- [ ] OptionsGridBlock → SSR-safe (maior complexidade)
- [ ] NavigationButtonBlock → SSR-safe
- [ ] ResultHeroBlock → SSR-safe
- [ ] ResultCTABlock → SSR-safe

**4 horas para blocos essenciais**

Prioridade Média (12 blocos × 20min):
- FormInputBlock, ProgressBarBlock, etc.

**4 horas para blocos secundários**

Prioridade Baixa (12 blocos × 15min):
- FooterBlock, CopyrightBlock, etc.

**3 horas para blocos terciários**

#### 3.2 Steps Públicos (8-12h)

**IntroStep** (2h)
- [ ] Criar `components/quiz/steps/IntroStep.tsx`
- [ ] Remover useEditor, DnD, callbacks de edição
- [ ] Integrar blocos SSR
- [ ] Testar SSR (next build)
- [ ] Responsive design

**QuestionStep** (3-4h) ← MAIS COMPLEXO
- [ ] Criar `components/quiz/steps/QuestionStep.tsx`
- [ ] Simplificar de 508 → ~180 linhas
- [ ] Remover DnD, SelectableBlock, SortableBlock
- [ ] Lógica de seleção (single/multi choice)
- [ ] Auto-advance (opcional)
- [ ] Validação inline
- [ ] Testar SSR

**StrategicQuestionStep** (2h)
- [ ] Similar ao QuestionStep, mas formulário de texto
- [ ] Validação de input
- [ ] Character counter

**TransitionStep** (1h)
- [ ] Componente simples (loading + mensagem)
- [ ] Animações CSS

**ResultStep** (2-3h)
- [ ] Cálculo de resultado (usa lib/quiz/scoring.ts)
- [ ] Renderização dinâmica baseada em scores
- [ ] CTAs (botões de ação)

**OfferStep** (1h)
- [ ] Similar ao ResultStep
- [ ] Integração com CTAs externos

**Subtotal Fase 3: 16-24 horas**

---

### **FASE 4: Página Pública & Renderer** ⏱️ 6-10 horas

#### 4.1 QuizRenderer (3-4h)
```typescript
// components/quiz/QuizRenderer.tsx
'use client';

- [ ] State management (useState para currentStep, answers)
- [ ] Navegação entre steps
- [ ] Persistência local (localStorage)
- [ ] Integração com todos os steps
- [ ] Progress tracking
- [ ] Animações de transição
```

#### 4.2 Página Pública (3-4h)
```typescript
// app/(public)/quiz/[quizId]/page.tsx

- [ ] Server Component para fetch inicial
- [ ] Integração com Supabase (buscar quiz por ID)
- [ ] Metadata dinâmica (SEO)
- [ ] Error handling (quiz não encontrado)
- [ ] Loading states
- [ ] Suspense boundaries
```

#### 4.3 Layout Público (1-2h)
```typescript
// app/(public)/layout.tsx

- [ ] Header/Footer simples
- [ ] Estilos globais
- [ ] Favicon, manifest
- [ ] Analytics (opcional)
```

**Subtotal Fase 4: 6-10 horas**

---

### **FASE 5: Testes & Otimização** ⏱️ 8-12 horas

#### 5.1 Testes (4-6h)
- [ ] Testes unitários (lib/quiz/*)
- [ ] Testes de integração (QuizRenderer)
- [ ] Testes E2E (Playwright/Cypress)
- [ ] Testes de SSR (verificar hidratação)

#### 5.2 Performance (2-3h)
- [ ] Lighthouse audit (score > 90)
- [ ] Bundle size analysis
- [ ] Image optimization (next/image)
- [ ] Font optimization
- [ ] Code splitting verification

#### 5.3 SEO (2-3h)
- [ ] Metadata por página
- [ ] Open Graph tags
- [ ] Schema.org markup
- [ ] Sitemap.xml
- [ ] robots.txt

**Subtotal Fase 5: 8-12 horas**

---

### **FASE 6: Deploy & Documentação** ⏱️ 4-6 horas

#### 6.1 Deploy Vercel (2-3h)
- [ ] Configurar projeto Vercel
- [ ] Environment variables
- [ ] Domain setup
- [ ] Preview deployments
- [ ] Production deployment

#### 6.2 Documentação (2-3h)
- [ ] README.md (setup, instalação)
- [ ] API documentation
- [ ] Component documentation (Storybook opcional)
- [ ] Guia de contribuição

**Subtotal Fase 6: 4-6 horas**

---

## 📊 Estimativa Total

### Por Desenvolvedor

| Perfil | Tempo Mínimo | Tempo Máximo | Observações |
|--------|--------------|--------------|-------------|
| **Sênior** (você, familiarizado com código) | **44 horas** | **66 horas** | ~6-8 dias úteis |
| **Pleno** (conhece Next.js) | **66 horas** | **88 horas** | ~8-11 dias úteis |
| **Júnior** (aprendendo) | **88 horas** | **120 horas** | ~11-15 dias úteis |

### Cronograma Realista (Desenvolvedor Sênior)

#### **Cenário Ideal** (dedicação exclusiva, 8h/dia)
```
Semana 1 (40h):
  Dia 1-2: Fase 1 + Fase 2 (setup + lógica)      10-14h
  Dia 3-5: Fase 3 (componentes públicos)         16-24h
  ----------
  Subtotal: 26-38h (sobram 2-14h para Fase 4)

Semana 2 (40h):
  Dia 6-7: Fase 4 (página + renderer)             6-10h
  Dia 8-9: Fase 5 (testes + otimização)           8-12h
  Dia 10:  Fase 6 (deploy + docs)                 4-6h
  ----------
  Total: 44-66h (cabe em 1.5-2 semanas)
```

**Resultado: 1,5 a 2 semanas (dedicação exclusiva)**

---

#### **Cenário Real** (50% dedicação, 4h/dia + outras tarefas)
```
Semana 1-2 (40h):
  Fases 1-3 completas
  
Semana 3-4 (40h):
  Fases 4-6 completas

Total: 3-4 semanas (~1 mês)
```

**Resultado: 3-4 semanas (dedicação parcial)**

---

## 🚀 Estratégia de Priorização

### MVP (Minimum Viable Product) - **24-32 horas**
Implementar apenas o essencial para ter um quiz funcional:

**Incluir:**
- ✅ 3 tipos de steps: Intro, Question, Result
- ✅ 8 blocos essenciais (logo, title, options, button, etc)
- ✅ QuizRenderer básico
- ✅ 1 rota pública (`/quiz/[quizId]`)
- ✅ Fetch de template JSON (hardcoded ou Supabase)

**Excluir (implementar depois):**
- ⏸️ StrategicQuestionStep
- ⏸️ TransitionStep
- ⏸️ OfferStep
- ⏸️ Blocos avançados (características, features, etc)
- ⏸️ Analytics
- ⏸️ Testes E2E completos

**MVP = 3-4 dias úteis (24-32h)**

---

### Incrementos Após MVP

**Incremento 1** (+ 8-12h): Adicionar steps restantes
**Incremento 2** (+ 6-8h): Completar blocos atômicos
**Incremento 3** (+ 8-12h): Testes completos + otimização
**Incremento 4** (+ 4-6h): Deploy + documentação

---

## 💡 Recomendações

### Para Acelerar
1. **Usar Template/Boilerplate**: Next.js + Supabase starter (economiza 4-6h)
2. **Copiar Estilos**: Reutilizar CSS existente (economiza 2-4h)
3. **Shadcn/UI**: Usar componentes prontos (economiza 4-6h)
4. **Skip Testes Iniciais**: Implementar TDD depois do MVP (economiza 4-6h)

**Ganho potencial: 14-22h (reduz para 30-44h total)**

### Para Qualidade
1. **TDD desde início**: Escrever testes antes de implementar (+20% tempo)
2. **Code Review**: Revisar cada PR (+10% tempo)
3. **Documentação inline**: Comentar código complexo (+5% tempo)
4. **Storybook**: Documentar componentes visualmente (+8-12h)

**Custo adicional: +35-50% tempo (58-99h total)**

---

## 🎯 Resposta Direta

### "Quanto tempo para implementar a versão pública NEXT?"

| Cenário | Tempo | Prazo |
|---------|-------|-------|
| **MVP (mínimo funcional)** | 24-32h | 3-4 dias úteis |
| **Versão Completa (sênior, dedicação exclusiva)** | 44-66h | 1,5-2 semanas |
| **Versão Completa (sênior, 50% dedicação)** | 44-66h | 3-4 semanas |
| **Versão Completa (pleno, dedicação parcial)** | 66-88h | 4-6 semanas |
| **Versão com Qualidade Total** | 58-99h | 2-3 meses (com testes, docs, review) |

---

## ✅ Checklist de Entrega

### MVP
- [ ] 3 tipos de steps funcionais (Intro, Question, Result)
- [ ] 8 blocos atômicos essenciais
- [ ] QuizRenderer básico (navegação + state)
- [ ] 1 rota pública SSR
- [ ] Deploy Vercel funcional
- [ ] README básico

### Versão Completa
- [ ] Todos os 6 tipos de steps
- [ ] Todos os 32 blocos atômicos
- [ ] QuizRenderer completo (persistência + animações)
- [ ] SEO otimizado (metadata + sitemap)
- [ ] Performance > 90 (Lighthouse)
- [ ] Testes unitários + integração
- [ ] Documentação completa

---

## 🚦 Status Atual

- ✅ Análise de arquitetura completa
- ✅ Correções no sistema atual aplicadas
- ✅ Exemplos de código criados
- ✅ Documentação detalhada
- ⏳ **Pronto para começar implementação**

**Próximo passo:** Decidir entre MVP (3-4 dias) ou Versão Completa (1,5-4 semanas)
