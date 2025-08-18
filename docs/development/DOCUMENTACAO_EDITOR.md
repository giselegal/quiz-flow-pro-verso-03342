# Documentação do Editor Quiz Quest Challenge Verse

## 1. Visão Geral do Editor

O Editor é uma ferramenta avançada para criação de quizzes interativos com várias etapas. Ele permite construir um funil completo com diferentes tipos de páginas, incluindo perguntas, resultados e ofertas. A interface foi projetada para ser intuitiva e altamente personalizável.

## 2. Estrutura e Componentes Principais

### 2.1. Organograma do Editor

```
Editor
├─ EditorContext (Contexto Global)
│  ├─ Estado: stages, activeStage, selectedBlock
│  ├─ Ações: gerenciamento de etapas e blocos
│  └─ Estado da UI: modo preview, tamanho do viewport
│
├─ Páginas do Editor
│  ├─ editor-fixed.tsx (Ponto de entrada principal)
│  └─ editor-fixed-dragdrop.tsx (Implementação com drag&drop)
│
├─ Layout Principal (FourColumnLayout)
│  ├─ Painel de Etapas (FunnelStagesPanel)
│  ├─ Painel de Componentes (EnhancedComponentsSidebar)
│  ├─ Canvas Central (CanvasDropZone)
│  └─ Painel de Propriedades (EnhancedUniversalPropertiesPanel)
│
├─ Sistema de Arrastar e Soltar (DND)
│  ├─ DndProvider (Gerencia operações de drag&drop)
│  ├─ DraggableComponentItem (Componentes arrastáveis)
│  └─ SortableBlockItem (Blocos reordenáveis)
│
└─ Definições e Registros
   ├─ Blocos: TextBlock, ImageBlock, ButtonBlock, etc.
   └─ Templates: Modelos pré-definidos para cada etapa
```

### 2.2. Fluxo de Dados

1. **Carregamento Inicial**:
   - O `EditorContext` inicializa 21 etapas (steps) baseadas nos templates
   - Cada etapa é configurada com um tipo específico (intro, question, result, etc.)
   - O estado global mantém a etapa ativa e o bloco selecionado

2. **Interação do Usuário**:
   - Selecionar etapa → Carregar blocos correspondentes no canvas
   - Arrastar componente → Adicionar novo bloco na posição designada
   - Selecionar bloco → Mostrar propriedades no painel direito
   - Editar propriedades → Atualizar bloco no estado global

3. **Persistência**:
   - Mudanças são mantidas no estado do EditorContext
   - Integração com Supabase para armazenamento (opcional)

## 3. Componentes Detalhados

### 3.1. Etapas (Stages)

O editor divide o quiz em 21 etapas pré-definidas:

1. **Introdução**: Apresentação do quiz (etapa-1)
2. **Coleta de Nome**: Captura informações do usuário (etapa-2)
3. **Perguntas (Q1-Q10)**: Questões principais do quiz (etapas 3-12)
4. **Transição**: Mensagem intermediária (etapa-13)
5. **Perguntas Estratégicas (S1-S6)**: Questões adicionais (etapas 14-19)
6. **Resultado**: Exibição do resultado personalizado (etapa-20)
7. **Oferta**: Apresentação da oferta final (etapa-21)

### 3.2. Sistema de Componentes (Blocos)

Cada etapa contém blocos que formam a interface do usuário:

- **Blocos de Conteúdo**: Texto, Imagem, Vídeo, Botão, etc.
- **Blocos de Quiz**: Perguntas, Opções, Seleção Múltipla
- **Blocos de Resultado**: Gráficos, Descrições de Estilo
- **Blocos de Oferta**: Preço, Lista de Benefícios, Botão de Compra

### 3.3. Interface de Arrastar e Soltar (Drag & Drop)

- **Arrastar da Sidebar**: Adiciona novos componentes ao canvas
- **Arrastar no Canvas**: Reordena componentes existentes
- **Zonas de Soltura**: Áreas designadas entre blocos para inserção

### 3.4. Painel de Propriedades

Sistema universal que se adapta ao tipo de bloco selecionado:

- **Propriedades Comuns**: Visibilidade, Classes CSS, Margens
- **Propriedades Específicas**: Texto, URLs de imagem, cores, etc.
- **Conteúdo Dinâmico**: Campos para conteúdo com formatação

## 4. Integração com o Sistema de Quiz

### 4.1. Conexão com StepsContext

O editor trabalha em conjunto com o `StepsContext`, que gerencia:

- A estrutura das 21 etapas do quiz
- A navegação entre etapas durante a execução
- As opções de múltipla escolha para perguntas

### 4.2. Conexão com QuizContext

O `QuizContext` gerencia a lógica de funcionamento do quiz:

- Captura das respostas do usuário
- Cálculo dos resultados baseado nas escolhas
- Determinação do estilo predominante

### 4.3. Integração com Supabase

O sistema está configurado para armazenar dados no Supabase:

- Informações do usuário (nome, email)
- Respostas individuais para cada pergunta
- Resultados calculados e recomendações

## 5. Fluxo de Trabalho no Editor

### 5.1. Criação de um Novo Quiz

1. Acesse o editor através de `/editor-fixed`
2. Configure as etapas necessárias (ou use o modelo padrão de 21 etapas)
3. Selecione cada etapa e adicione os blocos desejados
4. Configure as propriedades de cada bloco
5. Salve o quiz

### 5.2. Personalização de Etapas

1. Selecione uma etapa no painel esquerdo
2. Adicione blocos arrastando componentes da sidebar
3. Reordene blocos conforme necessário
4. Configure cada bloco no painel de propriedades à direita

### 5.3. Visualização e Teste

1. Use o botão de visualização na barra superior
2. Teste o funcionamento do quiz no modo de visualização
3. Volte ao modo de edição para fazer ajustes
4. Verifique a aparência em diferentes tamanhos de tela

## 6. Arquivos Principais e Suas Funções

### 6.1. Contextos

- `/src/context/EditorContext.tsx`: Gerenciamento global do editor
- `/src/context/StepsContext.tsx`: Estrutura das 21 etapas do quiz
- `/src/context/QuizContext.tsx`: Lógica de funcionamento do quiz

### 6.2. Páginas do Editor

- `/src/pages/editor-fixed.tsx`: Ponto de entrada principal
- `/src/pages/editor-fixed-dragdrop.tsx`: Implementação com drag&drop

### 6.3. Componentes do Layout

- `/src/components/editor/layout/FourColumnLayout.tsx`: Layout principal de 4 colunas
- `/src/components/editor/funnel/FunnelStagesPanel.tsx`: Painel de etapas
- `/src/components/editor/EnhancedComponentsSidebar.tsx`: Sidebar de componentes
- `/src/components/editor/canvas/CanvasDropZone.tsx`: Área central do canvas
- `/src/components/universal/EnhancedUniversalPropertiesPanel.tsx`: Painel de propriedades

### 6.4. Sistema de Drag & Drop

- `/src/components/editor/dnd/DndProvider.tsx`: Provedor de funcionalidades drag&drop
- `/src/components/editor/dnd/DraggableComponentItem.tsx`: Item arrastável da sidebar
- `/src/components/editor/dnd/SortableBlockItem.tsx`: Bloco reordenável no canvas

### 6.5. Blocos e Definições

- `/src/components/editor/blocks/`: Implementações dos blocos
- `/src/config/enhancedBlockRegistry.ts`: Registro de todos os blocos disponíveis
- `/src/config/stepTemplatesMapping.ts`: Templates para cada etapa

## 7. Fluxo de Integração com Supabase

1. **Armazenamento de Usuários**:
   - Os dados do participante são salvos na tabela `quiz_users`
   - Cada usuário recebe um ID único e um session_id

2. **Sessão do Quiz**:
   - Uma sessão é criada na tabela `quiz_sessions`
   - Mantém o progresso, pontuação e estado atual

3. **Respostas**:
   - Cada resposta é salva na tabela `quiz_step_responses`
   - Contém a pergunta, resposta e pontuação associada

4. **Resultados**:
   - O resultado final é calculado e salvo em `quiz_results`
   - Inclui o estilo predominante e estilos secundários

## 8. Considerações Técnicas

- O editor utiliza React com TypeScript
- A funcionalidade de drag&drop é implementada com @dnd-kit
- O layout é responsivo e adaptável a diferentes tamanhos de tela
- Os componentes são estruturados para máxima reutilização
- A persistência dos dados é gerenciada através do Supabase
