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
  // ✅ Import único - evita ReferenceError de inicialização
  const recharts = await import('recharts');
  
  return {
    // Chart components
    LineChart: recharts.LineChart,
    Line: recharts.Line,
    AreaChart: recharts.AreaChart,
    Area: recharts.Area,
    BarChart: recharts.BarChart,
    Bar: recharts.Bar,
    PieChart: recharts.PieChart,
    Pie: recharts.Pie,
    Cell: recharts.Cell,
    ReferenceLine: recharts.ReferenceLine,
    // Axis and layout components
    XAxis: recharts.XAxis,
    YAxis: recharts.YAxis,
    CartesianGrid: recharts.CartesianGrid,
    Tooltip: recharts.Tooltip,
    Legend: recharts.Legend,
    ResponsiveContainer: recharts.ResponsiveContainer,
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
        const icon = await import('lucide-react').then(m => m[iconName]);
        icons[iconName] = icon;
      } catch (error) {
        console.warn(`Icon ${iconName} not found in lucide-react`);
      }
    }),
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
  importFn: () => Promise<T>,
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
