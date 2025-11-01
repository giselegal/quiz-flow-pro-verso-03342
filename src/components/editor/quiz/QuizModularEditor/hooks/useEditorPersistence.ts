import { useCallback, useEffect, useMemo, useState } from 'react'
import { funnelService } from '@/services/canonical/FunnelService'

export type PersistenceOptions = {
  autoSaveInterval?: number // ms
  enableAutoSave?: boolean
  onSaveSuccess?: (stepKey: string) => void
  onSaveError?: (stepKey: string, error: Error) => void
}

export function useEditorPersistence(options: PersistenceOptions = {}) {
  const {
    autoSaveInterval = 3000, // 3s padrão
    enableAutoSave = true,
    onSaveSuccess,
    onSaveError,
  } = options

  const [pendingSaves, setPendingSaves] = useState<Set<string>>(new Set())
  const [lastSaved, setLastSaved] = useState<Record<string, number>>({})

  const saveStepBlocks = useCallback(async (stepKey: string, blocks: any[]) => {
    if (!stepKey) return { success: false, error: 'Step key required' }

    setPendingSaves(prev => new Set([...prev, stepKey]))

    try {
      // Usar FunnelService canônico para persistir
      // TODO: Obter funnelId do contexto/props; usando 'current' como fallback
      const funnelId = 'current' // Placeholder - implementar contexto de funnel
      const success = await funnelService.saveStepBlocks(funnelId, stepKey, blocks)
      
      if (success) {
        setLastSaved(prev => ({ ...prev, [stepKey]: Date.now() }))
        setPendingSaves(prev => {
          const next = new Set(prev)
          next.delete(stepKey)
          return next
        })
        onSaveSuccess?.(stepKey)
        return { success: true }
      } else {
        setPendingSaves(prev => {
          const next = new Set(prev)
          next.delete(stepKey)
          return next
        })
        onSaveError?.(stepKey, new Error('Save failed'))
        return { success: false, error: 'Save failed' }
      }
    } catch (error) {
      setPendingSaves(prev => {
        const next = new Set(prev)
        next.delete(stepKey)
        return next
      })
      const err = error instanceof Error ? error : new Error('Unknown save error')
      onSaveError?.(stepKey, err)
      return { success: false, error: err.message }
    }
  }, [onSaveSuccess, onSaveError])

  const getSaveStatus = useCallback((stepKey: string) => {
    return {
      isSaving: pendingSaves.has(stepKey),
      lastSavedAt: lastSaved[stepKey] || null,
      timeSinceLastSave: lastSaved[stepKey] ? Date.now() - lastSaved[stepKey] : null,
    }
  }, [pendingSaves, lastSaved])

  const api = useMemo(() => ({
    saveStepBlocks,
    getSaveStatus,
    pendingSaves: Array.from(pendingSaves),
    lastSaved,
  }), [saveStepBlocks, getSaveStatus, pendingSaves, lastSaved])

  return api
}