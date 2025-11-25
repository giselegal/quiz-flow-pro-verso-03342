import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import googleTTS from 'google-tts-api';
import Jimp from 'jimp';
import ffmpegPath from 'ffmpeg-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, 'output');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Scenes based on the VSL provided
const scenes = [
  {
    title: 'Você está fazendo tudo…',
    lines: [
      'Posta, faz live, cria conteúdo…',
      'Mas as vendas não acompanham o esforço.'
    ]
  },
  {
    title: 'Você tem um método,',
    lines: [
      'um curso incrível, clientes satisfeitos…',
      'Mas na hora de escalar, tudo trava.'
    ]
  },
  {
    title: 'A virada de chave:',
    lines: [
      'Experiências interativas conduzem o lead',
      'até a decisão de compra.'
    ]
  },
  {
    title: 'Quizzes e funis inteligentes',
    lines: [
      'Entendem o momento da pessoa,',
      'segmentam e entregam a mensagem certa.'
    ]
  },
  {
    title: 'QuizFlowPro',
    lines: [
      'Plataforma para alavancar e escalar no digital,',
      'mesmo sem saber por onde começar.'
    ]
  },
  {
    title: 'Clareza de tráfego',
    lines: [
      'Quem chega? Quem tem perfil?',
      'Onde as pessoas desistem?'
    ]
  },
  {
    title: 'O que você faz com o QuizFlowPro',
    lines: [
      'Cria quizzes alinhados ao seu método,',
      'segmenta e acompanha conversões em tempo real.'
    ]
  },
  {
    title: 'Não sabe por onde começar?',
    lines: [
      'Modelos de funis prontos,',
      'personalize perguntas e valide sua oferta.'
    ]
  },
  {
    title: 'Prova social',
    lines: [
      'Triplique a conversão,',
      'construa listas segmentadas e escale.'
    ]
  },
  {
    title: 'Chamada para ação',
    lines: [
      'Teste o QuizFlowPro e veja na prática',
      'como um único quiz muda tudo.'
    ]
  }
];

const narrationText = `Você já sentiu que está fazendo tudo para crescer no digital, mas os resultados não aparecem?\n\nVocê posta, faz live, cria conteúdo… e mesmo assim as vendas não acompanham seu esforço.\n\nTalvez você tenha um método poderoso, um curso incrível ou clientes satisfeitos. Mas na hora de escalar, tudo trava. Você não sabe por onde começar, qual passo dar primeiro, e sente que perde oportunidades todos os dias.\n\nQuem está crescendo de verdade cria experiências interativas que conduzem o lead passo a passo até a decisão de compra. Uma das mais poderosas são os quizzes e funis inteligentes.\n\nQuizFlowPro nasceu para quem quer alavancar e escalar no digital, mesmo sem saber por onde começar, usando quizzes e funis inteligentes para transformar visitantes em leads qualificados e leads em clientes.\n\nCom o QuizFlowPro, você cria quizzes alinhados ao seu método, mapeia perfil e momento de cada lead, direciona automaticamente para a oferta certa e acompanha em tempo real quais funis convertem mais — sem programar, sem depender de tech, sem virar escravo de lançamentos.\n\nSe você não sabe por onde começar, use nossos modelos prontos de funis. Personalize perguntas, textos e resultados, e valide sua oferta em poucas horas.\n\nProfissionais e empresas já usam o QuizFlowPro para triplicar a conversão, construir listas segmentadas e escalar com previsibilidade.\n\nSe quer parar de andar em círculos e ter um caminho claro para escalar no digital, teste o QuizFlowPro e veja na prática como um único quiz bem desenhado pode mudar tudo.`;

async function synthesizeAudio(text, outFile) {
  const base64 = await googleTTS.getAudioBase64(text, {
    lang: 'pt',
    slow: false,
    host: 'https://translate.google.com'
  });
  fs.writeFileSync(outFile, Buffer.from(base64, 'base64'));
}

async function createSceneImage(scene, index) {
  const width = 1280;
  const height = 720;
  const image = new Jimp(width, height, '#0a0f1f');

  // Brand gradient bar
  const barHeight = 10;
  const bar = new Jimp(width, barHeight, '#3bbef3');
  image.composite(bar, 0, 0);

  // Footer bar subtle
  const bar2 = new Jimp(width, barHeight, '#ea7af6');
  image.composite(bar2, 0, height - barHeight);

  // Title and lines
  const fontTitle = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
  const fontText = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

  image.print(fontTitle, 80, 160, {
    text: scene.title,
    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
    alignmentY: Jimp.VERTICAL_ALIGN_TOP
  }, width - 160, 200);

  let y = 280;
  for (const line of scene.lines) {
    image.print(fontText, 80, y, {
      text: line,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_TOP
    }, width - 160, 300);
    y += 60;
  }

  // Watermark
  image.print(fontText, width - 420, height - 60, 'QuizFlowPro', width - 160);

  const out = path.join(outDir, `scene-${String(index + 1).padStart(2, '0')}.png`);
  await image.writeAsync(out);
  return out;
}

function estimateDurations(scenesArr, wps = 2.2) {
  // Duration per scene based on text length (title + lines)
  const durations = scenesArr.map(s => {
    const words = (s.title + ' ' + s.lines.join(' ')).split(/\s+/).filter(Boolean).length;
    const d = Math.max(3, Math.round(words / wps)); // min 3s per scene
    return d;
  });
  return durations;
}

async function buildVideo(imageFiles, audioFile, durations, outFile) {
  // Build ffmpeg args: one input per image (loop), plus audio
  const inputs = [];
  const filterParts = [];
  const mappedVideos = [];

  inputs.push('-i');
  inputs.push(audioFile);

  imageFiles.forEach((img, idx) => {
    inputs.push('-loop');
    inputs.push('1');
    inputs.push('-t');
    inputs.push(String(durations[idx]));
    inputs.push('-i');
    inputs.push(img);
  });

  // Scale each image and label
  imageFiles.forEach((_, idx) => {
    const inIdx = idx + 1; // audio is 0
    filterParts.push(`[${inIdx}:v]scale=1280:720,setsar=1[v${inIdx}]`);
    mappedVideos.push(`[v${inIdx}]`);
  });

  const concatFilter = `${filterParts.join(';')};${mappedVideos.join('')}concat=n=${imageFiles.length}:v=1:a=0,format=yuv420p[vout]`;

  const args = [
    '-y',
    ...inputs,
    '-filter_complex', concatFilter,
    '-map', '[vout]',
    '-map', '0:a',
    '-shortest',
    '-c:v', 'libx264',
    '-c:a', 'aac',
    outFile
  ];

  await new Promise((resolve, reject) => {
    const ff = spawn(ffmpegPath, args, { stdio: 'inherit' });
    ff.on('error', reject);
    ff.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

async function main() {
  console.log('> Generating narration audio…');
  const audioFile = path.join(outDir, 'narration.mp3');
  await synthesizeAudio(narrationText, audioFile);

  console.log('> Creating scene images…');
  const imageFiles = [];
  for (let i = 0; i < scenes.length; i++) {
    const img = await createSceneImage(scenes[i], i);
    imageFiles.push(img);
  }

  console.log('> Estimating durations…');
  const durations = estimateDurations(scenes);
  const total = durations.reduce((a, b) => a + b, 0);
  console.log(`  Scenes: ${scenes.length}, total ~${total}s`);

  const outFile = path.join(outDir, 'vsl-quizflowpro.mp4');
  console.log('> Building video with ffmpeg…');
  await buildVideo(imageFiles, audioFile, durations, outFile);

  const stats = fs.statSync(outFile);
  console.log(`> Done: ${outFile} (${(stats.size/1024/1024).toFixed(2)} MB)`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
