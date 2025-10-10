# 🧪 GUIA DE TESTES - Integração de Componentes (Fase 6.6)

**Data:** 8 de outubro de 2025
**Status:** ✅ Editor aberto - Pronto para testar
**URL do Editor:** http://localhost:8080/editor/quiz-estilo-modular-pro

---

## 📋 CHECKLIST DE TESTES

### ✅ Fase 1: Editor Modular 4 Colunas

#### 1.1 Verificação Visual do Layout
- [ ] **Coluna 1 (Etapas):** Lista com 21 etapas visível
- [ ] **Coluna 2 (Componentes):** Biblioteca de componentes (Texto, Título, Botão, etc.)
- [ ] **Coluna 3 (Canvas):** Preview com tabs "Canvas" e "Preview"
- [ ] **Coluna 4 (Propriedades):** Painel de propriedades vazio inicialmente

#### 1.2 Navegação até Step-20 (Resultado)
1. **Clicar** na etapa "20. result" na Coluna 1
2. **Verificar** que a Coluna 3 (Canvas) atualiza
3. **Verificar** que **StyleResultCard** renderiza:
   - ✅ Card com título "Seu Estilo Predominante"
   - ✅ Imagem do estilo (placeholder ou real)
   - ✅ Nome do estilo (ex: "Clássico")
   - ✅ Descrição do estilo
   - ✅ Lista de estilos secundários com barras de progresso
   - ✅ Botão "Continuar" ou similar

#### 1.3 Navegação até Step-21 (Oferta)
1. **Clicar** na etapa "21. offer" na Coluna 1
2. **Verificar** que a Coluna 3 (Canvas) atualiza
3. **Verificar** que **OfferMap** renderiza:
   - ✅ Card com oferta personalizada
   - ✅ Título da oferta (ex: "Montar looks com mais facilidade")
   - ✅ Descrição da oferta
   - ✅ Botão CTA (ex: "Quero descobrir meu estilo!")
   - ✅ Testimonial inline com quote e autor
   - ✅ Ícone temático (Sparkles, Heart, Check, ou Star)

#### 1.4 Teste de Propriedades (Coluna 4)
1. **Clicar** em step-20 na Coluna 1
2. **Verificar** se Coluna 4 mostra propriedades editáveis:
   - Título do card
   - Modo de exibição
   - Estilos personalizados
3. **Modificar** uma propriedade
4. **Verificar** se o Canvas atualiza em tempo real

#### 1.5 Teste de Salvamento
1. **Modificar** algo em step-20 ou step-21
2. **Clicar** no botão "Salvar" no header
3. **Verificar** mensagem de sucesso: "Funil salvo com sucesso"
4. **Verificar** badge "Não salvo" desaparece

#### 1.6 Teste de Preview
1. **Clicar** na tab "Preview" na Coluna 3
2. **Verificar** que componentes renderizam idêntico à produção
3. **Verificar** animações e transições funcionam

---

### ✅ Fase 2: Produção (/quiz-estilo)

#### 2.1 Iniciar Quiz do Zero
1. **Abrir:** http://localhost:8080/quiz-estilo
2. **Verificar** step-01 (introdução) carrega
3. **Clicar** "Começar o Quiz"

#### 2.2 Responder Perguntas Estratégicas
1. **Responder** perguntas 02-11 (questões de estilo)
   - Escolher pelo menos 3 opções em cada
   - Variar respostas para gerar estilos secundários
2. **Chegar** até pergunta 18:
   - **Texto:** "Qual desses resultados você mais gostaria de alcançar?"
   - **Opções:**
     - "Montar looks com mais facilidade e confiança"
     - "Usar o que já tenho e me sentir estilosa"
     - "Comprar com mais consciência e sem culpa"
     - "Ser admirada pela imagem que transmito"
3. **Escolher** uma opção (ex: primeira opção)

#### 2.3 Verificar Step-20 (Resultado)
1. **Continuar** até step-20
2. **Verificar** que **StyleResultCard** renderiza:
   - ✅ Estilo predominante calculado (ex: "Clássico", "Romântico")
   - ✅ Nome do usuário aparece no texto (se fornecido)
   - ✅ Imagem correta do estilo
   - ✅ Descrição rica do estilo
   - ✅ Estilos secundários listados com % ou barra
   - ✅ Animações suaves (fade in, scale)
   - ✅ Botão "Continuar" funciona

#### 2.4 Verificar Step-21 (Oferta)
1. **Clicar** "Continuar" no step-20
2. **Verificar** que **OfferMap** renderiza:
   - ✅ Oferta corresponde à resposta da pergunta 18
   - ✅ Se escolheu "Montar looks..." → mostra oferta 1
   - ✅ Se escolheu "Usar o que já tenho..." → mostra oferta 2
   - ✅ Se escolheu "Comprar com consciência..." → mostra oferta 3
   - ✅ Se escolheu "Ser admirada..." → mostra oferta 4
3. **Verificar** conteúdo da oferta:
   - ✅ Título personalizado com {userName}
   - ✅ Descrição convincente
   - ✅ Botão CTA com texto correto
   - ✅ Testimonial com quote inspiradora
   - ✅ Ícone e cores temáticas corretas

#### 2.5 Verificar Variável {userName}
1. **No step-01**, fornecer nome (ex: "Maria")
2. **Verificar** em step-20: "Maria, seu estilo é..."
3. **Verificar** em step-21: "Maria, esta oferta foi feita para você..."

---

### ✅ Fase 3: Testes de Edge Cases

#### 3.1 Dados Faltantes
1. **Cenário:** Quiz sem userName
   - **Esperado:** Usar "Usuário" como fallback
   - **Verificar:** step-20 e step-21 funcionam

2. **Cenário:** Quiz sem resultStyle
   - **Esperado:** Usar "clássico" como fallback
   - **Verificar:** step-20 mostra estilo clássico

3. **Cenário:** Resposta não mapeada na pergunta 18
   - **Esperado:** Usar primeira oferta como fallback
   - **Verificar:** step-21 mostra oferta "Montar looks..."

#### 3.2 OfferMap Vazio
1. **Editor:** Abrir step-21
2. **Remover** todas as ofertas do offerMap
3. **Verificar:** Alerta de erro aparece: "Oferta não configurada"

#### 3.3 Performance
1. **Verificar** que StyleResultCard carrega em < 500ms
2. **Verificar** que OfferMap carrega em < 500ms
3. **Verificar** que lazy loading funciona (console: chunks carregados)

---

## 🐛 TROUBLESHOOTING

### Problema: "Carregando resultado..." aparece indefinidamente
**Causa:** StyleResultCard não carrega
**Solução:**
1. Abrir console do navegador (F12)
2. Verificar erro: "Failed to fetch module"
3. Verificar caminho: `/src/components/editor/quiz/components/StyleResultCard.tsx`
4. Verificar export: `export function StyleResultCard`

### Problema: "Carregando oferta..." aparece indefinidamente
**Causa:** OfferMap não carrega
**Solução:**
1. Verificar caminho: `/src/components/editor/quiz/components/OfferMap.tsx`
2. Verificar export: `export function OfferMap`
3. Verificar imports: `OFFER_KEYS`, `OfferKey`

### Problema: Oferta errada aparece em step-21
**Causa:** Mapeamento incorreto da resposta da pergunta 18
**Solução:**
1. Verificar `answerToKey` em `OfferStepAdapter`
2. Verificar chaves do offerMap em quizSteps.ts
3. Verificar que resposta foi salva em `strategicAnswers`

### Problema: Componentes não atualizam no editor
**Causa:** Cache do navegador ou hot reload falhou
**Solução:**
1. **Hard refresh:** Ctrl+Shift+R (Windows/Linux) ou Cmd+Shift+R (Mac)
2. **Limpar cache:** DevTools > Network > Disable cache
3. **Reiniciar servidor:** Ctrl+C e `npm run dev`

---

## ✅ CRITÉRIOS DE SUCESSO

### Mínimo Viável (MVP)
- [x] StyleResultCard renderiza em step-20 (editor e produção)
- [x] OfferMap renderiza em step-21 (editor e produção)
- [x] Lazy loading funciona sem erros
- [x] 0 erros de TypeScript
- [x] 0 erros de compilação

### Completo
- [ ] Propriedades editáveis no painel (Coluna 4)
- [ ] Salvamento e publicação funcionam
- [ ] Variável {userName} substituída corretamente
- [ ] Oferta muda baseada na resposta da pergunta 18
- [ ] Testimonial inline aparece em todas as ofertas
- [ ] Animações suaves funcionam
- [ ] Performance < 500ms por componente

### Excelência
- [ ] Design 100% fiel ao quiz-estilo original
- [ ] Responsivo em mobile/tablet/desktop
- [ ] Acessibilidade (screen readers, keyboard navigation)
- [ ] SEO otimizado (meta tags, structured data)
- [ ] Analytics tracking (eventos de conversão)

---

## 📊 RELATÓRIO DE TESTES

### Template para Preencher:

```markdown
## Resultado dos Testes - [Seu Nome] - [Data/Hora]

### ✅ Editor Modular 4 Colunas
- Layout 4 colunas: ✅ / ❌
- Step-20 StyleResultCard: ✅ / ❌
- Step-21 OfferMap: ✅ / ❌
- Edição de propriedades: ✅ / ❌
- Salvamento: ✅ / ❌

### ✅ Produção /quiz-estilo
- Step-20 renderização: ✅ / ❌
- Step-21 renderização: ✅ / ❌
- Oferta correta por pergunta 18: ✅ / ❌
- Variável {userName}: ✅ / ❌
- Testimonial inline: ✅ / ❌

### 🐛 Bugs Encontrados:
1. [Descrever bug, steps para reproduzir, severidade]
2. ...

### 💡 Melhorias Sugeridas:
1. [Descrever melhoria, impacto, prioridade]
2. ...

### 📸 Screenshots:
- [Anexar screenshots de step-20 e step-21]
```

---

## 🎯 PRÓXIMOS PASSOS

Após completar os testes:

1. **Documentar** bugs encontrados
2. **Priorizar** correções
3. **Implementar** melhorias críticas
4. **Atualizar** TODO list
5. **Avançar** para Fase 7 (Documentação) e Fase 8 (Deploy)

---

**Status:** 🟢 **PRONTO PARA TESTAR**

Editor aberto em: http://localhost:8080/editor/quiz-estilo-modular-pro
Produção em: http://localhost:8080/quiz-estilo

**Bons testes!** 🚀
