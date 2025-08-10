# Organograma do Editor Quiz Quest Challenge Verse

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SISTEMA DO EDITOR                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
    ┌───────────▼───────────┐  ┌───▼───────────┐  ┌────▼───────────┐
    │     GERENCIAMENTO     │  │ INTERFACE DO  │  │   INTEGRAÇÃO   │
    │       DE DADOS        │  │    EDITOR     │  │   DE DADOS     │
    └───────────┬───────────┘  └───┬───────────┘  └────┬───────────┘
                │                  │                   │
    ┌───────────▼───────────┐      │             ┌────▼───────────┐
    │    EditorContext      │      │             │   Supabase     │
    │                       │      │             │   Service      │
    │ • Etapas (21 stages)  │      │             │                │
    │ • Blocos por etapa    │      │             │ • quiz_users   │
    │ • Estado atual        │      │             │ • quiz_sessions│
    └───────────────────────┘      │             │ • quiz_responses│
                                   │             │ • quiz_results  │
                                   │             └────────────────┘
                                   │
              ┌──────────────────┬─▼──┬───────────────────┐
              │                  │    │                   │
    ┌─────────▼─────────┐ ┌─────▼────▼────┐     ┌────────▼────────┐
    │  Painel Etapas    │ │    Canvas     │     │ Painel Props    │
    │                   │ │               │     │                  │
    │ • Lista etapas    │ │ • Área editor │     │ • Propriedades  │
    │ • Seleção etapa   │ │ • Drag & Drop │     │   do bloco      │
    │ • Ações (add/rem) │ │ • Visualização│     │   selecionado   │
    └───────┬───────────┘ └─────┬────┬────┘     └────────┬────────┘
            │                   │    │                   │
            │                   │    │                   │
            │             ┌─────▼────▼────────────┐     │
            │             │  Sistema Drag & Drop  │     │
            │             │                       │     │
            │             │ • DndProvider         │     │
            │             │ • Componentes         │     │
            │             │   arrastáveis         │     │
            │             │ • Blocos reordenáveis │     │
            │             └───────────────────────┘     │
            │                                           │
┌───────────▼───────────────────┐         ┌─────────────▼─────────────────┐
│     FunnelStagesPanel.tsx     │         │  EnhancedUniversalProps.tsx   │
│                               │         │                                │
│ • Visualização de etapas      │         │ • Sistema adaptativo de        │
│ • Seleção da etapa atual      │         │   propriedades                 │
│ • Gerenciamento das etapas    │         │ • Edição de conteúdo           │
└───────────────────────────────┘         │ • Configurações visuais        │
                                          └────────────────────────────────┘
```

## Fluxo de Dados no Editor

```
┌───────────────────┐     ┌──────────────────┐     ┌───────────────────┐
│                   │     │                  │     │                   │
│   EditorContext   │◄────┤  Actions & Events│◄────┤  User Interface   │
│                   │     │                  │     │                   │
└─────────┬─────────┘     └──────────────────┘     └───────────────────┘
          │
          │
┌─────────▼─────────┐
│                   │
│  Estado Atualizado│
│                   │
└─────────┬─────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│                                         │
│  Re-renderização dos Componentes        │
│  (FunnelStagesPanel, CanvasDropZone,    │
│   EnhancedUniversalPropertiesPanel)     │
│                                         │
└─────────────────────────────────────────┘
```

## Ciclo de Vida das Etapas do Quiz

```
┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│           │     │           │     │           │     │           │     │           │
│  Etapa 1  │────►│ Etapas 2-12│───►│  Etapa 13 │────►│Etapas 14-19│───►│Etapas 20-21│
│Introdução │     │ Perguntas │     │Transição  │     │Estratégicas│     │Resultado  │
│           │     │           │     │           │     │           │     │e Oferta   │
└───────────┘     └───────────┘     └───────────┘     └───────────┘     └───────────┘
```

## Relação entre os Diferentes Contextos

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│                  │     │                  │     │                  │
│  EditorContext   │     │  StepsContext    │     │  QuizContext     │
│                  │     │                  │     │                  │
└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│                  │     │                  │     │                  │
│  Interface do    │     │  Navegação do    │     │  Lógica do       │
│  Editor          │     │  Quiz            │     │  Quiz            │
│                  │     │                  │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```
