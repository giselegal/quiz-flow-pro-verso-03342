import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Block } from '@/types/editor';

interface ComponentInstanceRow {
  id: string;
  component_type_key: string;
  properties: Record<string, any> | null;
  custom_styling?: Record<string, any> | null;
  config: Record<string, any> | null;
  funnel_id?: string | null;
  step_number?: number | null;
  order_index?: number | null;
}

export function useBlocksFromSupabase(
  funnelId: string,
  stepNumber: number
): UseQueryResult<Block[], Error> {
  return useQuery<Block[], Error>({
    queryKey: ['blocks', funnelId, stepNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('component_instances')
        .select('*')
        .eq('funnel_id', funnelId)
        .eq('step_number', stepNumber)
        .order('order_index', { ascending: true });

      if (error) throw new Error(error.message);

      const rows = (data || []) as ComponentInstanceRow[];

      const blocks: Block[] = rows.map((row, idx) => ({
        id: row.id,
        type: row.component_type_key as any,
        content: (row.config ?? {}) as any,
        properties: (row.properties ?? {}) as any,
        order: row.order_index ?? idx,
      }));

      return blocks;
    },
    enabled: !!funnelId && Number.isFinite(stepNumber as any),
    staleTime: 10_000,
  });
}

export default useBlocksFromSupabase;
