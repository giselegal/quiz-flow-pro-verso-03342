/**
 * Utilidades de formatação para o dashboard
 */

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export const formatPercent = (num: number): string => {
  return num.toFixed(1) + '%';
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatTimeAgo = (date: string | null): string => {
  if (!date) return 'Nunca';
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora mesmo';
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;
  
  return past.toLocaleDateString('pt-BR');
};

export const formatActivityTitle = (type: string): string => {
  const titles: Record<string, string> = {
    funnel_created: 'Funil criado',
    funnel_published: 'Funil publicado',
    funnel_updated: 'Funil atualizado',
    session_started: 'Sessão iniciada',
    session_completed: 'Sessão concluída',
    lead_captured: 'Lead capturado',
    conversion: 'Conversão realizada',
  };
  return titles[type] || type;
};

export const determineStatus = (type: string): 'success' | 'info' | 'warning' => {
  if (type.includes('completed') || type.includes('conversion') || type.includes('published')) {
    return 'success';
  }
  if (type.includes('started') || type.includes('created')) {
    return 'info';
  }
  return 'warning';
};
