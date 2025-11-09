/**
 * 💬 USER FRIENDLY ERROR MESSAGES - Mensagens de Erro Amigáveis
 * 
 * Resolve GARGALO G48 (MÉDIO): Erros técnicos exibidos ao usuário
 * 
 * PROBLEMAS RESOLVIDOS:
 * - ❌ "Failed to fetch" assusta usuários
 * - ❌ Stack traces expostos na UI
 * - ❌ Mensagens técnicas não acionáveis
 * 
 * SOLUÇÃO:
 * - ✅ Dicionário de mensagens amigáveis
 * - ✅ Sugestões de ação para usuário
 * - ✅ Detecta erros comuns automaticamente
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 */

export interface UserFriendlyError {
  /** Título user-friendly */
  title: string;
  /** Mensagem detalhada mas amigável */
  message: string;
  /** Ação sugerida para o usuário */
  action?: string;
  /** Nível de severidade */
  severity: 'info' | 'warning' | 'error';
}

/**
 * Mapeia erros técnicos comuns para mensagens amigáveis
 */
const ERROR_MESSAGES_MAP: Record<string, UserFriendlyError> = {
  // Erros de rede
  'Failed to fetch': {
    title: 'Problema de Conexão',
    message: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
    action: 'Tente novamente em alguns instantes',
    severity: 'warning',
  },
  'NetworkError': {
    title: 'Erro de Rede',
    message: 'Parece que você está offline ou com conexão instável.',
    action: 'Verifique sua internet e tente novamente',
    severity: 'warning',
  },
  'ETIMEDOUT': {
    title: 'Tempo Esgotado',
    message: 'A operação demorou muito e foi cancelada.',
    action: 'Tente novamente',
    severity: 'warning',
  },
  
  // Erros de autenticação
  'Unauthorized': {
    title: 'Sessão Expirada',
    message: 'Sua sessão expirou. Por favor, faça login novamente.',
    action: 'Fazer login',
    severity: 'warning',
  },
  'Invalid token': {
    title: 'Sessão Inválida',
    message: 'Sua sessão não é mais válida.',
    action: 'Faça login novamente',
    severity: 'warning',
  },
  'Forbidden': {
    title: 'Sem Permissão',
    message: 'Você não tem permissão para realizar esta ação.',
    action: 'Entre em contato com o administrador',
    severity: 'error',
  },
  
  // Erros de dados
  'Not Found': {
    title: 'Não Encontrado',
    message: 'O item que você procura não foi encontrado.',
    action: 'Verifique se o link está correto',
    severity: 'warning',
  },
  'Validation Error': {
    title: 'Dados Inválidos',
    message: 'Alguns dados estão incorretos ou incompletos.',
    action: 'Verifique os campos em destaque',
    severity: 'warning',
  },
  'Duplicate': {
    title: 'Item Duplicado',
    message: 'Já existe um item com essas informações.',
    action: 'Use um nome diferente',
    severity: 'warning',
  },
  
  // Erros de sistema
  'Internal Server Error': {
    title: 'Erro no Servidor',
    message: 'Ocorreu um erro inesperado. Nossa equipe foi notificada.',
    action: 'Tente novamente em alguns minutos',
    severity: 'error',
  },
  'Service Unavailable': {
    title: 'Serviço Temporariamente Indisponível',
    message: 'O serviço está passando por manutenção.',
    action: 'Tente novamente em alguns minutos',
    severity: 'warning',
  },
  
  // Erros de autosave
  'Autosave Failed': {
    title: 'Não Foi Possível Salvar',
    message: 'Suas alterações não foram salvas automaticamente.',
    action: 'Clique em "Salvar" manualmente',
    severity: 'warning',
  },
  
  // Erros de upload
  'File Too Large': {
    title: 'Arquivo Muito Grande',
    message: 'O arquivo selecionado ultrapassa o tamanho máximo permitido.',
    action: 'Escolha um arquivo menor que 5MB',
    severity: 'warning',
  },
  'Invalid File Type': {
    title: 'Tipo de Arquivo Não Suportado',
    message: 'Este tipo de arquivo não é permitido.',
    action: 'Use PNG, JPG ou GIF',
    severity: 'warning',
  },
};

/**
 * Detecta padrões comuns em mensagens de erro
 */
function detectErrorPattern(errorMessage: string): UserFriendlyError | null {
  const lowerMessage = errorMessage.toLowerCase();
  
  // Erros de rede
  if (lowerMessage.includes('failed to fetch') || lowerMessage.includes('network')) {
    return ERROR_MESSAGES_MAP['Failed to fetch'];
  }
  
  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return ERROR_MESSAGES_MAP['ETIMEDOUT'];
  }
  
  // Erros de autenticação
  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('401')) {
    return ERROR_MESSAGES_MAP['Unauthorized'];
  }
  
  if (lowerMessage.includes('forbidden') || lowerMessage.includes('403')) {
    return ERROR_MESSAGES_MAP['Forbidden'];
  }
  
  // Erros 404
  if (lowerMessage.includes('not found') || lowerMessage.includes('404')) {
    return ERROR_MESSAGES_MAP['Not Found'];
  }
  
  // Erros 500
  if (lowerMessage.includes('internal server') || lowerMessage.includes('500')) {
    return ERROR_MESSAGES_MAP['Internal Server Error'];
  }
  
  // Erros de validação
  if (lowerMessage.includes('validation') || lowerMessage.includes('invalid')) {
    return ERROR_MESSAGES_MAP['Validation Error'];
  }
  
  // Erros de duplicação
  if (lowerMessage.includes('duplicate') || lowerMessage.includes('already exists')) {
    return ERROR_MESSAGES_MAP['Duplicate'];
  }
  
  return null;
}

/**
 * Converte erro técnico em mensagem amigável
 * 
 * @param error - Erro original (Error, string ou unknown)
 * @param context - Contexto adicional (opcional)
 * @returns Mensagem amigável estruturada
 * 
 * @example
 * ```ts
 * try {
 *   await saveData();
 * } catch (error) {
 *   const friendly = getUserFriendlyError(error);
 *   showToast(friendly.title, friendly.message, friendly.severity);
 * }
 * ```
 */
export function getUserFriendlyError(
  error: unknown,
  context?: string
): UserFriendlyError {
  // Extrair mensagem do erro
  let errorMessage = 'Erro desconhecido';
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = String((error as any).message);
  }
  
  // Tentar encontrar no mapa direto
  const directMatch = ERROR_MESSAGES_MAP[errorMessage];
  if (directMatch) {
    return directMatch;
  }
  
  // Tentar detectar padrão
  const patternMatch = detectErrorPattern(errorMessage);
  if (patternMatch) {
    return patternMatch;
  }
  
  // Fallback: mensagem genérica mas amigável
  return {
    title: context ? `Erro ao ${context}` : 'Ops! Algo deu errado',
    message: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
    action: 'Se o problema persistir, entre em contato com o suporte',
    severity: 'error',
  };
}

/**
 * Adiciona novo mapeamento de erro (útil para erros específicos da aplicação)
 */
export function registerErrorMessage(key: string, error: UserFriendlyError): void {
  ERROR_MESSAGES_MAP[key] = error;
}

/**
 * Formata erro para exibição com título, mensagem e ação
 */
export function formatErrorForDisplay(error: UserFriendlyError): string {
  let formatted = `**${error.title}**\n\n${error.message}`;
  if (error.action) {
    formatted += `\n\n💡 **${error.action}**`;
  }
  return formatted;
}
