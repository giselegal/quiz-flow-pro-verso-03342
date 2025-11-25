# Gerador de VSL (QuizFlowPro)

Este utilitário cria um vídeo VSL em MP4 combinando narração TTS com cenas (slides ou vídeos reais) e sobreposição de texto.

## Estrutura
- `generate-vsl.mjs`: script principal (Node + ffmpeg).
- `package.json`: dependências (`ffmpeg-static`, `google-tts-api`, `jimp`, `node-fetch`).
- `config.json`: configuração de voz, velocidade e cenas (pode referenciar vídeos reais).
- `assets/videos/`: coloque aqui seus clipes MP4 por cena.
- `output/`: arquivos gerados (`vsl-quizflowpro.mp4`).

## Configuração
Edite `tools/vsl/config.json`:
```json
{
  "useElevenLabs": false,
  "voiceId": "",
  "voiceSpeed": 1.25,
  "scenes": [
    { "title": "Você está fazendo tudo…", "lines": ["Posta, faz live, cria conteúdo…", "Mas as vendas não acompanham o esforço."], "assetVideo": "assets/videos/01-frustracao.mp4" }
    // ... demais cenas
  ]
}
```
- `useElevenLabs`: true para usar TTS ElevenLabs (mais natural).
- `voiceId`: ID da voz em ElevenLabs.
- `voiceSpeed`: aceleração da fala via `ffmpeg atempo` (0.5–2.0). Recomendado: 1.25–1.4.
- `scenes[*].assetVideo`: caminho relativo para o vídeo da cena. Se o arquivo não existir, o script gera um slide estático.

## ElevenLabs (opcional)
Defina sua chave de API antes de rodar:
```bash
export ELEVENLABS_API_KEY="sua_chave_aqui"
```
Defina no `config.json`:
```json
{"useElevenLabs": true, "voiceId": "<VOICE_ID>"}
```

## Gerar o vídeo
```bash
cd tools/vsl
npm install
npm run build
```
Saída: `tools/vsl/output/vsl-quizflowpro.mp4`.

## Publicar na Home
Copie o MP4 para a pasta pública (Vite):
```bash
cp -f tools/vsl/output/vsl-quizflowpro.mp4 public/videos/vsl-quizflowpro.mp4
```
A Home já possui um botão “Assistir VSL” com modal player que carrega este arquivo.

## Dicas de conteúdo
- Use vídeos reais com pessoas (frustração, equipe, métricas, depoimentos). Evite conteúdos com direitos autorais sem licença adequada.
- Mantenha duração por cena entre 4–7s (o script estima baseado no texto, mas você pode ajustar encurtando linhas).
- Para voz mais natural e rápida, combine ElevenLabs + `voiceSpeed` em `config.json`.

## Problemas comuns
- Limite do TTS: o script fatiará automaticamente textos longos no Google TTS.
- Performance: ffmpeg estático é usado; se faltar permissões, verifique seu ambiente.
- Áudio lento: aumente `voiceSpeed` (ex.: 1.35).

## Personalizações avançadas
- Transições entre cenas: podemos adicionar crossfade (re-encode) se desejar.
- Overlays: o arquivo gerado aplica um painel semitransparente com título/linhas; cores e opacidade podem ser ajustadas em `createOverlayImage`.
