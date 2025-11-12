import { useState } from 'react'
import type { AutosaveStatus } from './AutosaveIndicator'

export function useAutosaveIndicator() {
  const [status, setStatus] = useState<AutosaveStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const setSaving = () => {
    setStatus('saving')
    setErrorMessage(undefined)
  }

  const setSaved = () => {
    setStatus('saved')
    setErrorMessage(undefined)
  }

  const setError = (message?: string) => {
    setStatus('error')
    setErrorMessage(message)
  }

  const setUnsaved = () => {
    setStatus('unsaved')
    setErrorMessage(undefined)
  }

  const reset = () => {
    setStatus('idle')
    setErrorMessage(undefined)
  }

  return { status, errorMessage, setSaving, setSaved, setError, setUnsaved, reset }
}
