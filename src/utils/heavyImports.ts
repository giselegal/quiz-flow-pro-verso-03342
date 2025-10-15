/**
 * 🎨 HEAVY IMPORTS OPTIMIZATION (P2)
 * 
 * Lazy loading de bibliotecas pesadas para reduzir bundle inicial
 * - Recharts (~410KB)
 * - React Icons
 * - Outras libs pesadas
 */

/**
 * Recharts (410KB) - Carregar sob demanda
 */
export const loadRecharts = async () => {
  const [
    { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell },
    { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer }
  ] = await Promise.all([
    import('recharts').then(m => ({
      LineChart: m.LineChart,
      Line: m.Line,
      BarChart: m.BarChart,
      Bar: m.Bar,
      PieChart: m.PieChart,
      Pie: m.Pie,
      Cell: m.Cell,
    })),
    import('recharts').then(m => ({
      XAxis: m.XAxis,
      YAxis: m.YAxis,
      CartesianGrid: m.CartesianGrid,
      Tooltip: m.Tooltip,
      Legend: m.Legend,
      ResponsiveContainer: m.ResponsiveContainer,
    }))
  ]);

  return {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
  };
};

/**
 * React Icons - Carregar ícones específicos sob demanda
 */
export const loadLucideIcons = async (iconNames: string[]) => {
  const icons: Record<string, any> = {};
  
  // Carrega apenas os ícones solicitados
  await Promise.all(
    iconNames.map(async (iconName) => {
      try {
        const icon = await import(`lucide-react`).then(m => m[iconName]);
        icons[iconName] = icon;
      } catch (error) {
        console.warn(`Icon ${iconName} not found in lucide-react`);
      }
    })
  );

  return icons;
};

/**
 * Date-fns - Carregar funções específicas
 */
export const loadDateFns = async (fns: string[]): Promise<Record<string, any>> => {
  const dateFns: Record<string, any> = {};
  
  // Import completo e depois extrai funções
  const dateFnsModule = await import('date-fns');
  
  fns.forEach((fnName) => {
    if (fnName in dateFnsModule) {
      dateFns[fnName] = (dateFnsModule as any)[fnName];
    } else {
      console.warn(`Function ${fnName} not found in date-fns`);
    }
  });

  return dateFns;
};

/**
 * Cache de imports pesados
 */
const importCache = new Map<string, any>();

export const getCachedImport = async <T>(
  key: string,
  importFn: () => Promise<T>
): Promise<T> => {
  if (importCache.has(key)) {
    return importCache.get(key);
  }

  const result = await importFn();
  importCache.set(key, result);
  return result;
};

export default {
  loadRecharts,
  loadLucideIcons,
  loadDateFns,
  getCachedImport,
};
