# Checklist Completo de Verificação da Etapa 01

## 1. Componentes

- [ ] quiz-intro-header
- [ ] text-inline
- [ ] image-inline
- [ ] lead-form
- [ ] accessibility-skip-link

## 2. IDs de Componentes

- [ ] Verificar se todos os IDs são únicos
- [ ] Verificar se seguem o padrão "step01-\*"
- [ ] Verificar se estão registrados no Supabase

## 3. Coleta de Nome do Usuário

- [ ] Formulário possui campo de nome
- [ ] Campo tem label correto
- [ ] Placeholder está configurado
- [ ] Botão de submissão tem texto adequado
- [ ] Integração com estado global

## 4. Arquivos JSON

- [ ] Metadata correta (id, name, description, etc)
- [ ] Design configurado (cores, fontes, etc)
- [ ] Layout responsivo
- [ ] Blocos definidos corretamente
- [ ] Validações configuradas
- [ ] Analytics configurados
- [ ] Lógica de navegação definida

## 5. Arquivos TSX

- [ ] Imports corretos
- [ ] Componente usa ConnectedTemplateWrapper
- [ ] Props corretas (sessionId, onNext)
- [ ] Estrutura de UI adequada
- [ ] Integração com hooks do quiz

## 6. Painel de Propriedades

- [ ] Propriedades específicas para cada tipo de componente
- [ ] Todas as propriedades editáveis
- [ ] Previews funcionando
- [ ] Valores padrão corretos

## 7. Validações

- [ ] validateName implementado
- [ ] validateRequired implementado
- [ ] validateMinLength implementado
- [ ] validateMaxLength implementado
- [ ] Mensagens de erro configuradas

## 8. Hooks Configurados

- [ ] useQuizLogic
- [ ] useSupabaseQuiz
- [ ] useUserProgress
- [ ] Hooks utilizados corretamente no Step01Template.tsx

## 9. Schema de Dados

- [ ] Interface/Type para User
- [ ] Interface/Type para Quiz
- [ ] Interface/Type para Template
- [ ] Interface/Type para Block
- [ ] Tipagem correta de propriedades

## 10. Integração com Supabase

- [ ] Função saveUserData
- [ ] Função saveQuizProgress
- [ ] Função getUserData
- [ ] Tabelas configuradas corretamente
- [ ] Integração com hooks

## 11. Index e Layout

- [ ] Referência ao Step01 ou Quiz no index.tsx
- [ ] Uso de Layout
- [ ] Rotas para Step01 configuradas
- [ ] Layout.tsx com Header, Footer e Main
- [ ] Componentes de navegação

## 12. Consistência com quiz21StepsComplete.ts

- [ ] Estrutura de blocos compatível
- [ ] Mesmos tipos de componentes
- [ ] Configurações de propriedades semelhantes
- [ ] Navegação configurada corretamente

## Observações Adicionais

- Adicione aqui quaisquer notas ou problemas específicos encontrados durante a verificação
