# 🧪 Testes E2E - Sistema DND (Drag and Drop)

## 📋 Visão Geral

Suite completa de testes end-to-end para o sistema DND implementado nas **FASE 1 + FASE 2** do plano de ativação.

### 🎯 Cobertura

- ✅ **8 Suites** com 30+ testes
- ✅ **Mouse/Pointer**: PointerSensor com distance 5px
- ✅ **Teclado**: KeyboardSensor com sortableKeyboardCoordinates
- ✅ **Touch/Mobile**: TouchSensor com delay 250ms
- ✅ **Colisão Híbrida**: closestCorners → pointerWithin → closestCenter
- ✅ **Visual Feedback**: Preview premium, linha azul, indicadores
- ✅ **Performance**: FPS, tempo de resposta, memory leaks
- ✅ **Visual Regression**: Snapshots do preview e indicadores
- ✅ **Edge Cases**: Canvas vazio, drags inválidos, heights variadas

---

## 🚀 Quick Start

### 1️⃣ Rodar Todos os Testes DND

```bash
# Com config específica (recomendado)
npm run test:e2e:dnd

# Ou manualmente
npx playwright test tests/e2e/dnd-system.spec.ts --config=playwright.dnd.config.ts
```

### 2️⃣ Rodar Suite Específica

```bash
# Mouse/Pointer
npx playwright test -g "DND - Mouse/Pointer"

# Teclado
npx playwright test -g "DND - Teclado"

# Touch/Mobile
npx playwright test -g "DND - Touch/Mobile"

# Performance
npx playwright test -g "DND - Performance"
```

### 3️⃣ Modo Debug (Headed + Slow Motion)

```bash
npx playwright test tests/e2e/dnd-system.spec.ts --project=debug-dnd
```

### 4️⃣ UI Mode (Interativo)

```bash
npx playwright test tests/e2e/dnd-system.spec.ts --ui
```

---

## 📁 Estrutura dos Testes

### **SUITE 1: Inicialização & Carregamento DND**
- Carrega @dnd-kit sem erros React APIs
- Verifica SafeDndContext renderizado
- Valida blocos arrastáveis no canvas

### **SUITE 2: Drag com Mouse (PointerSensor)**
- ✅ Drag com distance 5px
- ✅ Preview premium (gradiente, ícone 2x2, badge)
- ✅ Indicador de drop (linha azul, círculos, label "#N")
- ✅ Animação cubic-bezier 300ms
- ✅ Taxa de sucesso >=95% em múltiplos drags

### **SUITE 3: Navegação por Teclado (KeyboardSensor)**
- ✅ Navegar com Tab
- ✅ Mover com Space + Setas (↑/↓)
- ✅ Cancelar com Escape
- ✅ Anúncios ARIA básicos

### **SUITE 4: Touch/Mobile (TouchSensor)**
- ✅ Drag com delay 250ms
- ✅ Distinguir scroll de drag
- ✅ Visual feedback responsivo (min-w-280px)

### **SUITE 5: Estratégia de Colisão Híbrida**
- ✅ closestCorners para listas verticais
- ✅ pointerWithin quando cursor dentro
- ✅ closestCenter como fallback

### **SUITE 6: Performance & Estresse**
- ✅ FPS >30 durante drag com 10+ blocos
- ✅ Tempo de resposta <100ms para ativar
- ✅ Limpeza de event listeners

### **SUITE 7: Visual Regression**
- 📸 Snapshot: Canvas idle
- 📸 Snapshot: Preview premium durante drag
- 📸 Snapshot: Indicador de drop com linha azul

### **SUITE 8: Edge Cases & Robustez**
- ✅ Canvas vazio sem erros
- ✅ Cancelar drag ao sair da viewport
- ✅ Ignorar drags em modo não-editável
- ✅ Recuperar de erros de colisão
- ✅ Lidar com blocos de alturas variadas

---

## 🎯 Métricas de Sucesso

| Métrica | Antes (FASE 0) | Depois (FASE 1+2) | Teste |
|---------|----------------|-------------------|-------|
| **Taxa de sucesso** | ~40% | **>=95%** | `test:e2e:dnd -g "taxa de sucesso"` |
| **Tempo de resposta** | 150ms (delay) | **<100ms** | `test:e2e:dnd -g "tempo de resposta"` |
| **FPS durante drag** | ~20 FPS | **>30 FPS** | `test:e2e:dnd -g "FPS"` |
| **Suporte mobile** | ❌ | ✅ | `test:e2e:dnd -g "Touch/Mobile"` |
| **Acessibilidade** | ❌ | ✅ | `test:e2e:dnd -g "Teclado"` |

---

## 🛠️ Comandos npm

Adicione ao `package.json`:

```json
{
  "scripts": {
    "test:e2e:dnd": "playwright test tests/e2e/dnd-system.spec.ts --config=playwright.dnd.config.ts",
    "test:e2e:dnd:ui": "playwright test tests/e2e/dnd-system.spec.ts --config=playwright.dnd.config.ts --ui",
    "test:e2e:dnd:headed": "playwright test tests/e2e/dnd-system.spec.ts --config=playwright.dnd.config.ts --headed",
    "test:e2e:dnd:debug": "playwright test tests/e2e/dnd-system.spec.ts --project=debug-dnd",
    "test:e2e:dnd:mouse": "playwright test tests/e2e/dnd-system.spec.ts -g 'Mouse/Pointer'",
    "test:e2e:dnd:keyboard": "playwright test tests/e2e/dnd-system.spec.ts -g 'Teclado'",
    "test:e2e:dnd:mobile": "playwright test tests/e2e/dnd-system.spec.ts -g 'Touch/Mobile' --project=mobile-chrome-dnd",
    "test:e2e:dnd:performance": "playwright test tests/e2e/dnd-system.spec.ts -g 'Performance'",
    "test:e2e:dnd:visual": "playwright test tests/e2e/dnd-system.spec.ts -g 'Visual Regression'",
    "test:e2e:dnd:update-snapshots": "playwright test tests/e2e/dnd-system.spec.ts -g 'Visual Regression' --update-snapshots"
  }
}
```

---

## 📊 Relatórios

### HTML Report
```bash
npx playwright show-report test-results/dnd-report
```

### JSON Results
```bash
cat test-results/dnd-results.json | jq '.suites[] | {name: .suites[].title, tests: .suites[].specs | length}'
```

### Screenshots de Falhas
```
test-results/
├── dnd-system-spec-Mouse-Pointer-deve-arrastar-bloco-chromium/
│   ├── test-failed-1.png
│   └── trace.zip
└── ...
```

---

## 🐛 Troubleshooting

### ❌ "Blocos não encontrados"

**Causa**: Canvas ainda carregando ou seletor incorreto.

**Solução**:
```typescript
// Aumentar timeout
await page.locator('[data-block-id]').first().waitFor({ timeout: 15000 });

// Ou usar seletor alternativo
const blocks = page.locator('[data-block-id]').or(page.locator('[data-testid^="block-"]'));
```

### ❌ "Drag não funcionou"

**Causa**: Distance constraint de 5px não atingido.

**Solução**:
```typescript
// Mover PELO MENOS 6px
await page.mouse.move(x + 6, y); // ✅
await page.mouse.move(x + 3, y); // ❌ Não ativa sensor
```

### ❌ "Timeout ao aguardar preview"

**Causa**: Animação cubic-bezier 300ms + delay de renderização.

**Solução**:
```typescript
// Aguardar animação completa
await page.waitForTimeout(500); // 300ms animation + 200ms buffer
```

### ❌ "Taxa de sucesso baixa"

**Causa**: Animações não completadas entre drags.

**Solução**:
```typescript
await dragBlock(page, 0, 1);
await page.waitForTimeout(500); // ✅ Aguardar animação
await dragBlock(page, 1, 2);    // Próximo drag
```

### ❌ "Touch não funciona"

**Causa**: TouchSensor requer delay de 250ms.

**Solução**:
```typescript
await page.touchscreen.tap(x, y);
await page.waitForTimeout(300); // ✅ Delay 250ms + margem
// Agora pode arrastar
```

---

## 🔍 Debug Tips

### 1. Slow Motion
```bash
npx playwright test --project=debug-dnd
# ou
PWDEBUG=1 npx playwright test tests/e2e/dnd-system.spec.ts
```

### 2. Pausar em Ponto Específico
```typescript
await page.pause(); // Abre Playwright Inspector
```

### 3. Logs de Colisão
```typescript
page.on('console', msg => {
    if (msg.text().includes('collision') || msg.text().includes('dnd')) {
        console.log('🔍', msg.text());
    }
});
```

### 4. Visual do Mouse
```typescript
await page.mouse.move(x, y);
await page.screenshot({ path: 'debug-mouse-position.png' });
```

### 5. Estado dos Blocos
```typescript
const blocks = await getCanvasBlocks(page);
for (let i = 0; i < await blocks.count(); i++) {
    const text = await blocks.nth(i).textContent();
    const bbox = await blocks.nth(i).boundingBox();
    console.log(`Bloco ${i}:`, text?.substring(0, 20), bbox);
}
```

---

## 📚 Referências

- **Plano de Ativação**: `PLANO_ATIVACAO_DND.md`
- **Status Implementação**: `FASE2_DND_COMPLETA.md`
- **Código Fonte**: `src/components/editor/quiz/QuizModularEditor/components/SafeDndContext.tsx`
- **Playwright Docs**: https://playwright.dev/docs/api/class-page
- **@dnd-kit Docs**: https://docs.dndkit.com/

---

## 🎉 Próximos Passos

### ✅ Validação Completa
```bash
# 1. Rodar todos testes
npm run test:e2e:dnd

# 2. Verificar relatório
npx playwright show-report test-results/dnd-report

# 3. Atualizar snapshots se necessário
npm run test:e2e:dnd:update-snapshots
```

### 🚀 Implementar FASE 3 (Virtualização)
- Instalar react-window
- Adicionar testes para listas >50 blocos
- Validar performance com virtualização

### 🎨 Implementar FASE 4 (Acessibilidade Avançada)
- Adicionar testes para anúncios ARIA customizados
- Validar conformidade WCAG 2.1 AA
- Testes com screen readers (voice over, NVDA)

---

**Autor**: Sistema de Testes E2E Automatizado  
**Data**: 27 de Novembro de 2025  
**Versão**: 1.0.0  
**Status**: ✅ Completo e Funcional
