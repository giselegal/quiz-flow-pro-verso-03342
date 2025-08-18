import FileLoadingSimulator from '@/components/loading/FileLoadingSimulator';

interface LoadingAccessPageProps {
  route?: string;
}

const LoadingAccessPage: React.FC<LoadingAccessPageProps> = ({ route }) => {
  // Definir as rotas disponíveis e seus redirecionamentos
  const routeMap: Record<string, string> = {
    editor: '/editor-fixed',
    admin: '/admin',
    dashboard: '/admin/dashboard',
    'unified-editor': '/admin/unified-editor',
    'result-editor': '/admin/result/editor',
    'sales-editor': '/admin/sales/editor',
    lovable: 'https://a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com',
    'lovable-admin': 'https://a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com/admin',
    'lovable-editor':
      'https://a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com/resultado/editor',
  };

  // Determinar para onde redirecionar
  let redirectPath = route && routeMap[route] ? routeMap[route] : '/admin';

  // Configurações dinâmicas baseadas na rota
  const getSpeedForRoute = (route?: string): 'slow' | 'medium' | 'fast' => {
    if (!route) return 'medium';

    if (['lovable', 'lovable-admin', 'lovable-editor'].includes(route)) {
      return 'slow'; // Rotas externas mais lentas
    }

    if (['editor', 'unified-editor'].includes(route)) {
      return 'medium'; // Editores são médios
    }

    return 'fast'; // Outras rotas são rápidas
  };

  const getTotalFiles = (route?: string): number => {
    if (!route) return 3700;

    if (['lovable', 'lovable-admin', 'lovable-editor'].includes(route)) {
      return 4200; // Mais arquivos para Lovable
    }

    if (['editor', 'unified-editor', 'result-editor', 'sales-editor'].includes(route)) {
      return 3700; // Quantidade padrão para editores
    }

    return 2500; // Menos arquivos para outras rotas
  };

  return (
    <FileLoadingSimulator
      initialLoaded={2000}
      totalFiles={getTotalFiles(route)}
      redirectAfterComplete={redirectPath}
      speed={getSpeedForRoute(route)}
    />
  );
};

export default LoadingAccessPage;
