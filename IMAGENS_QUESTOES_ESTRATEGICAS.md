# Imagens das Questões Estratégicas (Steps 13, 14, 16, 18)

Este documento descreve a estratégia visual, prompts IA e guidelines para manutenção das imagens reflexivas usadas em quatro questões estratégicas do quiz.

## Objetivo
Adicionar imagens que provoquem reflexão emocional e ancorem a intenção da pergunta sem distrair ou induzir resposta específica. O foco é criar empatia, sensação de jornada e transição do estado atual (autopercepção / dilema) para um estado aspiracional (clareza e confiança).

## Seleção das Etapas
| Step | Pergunta | Motivo da Imagem |
|------|----------|------------------|
| 13 | "Quando você se olha no espelho..." | Alto potencial introspectivo (autoimagem) |
| 14 | "O que mais te desafia..." | Reforçar contexto de decisão/curadoria |
| 16 | "Pense no quanto você já gastou..." | Representar análise / desperdício implícito |
| 18 | "Qual desses resultados..." | Ancorar visão aspiracional (futuro desejado) |

Steps 15 e 17 foram omitidos para evitar sobrecarga visual e manter ritmo (respiro cognitivo).

## Diretrizes Estéticas Globais
- Paleta: neutros quentes (bege, areia, caramelo suave, branco natural). Evitar saturação forte.
- Iluminação: soft natural window light ou golden hour leve; nunca flash direto.
- Estilo: editorial minimalista, leve influência Vogue / lifestyle consciente.
- Textura: linho, madeira clara, superfícies foscas. Evitar plástico brilhante.
- Emoção: contemplação -> decisão -> avaliação -> aspiração.
- Formato: 16:9 mobile / pode expandir para 3:1 em desktop (classe responsiva aplicada). Foco central, corte limpo.
- Pessoas: representar mulher brasileira (tonalidade de pele média a morena clara) sem estereótipos, expressão natural (não poses exageradas).

## Prompts Propostos
(Compatíveis com Midjourney v6 / SDXL / Flux. Formato: inglês para maior consistência nos modelos.)

### Step 13 – Espelho / Autoimagem
```
cinematic soft light, editorial portrait of a Brazilian woman early 30s in a minimal neutral bedroom, standing in front of a tall mirror gently touching it, introspective calm expression, muted beige and warm brown palette, shallow depth of field, medium format look, subtle film grain, evokes self reflection, vogue minimal aesthetic
```

### Step 14 – Curadoria / Dilema de Combinar
```
top-down soft daylight photo of hands curating minimalist neutral wardrobe pieces (linen, cotton, knit) on textured beige bed cover, aesthetic flatlay, warm desaturated tones, lifestyle editorial, evokes decision process and personal style curation, natural shadows, high detail
```

### Step 16 – Guarda-roupa Avaliando Gastos
```
minimalist open wardrobe interior with curated neutral capsule pieces on wooden hangers, soft side window light with gentle dust particles, negative space, warm beige and camel palette, evokes mindful evaluation of wardrobe spending, lifestyle editorial photograph, subtle depth
```

### Step 18 – Caminhada Aspiracional
```
golden hour urban candid of a confident stylish Brazilian woman walking forward, subtle wind in hair, soft cinematic glow, neutral chic outfit (linen blazer and tailored pants), warm golden highlights, evokes aspiration and transformation, editorial street style look, shallow depth
```

## Pós-processamento Recomendado
- Converter para WebP (qualidade ~82). 
- Largura padrão 1600px (desktop), derivar variantes 960px (tablet) e 640px (mobile) se necessário (Cloudinary auto-quality já configurado). 
- Verificar contraste para acessibilidade (não inserir texto sobre a imagem no componente atual, então foco é só estética). 

## Acessibilidade
- `alt` curto e objetivo descrevendo a cena (já incluído no objeto `reflectionImage`).
- `figcaption` oculto para leitores de tela (classe `sr-only`) mantido para semântica.

## Implementação Técnica
- Campo opcional `reflectionImage` adicionado à interface `QuizStep`.
- Renderização condicional em `StrategicQuestionStep` logo após o título.
- Classe responsiva: `aspect-[16/9] md:aspect-[3/1]` garante proporção cinematográfica wide em desktop.
- `loading="lazy"` + `decoding="async"` para performance.

## Possíveis Extensões Futuras
- Suporte a `srcSet` e densidades (`2x`) se houver demanda de retina.
- Placeholder blurred (LQIP) via Cloudinary `e_blur` ou `q_auto:low`.
- Telemetria para medir impacto de engajamento (taxa de resposta / abandono por step com e sem imagem).

## Manutenção
Em alterações futuras manter consistência de:
- Paleta e iluminação.
- Narrativa emocional progressiva.
- Distância média da câmera (alternando close / medium / wider para ritmo visual mas sem ruído).

---
Versão 1.0 • Criado automaticamente via assistente.
