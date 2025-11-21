import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { blockSchemas as libBlockSchemas } from '../lib/validation'
import { blockSchemas as typeBlockSchemas } from '../types/schemas/blockSchemas'

function loadStep20() {
  const file = path.resolve(process.cwd(), 'public', 'templates', 'funnels', 'quiz21StepsComplete', 'steps', 'step-20.json')
  const raw = fs.readFileSync(file, 'utf-8')
  return JSON.parse(raw)
}

describe('SchemaValidator step-20 blocks', () => {
  it('validates merged schemas for key block types', () => {
    const merged: Record<string, any> = { ...typeBlockSchemas, ...libBlockSchemas }
    const textInlinePayload = { content: '<p>HTML aqui</p>', textAlign: 'left', fontSize: '14px' }
    const resultSharePayload = { title: 'Compartilhe', message: 'Faça o quiz!', platforms: ['facebook', 'twitter'] }
    const ctaPayload = { text: 'Quero meu estilo', url: 'https://example.com', style: 'primary', size: 'lg' }

    expect(merged['text-inline'].safeParse(textInlinePayload).success).toBe(true)
    expect(merged['result-share'].safeParse(resultSharePayload).success).toBe(true)
    expect(merged['result-cta'].safeParse(ctaPayload).success).toBe(true)
  })
})