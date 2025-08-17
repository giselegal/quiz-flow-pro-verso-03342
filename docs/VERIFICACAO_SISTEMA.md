# Sistema de Verificação do Quiz - 21 Etapas

Este documento descreve o sistema de verificação implementado para garantir a qualidade e consistência do quiz de 21 etapas.

## Verificações Implementadas

### 1. Componentes

- [x] quiz-intro-header
- [x] text-inline
- [x] image-inline
- [x] lead-form
- [x] accessibility-skip-link
- [x] call-to-action
- [x] navigation-buttons

### 2. IDs de Componentes

- [x] Verificação de unicidade de IDs
- [x] Padrão "step01-\*" para primeira etapa
- [x] Conexão com Supabase
- [x] Integração com eventos

### 3. Navegação

- [x] Configuração de botões CTA
- [x] URLs de próximas etapas
- [x] Parâmetros de navegação
- [x] Auto-avanço
- [x] Estilização de botões

### 4. Coleta de Nome

- [x] Campo de nome no formulário
- [x] Labels corretos
- [x] Placeholders
- [x] Texto do botão
- [x] Integração com estado
- [x] Persistência entre etapas

### 5. Configurações JSON

- [x] Metadata
- [x] Design
- [x] Layout responsivo
- [x] Blocos
- [x] Validações
- [x] Analytics
- [x] Navegação

### 6. Schema e Hooks

- [x] Interfaces de tipos
- [x] Hooks necessários
- [x] Uso correto no template
- [x] Integração com Supabase

## Scripts de Verificação

1. **verificador-21-etapas.js**
   - Verifica a estrutura completa do quiz
   - Valida componentes e configurações
   - Checa navegação e formulários

2. **verificador-schema-hooks.js**
   - Verifica interfaces e tipos
   - Valida implementação dos hooks
   - Checa uso correto no template

3. **verificar-sistema.js**
   - Script principal que executa todas as verificações
   - Gera relatório completo
   - Indica sucesso/falha de cada etapa

## Como Usar

```bash
# Executar todas as verificações
node scripts/verificar-sistema.js

# Verificar apenas as 21 etapas
node scripts/verificador-21-etapas.js

# Verificar apenas schema e hooks
node scripts/verificador-schema-hooks.js
```

## Resultados

O sistema irá gerar um relatório detalhado indicando:

- ✅ Itens verificados com sucesso
- ❌ Problemas encontrados
- 📋 Sugestões de correção

## Manutenção

Para adicionar novas verificações:

1. Crie uma nova função de verificação
2. Adicione ao script apropriado
3. Atualize esta documentação

## Observações

- Mantenha os padrões de código
- Atualize verificações conforme necessário
- Document quaisquer alterações
