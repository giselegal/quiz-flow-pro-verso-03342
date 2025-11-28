/**
 * Funnel Steps Controller - Operações CRUD para steps individuais
 * 
 * Endpoints:
 * - GET    /api/funnels/:funnelId/steps/:stepId      - Buscar step individual
 * - PUT    /api/funnels/:funnelId/steps/:stepId      - Atualizar step
 * - POST   /api/funnels/:funnelId/steps              - Adicionar novo step
 * - DELETE /api/funnels/:funnelId/steps/:stepId      - Remover step
 * - PUT    /api/funnels/:funnelId/steps/reorder      - Reordenar steps
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { getSupabaseServiceClient } from '@/services/supabaseServiceClient';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = getSupabaseServiceClient();

// ==================================================================================
// Schemas de Validação
// ==================================================================================

const StepIdParamSchema = z.object({
  funnelId: z.string().uuid(),
  stepId: z.string().regex(/^step-\d+$/, 'stepId deve estar no formato step-XX')
});

const CreateStepSchema = z.object({
  stepId: z.string().regex(/^step-\d+$/).optional(), // Auto-gerado se omitido
  templateVersion: z.string().default('4.0'),
  metadata: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional()
  }),
  blocks: z.array(z.object({
    id: z.string(),
    type: z.string(),
    order: z.number().optional(),
    content: z.any().optional(),
    properties: z.any().optional(),
    style: z.any().optional()
  })),
  navigation: z.any().optional(),
  validation: z.any().optional()
});

const UpdateStepSchema = CreateStepSchema.partial().omit({ stepId: true });

const ReorderStepsSchema = z.object({
  order: z.array(z.string().regex(/^step-\d+$/))
});

// ==================================================================================
// Logger
// ==================================================================================

class Logger {
  private log(level: string, message: string, context?: any) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      service: 'funnel-steps-controller',
      ...context
    }));
  }

  info(message: string, context?: any) {
    this.log('info', message, context);
  }

  error(message: string, error?: Error, context?: any) {
    this.log('error', message, {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }

  warn(message: string, context?: any) {
    this.log('warn', message, context);
  }
}

const logger = new Logger();

// ==================================================================================
// Helper Functions
// ==================================================================================

/**
 * Busca settings do funil usando jsonb_path_query para otimização
 */
async function getFunnelSettings(funnelId: string) {
  const { data, error } = await supabase
    .from('funnels')
    .select('id, name, settings')
    .eq('id', funnelId)
    .single();

  if (error) throw new Error(`Funil não encontrado: ${error.message}`);
  if (!data) throw new Error('Funil não encontrado');

  return data;
}

/**
 * Atualiza step específico usando jsonb_set
 */
async function updateStepInSettings(funnelId: string, stepId: string, stepData: any) {
  const { data, error } = await supabase.rpc('update_funnel_step', {
    p_funnel_id: funnelId,
    p_step_id: stepId,
    p_step_data: stepData
  });

  if (error) {
    logger.error('Erro ao atualizar step via RPC', error, { funnelId, stepId });
    // Fallback: atualizar settings completo
    const funnel = await getFunnelSettings(funnelId);
    const settings = funnel.settings || {};
    const steps = settings.steps || {};
    
    steps[stepId] = stepData;
    
    const { error: updateError } = await supabase
      .from('funnels')
      .update({
        settings: {
          ...settings,
          steps
        }
      })
      .eq('id', funnelId);
    
    if (updateError) throw updateError;
  }

  return data;
}

/**
 * Remove step usando jsonb_set
 */
async function deleteStepFromSettings(funnelId: string, stepId: string) {
  const funnel = await getFunnelSettings(funnelId);
  const settings = funnel.settings || {};
  const steps = settings.steps || {};
  
  delete steps[stepId];
  
  const { error } = await supabase
    .from('funnels')
    .update({
      settings: {
        ...settings,
        steps,
        totalSteps: Object.keys(steps).length
      }
    })
    .eq('id', funnelId);
  
  if (error) throw error;
}

/**
 * Gera próximo stepId disponível
 */
function getNextStepId(existingSteps: Record<string, any>): string {
  const stepNumbers = Object.keys(existingSteps)
    .map(key => parseInt(key.match(/\d+/)?.[0] || '0'))
    .filter(num => !isNaN(num));
  
  const maxStep = stepNumbers.length > 0 ? Math.max(...stepNumbers) : 0;
  const nextStep = maxStep + 1;
  
  return `step-${nextStep.toString().padStart(2, '0')}`;
}

// ==================================================================================
// Controllers
// ==================================================================================

/**
 * GET /api/funnels/:funnelId/steps/:stepId
 * Busca step individual
 */
export async function getStep(req: Request, res: Response) {
  try {
    const { funnelId, stepId } = StepIdParamSchema.parse(req.params);
    
    logger.info('Buscando step', { funnelId, stepId });
    
    const funnel = await getFunnelSettings(funnelId);
    const steps = funnel.settings?.steps || {};
    const step = steps[stepId];
    
    if (!step) {
      logger.warn('Step não encontrado', { funnelId, stepId });
      return res.status(404).json({
        error: 'Step não encontrado',
        funnelId,
        stepId
      });
    }
    
    res.json({
      funnelId,
      stepId,
      data: step
    });
    
  } catch (error) {
    logger.error('Erro ao buscar step', error as Error, {
      params: req.params
    });
    
    res.status(500).json({
      error: 'Erro ao buscar step',
      message: (error as Error).message
    });
  }
}

/**
 * PUT /api/funnels/:funnelId/steps/:stepId
 * Atualiza step existente
 */
export async function updateStep(req: Request, res: Response) {
  try {
    const { funnelId, stepId } = StepIdParamSchema.parse(req.params);
    const stepData = UpdateStepSchema.parse(req.body);
    
    logger.info('Atualizando step', { funnelId, stepId });
    
    // Buscar step atual
    const funnel = await getFunnelSettings(funnelId);
    const steps = funnel.settings?.steps || {};
    const currentStep = steps[stepId];
    
    if (!currentStep) {
      return res.status(404).json({
        error: 'Step não encontrado',
        funnelId,
        stepId
      });
    }
    
    // Merge com dados atuais
    const updatedStep = {
      ...currentStep,
      ...stepData,
      metadata: {
        ...currentStep.metadata,
        ...(stepData.metadata || {})
      },
      _modified: true,
      _modifiedAt: new Date().toISOString()
    };
    
    // Atualizar no banco
    await updateStepInSettings(funnelId, stepId, updatedStep);
    
    logger.info('Step atualizado com sucesso', { funnelId, stepId });
    
    res.json({
      success: true,
      funnelId,
      stepId,
      data: updatedStep
    });
    
  } catch (error) {
    logger.error('Erro ao atualizar step', error as Error, {
      params: req.params,
      body: req.body
    });
    
    res.status(500).json({
      error: 'Erro ao atualizar step',
      message: (error as Error).message
    });
  }
}

/**
 * POST /api/funnels/:funnelId/steps
 * Adiciona novo step ao funil
 */
export async function createStep(req: Request, res: Response) {
  try {
    const { funnelId } = z.object({ funnelId: z.string().uuid() }).parse(req.params);
    const stepData = CreateStepSchema.parse(req.body);
    
    logger.info('Criando novo step', { funnelId });
    
    const funnel = await getFunnelSettings(funnelId);
    const settings = funnel.settings || {};
    const steps = settings.steps || {};
    
    // Gerar stepId se não fornecido
    const stepId = stepData.stepId || getNextStepId(steps);
    
    // Verificar se já existe
    if (steps[stepId]) {
      return res.status(409).json({
        error: 'Step já existe',
        funnelId,
        stepId,
        suggestion: getNextStepId(steps)
      });
    }
    
    // Criar step com metadados
    const newStep = {
      templateVersion: stepData.templateVersion,
      metadata: {
        ...stepData.metadata,
        id: stepData.metadata.id || stepId
      },
      blocks: stepData.blocks,
      navigation: stepData.navigation,
      validation: stepData.validation,
      _created: true,
      _createdAt: new Date().toISOString()
    };
    
    // Adicionar ao funil
    await updateStepInSettings(funnelId, stepId, newStep);
    
    // Atualizar totalSteps
    const { error: updateError } = await supabase
      .from('funnels')
      .update({
        settings: {
          ...settings,
          steps: {
            ...steps,
            [stepId]: newStep
          },
          totalSteps: Object.keys(steps).length + 1
        }
      })
      .eq('id', funnelId);
    
    if (updateError) throw updateError;
    
    logger.info('Step criado com sucesso', { funnelId, stepId });
    
    res.status(201).json({
      success: true,
      funnelId,
      stepId,
      data: newStep
    });
    
  } catch (error) {
    logger.error('Erro ao criar step', error as Error, {
      params: req.params,
      body: req.body
    });
    
    res.status(500).json({
      error: 'Erro ao criar step',
      message: (error as Error).message
    });
  }
}

/**
 * DELETE /api/funnels/:funnelId/steps/:stepId
 * Remove step do funil
 */
export async function deleteStep(req: Request, res: Response) {
  try {
    const { funnelId, stepId } = StepIdParamSchema.parse(req.params);
    
    logger.info('Removendo step', { funnelId, stepId });
    
    const funnel = await getFunnelSettings(funnelId);
    const steps = funnel.settings?.steps || {};
    
    if (!steps[stepId]) {
      return res.status(404).json({
        error: 'Step não encontrado',
        funnelId,
        stepId
      });
    }
    
    await deleteStepFromSettings(funnelId, stepId);
    
    logger.info('Step removido com sucesso', { funnelId, stepId });
    
    res.json({
      success: true,
      funnelId,
      stepId,
      message: 'Step removido com sucesso'
    });
    
  } catch (error) {
    logger.error('Erro ao remover step', error as Error, {
      params: req.params
    });
    
    res.status(500).json({
      error: 'Erro ao remover step',
      message: (error as Error).message
    });
  }
}

/**
 * PUT /api/funnels/:funnelId/steps/reorder
 * Reordena steps do funil
 */
export async function reorderSteps(req: Request, res: Response) {
  try {
    const { funnelId } = z.object({ funnelId: z.string().uuid() }).parse(req.params);
    const { order } = ReorderStepsSchema.parse(req.body);
    
    logger.info('Reordenando steps', { funnelId, newOrder: order });
    
    const funnel = await getFunnelSettings(funnelId);
    const settings = funnel.settings || {};
    const currentSteps = settings.steps || {};
    
    // Validar que todos os stepIds existem
    const missingSteps = order.filter(stepId => !currentSteps[stepId]);
    if (missingSteps.length > 0) {
      return res.status(400).json({
        error: 'Steps não encontrados',
        missingSteps
      });
    }
    
    // Criar novo objeto de steps com ordem atualizada
    const reorderedSteps: Record<string, any> = {};
    
    order.forEach((stepId, index) => {
      reorderedSteps[`step-${(index + 1).toString().padStart(2, '0')}`] = {
        ...currentSteps[stepId],
        metadata: {
          ...currentSteps[stepId].metadata,
          order: index + 1
        }
      };
    });
    
    // Atualizar no banco
    const { error: updateError } = await supabase
      .from('funnels')
      .update({
        settings: {
          ...settings,
          steps: reorderedSteps
        }
      })
      .eq('id', funnelId);
    
    if (updateError) throw updateError;
    
    logger.info('Steps reordenados com sucesso', { funnelId });
    
    res.json({
      success: true,
      funnelId,
      newOrder: Object.keys(reorderedSteps)
    });
    
  } catch (error) {
    logger.error('Erro ao reordenar steps', error as Error, {
      params: req.params,
      body: req.body
    });
    
    res.status(500).json({
      error: 'Erro ao reordenar steps',
      message: (error as Error).message
    });
  }
}
