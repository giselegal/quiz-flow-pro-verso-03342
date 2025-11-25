import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import googleTTS from 'google-tts-api';
import Jimp from 'jimp';
import ffmpegPath from 'ffmpeg-static';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, 'output');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Load config if present
function loadConfig() {
  const cfgPath = path.join(__dirname, 'config.json');
  if (fs.existsSync(cfgPath)) {
    try {
      const raw = fs.readFileSync(cfgPath, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.warn('> Warning: Failed to parse config.json, using defaults');
    }
  }
  return { useElevenLabs: false, voiceId: '', voiceSpeed: 1.25 };
}

const config = loadConfig();

// Scenes based on the VSL provided
const defaultScenes = [
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
const scenes = Array.isArray(config.scenes) && config.scenes.length ? config.scenes : defaultScenes;

const narrationText = `Você já sentiu que está fazendo tudo para crescer no digital, mas os resultados não aparecem?\n\nVocê posta, faz live, cria conteúdo… e mesmo assim as vendas não acompanham seu esforço.\n\nTalvez você tenha um método poderoso, um curso incrível ou clientes satisfeitos. Mas na hora de escalar, tudo trava. Você não sabe por onde começar, qual passo dar primeiro, e sente que perde oportunidades todos os dias.\n\nQuem está crescendo de verdade cria experiências interativas que conduzem o lead passo a passo até a decisão de compra. Uma das mais poderosas são os quizzes e funis inteligentes.\n\nQuizFlowPro nasceu para quem quer alavancar e escalar no digital, mesmo sem saber por onde começar, usando quizzes e funis inteligentes para transformar visitantes em leads qualificados e leads em clientes.\n\nCom o QuizFlowPro, você cria quizzes alinhados ao seu método, mapeia perfil e momento de cada lead, direciona automaticamente para a oferta certa e acompanha em tempo real quais funis convertem mais — sem programar, sem depender de tech, sem virar escravo de lançamentos.\n\nSe você não sabe por onde começar, use nossos modelos prontos de funis. Personalize perguntas, textos e resultados, e valide sua oferta em poucas horas.\n\nProfissionais e empresas já usam o QuizFlowPro para triplicar a conversão, construir listas segmentadas e escalar com previsibilidade.\n\nSe quer parar de andar em círculos e ter um caminho claro para escalar no digital, teste o QuizFlowPro e veja na prática como um único quiz bem desenhado pode mudar tudo.`;

async function synthesizeWithGoogle(text, outFile) {
  const parts = await googleTTS.getAllAudioBase64(text, {
    lang: 'pt',
    slow: false,
    host: 'https://translate.google.com'
  });
  const tmpDir = path.join(outDir, 'tmp-audio');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const listPath = path.join(tmpDir, 'files.txt');
  const listLines = [];
  for (let i = 0; i < parts.length; i++) {
    const pFile = path.join(tmpDir, `part-${String(i + 1).padStart(2, '0')}.mp3`);
    fs.writeFileSync(pFile, Buffer.from(parts[i].base64, 'base64'));
    listLines.push(`file '${pFile.replace(/'/g, "'\\''")}'`);
  }
  fs.writeFileSync(listPath, listLines.join('\n'));
  await new Promise((resolve, reject) => {
    const ff = spawn(ffmpegPath, ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', outFile], { stdio: 'inherit' });
    ff.on('error', reject);
    ff.on('close', code => (code === 0 ? resolve() : reject(new Error(`ffmpeg audio concat exited with code ${code}`))));
  });
}

async function synthesizeWithElevenLabs(text, outFile, voiceId, apiKey) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const body = {
    text,
    voice_settings: {
      stability: 0.4,
      similarity_boost: 0.8
    }
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    throw new Error(`ElevenLabs TTS failed: ${res.status} ${await res.text()}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outFile, buf);
}

async function synthesizeAudio(text, outFile) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (config.useElevenLabs && apiKey && config.voiceId) {
    console.log('> Using ElevenLabs TTS…');
    await synthesizeWithElevenLabs(text, outFile, config.voiceId, apiKey);
  } else {
    console.log('> Using Google TTS…');
    await synthesizeWithGoogle(text, outFile);
  }
  // Apply speed via atempo if configured
  const speed = Math.min(Math.max(Number(config.voiceSpeed || 1.0), 0.5), 2.0);
  if (Math.abs(speed - 1.0) > 0.01) {
    const sped = outFile.replace(/\.mp3$/, '.fast.mp3');
    await new Promise((resolve, reject) => {
      const ff = spawn(ffmpegPath, ['-y', '-i', outFile, '-filter:a', `atempo=${speed}`, '-c:a', 'mp3', sped], { stdio: 'inherit' });
      ff.on('error', reject);
      ff.on('close', code => (code === 0 ? resolve() : reject(new Error(`ffmpeg atempo exited with code ${code}`))));
    });
    fs.renameSync(sped, outFile);
  }
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

async function createOverlayImage(scene, index) {
  const width = 1280;
  const height = 720;
  const image = new Jimp(width, height, 0x00000000);
  const panel = new Jimp(width, 220, 0x00000000);
  panel.opacity(0.35);
  image.composite(panel, 0, 120);

  const fontTitle = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
  const fontText = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

  image.print(fontTitle, 80, 140, {
    text: scene.title,
    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
    alignmentY: Jimp.VERTICAL_ALIGN_TOP
  }, width - 160, 200);

  let y = 220;
  for (const line of scene.lines) {
    image.print(fontText, 80, y, {
      text: line,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_TOP
    }, width - 160, 300);
    y += 52;
  }

  const out = path.join(outDir, `overlay-${String(index + 1).padStart(2, '0')}.png`);
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

// Animated slide generation (synthetic AI-style scene): slow zoom + subtle movement
async function buildSceneVideoFromImage(imageFile, duration, outFile) {
  const frames = duration * 25; // target fps 25
  const vf = `zoompan=z='min(zoom+0.0015,1.05)':fps=25:d=${frames},scale=1280:720,format=yuv420p`;
  const args = ['-y', '-loop', '1', '-i', imageFile, '-vf', vf, '-t', String(duration), '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', outFile];
  await new Promise((resolve, reject) => {
    const ff = spawn(ffmpegPath, args, { stdio: 'inherit' });
    ff.on('error', reject);
    ff.on('close', code => (code === 0 ? resolve() : reject(new Error(`ffmpeg animated slide exited with code ${code}`))));
  });
}

async function buildSceneVideoWithAsset(assetFile, overlayFile, duration, outFile) {
  const args = ['-y', '-i', assetFile, '-i', overlayFile, '-filter_complex', '[0:v]scale=1280:720,setsar=1[base];[1:v]format=rgba[ov];[base][ov]overlay=0:0:format=auto', '-t', String(duration), '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', outFile];
  await new Promise((resolve, reject) => {
    const ff = spawn(ffmpegPath, args, { stdio: 'inherit' });
    ff.on('error', reject);
    ff.on('close', code => (code === 0 ? resolve() : reject(new Error(`ffmpeg asset overlay exited with code ${code}`))));
  });
}

async function concatScenes(sceneFiles, outFile) {
  const tmpDir = path.join(outDir, 'tmp-video');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const listPath = path.join(tmpDir, 'files.txt');
  const listLines = sceneFiles.map(f => `file '${f.replace(/'/g, "'\\''")}'`);
  fs.writeFileSync(listPath, listLines.join('\n'));
  const args = ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', outFile];
  await new Promise((resolve, reject) => {
    const ff = spawn(ffmpegPath, args, { stdio: 'inherit' });
    ff.on('error', reject);
    ff.on('close', code => (code === 0 ? resolve() : reject(new Error(`ffmpeg concat scenes exited with code ${code}`))));
  });
}

async function muxAudio(videoFile, audioFile, outFile) {
  const args = ['-y', '-i', videoFile, '-i', audioFile, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-shortest', outFile];
  await new Promise((resolve, reject) => {
    const ff = spawn(ffmpegPath, args, { stdio: 'inherit' });
    ff.on('error', reject);
    ff.on('close', code => (code === 0 ? resolve() : reject(new Error(`ffmpeg mux audio exited with code ${code}`))));
  });
}

async function main() {
  console.log('> Generating narration audio…');
  const audioFile = path.join(outDir, 'narration.mp3');
  await synthesizeAudio(narrationText, audioFile);

  console.log('> Preparing scene visuals…');
  const sceneFiles = [];
  const durations = estimateDurations(scenes);
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const dur = durations[i];
    const assetPath = scene.assetVideo ? path.join(__dirname, String(scene.assetVideo)) : null;
    if (assetPath && fs.existsSync(assetPath)) {
      const overlay = await createOverlayImage(scene, i);
      const outScene = path.join(outDir, `scene-${String(i + 1).padStart(2, '0')}.mp4`);
      console.log(`  > scene ${i + 1}: using asset ${scene.assetVideo}`);
      await buildSceneVideoWithAsset(assetPath, overlay, dur, outScene);
      sceneFiles.push(outScene);
    } else {
      const img = await createSceneImage(scene, i);
      const outScene = path.join(outDir, `scene-${String(i + 1).padStart(2, '0')}.mp4`);
      console.log(`  > scene ${i + 1}: using generated slide`);
      await buildSceneVideoFromImage(img, dur, outScene);
      sceneFiles.push(outScene);
    }
  }

  const total = durations.reduce((a, b) => a + b, 0);
  console.log(`> Scenes: ${scenes.length}, total ~${total}s`);

  const videoOnly = path.join(outDir, 'vsl-video-only.mp4');
  console.log('> Concatenating scenes…');
  await concatScenes(sceneFiles, videoOnly);

  const outFile = path.join(outDir, 'vsl-quizflowpro.mp4');
  console.log('> Muxing audio…');
  await muxAudio(videoOnly, audioFile, outFile);

  const stats = fs.statSync(outFile);
  console.log(`> Done: ${outFile} (${(stats.size/1024/1024).toFixed(2)} MB)`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
