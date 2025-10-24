/**
 * 🔌 API ENDPOINT - SAVE TEMPLATE
 * 
 * Endpoint para receber e salvar mudanças no quiz21-complete.json
 * 
 * Uso:
 *   POST /api/templates/save
 *   Body: { template object }
 * 
 *   POST /api/templates/apply-changes
 *   Body: { changes: [ { type, stepId, ... } ] }
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Request, Response } from 'express';

const TEMPLATE_PATH = join(process.cwd(), 'public/templates/quiz21-complete.json');
const BACKUP_DIR = join(process.cwd(), 'public/templates/backups');

// ============================================================================
// UTILITIES
// ============================================================================

function loadTemplate() {
  if (!existsSync(TEMPLATE_PATH)) {
    throw new Error('Template file not found');
  }
  const content = readFileSync(TEMPLATE_PATH, 'utf-8');
  return JSON.parse(content);
}

function saveTemplate(template: any) {
  // Criar backup antes de salvar
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = join(BACKUP_DIR, `quiz21-complete-${timestamp}.json`);
  
  if (existsSync(TEMPLATE_PATH)) {
    const backup = readFileSync(TEMPLATE_PATH, 'utf-8');
    writeFileSync(backupPath, backup, 'utf-8');
    console.log('📦 Backup criado:', backupPath);
  }
  
  // Salvar novo template
  const content = JSON.stringify(template, null, 2);
  writeFileSync(TEMPLATE_PATH, content, 'utf-8');
  console.log('✅ Template salvo:', TEMPLATE_PATH);
}

// ============================================================================
// HANDLERS
// ============================================================================

/**
 * 💾 SAVE COMPLETE TEMPLATE
 */
export async function handleSaveTemplate(req: Request, res: Response) {
  try {
    const template = req.body;
    
    if (!template || !template.id || !template.steps) {
      return res.status(400).json({ 
        error: 'Invalid template structure',
        required: ['id', 'steps']
      });
    }
    
    saveTemplate(template);
    
    res.json({ 
      success: true, 
      message: 'Template saved successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Error saving template:', error);
    res.status(500).json({ 
      error: 'Failed to save template',
      message: error.message
    });
  }
}

/**
 * 🔄 APPLY INCREMENTAL CHANGES
 */
export async function handleApplyChanges(req: Request, res: Response) {
  try {
    const { changes } = req.body;
    
    if (!Array.isArray(changes)) {
      return res.status(400).json({ 
        error: 'Changes must be an array'
      });
    }
    
    const template = loadTemplate();
    
    // Aplicar cada mudança
    for (const change of changes) {
      applyChange(template, change);
    }
    
    saveTemplate(template);
    
    res.json({ 
      success: true, 
      message: `${changes.length} changes applied`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Error applying changes:', error);
    res.status(500).json({ 
      error: 'Failed to apply changes',
      message: error.message
    });
  }
}

/**
 * 🔧 APPLY SINGLE CHANGE
 */
function applyChange(template: any, change: any) {
  const step = template.steps.find((s: any) => s.id === change.stepId);
  
  if (!step) {
    console.warn(`Step ${change.stepId} not found, skipping change`);
    return;
  }
  
  switch (change.type) {
    case 'reorder':
      // Reordenar blocos
      step.blocks = change.blocks.map((ref: any) => 
        step.blocks.find((b: any) => b.id === ref.id)
      ).filter(Boolean);
      break;
      
    case 'add':
      // Adicionar bloco
      if (change.position === -1) {
        step.blocks.push(change.block);
      } else {
        step.blocks.splice(change.position, 0, change.block);
      }
      break;
      
    case 'remove':
      // Remover bloco
      step.blocks = step.blocks.filter((b: any) => b.id !== change.blockId);
      break;
      
    case 'update':
      // Atualizar propriedades do bloco
      const block = step.blocks.find((b: any) => b.id === change.blockId);
      if (block) {
        block.data = { ...block.data, ...change.data };
      }
      break;
      
    default:
      console.warn(`Unknown change type: ${change.type}`);
  }
}

/**
 * 📋 GET TEMPLATE
 */
export async function handleGetTemplate(req: Request, res: Response) {
  try {
    const template = loadTemplate();
    res.json(template);
  } catch (error: any) {
    console.error('Error loading template:', error);
    res.status(500).json({ 
      error: 'Failed to load template',
      message: error.message
    });
  }
}

/**
 * 📜 LIST BACKUPS
 */
export async function handleListBackups(req: Request, res: Response) {
  try {
    if (!existsSync(BACKUP_DIR)) {
      return res.json({ backups: [] });
    }
    
    const files = require('fs').readdirSync(BACKUP_DIR);
    const backups = files
      .filter((f: string) => f.startsWith('quiz21-complete-'))
      .map((f: string) => ({
        filename: f,
        path: join(BACKUP_DIR, f),
        timestamp: f.replace('quiz21-complete-', '').replace('.json', '')
      }))
      .sort((a: any, b: any) => b.timestamp.localeCompare(a.timestamp));
    
    res.json({ backups });
    
  } catch (error: any) {
    console.error('Error listing backups:', error);
    res.status(500).json({ 
      error: 'Failed to list backups',
      message: error.message
    });
  }
}

/**
 * ♻️ RESTORE FROM BACKUP
 */
export async function handleRestoreBackup(req: Request, res: Response) {
  try {
    const { filename } = req.body;
    
    if (!filename) {
      return res.status(400).json({ error: 'Filename required' });
    }
    
    const backupPath = join(BACKUP_DIR, filename);
    
    if (!existsSync(backupPath)) {
      return res.status(404).json({ error: 'Backup not found' });
    }
    
    const backup = readFileSync(backupPath, 'utf-8');
    const template = JSON.parse(backup);
    
    saveTemplate(template);
    
    res.json({ 
      success: true, 
      message: `Restored from ${filename}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Error restoring backup:', error);
    res.status(500).json({ 
      error: 'Failed to restore backup',
      message: error.message
    });
  }
}
