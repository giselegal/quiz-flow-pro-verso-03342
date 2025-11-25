#!/usr/bin/env node
// Downloader de vídeos para cenas da VSL usando API do Pexels.
// Requer variável de ambiente PEXELS_API_KEY.
// Cada cena define uma query e salva o melhor clipe MP4 em assets/videos/<file>.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) {
  console.error('🛑 PEXELS_API_KEY não definida. Exporte antes de rodar:');
  console.error('    export PEXELS_API_KEY="sua_chave"');
  process.exit(1);
}

const outDir = path.join(__dirname, 'assets', 'videos');
fs.mkdirSync(outDir, { recursive: true });

// Mapeamento de cenas: arquivo alvo + termo de busca
// Query curta e específica para aumentar relevância.
const scenes = [
  { file: '01-frustracao.mp4', query: 'frustrated entrepreneur laptop' },
  { file: '02-metricas-duvida.mp4', query: 'analytics dashboard thinking' },
  { file: '03-flow-interativo.mp4', query: 'using tablet scrolling hands' },
  { file: '04-quiz-mobile.mp4', query: 'smartphone app interaction hands' },
  { file: '05-saas-dashboard.mp4', query: 'team meeting startup office' },
  { file: '06-analytics.mp4', query: 'business people analyzing charts' },
  { file: '07-equipe-otimista.mp4', query: 'team celebrating success office' },
  { file: '08-templates.mp4', query: 'designer working interface computer' },
  { file: '09-depoimentos.mp4', query: 'person talking interview testimonial' },
  { file: '10-cta.mp4', query: 'typing keyboard click button closeup' }
];

async function fetchVideo(query) {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: API_KEY } });
  if (!res.ok) throw new Error(`Falha na requisição (${res.status}) para query '${query}'`);
  const data = await res.json();
  if (!data.videos || data.videos.length === 0) return null;
  // Seleciona o arquivo com maior largura >=1280, senão o maior disponível.
  let best = null;
  for (const vid of data.videos) {
    for (const f of vid.video_files || []) {
      if (!best) best = f;
      const width = f.width || 0;
      if (width >= 1280) {
        best = f;
        break;
      }
    }
    if (best && best.width >= 1280) break;
  }
  return best;
}

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download falhou (${res.status}) para ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

async function main() {
  console.log('🎬 Iniciando download de vídeos (Pexels) para cenas da VSL...');
  const report = [];
  for (const scene of scenes) {
    const target = path.join(outDir, scene.file);
    if (fs.existsSync(target)) {
      report.push({ file: scene.file, status: 'skip-exists' });
      console.log(`↪️  ${scene.file} já existe, pulando.`);
      continue;
    }
    try {
      console.log(`🔎 Buscando: '${scene.query}' ...`);
      const best = await fetchVideo(scene.query);
      if (!best) {
        report.push({ file: scene.file, status: 'no-results' });
        console.warn(`⚠️  Nenhum resultado para '${scene.query}'.`);
        continue;
      }
      console.log(`⬇️  Baixando ${scene.file} (${best.width}x${best.height})`);
      await downloadFile(best.link, target);
      const sizeMb = (fs.statSync(target).size / 1024 / 1024).toFixed(2);
      report.push({ file: scene.file, status: 'ok', sizeMb });
    } catch (err) {
      report.push({ file: scene.file, status: 'error', error: err.message });
      console.error(`🛑 Erro ao processar ${scene.file}:`, err.message);
    }
  }
  console.log('\n📄 Relatório:');
  for (const r of report) {
    console.log(` - ${r.file}: ${r.status}${r.sizeMb ? ` (${r.sizeMb} MB)` : ''}${r.error ? ` -> ${r.error}` : ''}`);
  }
  console.log('\n✅ Concluído. Rode agora: npm run build (para gerar a VSL com overlays sobre os vídeos).');
}

main().catch(e => {
  console.error('Erro fatal:', e);
  process.exit(1);
});
