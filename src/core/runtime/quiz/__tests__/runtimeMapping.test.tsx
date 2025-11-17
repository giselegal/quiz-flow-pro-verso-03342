import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuizRuntimeContainer } from '../QuizRuntimeContainer'

describe('Runtime mapping from editor block types', () => {
  it('renders quiz-question-header text', () => {
    const quizContent = {
      steps: [{ id: 'step-01', type: 'quiz-step', order: 0, blocks: [
        { id: 'b1', type: 'quiz-question-header', content: { text: 'Qual é seu estilo?' }, isSelected: false }
      ] }],
      metadata: {}
    }
    render(<QuizRuntimeContainer quizContent={quizContent} />)
    expect(screen.getByText(/Qual é seu estilo/i)).toBeDefined()
  })

  it('renders options-grid as buttons', () => {
    const quizContent = {
      steps: [{ id: 'step-01', type: 'quiz-step', order: 0, blocks: [
        { id: 'b2', type: 'options-grid', content: { options: [{ id: 'o1', text: 'Natural' }, { id: 'o2', text: 'Elegante' }] }, isSelected: false }
      ] }],
      metadata: {}
    }
    render(<QuizRuntimeContainer quizContent={quizContent} />)
    expect(screen.getByText(/Natural/i)).toBeDefined()
    expect(screen.getByText(/Elegante/i)).toBeDefined()
  })
})