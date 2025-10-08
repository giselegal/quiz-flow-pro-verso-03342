# 🚀 PLANO DE IMPLEMENTAÇÃO: FASE 6.6

**Data:** 8 de outubro de 2025  
**Objetivo:** Integrar OfferMap, Testimonial e StyleResultCard para alcançar 100% de fidelidade com `/quiz-estilo`  
**Estimativa:** 4-6 horas  
**Prioridade:** 🔴 CRÍTICA

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### ETAPA 1: Integrar StyleResultCard no STEP-20 (Result) ⏱️ 1h30min

#### 1.1 Produção (`ResultStep.tsx`)
- [ ] Importar `StyleResultCard` de `/src/components/editor/quiz/components/`
- [ ] Refatorar seção de resultado para usar `StyleResultCard`
- [ ] Passar props corretas:
  - `resultStyle` ← `userProfile.resultStyle`
  - `userName` ← `userProfile.userName`
  - `secondaryStyles` ← `userProfile.secondaryStyles`
  - `scores` ← `scores` (para barras de porcentagem)
  - `mode` ← `'preview'`
- [ ] Manter oferta/CTA intactos (seção 2)
- [ ] Testar responsividade
- [ ] Verificar fallback de imagens

#### 1.2 Editor (`EditorResultStep.tsx`)
- [ ] Substituir blocos manuais por `StyleResultCard`
- [ ] Passar props:
  - `resultStyle` ← `safeData.resultStyle`
  - `userName` ← `safeData.userName`
  - `secondaryStyles` ← array vazio (TODO: conectar)
  - `scores` ← undefined (TODO: calcular no editor)
  - `mode` ← `'editor'`
  - `onUpdate` ← callback para `onEdit`
- [ ] Envolver em `SelectableBlock` para manter editabilidade
- [ ] Testar drag & drop
- [ ] Verificar painel de propriedades

#### 1.3 Modular (`ModularResultStep.tsx`)
- [ ] Importar `StyleResultCard`
- [ ] Substituir blocos individuais por componente integrado
- [ ] Manter estrutura de `SelectableBlock` se necessário
- [ ] Testar preview vs edit mode

---

### ETAPA 2: Integrar OfferMap + Testimonial no STEP-21 (Offer) ⏱️ 2h30min

#### 2.1 Produção (`ResultStep.tsx` - Seção 2)
- [ ] Importar `OfferMap` e `Testimonial`
- [ ] Adicionar lógica de seleção de oferta:
  ```typescript
  // Obter resposta estratégica da pergunta 18
  const strategicAnswer = state.userProfile.strategicAnswers[
      'Qual é a sua maior dificuldade com moda hoje?'
  ];
  
  // Mapear para chave do offerMap
  const offerKey = STRATEGIC_ANSWER_TO_OFFER_KEY[strategicAnswer] || 
                   'Montar looks com mais facilidade e confiança';
  
  // Buscar oferta do quizSteps.ts
  const step21 = QUIZ_STEPS['step-21'];
  const selectedOffer = step21.offerMap?.[offerKey];
  ```
- [ ] Substituir oferta hardcoded por `<OfferMap>`
- [ ] Passar props:
  - `offerMap` ← `step21.offerMap`
  - `selectedKey` ← `offerKey`
  - `userName` ← `userProfile.userName`
  - `mode` ← `'preview'`
- [ ] Renderizar `<Testimonial>` dentro da oferta selecionada
- [ ] Props testimonial:
  - `content` ← `selectedOffer.testimonial`
  - `mode` ← `'preview'`
  - `properties` ← `{ showPhoto: false }` (opcional)
- [ ] Manter gradientes e visual original
- [ ] Testar 4 cenários de ofertas

#### 2.2 Editor (`EditorOfferStep.tsx`)
- [ ] Importar `OfferMap` e `Testimonial`
- [ ] Substituir blocos manuais por `<OfferMap>`
- [ ] Passar props:
  - `offerMap` ← `data.offerMap || QUIZ_STEPS['step-21'].offerMap`
  - `selectedKey` ← `offerKey` (da prop)
  - `userName` ← `userProfile.userName`
  - `mode` ← `'editor'`
  - `onUpdate` ← callback para salvar alterações
- [ ] `OfferMap` já tem tabs internas para editar 4 ofertas
- [ ] Cada oferta já renderiza `Testimonial` internamente
- [ ] Envolver em `SelectableBlock` se necessário
- [ ] Testar edição de cada oferta (tabs)
- [ ] Verificar preview real

#### 2.3 Modular (`ModularOfferStep.tsx`)
- [ ] Importar `OfferMap`
- [ ] Substituir estrutura atual
- [ ] Configurar modo editor/preview
- [ ] Testar alternância entre ofertas

#### 2.4 Conectar com quizSteps.ts
- [ ] Verificar `QUIZ_STEPS['step-21'].offerMap` está populado
- [ ] Verificar `STRATEGIC_ANSWER_TO_OFFER_KEY` mapping correto
- [ ] Testar 4 caminhos:
  - Resposta 1 → Oferta "Montar looks"
  - Resposta 2 → Oferta "Usar o que tenho"
  - Resposta 3 → Oferta "Comprar com consciência"
  - Resposta 4 → Oferta "Ser admirada"

---

### ETAPA 3: Registrar Componentes no BlockRegistry (Reusabilidade) ⏱️ 45min

#### 3.1 Atualizar BlockRegistry.tsx
- [ ] Importar os 3 componentes
- [ ] Criar `StyleResultCardBlock`:
  ```typescript
  export const StyleResultCardBlock = defineBlock({
      id: 'result.styleCard',
      label: 'Resultado: Card de Estilo Completo',
      category: 'resultado',
      schema: z.object({
          userName: z.string(),
          resultStyle: z.string(),
          secondaryStyles: z.array(z.string()).optional(),
          scores: z.record(z.number()).optional()
      }),
      defaultConfig: {...},
      render: ({ config, state }) => (
          <StyleResultCard
              userName={config.userName || state?.userName}
              resultStyle={config.resultStyle || state?.resultStyle}
              secondaryStyles={config.secondaryStyles || state?.secondaryStyles}
              scores={state?.scores}
              mode="preview"
          />
      )
  });
  ```
- [ ] Criar `OfferMapBlock`:
  ```typescript
  export const OfferMapBlock = defineBlock({
      id: 'offer.map',
      label: 'Oferta: Mapa Personalizado (4 variações)',
      category: 'oferta',
      schema: z.object({
          offerMap: z.record(z.object({
              title: z.string(),
              description: z.string(),
              buttonText: z.string(),
              testimonial: z.object({
                  quote: z.string(),
                  author: z.string(),
                  photo: z.string().optional()
              })
          }))
      }),
      defaultConfig: {...},
      render: ({ config, state }) => (
          <OfferMap
              offerMap={config.offerMap}
              selectedKey={state?.strategicAnswer}
              userName={state?.userName}
              mode="preview"
          />
      )
  });
  ```
- [ ] Criar `TestimonialBlock` (avançado):
  ```typescript
  export const TestimonialAdvancedBlock = defineBlock({
      id: 'testimonial.advanced',
      label: 'Depoimento Avançado (com foto e editor)',
      category: 'social-proof',
      schema: z.object({
          quote: z.string(),
          author: z.string(),
          photo: z.string().optional(),
          showPhoto: z.boolean().default(true)
      }),
      defaultConfig: {...},
      render: ({ config }) => (
          <Testimonial
              content={{
                  quote: config.quote,
                  author: config.author,
                  photo: config.photo
              }}
              properties={{ showPhoto: config.showPhoto }}
              mode="preview"
          />
      )
  });
  ```
- [ ] Adicionar aos `DEFAULT_BLOCK_DEFINITIONS`
- [ ] Testar blocos em editor modular

---

### ETAPA 4: Replicar Visual Exato (Fidelidade 100%) ⏱️ 1h15min

#### 4.1 Backgrounds e Gradientes
- [ ] ResultStep: Verificar `bg-gradient-to-br from-[#fffaf7] to-[#faf5f0]`
- [ ] ResultStep: Adicionar círculos decorativos blur
- [ ] OfferStep: Verificar `bg-gradient-to-r from-[#deac6d] to-[#c19952]`
- [ ] Garantir mesmas cores em editor e produção

#### 4.2 Tipografia
- [ ] Consolidar `playfair-display` vs `"Playfair Display", serif`
- [ ] Verificar font-weights (normal, semibold, bold)
- [ ] Tamanhos responsivos (text-2xl sm:text-3xl md:text-4xl)

#### 4.3 Elementos Visuais
- [ ] Ícone celebração: `🎉` com `animate-bounce`
- [ ] Ícones Lucide: Star, Shield, Clock, ShoppingCart
- [ ] Backdrop blur: `bg-white/10 backdrop-blur-sm`
- [ ] Hover states nos botões
- [ ] Transições suaves

#### 4.4 Layout Responsivo
- [ ] Grids: `md:grid-cols-2`, `md:grid-cols-3`
- [ ] Padding: `px-3 sm:px-5 py-6 md:py-8`
- [ ] Max-width: `max-w-5xl` vs `max-w-6xl`
- [ ] Order: `order-1 md:order-2` para inversão mobile

---

### ETAPA 5: Testes e Validação ⏱️ 30min

#### 5.1 Testes Visuais
- [ ] Screenshot produção vs editor (step-20)
- [ ] Screenshot produção vs editor (step-21)
- [ ] Comparação pixel-perfect
- [ ] Teste em mobile (375px)
- [ ] Teste em tablet (768px)
- [ ] Teste em desktop (1440px)

#### 5.2 Testes Funcionais
- [ ] Percorrer quiz completo
- [ ] Responder pergunta estratégica 18 com cada opção
- [ ] Verificar oferta correta exibida
- [ ] Verificar testimonial correto
- [ ] Verificar resultado com estilo calculado
- [ ] Testar edição de ofertas no editor
- [ ] Testar edição de resultado no editor

#### 5.3 Testes de Dados
- [ ] Verificar `offerMap` carregado de `quizSteps.ts`
- [ ] Verificar `testimonial` para cada oferta
- [ ] Verificar `scores` no resultado
- [ ] Verificar `secondaryStyles`
- [ ] Verificar placeholders `{userName}`

---

## 📊 ARQUIVOS A MODIFICAR

### Produção (3 arquivos):
1. `/src/components/quiz/ResultStep.tsx` (~469 linhas)
   - Adicionar imports
   - Seção 1: Integrar `StyleResultCard`
   - Seção 2: Integrar `OfferMap` + `Testimonial`

### Editor (3 arquivos):
2. `/src/components/editor/quiz-estilo/EditorResultStep.tsx` (~193 linhas)
   - Substituir blocos por `StyleResultCard`
   
3. `/src/components/editor/quiz-estilo/EditorOfferStep.tsx` (~245 linhas)
   - Substituir blocos por `OfferMap`
   
4. `/src/components/editor/quiz-estilo/ModularResultStep.tsx` (~193 linhas)
   - Integrar `StyleResultCard`
   
5. `/src/components/editor/quiz-estilo/ModularOfferStep.tsx` (~245 linhas)
   - Integrar `OfferMap`

### Registry (1 arquivo):
6. `/src/runtime/quiz/blocks/BlockRegistry.tsx` (~190 linhas)
   - Adicionar 3 novos blocos
   - Atualizar `DEFAULT_BLOCK_DEFINITIONS`

---

## 🎯 CRITÉRIOS DE SUCESSO

### Funcional:
- ✅ Produção usa `StyleResultCard`, `OfferMap`, `Testimonial`
- ✅ Editor usa os mesmos componentes
- ✅ 4 ofertas personalizadas funcionando
- ✅ Seleção baseada em resposta estratégica
- ✅ Depoimentos específicos por oferta
- ✅ Blocos editáveis e drag & drop
- ✅ Preview idêntico à produção

### Visual:
- ✅ Fidelidade 100% com design Gisele Galvão
- ✅ Backgrounds e gradientes corretos
- ✅ Tipografia consistente
- ✅ Ícones e animações
- ✅ Responsivo (mobile, tablet, desktop)
- ✅ Hover states e transições

### Técnico:
- ✅ Zero código duplicado
- ✅ Componentes registrados no BlockRegistry
- ✅ Props tipadas com TypeScript
- ✅ Testes passando
- ✅ Sem warnings no console
- ✅ Performance otimizada

---

## 📅 CRONOGRAMA

| Etapa | Duração | Início | Fim |
|-------|---------|--------|-----|
| 1. StyleResultCard | 1h30min | 00:00 | 01:30 |
| 2. OfferMap + Testimonial | 2h30min | 01:30 | 04:00 |
| 3. BlockRegistry | 45min | 04:00 | 04:45 |
| 4. Visual Exato | 1h15min | 04:45 | 06:00 |
| 5. Testes | 30min | 06:00 | 06:30 |
| **TOTAL** | **6h30min** | - | - |

---

## 🚀 PRÓXIMOS PASSOS

1. **Começar Etapa 1:** Integrar `StyleResultCard` na produção
2. **Testar iterativamente:** Cada mudança com teste visual
3. **Documentar:** Screenshots antes/depois
4. **Commitar:** Commits atômicos por componente
5. **Revisar:** Checklist de fidelidade visual

---

**Status:** 🟢 PRONTO PARA INICIAR  
**Bloqueadores:** ❌ Nenhum  
**Dependências:** ✅ Componentes criados (Fase 2)  
**Risco:** 🟢 BAIXO (componentes prontos, só integrar)

---

**Assinado:** GitHub Copilot  
**Data:** 8 de outubro de 2025  
**Próxima Ação:** Iniciar Etapa 1.1
