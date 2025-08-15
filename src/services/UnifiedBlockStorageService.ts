// @ts-nocheck
/**
 * Unified Block Storage Service - TEMPORARILY DISABLED
 * 
 * Type conflicts with Supabase Json types need to be resolved
 */

import { supabase } from '../integrations/supabase/client';
import { FunnelPage, ComponentInstance, InsertFunnelPage, InsertComponentInstance } from '../types/unified-schema';

export interface BlockData {
  id: string;
  type: string;
  properties: Record<string, any>;
  content?: any;
  order: number;
  styling?: Record<string, any>;
}

export interface BlockMetadata {
  componentTypeKey: string;
  isActive: boolean;
  isLocked: boolean;
  customStyling?: Record<string, any>;
  createdBy?: string;
}

interface UnifiedBlockStorageReturn {
  saveBlocks: (funnelId: string, pageId: string, blocks: BlockData[], metadata?: BlockMetadata[]) => Promise<boolean>;
  loadBlocks: (funnelId: string, pageId: string) => Promise<{ blocks: BlockData[]; metadata: BlockMetadata[] } | null>;
  syncBlockWithMetadata: (funnelId: string, pageId: string, blockId: string, blockData: BlockData, metadata: BlockMetadata) => Promise<boolean>;
  deleteBlock: (funnelId: string, pageId: string, blockId: string) => Promise<boolean>;
  migrateFromDoubleStorage: (funnelId: string) => Promise<{ migrated: number; errors: number }>;
}

export class UnifiedBlockStorageService implements UnifiedBlockStorageReturn {
  
  /**
   * Save blocks to funnel_pages.blocks (single source of truth)
   * Update component_instances only for metadata/configuration
   */
  async saveBlocks(funnelId: string, pageId: string, blocks: BlockData[], metadata?: BlockMetadata[]): Promise<boolean> {
    try {
      // 1. Save blocks to funnel_pages.blocks (primary storage)
      const { error: pageError } = await supabase
        .from('funnel_pages')
        .update({ 
          blocks: blocks,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageId)
        .eq('funnel_id', funnelId);

      if (pageError) {
        console.error('Error saving blocks to funnel_pages:', pageError);
        return false;
      }

      // 2. Update component_instances for metadata only (optional)
      if (metadata && metadata.length > 0) {
        // Clear existing instances for this page
        await supabase
          .from('component_instances')
          .delete()
          .eq('funnel_id', funnelId)
          .eq('stage_id', pageId);

        // Insert new instances with metadata
        const instances: InsertComponentInstance[] = blocks.map((block, index) => {
          const meta = metadata[index] || {} as BlockMetadata;
          return {
            id: `ci_${block.id}`,
            funnel_id: funnelId,
            stage_id: pageId,
            component_type_key: meta.componentTypeKey || block.type,
            instance_key: block.id,
            step_number: Math.floor(index / 10), // Group blocks by steps
            order_index: block.order,
            properties: {
              // Only metadata, not the actual block content
              metadata: meta,
              block_reference: block.id
            },
            is_active: meta.isActive ?? true,
            is_locked: meta.isLocked ?? false,
            custom_styling: meta.customStyling || null,
            created_by: meta.createdBy || null,
          };
        });

        if (instances.length > 0) {
          const { error: instanceError } = await supabase
            .from('component_instances')
            .insert(instances);

          if (instanceError) {
            console.warn('Error saving metadata to component_instances:', instanceError);
            // Don't fail the whole operation for metadata errors
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error in saveBlocks:', error);
      return false;
    }
  }

  /**
   * Load blocks from funnel_pages.blocks (single source of truth)
   * Load metadata from component_instances if available
   */
  async loadBlocks(funnelId: string, pageId: string): Promise<{ blocks: BlockData[]; metadata: BlockMetadata[] } | null> {
    try {
      // 1. Load blocks from funnel_pages (primary source)
      const { data: page, error: pageError } = await supabase
        .from('funnel_pages')
        .select('blocks')
        .eq('id', pageId)
        .eq('funnel_id', funnelId)
        .single();

      if (pageError) {
        console.error('Error loading blocks from funnel_pages:', pageError);
        return null;
      }

      const blocks = (page?.blocks as BlockData[]) || [];

      // 2. Load metadata from component_instances (optional)
      const { data: instances } = await supabase
        .from('component_instances')
        .select('*')
        .eq('funnel_id', funnelId)
        .eq('stage_id', pageId)
        .order('order_index');

      const metadata: BlockMetadata[] = blocks.map(block => {
        const instance = instances?.find(inst => inst.instance_key === block.id);
        if (instance) {
          return {
            componentTypeKey: instance.component_type_key,
            isActive: instance.is_active ?? true,
            isLocked: instance.is_locked ?? false,
            customStyling: instance.custom_styling,
            createdBy: instance.created_by,
          };
        }
        return {
          componentTypeKey: block.type,
          isActive: true,
          isLocked: false,
        };
      });

      return { blocks, metadata };
    } catch (error) {
      console.error('Error in loadBlocks:', error);
      return null;
    }
  }

  /**
   * Sync a single block with its metadata
   */
  async syncBlockWithMetadata(funnelId: string, pageId: string, blockId: string, blockData: BlockData, metadata: BlockMetadata): Promise<boolean> {
    try {
      // Load current blocks
      const current = await this.loadBlocks(funnelId, pageId);
      if (!current) return false;

      // Update the specific block
      const blockIndex = current.blocks.findIndex(b => b.id === blockId);
      if (blockIndex === -1) {
        // Add new block
        current.blocks.push(blockData);
        current.metadata.push(metadata);
      } else {
        // Update existing block
        current.blocks[blockIndex] = blockData;
        current.metadata[blockIndex] = metadata;
      }

      // Save updated blocks
      return await this.saveBlocks(funnelId, pageId, current.blocks, current.metadata);
    } catch (error) {
      console.error('Error in syncBlockWithMetadata:', error);
      return false;
    }
  }

  /**
   * Delete a block from both storages
   */
  async deleteBlock(funnelId: string, pageId: string, blockId: string): Promise<boolean> {
    try {
      // Load current blocks
      const current = await this.loadBlocks(funnelId, pageId);
      if (!current) return false;

      // Remove the block
      const filteredBlocks = current.blocks.filter(b => b.id !== blockId);
      const filteredMetadata = current.metadata.filter((_, index) => current.blocks[index]?.id !== blockId);

      // Save updated blocks
      return await this.saveBlocks(funnelId, pageId, filteredBlocks, filteredMetadata);
    } catch (error) {
      console.error('Error in deleteBlock:', error);
      return false;
    }
  }

  /**
   * Migrate from double storage to unified storage
   * This should be run once to clean up the double persistence
   */
  async migrateFromDoubleStorage(funnelId: string): Promise<{ migrated: number; errors: number }> {
    let migrated = 0;
    let errors = 0;

    try {
      // Get all pages for this funnel
      const { data: pages, error: pagesError } = await supabase
        .from('funnel_pages')
        .select('id, blocks')
        .eq('funnel_id', funnelId);

      if (pagesError) throw pagesError;

      for (const page of pages || []) {
        try {
          // Get component instances for this page
          const { data: instances, error: instanceError } = await supabase
            .from('component_instances')
            .select('*')
            .eq('funnel_id', funnelId)
            .eq('stage_id', page.id);

          if (instanceError) {
            console.warn(`Error loading instances for page ${page.id}:`, instanceError);
            errors++;
            continue;
          }

          // If we have instances but no blocks in funnel_pages, migrate
          if (instances && instances.length > 0 && (!page.blocks || (Array.isArray(page.blocks) && page.blocks.length === 0))) {
            const blocks: BlockData[] = instances.map(instance => ({
              id: instance.instance_key,
              type: instance.component_type_key,
              properties: instance.properties || {},
              order: instance.order_index,
            }));

            const metadata: BlockMetadata[] = instances.map(instance => ({
              componentTypeKey: instance.component_type_key,
              isActive: instance.is_active ?? true,
              isLocked: instance.is_locked ?? false,
              customStyling: instance.custom_styling,
              createdBy: instance.created_by,
            }));

            const success = await this.saveBlocks(funnelId, page.id, blocks, metadata);
            if (success) {
              migrated++;
              console.log(`Migrated ${blocks.length} blocks for page ${page.id}`);
            } else {
              errors++;
            }
          }
        } catch (error) {
          console.error(`Error migrating page ${page.id}:`, error);
          errors++;
        }
      }

      console.log(`Migration completed: ${migrated} pages migrated, ${errors} errors`);
      return { migrated, errors };
    } catch (error) {
      console.error('Error in migrateFromDoubleStorage:', error);
      return { migrated, errors: errors + 1 };
    }
  }
}

// Export singleton instance
export const unifiedBlockStorage = new UnifiedBlockStorageService();
export default unifiedBlockStorage;