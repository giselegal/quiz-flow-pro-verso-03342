# Guia de Identidade Visual — QuizFlowPro

Este guia consolida paleta, tipografia e utilitários CSS para o tema neon-escuro (exceto funis B2B e clientes finais).

## Paleta de Cores
- Preto Profundo: `#05070A` (var `--neon-black`)
- Navy Escuro: `#0A0F1F` (var `--neon-space`)
- Superfície Escura: `#0F1724` (var `--surface-dark`)
- Azul Neon: `#00A7FF` (var `--neon-blue`)
- Ciano Luminoso: `#3EEBFF` (var `--neon-cyan`)
- Magenta Neon: `#D600F9` (var `--neon-magenta`)
- Rosa Elétrico: `#FF4EDC` (var `--neon-pink`)
- Violeta Suave: `#6E3BFF` (var `--neon-violet`)

## Gradientes
- `--gradient-neon`: Azul → Violeta → Magenta
- `--gradient-blue-pink`: `#3bbef3` → `#ea7af6`
- `--gradient-hero-soft`: halos radiais azul/magenta sobre fundo escuro

## Tipografia
- Título: Playfair Display (`.font-title`)
- Corpo: Inter (`.font-body`)

## Utilitários CSS
- Fundo: `.bg-neon-black`, `.bg-neon-space`, `.bg-surface-dark`
- Texto: `.text-neon-blue`, `.text-neon-magenta`, `.text-neon-pink`, `.text-neon-cyan`
- Gradientes: `.bg-gradient-neon`, `.bg-gradient-blue-pink`, `.bg-hero-soft`
- Efeitos: `.shadow-neon`, `.shadow-soft`, `.border-translucent`, `.badge-translucent`, `.btn-neon`

## Exemplos de Uso
- Hero escuro com halos: `section.bg-neon-space > div.bg-hero-soft`
- Título premium: `<h1 class="font-title text-white">...` 
- CTA: `<button class="btn-neon shadow-neon">Começar</button>`
- Card: `<div class="border-translucent bg-surface-dark shadow-soft">...` 

## Diretrizes
- Evite excesso de elementos; foque em luz/sombra e contraste.
- Use `.font-title` apenas em títulos e hero claims.
- Prefira `.btn-neon` para CTAs principais em páginas de marketing.
- Mantenha acessibilidade com contraste suficiente sobre fundos escuros.
