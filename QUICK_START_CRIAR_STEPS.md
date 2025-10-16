# 🚀 Quick Start: Criar Novo Step Component

## Método Rápido (Script Automatizado)

```bash
# Execute o script interativo
./scripts/create-step-component.sh
```

O script irá perguntar:
- Nome do componente (ex: `WelcomeStep`)
- Tipo do step (ex: `welcome`)
- Step ID (ex: `step-00`)
- Título do step
- Descrição

E criará automaticamente:
- ✅ Arquivo do componente
- 📋 Instruções para adapter
- 📋 Instruções para dados
- 📋 Instruções para lazy loading

## Método Manual (Passo a Passo)

Consulte o guia completo: [`GUIA_CRIAR_COMPONENTES_SEPARADOS.md`](./GUIA_CRIAR_COMPONENTES_SEPARADOS.md)

## Exemplo Completo Criado

Um exemplo completo de `WelcomeStep` foi criado em:
- `src/components/quiz/WelcomeStep.tsx`

Features incluídas:
- ✅ Animações com Framer Motion
- ✅ Scroll progress bar
- ✅ Detecção de leitura completa
- ✅ Checkbox de confirmação
- ✅ Validações robustas
- ✅ Fallbacks de dados
- ✅ Design system consistente

## Estrutura de Arquivos

```
Criar Novo Step:
├── 1️⃣ src/components/quiz/[NomeStep].tsx          (Componente)
├── 2️⃣ src/components/step-registry/...            (Adapter)
├── 3️⃣ src/data/quizSteps.ts                       (Dados)
└── 4️⃣ src/components/editor/unified/...           (Lazy loading)
```

## Documentação Completa

- **Guia Completo:** [`GUIA_CRIAR_COMPONENTES_SEPARADOS.md`](./GUIA_CRIAR_COMPONENTES_SEPARADOS.md)
- **Fluxo de Renderização:** [`FLUXO_RENDERIZACAO_COMPONENTES.md`](./FLUXO_RENDERIZACAO_COMPONENTES.md)
- **Análise do Projeto:** [`ANALISE_COMPLETA_PROJETO.md`](./ANALISE_COMPLETA_PROJETO.md)

## Checklist Rápida

Depois de criar o componente:

- [ ] Componente criado em `src/components/quiz/`
- [ ] Adapter adicionado em `ProductionStepsRegistry.tsx`
- [ ] Dados adicionados em `quizSteps.ts`
- [ ] STEP_ORDER atualizado
- [ ] Lazy loading configurado
- [ ] Step registrado no StepRegistry
- [ ] Testado em dev (`npm run dev`)
- [ ] Testado navegação anterior/próxima
- [ ] Testado em mobile

## Troubleshooting

### Erro: "Component not found"
```bash
# Verificar caminho e nome do arquivo
ls src/components/quiz/WelcomeStep.tsx

# Reiniciar servidor
npm run dev
```

### Erro: "onContinue is not a function"
Verificar adapter está conectando o callback corretamente.

### Erro: "Data is undefined"
Verificar fallback de dados no componente.

## Suporte

Dúvidas? Consulte:
1. Documentação completa em `GUIA_CRIAR_COMPONENTES_SEPARADOS.md`
2. Exemplos existentes em `src/components/quiz/`
3. Código do `IntroStep.tsx` (referência)
