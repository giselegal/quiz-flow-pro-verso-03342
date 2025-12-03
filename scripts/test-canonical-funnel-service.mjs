import { canonicalFunnelService } from '../src/services/funnel/CanonicalFunnelService.ts';

async function main() {
  console.log('▶️ Listar funis...');
  const list1 = await canonicalFunnelService.listFunnels('current-user');
  console.log('Funis:', list1.map(f => f.id));

  console.log('🆕 Criar funil...');
  const created = await canonicalFunnelService.createFunnel({ name: 'Teste CLI ' + Date.now() });
  console.log('Criado:', created);

  console.log('✏️ Atualizar funil...');
  const updated = await canonicalFunnelService.updateFunnel(created.id, { description: 'Atualizado via script' });
  console.log('Atualizado:', updated);

  console.log('📄 Duplicar funil...');
  const duplicated = await canonicalFunnelService.duplicateFunnel(created.id, created.name + ' (cópia)');
  console.log('Duplicado:', duplicated);

  console.log('🔍 Buscar funil...');
  const fetched = await canonicalFunnelService.getFunnel(duplicated.id);
  console.log('Buscado:', fetched);

  console.log('✅ OK');
}

main().catch(err => { console.error('Erro no teste:', err); process.exit(1); });
