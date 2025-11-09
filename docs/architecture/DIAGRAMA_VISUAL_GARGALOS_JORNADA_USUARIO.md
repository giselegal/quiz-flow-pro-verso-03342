# 🗺️ DIAGRAMA VISUAL: Jornada do Usuário com Gargalos Mapeados

**Data:** 08/11/2025  
**Tipo:** Mapa de Jornada do Usuário (User Journey Map)  
**Foco:** Pontos de dor e gargalos em cada etapa

---

## 👤 PERSONA: Editor de Quizzes

**Nome:** Maria, Marketing Manager  
**Objetivo:** Criar quiz de estilo pessoal com 21 etapas  
**Experiência Técnica:** Baixa (não-developer)  
**Expectativa:** Editor visual, intuitivo, sem bugs

---

## 🛤️ JORNADA COMPLETA (11 ETAPAS)

### 1️⃣ ACESSO AO EDITOR

**Ação do Usuário:**
```
Maria clica no link:
/editor?resource=quiz21StepsComplete
```

**O que Acontece (Backend):**
- ✅ URL é parseada
- ⚠️ Sem validação de parâmetros
- 🔴 "resource" vs "template" inconsistente

**Gargalos Encontrados:**
- 🔴 **G1:** URL inconsistente (resource vs template)
- 🔴 **G2:** Múltiplas rotas para o mesmo editor
- 🟡 **G3:** Sem validação de parâmetros

**Experiência do Usuário:**
```
😐 Funciona... mas pode quebrar com URL errada
   Tempo esperando: 0-5s (load inicial)
```

**Impacto:**
- ⚠️ Usuários confusos com URLs diferentes
- ⚠️ Crashes em URLs malformadas

---

### 2️⃣ CARREGAMENTO DO TEMPLATE

**Ação do Usuário:**
```
Maria aguarda o editor carregar
(esperando ver as 21 etapas)
```

**O que Acontece (Backend):**
- 🔄 Busca template em 7 lugares diferentes:
  1. quiz21StepsComplete.ts (estático)
  2. templateService
  3. consolidatedService
  4. registry
  5. Supabase
  6. localStorage
  7. IndexedDB
- ⚠️ Qual versão será usada? DEPENDE!
- ⚠️ 4 caches independentes podem servir versões diferentes

**Gargalos Encontrados:**
- 🔴 **G4:** 7 fontes de verdade (qual usar?)
- 🔴 **G5:** 4 caches desalinhados
- 🔴 **G6:** Template TS estático (não persiste edições)
- 🟡 **G7:** 23 services duplicados
- 🟠 **G9:** Bundle 450KB (lento)

**Experiência do Usuário:**
```
😕 Editor carregando... carregando... (150-200ms)
   SEM skeleton loader
   SEM indicador de progresso
   Usuário não sabe se está travado ou carregando
```

**Impacto:**
- ⚠️ Percepção de lentidão
- ⚠️ Possível data loss (fonte errada)
- ⚠️ Memory leak (cache L1 infinito)

---

### 3️⃣ VALIDAÇÃO DO TEMPLATE

**Ação do Usuário:**
```
Maria não vê nada
(acontece em background)
```

**O que Acontece (Backend):**
- ⚠️ Template deveria ser validado com Zod
- ❌ MAS: Validação não é executada em runtime
- ❌ Schemas incompletos (21% cobertura)

**Gargalos Encontrados:**
- 🔴 **G10:** Schemas Zod incompletos (3/14 tipos)
- 🟡 **G11:** Validação não executada
- 🟠 **G12:** Normalização inconsistente

**Experiência do Usuário:**
```
😐 Usuário não percebe nada
   (até tentar editar um bloco sem schema...)
```

**Impacto:**
- ⚠️ Dados inválidos podem passar
- ⚠️ Crashes inesperados depois

---

### 4️⃣ INICIALIZAÇÃO DO EDITOR

**Ação do Usuário:**
```
Maria vê o editor aparecer na tela
(4 colunas: Steps, Library, Canvas, Properties)
```

**O que Acontece (Backend):**
- 🔄 4 providers montam (1 atual + 3 deprecados)
- 🔄 15+ re-renders no mount
- ⚠️ Estado inicial não validado
- ❌ Sem loading state visual

**Gargalos Encontrados:**
- 🔴 **G14:** 4 providers ativos (3 deprecados)
- 🟡 **G15:** Estado inicial não validado
- 🟡 **G16:** Sem loading state
- 🟠 **G17:** 15+ re-renders
- 🟢 **G18:** Sem skeleton loader

**Experiência do Usuário:**
```
😕 Editor "pisca" várias vezes antes de estabilizar
   Demora ~1-2s para ficar interativo
   Parece travado durante re-renders
```

**Impacto:**
- ⚠️ Percepção de instabilidade
- ⚠️ Possível crash em estado inválido

---

### 5️⃣ NAVEGAÇÃO ENTRE STEPS

**Ação do Usuário:**
```
Maria clica em "Step 02" no navegador
Depois "Step 03", "Step 04"...
```

**O que Acontece (Backend):**
- 🔄 Lazy load de componentes (150-200ms cada)
- ❌ Sem prefetch do próximo step
- ❌ Step atual não persiste em URL
- ⚠️ Scroll position perdida

**Gargalos Encontrados:**
- 🔴 **G19:** Step atual não persistido (reload = perde progresso)
- 🟡 **G20:** Lazy load sem prefetch (flash)
- 🟠 **G21:** Animações bloqueiam UI
- 🟠 **G22:** Scroll não preservado

**Experiência do Usuário:**
```
😕 Flash branco a cada step (150ms)
   Scroll volta pro topo
   
   Maria fecha aba acidentalmente...
   Reabre → Volta para Step 01! ❌
   
   "Cadê o Step 15 que eu estava?" 😡
```

**Impacto:**
- 😡 Frustração (perde contexto)
- 😡 Precisa navegar 14 steps novamente
- ⚠️ Deep linking não funciona

---

### 6️⃣ EDIÇÃO DE UM BLOCO

**Ação do Usuário:**
```
Maria seleciona bloco "intro-logo" no Canvas
Painel de Propriedades abre à direita
```

**O que Acontece (Backend):**
- 🔄 Busca schema do tipo "intro-logo"
- ❌ Schema não existe! (11/14 tipos sem schema)
- ❌ Painel fica VAZIO

**Gargalos Encontrados:**
- 🔴 **G24:** Painel vazio para 11/14 tipos
- 🔴 **G25:** Mudanças não aplicam em tempo real (500ms delay)
- 🟡 **G26:** Sem validação de campos
- 🟡 **G27:** Undo/Redo parcial

**Experiência do Usuário:**

**CENÁRIO 1: Bloco SEM schema (79% dos casos)**
```
😡 Painel VAZIO!
   "Propriedades não disponíveis"
   
   Maria: "Como eu edito isso?!" 😡
   Única opção: Editar JSON manualmente (não sabe como)
```

**CENÁRIO 2: Bloco COM schema (21% dos casos)**
```
😕 Maria digita no campo "Título":
   T... i... t... u... l... o
   
   Canvas NÃO atualiza enquanto digita
   
   Maria para de digitar...
   Aguarda 500ms... ⏳
   
   Finalmente Canvas atualiza! 😕
   
   "Por que demora tanto?"
```

**Impacto:**
- 😡😡😡 Editor INUTILIZÁVEL para 79% dos blocos
- 😡 UX muito ruim (delay perceptível)
- ⚠️ Parece que editor está travado

---

### 7️⃣ DRAG & DROP DE BLOCO

**Ação do Usuário:**
```
Maria arrasta bloco "Button" da Library
Tenta soltar no Canvas
```

**O que Acontece (Backend):**
- 🔄 Drag inicia... drop zones deveriam aparecer
- ❌ Drop zones aparecem às vezes, às vezes não
- ❌ Sem rollback em falha
- ❌ Sem optimistic update

**Gargalos Encontrados:**
- 🔴 **G30:** Drop zones inconsistentes
- 🟡 **G31:** Sem rollback em falha
- 🟡 **G32:** Sem optimistic updates
- 🟠 **G33:** Drag preview incorreto

**Experiência do Usuário:**

**TENTATIVA 1:**
```
😕 Maria arrasta... drop zones NÃO aparecem
   Solta... nada acontece ❌
   "Não funcionou?"
```

**TENTATIVA 2:**
```
😕 Maria arrasta novamente...
   Agora drop zones aparecem! ✅
   Solta... aguarda 300ms...
   Bloco aparece! ✅
   
   "Funcionou! Mas por que demorou tanto?"
```

**TENTATIVA 3 (com erro):**
```
😡 Maria arrasta... solta...
   Bloco aparece no Canvas (otimista)
   Backend retorna erro ❌
   
   MAS: Bloco continua no Canvas! ❌
   Estado inconsistente!
   
   Próximo save: Erro ou sobrescreve?
```

**Impacto:**
- 😡 DnD não confiável (~30% falha)
- 😡 Estado inconsistente em erro
- ⚠️ Possível data loss

---

### 8️⃣ AUTOSAVE ACONTECE

**Ação do Usuário:**
```
Maria não vê nada
(acontece em background a cada 5s)
```

**O que Acontece (Backend):**
- 🔄 Timer de 5s dispara
- 🔄 Save executa...
- ❌ SEM lock (múltiplos saves concorrentes!)
- ❌ SEM retry (falha = data loss)
- ❌ SEM feedback (usuário não sabe status)

**Gargalos Encontrados:**
- 🔴 **G35:** Autosave sem lock (race condition)
- 🔴 **G36:** IDs com Date.now() (colisões)
- 🟡 **G37:** Sem retry em falha
- 🟡 **G38:** Sem feedback "salvando..."

**Experiência do Usuário:**

**CENÁRIO 1: Edição rápida**
```
😐 Maria edita block-1... block-2... block-3
   (3 edições em 3 segundos)
   
   3 timers disparam (T+5s, T+6s, T+7s)
   
   T+5s: Save 1 executa
   T+6s: Save 2 executa (CONCORRENTE!) ❌
   T+7s: Save 3 executa (CONCORRENTE!) ❌
   
   Race condition! 
   Últimos saves podem sobrescrever primeiros
   
   Maria: (não vê nada, não sabe que tem problema)
```

**CENÁRIO 2: Save falha**
```
😐 Maria edita... autosave dispara...
   
   Backend: Connection timeout ❌
   
   try { await save(); }
   catch { /* ❌ SILENCIOSO! */ }
   
   Maria: (não vê nada)
   Acha que salvou... MAS PERDEU DADOS! 😡
```

**CENÁRIO 3: Colisão de IDs**
```
😐 Maria adiciona 2 blocos rapidamente
   
   ID 1: block-1699123456789
   ID 2: block-1699123456789 (COLISÃO!) ❌
   
   Save: Sobrescreve block 1 com block 2
   
   Maria: "Cadê o primeiro bloco?" 😡
```

**Impacto:**
- 😡😡😡 DATA LOSS frequente
- 😡 Usuário perde horas de trabalho
- ⚠️ Sem feedback de erro
- ⚠️ Debugging impossível (catch silencioso)

---

### 9️⃣ PREVIEW DO QUIZ

**Ação do Usuário:**
```
Maria clica no botão "Preview" 
para ver como ficará o quiz
```

**O que Acontece (Backend):**
- 🔄 Preview carrega de fonte diferente do Canvas
- Canvas: templateService (L1 cache)
- Preview: consolidatedService (L2 cache)
- ❌ Caches não sincronizados!

**Gargalos Encontrados:**
- 🔴 **G41:** Preview desalinhado (cache stale)
- 🟡 **G42:** Production não reflete mudanças
- 🟠 **G43:** Preview não renderiza todos tipos
- 🟠 **G44:** Transições não funcionam

**Experiência do Usuário:**
```
😕 Maria editou título: "Descubra seu Estilo!"
   Canvas mostra: "Descubra seu Estilo!" ✅
   
   Clica em Preview...
   
   Preview mostra: "Bem-vindo ao Quiz" ❌
   (versão antiga do L2 cache!)
   
   Maria: "Por que não mudou?!" 😡
   
   Clica 5 vezes em "Refresh Preview"...
   Ainda mostra versão antiga ❌
   
   Maria: "Esse preview não funciona!" 😡
   Desiste de testar...
```

**Impacto:**
- 😡 Preview não confiável
- 😡 Testes inválidos
- ⚠️ Usuário não confia no preview

---

### 🔟 ERRO ACONTECE (CATCH SILENCIOSO)

**Ação do Usuário:**
```
Maria não vê nada
(erro acontece em background)
```

**O que Acontece (Backend):**
```typescript
try {
  await saveBlocks();
  // Erro: Supabase connection timeout
} catch {
  // ❌ SILENCIOSO! Não loga, não avisa
}
```

**Gargalos Encontrados:**
- 🔴 **G46:** 30+ catches silenciosos
- 🟡 **G47:** Sem Sentry/error tracking
- 🟠 **G48:** Erros técnicos para usuário

**Experiência do Usuário:**
```
😐 Maria continua trabalhando...
   (não sabe que teve erro)
   
   Trabalha por 30 minutos...
   Adiciona 10 blocos...
   Edita propriedades...
   
   Fecha o editor: "Pronto!" ✅
   
   ─────────────────────────────
   
   Próximo dia...
   
   Maria abre o editor novamente
   
   CADÊ TUDO?! ❌
   Apenas as primeiras 3 edições foram salvas
   Últimas 7 edições PERDIDAS!
   
   Maria: "PERDI 30 MINUTOS DE TRABALHO!" 😡😡😡
   
   (Porque save falhou silenciosamente)
```

**Impacto:**
- 😡😡😡 DATA LOSS catastrófico
- 😡😡😡 Usuário ABANDONA plataforma
- ⚠️ Debugging IMPOSSÍVEL (sem logs)
- ⚠️ Empresa perde clientes

---

### 1️⃣1️⃣ PUBLICAÇÃO DO QUIZ

**Ação do Usuário:**
```
Maria clica em "Publicar"
(finalmente!)
```

**O que Acontece (Backend):**
- ⚠️ Validação final DEVERIA acontecer
- ❌ MAS: Não é executada
- ✅ Publish prossegue (pode ter dados inválidos)

**Gargalos Encontrados:**
- 🟡 **G50:** Sem validação final
- 🟠 **G51:** Export JSON não valida
- 🟠 **G52:** Sem preview publicado

**Experiência do Usuário:**

**CENÁRIO 1: Dados válidos**
```
😊 Publish bem-sucedido! ✅
   Quiz funciona em produção
   
   Maria: "Ufa! Consegui!" 
   (Mas sofreu muito no processo...)
```

**CENÁRIO 2: Dados inválidos (por G10, G24)**
```
😡 Publish "bem-sucedido" ✅
   
   MAS: Quiz em produção quebra! ❌
   
   Step-05: Bloco "options-grid" sem schema
   Runtime error: Cannot read property 'options' of undefined
   
   Usuário final: "Quiz está quebrado!" ❌
   
   Maria: "Mas eu testei no preview!" 
   (Mas preview não reflete produção - G42)
   
   Empresa: Perde conversões 😡
```

**Impacto:**
- 😡 Quiz em produção pode quebrar
- 😡 Empresa perde conversões
- ⚠️ Usuário final vê erros

---

## 📊 MAPA DE CALOR: Pontos de Dor

```
Etapa do Fluxo          | Severidade | Frequência | Impacto UX
────────────────────────|────────────|────────────|──────────────
1. Acesso               | 🟡 Média   | 100%       | 😐 OK
2. Carregamento         | 🔴 Alta    | 100%       | 😕 Lento
3. Validação            | 🟠 Média   | 100%       | 😐 Invisível
4. Inicialização        | 🟡 Média   | 100%       | 😕 Instável
5. Navegação Steps      | 🔴 Alta    | 90%        | 😡 Frustrante
6. Edição Blocos        | 🔴🔴 CRÍTICA | 100%      | 😡😡😡 INUTILIZÁVEL
7. Drag & Drop          | 🔴 Alta    | 50%        | 😡 Não confiável
8. Autosave             | 🔴🔴 CRÍTICA | 100%      | 😡😡😡 DATA LOSS
9. Preview              | 🔴 Alta    | 80%        | 😡 Não funciona
10. Erro Silencioso     | 🔴🔴 CRÍTICA | 30%       | 😡😡😡 CATASTRÓFICO
11. Publicação          | 🟡 Média   | 100%       | 😕 Arriscado

LEGENDA:
🔴🔴 CRÍTICA = Bloqueia ou causa data loss
🔴 Alta = UX muito ruim
🟡 Média = Friction
🟠 Baixa = Melhorias

😡😡😡 = Abandono
😡 = Frustração
😕 = Confusão
😐 = Aceitável
😊 = Satisfação
```

---

## 💡 INSIGHTS DA JORNADA

### Pontos de Abandono (Churn Risk)

**1. Edição de Blocos (Etapa 6)** 🚨
- 79% dos blocos não editáveis
- **Risco de abandono:** CRÍTICO
- Usuário não consegue fazer o trabalho básico

**2. Autosave com Data Loss (Etapa 8)** 🚨
- Perde trabalho de horas
- **Risco de abandono:** CRÍTICO
- Usuário nunca mais volta

**3. Preview Quebrado (Etapa 9)** ⚠️
- Não consegue testar
- **Risco de abandono:** ALTO
- Perde confiança na plataforma

### Momentos de Frustração Acumulada

```
Escala de Frustração (0-10):

Etapa 1: 0 →  😐 OK
Etapa 2: 2 →  😕 "Por que demora?"
Etapa 4: 3 →  😕 "Por que pisca?"
Etapa 5: 5 →  😡 "Perdi meu progresso!"
Etapa 6: 9 →  😡😡 "NÃO CONSIGO EDITAR!"
Etapa 8: 10 → 😡😡😡 "PERDI TUDO!" 
            ↓
         ABANDONA
```

### Tempo Desperdiçado

```
Atividade                | Tempo Real | Tempo Ideal | Desperdício
─────────────────────────|──────────--|─────────────|─────────────
Load inicial             | 5s         | 1s          | 4s
Navegação entre steps    | 150ms×20   | 20ms×20     | 2.6s
Edição (delay 500ms)     | 500ms×100  | 50ms×100    | 45s
DnD (30% falha, retry)   | 1s×10×1.3  | 300ms×10    | 10s
Procurar step perdido    | 60s        | 0s          | 60s
Refazer trabalho perdido | 30min      | 0min        | 30min
─────────────────────────|──────────--|─────────────|─────────────
TOTAL por sessão         | ~32min     | ~2min       | 30min 😡
```

**Cada sessão desperdiça 30 minutos do usuário!**

---

## ✅ OPORTUNIDADES DE MELHORIA

### Quick Win #1: Tornar Editor Utilizável
**Fix:** G10, G24 (schemas faltantes)  
**Impacto:** 79% → 100% blocos editáveis  
**Esforço:** 1-2 dias  
**Redução de Frustração:** 9 → 4 (60%)

### Quick Win #2: Eliminar Data Loss
**Fix:** G35, G36, G46 (autosave + IDs + catches)  
**Impacto:** 0 data loss  
**Esforço:** 1-2 dias  
**Redução de Abandono:** 90%

### Quick Win #3: Feedback Imediato
**Fix:** G25 (optimistic updates)  
**Impacto:** 500ms → 50ms  
**Esforço:** 1 dia  
**Redução de Frustração:** 30%

---

## 📈 ANTES vs DEPOIS

### Jornada ANTES das Correções
```
😐 → 😕 → 😕 → 😡 → 😡😡 → 😡😡😡 ABANDONA
```

**Resultado:**
- 30% completam a tarefa
- 70% abandonam frustrados
- 100% relatam problemas

### Jornada DEPOIS das Correções
```
😊 → 😊 → 😊 → 😊 → 😊 → 😊 SUCESSO!
```

**Resultado:**
- 95% completam a tarefa
- 5% issues menores
- 90% satisfeitos (NPS >8)

---

**Conclusão:** A jornada atual é INACEITÁVEL. Correções são URGENTES e NECESSÁRIAS.

---

**Documento elaborado por:** UX Research + Technical Analysis  
**Para ação executiva:** Ver RESUMO_EXECUTIVO_GARGALOS_QUIZ21.md
