import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { funnelService } from '@/services/canonical/FunnelService'

export type PersistenceOptions = {
  autoSaveInterval?: number // ms
  enableAutoSave?: boolean
  onSaveSuccess?: (stepKey: string) => void
  onSaveError?: (stepKey: string, error: Error) => void
  getDirtyBlocks?: () => { stepKey: string; blocks: any[] } | null
}

export function useEditorPersistence(options: PersistenceOptions = {}) {
  const {
    autoSaveInterval = 3000, // 3s padrão
    enableAutoSave = true,
    onSaveSuccess,
    onSaveError,
    getDirtyBlocks,
  } = options

  const [pendingSaves, setPendingSaves] = useState<Set<string>>(new Set())
  const [lastSaved, setLastSaved] = useState<Record<string, number>>({})
  
  // Auto-save debounce timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pendingAutoSaveRef = useRef<{ stepKey: string; blocks: any[] } | null>(null)

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

  // Auto-save trigger com debouncing
  const triggerAutoSave = useCallback((stepKey: string, blocks: any[]) => {
    if (!enableAutoSave || !stepKey) return

    // Armazenar dados do auto-save pendente
    pendingAutoSaveRef.current = { stepKey, blocks }

    // Limpar timer anterior
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    // Configurar novo timer
    autoSaveTimerRef.current = setTimeout(async () => {
      const pending = pendingAutoSaveRef.current
      if (pending && pending.stepKey === stepKey) {
        console.log(`🔄 Auto-saving step: ${stepKey}`)
        await saveStepBlocks(pending.stepKey, pending.blocks)
        pendingAutoSaveRef.current = null
      }
      autoSaveTimerRef.current = null
    }, autoSaveInterval)
  }, [enableAutoSave, autoSaveInterval, saveStepBlocks])

  // Cancelar auto-save pendente
  const cancelAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
      autoSaveTimerRef.current = null
    }
    pendingAutoSaveRef.current = null
  }, [])

  // Forçar auto-save imediato se houver dados pendentes
  const flushAutoSave = useCallback(async () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
      autoSaveTimerRef.current = null
    }

    const pending = pendingAutoSaveRef.current
    if (pending) {
      console.log(`⚡ Flushing auto-save for step: ${pending.stepKey}`)
      await saveStepBlocks(pending.stepKey, pending.blocks)
      pendingAutoSaveRef.current = null
    }
  }, [saveStepBlocks])

  // Auto-save periódico usando getDirtyBlocks
  useEffect(() => {
    if (!enableAutoSave || !getDirtyBlocks) return

    const interval = setInterval(() => {
      const dirtyData = getDirtyBlocks()
      if (dirtyData) {
        triggerAutoSave(dirtyData.stepKey, dirtyData.blocks)
      }
    }, Math.max(autoSaveInterval / 2, 1000)) // Verificar a cada metade do intervalo, mínimo 1s

    return () => clearInterval(interval)
  }, [enableAutoSave, getDirtyBlocks, triggerAutoSave, autoSaveInterval])

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [])

  const getSaveStatus = useCallback((stepKey: string) => {
    return {
      isSaving: pendingSaves.has(stepKey),
      lastSavedAt: lastSaved[stepKey] || null,
      timeSinceLastSave: lastSaved[stepKey] ? Date.now() - lastSaved[stepKey] : null,
    }
  }, [pendingSaves, lastSaved])

  const api = useMemo(() => ({
    saveStepBlocks,
    triggerAutoSave,
    cancelAutoSave,
    flushAutoSave,
    getSaveStatus,
    pendingSaves: Array.from(pendingSaves),
    lastSaved,
    hasAutoSavePending: pendingAutoSaveRef.current !== null,
  }), [saveStepBlocks, triggerAutoSave, cancelAutoSave, flushAutoSave, getSaveStatus, pendingSaves, lastSaved])

  return api
}