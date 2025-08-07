# 📚 Documentação dos Componentes Quiz

## 🎯 Componentes Disponíveis

### 1. 📝 **Text Inline** (`text-inline`)

**Descrição**: Componente para textos formatáveis com suporte a múltiplas cores e estilos.

#### 🔧 Propriedades Configuráveis:

| Propriedade                   | Tipo   | Categoria | Descrição         | Valores                               |
| ----------------------------- | ------ | --------- | ----------------- | ------------------------------------- |
| `text`                        | TEXT   | content   | Conteúdo do texto | Texto livre                           |
| `fontSize`                    | SELECT | style     | Tamanho da fonte  | xs, sm, base, lg, xl, 2xl, 3xl        |
| `fontWeight`                  | SELECT | style     | Peso da fonte     | light, normal, medium, semibold, bold |
| `textColor`                   | COLOR  | style     | Cor do texto      | Qualquer cor                          |
| `backgroundColor`             | COLOR  | style     | Cor de fundo      | Qualquer cor                          |
| `textAlign`                   | SELECT | alignment | Alinhamento       | left, center, right, justify          |
| `marginTop/Bottom/Left/Right` | RANGE  | style     | Margens           | -40px a 100px                         |

---

### 2. 🏠 **Quiz Intro Header** (`quiz-intro-header`)

**Descrição**: Cabeçalho do quiz com logo, título e barra de progresso.

#### 🔧 Propriedades Configuráveis:

| Propriedade       | Tipo     | Categoria | Descrição            | Valores                                |
| ----------------- | -------- | --------- | -------------------- | -------------------------------------- |
| `logoUrl`         | TEXT     | content   | URL do logo          | Link da imagem                         |
| `logoAlt`         | TEXT     | content   | Texto alternativo    | Descrição                              |
| `logoWidth`       | RANGE    | style     | Largura do logo      | 32px a 200px                           |
| `logoHeight`      | RANGE    | style     | Altura do logo       | 32px a 200px                           |
| `title`           | TEXT     | content   | Título principal     | Texto livre                            |
| `subtitle`        | TEXT     | content   | Subtítulo            | Texto livre                            |
| `description`     | TEXTAREA | content   | Descrição detalhada  | Texto longo                            |
| `progressValue`   | NUMBER   | content   | Valor do progresso   | 0 a 100                                |
| `showProgress`    | SWITCH   | content   | Mostrar progresso    | true/false                             |
| `showBackButton`  | SWITCH   | behavior  | Mostrar botão voltar | true/false                             |
| `headerStyle`     | SELECT   | style     | Estilo do cabeçalho  | centered, left, right                  |
| `backgroundColor` | SELECT   | style     | Cor de fundo         | transparent, primary, secondary, muted |

---

### 3. 🖼️ **Image Display** (`image-display-inline`)

**Descrição**: Componente para exibir imagens responsivas com controles de layout.

#### 🔧 Propriedades Configuráveis:

| Propriedade    | Tipo   | Categoria | Descrição         | Valores                          |
| -------------- | ------ | --------- | ----------------- | -------------------------------- |
| `src`          | TEXT   | content   | URL da imagem     | Link da imagem                   |
| `alt`          | TEXT   | content   | Texto alternativo | Descrição                        |
| `width`        | SELECT | style     | Largura           | 25%, 50%, 75%, 100%, auto        |
| `height`       | SELECT | style     | Altura            | auto, 200px, 300px, 400px, 500px |
| `borderRadius` | RANGE  | style     | Arredondamento    | 0px a 50px                       |
| `shadow`       | SWITCH | style     | Sombra            | true/false                       |
| `alignment`    | SELECT | layout    | Alinhamento       | left, center, right              |

---

### 4. 🎯 **Button Inline** (`button-inline`)

**Descrição**: Botão CTA customizável com efeitos visuais e validação.

#### 🔧 Propriedades Configuráveis:

| Propriedade          | Tipo   | Categoria | Descrição           | Valores                                               |
| -------------------- | ------ | --------- | ------------------- | ----------------------------------------------------- |
| `text`               | TEXT   | content   | Texto do botão      | Texto livre                                           |
| `variant`            | SELECT | style     | Estilo do botão     | primary, secondary, success, warning, danger, outline |
| `size`               | SELECT | style     | Tamanho             | small, medium, large                                  |
| `backgroundColor`    | COLOR  | style     | Cor de fundo        | Qualquer cor                                          |
| `textColor`          | COLOR  | style     | Cor do texto        | Qualquer cor                                          |
| `borderColor`        | COLOR  | style     | Cor da borda        | Qualquer cor                                          |
| `fontSize`           | RANGE  | style     | Tamanho da fonte    | 12px a 24px                                           |
| `fontFamily`         | SELECT | style     | Família da fonte    | inherit, Inter, Roboto, Open Sans, Playfair Display   |
| `fontWeight`         | SELECT | style     | Peso da fonte       | 300, 400, 500, 600, 700                               |
| `action`             | SELECT | behavior  | Ação do botão       | none, next-step, url                                  |
| `nextStepId`         | SELECT | behavior  | Próxima etapa       | Lista de etapas disponíveis                           |
| `url`                | TEXT   | behavior  | URL de destino      | Link                                                  |
| `target`             | SELECT | behavior  | Destino do link     | \_blank, \_self                                       |
| `icon`               | SELECT | style     | Ícone               | none, arrow-right, download, play, star               |
| `iconPosition`       | SELECT | style     | Posição do ícone    | left, right                                           |
| `requiresValidInput` | SWITCH | behavior  | Requer input válido | true/false                                            |
| `disabled`           | SWITCH | behavior  | Desabilitado        | true/false                                            |
| `shadowType`         | SELECT | style     | Tipo de sombra      | none, small, medium, large, inner, glow               |
| `shadowColor`        | COLOR  | style     | Cor da sombra       | Qualquer cor                                          |
| `effectType`         | SELECT | style     | Efeito visual       | none, gradient, hover-lift, pulse, shine, bounce      |
| `borderRadius`       | RANGE  | style     | Raio da borda       | 0px a 50px                                            |
| `hoverOpacity`       | RANGE  | style     | Opacidade no hover  | 50% a 100%                                            |

---

### 5. 📋 **Form Input** (`form-input`)

**Descrição**: Campo de entrada de dados com validação e estilos customizáveis.

#### 🔧 Propriedades Configuráveis:

| Propriedade       | Tipo   | Categoria | Descrição         | Valores                                             |
| ----------------- | ------ | --------- | ----------------- | --------------------------------------------------- |
| `label`           | TEXT   | content   | Rótulo do campo   | Texto livre                                         |
| `placeholder`     | TEXT   | content   | Texto placeholder | Texto livre                                         |
| `inputType`       | SELECT | behavior  | Tipo de input     | text, email, tel, number, password                  |
| `required`        | SWITCH | behavior  | Campo obrigatório | true/false                                          |
| `name`            | TEXT   | behavior  | Nome do campo     | Identificador                                       |
| `backgroundColor` | COLOR  | style     | Cor de fundo      | Qualquer cor                                        |
| `borderColor`     | COLOR  | style     | Cor da borda      | Qualquer cor                                        |
| `textColor`       | COLOR  | style     | Cor do texto      | Qualquer cor                                        |
| `labelColor`      | COLOR  | style     | Cor do rótulo     | Qualquer cor                                        |
| `fontSize`        | RANGE  | style     | Tamanho da fonte  | 12px a 24px                                         |
| `fontFamily`      | SELECT | style     | Família da fonte  | inherit, Inter, Roboto, Open Sans, Playfair Display |
| `fontWeight`      | SELECT | style     | Peso da fonte     | 300, 400, 500, 600, 700                             |
| `borderRadius`    | RANGE  | style     | Arredondamento    | 0px a 20px                                          |

---

### 6. ⚖️ **Legal Notice** (`legal-notice-inline`)

**Descrição**: Aviso legal com links para política de privacidade e termos.

#### 🔧 Propriedades Configuráveis:

| Propriedade       | Tipo   | Categoria | Descrição                  | Valores                                             |
| ----------------- | ------ | --------- | -------------------------- | --------------------------------------------------- |
| `privacyText`     | TEXT   | content   | Texto política privacidade | Texto livre                                         |
| `copyrightText`   | TEXT   | content   | Texto de copyright         | Texto livre                                         |
| `termsText`       | TEXT   | content   | Texto termos de uso        | Texto livre                                         |
| `fontSize`        | RANGE  | style     | Tamanho da fonte           | 10px a 20px                                         |
| `fontFamily`      | SELECT | style     | Família da fonte           | inherit, Inter, Roboto, Open Sans, Playfair Display |
| `fontWeight`      | SELECT | style     | Peso da fonte              | 300, 400, 500, 600, 700                             |
| `textAlign`       | SELECT | style     | Alinhamento do texto       | left, center, right                                 |
| `textColor`       | COLOR  | style     | Cor do texto               | Qualquer cor                                        |
| `linkColor`       | COLOR  | style     | Cor dos links              | Qualquer cor                                        |
| `backgroundColor` | COLOR  | style     | Cor de fundo               | Qualquer cor                                        |
| `lineHeight`      | SELECT | style     | Altura da linha            | 1, 1.25, 1.5, 1.75, 2                               |

---

## 🎨 Propriedades Universais

### 📐 Layout e Container

- `containerWidth`: Largura do container (full, large, medium, small)
- `containerPosition`: Posição do container (left, center, right)
- `spacing`: Espaçamento interno (none, compact, normal, comfortable, spacious)

### 🎯 Margens e Espaçamento

- `marginTop/Bottom/Left/Right`: Controle preciso de margens (-40px a 100px)

### 👁️ Visibilidade e Estado

- `visible`: Controle de visibilidade do componente
- `scale`: Escala uniforme do componente (50% a 200%)

### 🎨 Cores da Marca

- Padrão: `#B89B7A` (Dourado)
- Texto: `#432818` (Marrom Escuro)
- Fundo: `#FAF9F7` (Creme)

---

## 📱 Responsividade

Todos os componentes são **100% responsivos** e se adaptam automaticamente a:

- 📱 **Mobile** (até 768px)
- 📊 **Tablet** (768px - 1024px)
- 🖥️ **Desktop** (1024px+)

## ✨ Recursos Especiais

- 🎨 **Múltiplas cores no texto**: `[#cor]texto[/#cor]`
- 🔥 **Formatação inline**: `**negrito**`
- 🔄 **Hot reload**: Alterações em tempo real
- 🎯 **Validação automática**: Campos obrigatórios
- ⚡ **Performance otimizada**: Componentes lazy-loaded
