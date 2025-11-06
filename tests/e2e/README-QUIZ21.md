# 🧪 E2E Tests - Quiz 21 Steps Complete

Testes end-to-end completos para validar o fluxo do quiz de 21 etapas.

## 📁 Arquivos de Teste

### Quiz 21 Steps - Fluxo Completo
**Arquivo**: `quiz21-complete-flow.spec.ts`

Testa o fluxo completo do usuário através das 21 etapas:
- ✅ Step 01 (Intro): Formulário de nome
- ✅ Steps 02-11 (Questions): Seleção múltipla (3 opções)
- ✅ Step 12 (Transition): Transição intermediária
- ✅ Steps 13-18 (Strategic): Seleção única (1 opção)
- ✅ Step 19 (Transition Result): Processamento de resultado
- ✅ Step 20 (Result): Exibição de resultado calculado
- ✅ Step 21 (Offer): Oferta final

**Testes incluídos**:
1. Fluxo completo de 21 etapas
2. Navegação backward (voltar)
3. Indicador de progresso
4. Validação de seleção mínima
5. Persistência de dados (localStorage)
6. Performance do fluxo

### Quiz 21 Steps - Validações
**Arquivo**: `quiz21-validation.spec.ts`

Testa casos específicos de validação:
- ✅ Campo de nome obrigatório
- ✅ Seleção mínima em multi-select (3 opções)
- ✅ Seleção máxima em multi-select (3 opções)
- ✅ Erro ao tentar avançar sem responder
- ✅ Verificação de blocos "Sem conteúdo"
- ✅ Carregamento de imagens
- ✅ Clicabilidade de botões
- ✅ Responsividade mobile
- ✅ Acessibilidade básica

## 🚀 Como Executar

### Executar todos os testes E2E
```bash
npm run test:e2e
```

### Executar apenas testes do Quiz 21
```bash
# Fluxo completo
npx playwright test quiz21-complete-flow

# Validações
npx playwright test quiz21-validation

# Ambos
npx playwright test quiz21
```

### Executar com UI interativa
```bash
npx playwright test --ui
```

### Executar em modo debug
```bash
npx playwright test --debug quiz21-complete-flow
```

### Executar em navegador específico
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Executar em modo headed (visualizar navegador)
```bash
npx playwright test --headed quiz21-complete-flow
```

## 📊 O Que É Testado

### Navegação
- ✅ Avançar pelas 21 etapas
- ✅ Voltar para etapa anterior
- ✅ Auto-advance após seleção
- ✅ Transições entre steps

### Seleção de Opções
- ✅ Multi-select (3 opções obrigatórias)
- ✅ Single-select (1 opção obrigatória)
- ✅ Validação de mínimo/máximo
- ✅ Visual feedback de seleção

### Formulários
- ✅ Campo de nome obrigatório
- ✅ Validação de entrada
- ✅ Persistência de dados
- ✅ Estados de erro

### Resultado
- ✅ Cálculo correto baseado em respostas
- ✅ Exibição de nome do usuário
- ✅ Descrição personalizada
- ✅ Transição para oferta

### Oferta
- ✅ Título e descrição
- ✅ Lista de benefícios
- ✅ CTA clicável
- ✅ Layout correto

### Performance
- ✅ Tempo de carregamento < 3s por step
- ✅ Transições suaves
- ✅ Sem travamentos
- ✅ Imagens otimizadas

### Qualidade
- ✅ Nenhum bloco "Sem conteúdo"
- ✅ Todas as imagens carregam
- ✅ Todos os botões clicáveis
- ✅ Layout responsivo
- ✅ Acessibilidade básica

## 📸 Screenshots

Os testes capturam screenshots em:
- `tests/e2e/screenshots/quiz21-result.png` - Página de resultado
- `tests/e2e/screenshots/quiz21-offer.png` - Página de oferta
- `tests/e2e/screenshots/error-*.png` - Erros encontrados

## 🔧 Configuração

### Timeout
Testes do Quiz 21 têm timeout de **3 minutos** para permitir fluxo completo.

### Viewport
- Desktop: 1280x720 (padrão)
- Mobile: 375x667 (iPhone 12)

### Navegadores
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)
- Mobile Chrome
- Mobile Safari

## 🐛 Debug

### Ver logs detalhados
Os testes exibem logs no console para cada step:
```
🚀 Iniciando teste de fluxo completo...
📝 Step 01: Intro
  ✓ Título encontrado
  ✓ Nome preenchido e enviado
✅ Step 01: Nome preenchido e enviado
📊 Step 02: Question (multi-select)
  ✓ Encontradas 6 opções
  ✓ Opção 1/3 selecionada
  ...
```

### Capturar traces
Para debug avançado, habilite traces:
```bash
npx playwright test --trace on
```

Visualizar trace:
```bash
npx playwright show-trace trace.zip
```

### Modo slowmo
Para visualizar ações em câmera lenta:
```bash
npx playwright test --headed --slow-mo=1000
```

## 📈 Relatórios

### HTML Report
Após executar testes:
```bash
npx playwright show-report
```

### JSON Report
```bash
npx playwright test --reporter=json
```

## ✅ Checklist de Testes

- [x] Intro (Step 01) renderiza corretamente
- [x] Nome é capturado e persistido
- [x] Perguntas principais (Steps 02-11) renderizam
- [x] Seleção múltipla (3 opções) funciona
- [x] Auto-advance após seleção funciona
- [x] Transição (Step 12) exibe corretamente
- [x] Perguntas estratégicas (Steps 13-18) renderizam
- [x] Seleção única (1 opção) funciona
- [x] Transição de resultado (Step 19) funciona
- [x] Resultado (Step 20) é calculado e exibido
- [x] Nome do usuário aparece no resultado
- [x] Oferta (Step 21) é exibida
- [x] Benefícios da oferta são listados
- [x] CTA da oferta está presente
- [x] Navegação backward funciona
- [x] Progresso é exibido corretamente
- [x] Validações de formulário funcionam
- [x] Nenhum bloco "Sem conteúdo"
- [x] Todas as imagens carregam
- [x] Performance adequada
- [x] Layout responsivo
- [x] Acessibilidade básica

## 🔗 Links Úteis

- [Playwright Docs](https://playwright.dev/)
- [Quiz 21 Template](../../src/templates/quiz21StepsComplete.ts)
- [Block Complexity Map](../../src/config/block-complexity-map.ts)
- [Auditoria de Blocos](../../docs/AUDITORIA_BLOCOS_QUIZ21.md)
