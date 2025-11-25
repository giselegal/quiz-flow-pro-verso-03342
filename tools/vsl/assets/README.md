# Assets de Vídeo — VSL QuizFlowPro

Coloque aqui vídeos MP4 com pessoas que representem cada cena da narrativa. Use apenas conteúdos com licença adequada (ex.: Pexels, Pixabay, Videvo, ou material próprio com autorização).

Estrutura esperada (nomes devem bater com `tools/vsl/config.json`):

- `assets/videos/01-frustracao.mp4` — Pessoa empreendedora frustrada, olhando métricas sem resultados
- `assets/videos/02-metricas-duvida.mp4` — Close em tela/analytics e pessoa pensativa/indecisa
- `assets/videos/03-flow-interativo.mp4` — Interação em dispositivo (scroll/click), clima de fluxo guiado
- `assets/videos/04-quiz-mobile.mp4` — Uso de quiz em smartphone (mãos interagindo)
- `assets/videos/05-saas-dashboard.mp4` — Dashboard SaaS moderno com pessoas apontando/reunidas
- `assets/videos/06-analytics.mp4` — Gráficos crescendo, equipe observando métricas
- `assets/videos/07-equipe-otimista.mp4` — Equipe comemorando/resultado positivo
- `assets/videos/08-templates.mp4` — Biblioteca/templates na tela, pessoa personalizando
- `assets/videos/09-depoimentos.mp4` — Pessoas dando depoimentos (on-camera) ou lendo avaliações
- `assets/videos/10-cta.mp4` — Close em ação de clicar/assinar/iniciar teste

Dicas de sourcing seguro:
- Pexels (licença gratuita, não exige atribuição): https://www.pexels.com/pt-br/videos/
- Pixabay (verificar licença de cada vídeo): https://pixabay.com/videos/
- Videvo (alguns clipes exigem atribuição): https://www.videvo.net/

Boas práticas:
- Resolução ideal: 1280x720 ou maior (o script faz scale para 1280x720).
- Duração sugerida por cena: 4–7s; o gerador corta cada asset pela duração estimada do texto.
- Evite marcas registradas reconhecíveis ou pessoas sem consentimento.

Depois de adicionar os arquivos, gere o vídeo:
```bash
cd tools/vsl
npm run build
cp -f output/vsl-quizflowpro.mp4 ../../public/videos/vsl-quizflowpro.mp4
```