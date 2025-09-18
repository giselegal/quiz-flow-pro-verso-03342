// @ts-nocheck
/**
 * 🚀 API ENDPOINT PARA MIGRAÇÃO AUTOMÁTICA
 * POST /api/admin/migrate - Executa migração do schema
 */

import { Request, Response } from 'express';
import MigrationService from '../../services/MigrationService';

export async function POST(req: Request, res: Response) {
  try {
    console.log('🔧 API de migração chamada');

    // Verificar se usuário tem permissão (opcional)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.includes('Bearer')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorização necessário',
      });
    }

    // 1. Verificar status atual
    console.log('📊 Verificando status atual...');
    const status = await MigrationService.checkSchemaStatus();

    // 2. Se não precisa migração, retornar status
    if (!status.needsMigration) {
      return res.json({
        success: true,
        message: 'Schema já está atualizado',
        status,
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Executar migração
    console.log('⚡ Executando migração...');
    const migrationResult = await MigrationService.executeMigrationDirect();

    // 4. Popular dados iniciais se migração foi bem-sucedida
    if (migrationResult.success) {
      console.log('🌱 Populando dados iniciais...');
      await MigrationService.seedInitialData();
    }

    // 5. Verificar status final
    const finalStatus = await MigrationService.checkSchemaStatus();

    return res.json({
      success: migrationResult.success,
      message: migrationResult.message,
      migration: migrationResult,
      statusBefore: status,
      statusAfter: finalStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Erro na API de migração:', error);

    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

// GET para verificar status
export async function GET(req: Request, res: Response) {
  try {
    console.log('📊 Verificando status do schema via API...');

    const status = await MigrationService.checkSchemaStatus();

    return res.json({
      success: true,
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Erro ao verificar status:', error);

    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar status',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
