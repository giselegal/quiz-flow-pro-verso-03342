import { SupabaseFunnelService } from '../services/SupabaseFunnelService';

// Criar uma instância do serviço
const funnelService = new SupabaseFunnelService();

// Exemplo de uso
async function exemploDeUso() {
  try {
    // Criar novo funnel
    const novoFunnel = await funnelService.createFunnel({
      name: 'Meu Funnel',
      description: 'Descrição do meu funnel'
    });

    if (!novoFunnel.success) {
      throw new Error(novoFunnel.error);
    }

    // Carregar funnel
    const { success, funnel, error } = await funnelService.loadFunnel(novoFunnel.id!);

    if (!success || !funnel) {
      throw new Error(error || 'Erro ao carregar funnel');
    }

    // Atualizar funnel
    funnel.name = 'Meu Funnel Atualizado';
    const resultadoSalvar = await funnelService.saveFunnel(funnel);

    if (!resultadoSalvar.success) {
      throw new Error(resultadoSalvar.error);
    }

    // Deletar funnel
    const resultadoDeletar = await funnelService.deleteFunnel(funnel.id);

    if (!resultadoDeletar.success) {
      throw new Error(resultadoDeletar.error);
    }

  } catch (error: any) {
    console.error('Erro no exemplo:', error.message);
  }
}

// Executar exemplo
exemploDeUso();
