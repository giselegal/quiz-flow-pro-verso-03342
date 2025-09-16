// Augmented available components including Step 20 modular blocks
import { availableComponents as baseAvailableComponents, type ComponentDef, type IconName } from './availableComponents';

// Step 20 specific components to appear in the Components sidebar
const step20Components: ComponentDef[] = [
  {
    type: 'step20-result-header',
    name: 'Header Resultado (Step 20)',
    icon: 'confetti' as IconName,
    category: 'Resultado',
    description: 'Cabeçalho comemorativo do resultado com ícone e mensagem',
  },
  {
    type: 'step20-user-greeting',
    name: 'Saudação do Usuário',
    icon: 'info' as IconName,
    category: 'Resultado',
    description: 'Saudação personalizada com nome do usuário e emoji',
  },
  {
    type: 'step20-style-reveal',
    name: 'Revelação do Estilo',
    icon: 'palette' as IconName,
    category: 'Resultado',
    description: 'Bloco principal que revela o estilo encontrado',
  },
  {
    type: 'step20-compatibility',
    name: 'Compatibilidade',
    icon: 'target' as IconName,
    category: 'Resultado',
    description: 'Indicador de compatibilidade em porcentagem com animação',
  },
  {
    type: 'step20-secondary-styles',
    name: 'Estilos Secundários',
    icon: 'chart' as IconName,
    category: 'Resultado',
    description: 'Grid com estilos complementares e porcentagens',
  },
  {
    type: 'step20-personalized-offer',
    name: 'Oferta Personalizada',
    icon: 'money' as IconName,
    category: 'Conversão',
    description: 'CTA e ofertas baseadas no resultado do quiz',
  },
  {
    type: 'step20-complete-template',
    name: 'Template Completo (Step 20)',
    icon: 'sparkle' as IconName,
    category: 'Resultado',
    description: 'Composição pronta com todos os módulos da etapa 20',
  },
];

export const availableComponents: ComponentDef[] = [
  ...baseAvailableComponents,
  ...step20Components,
];

export type { IconName, ComponentDef };
