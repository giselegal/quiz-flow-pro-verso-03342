# Documentação: Editor Unificado com Etapas do Quiz

## Integração do Editor Unificado com quiz21StepsComplete

### Componentes principais:

1. **EditorUnified.tsx**
   - Componente principal da página do editor unificado
   - Integra todos os componentes do sistema

2. **UnifiedQuizStepLoader**
   - Responsável por carregar os blocos de cada etapa do quiz
   - Converte os dados do template para o formato do editor

3. **quiz21StepsRenderer.ts**
   - Utilitário que transforma dados do template em blocos do editor
   - Mapeia tipos de blocos e processa conteúdo

### Fluxo de funcionamento:

1. Quando o usuário navega para uma etapa no `EditorStageManager`:
   - O método `handleStepSelect` é chamado
   - Atualiza o estado local (`currentStep`)
   - Chama `actions.goToStep` do `useQuizFlow`
   - Atualiza o `activeStageId` no `EditorContext`

2. O `UnifiedQuizStepLoader` detecta a mudança no `stepNumber`:
   - Carrega os blocos da etapa usando `loadStepBlocks`
   - Atualiza o estado do editor com os novos blocos
   - Exibe feedback visual durante o carregamento

3. O `UnifiedPreviewEngine` renderiza os blocos:
   - Recebe `currentBlocks` do `EditorContext`
   - A prop `key` força a recriação quando a etapa muda
   - Permite edição ou visualização de acordo com `editorMode`

### Melhores práticas:

1. **Navegação entre etapas:**
   - Use `handleStepSelect` para navegação programática
   - O `EditorStageManager` controla a navegação na UI

2. **Edição de blocos:**
   - Selecione um bloco no preview para editar propriedades
   - As alterações são armazenadas no `EditorContext`

3. **Modos de visualização:**
   - `edit`: Permite selecionar e editar blocos
   - `preview`: Mostra como o quiz ficará para o usuário
   - `test`: Permite testar a navegação do quiz

### Resolução de problemas:

Se os blocos não aparecerem corretamente:

1. Verifique o console para erros
2. Certifique-se de que `UnifiedQuizStepLoader` está integrado
3. Verifique se a etapa existe em `QUIZ_STYLE_21_STEPS_TEMPLATE`
