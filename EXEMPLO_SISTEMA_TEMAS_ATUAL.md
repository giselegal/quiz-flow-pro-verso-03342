# 🎨 Como Usar o Sistema de Temas Atual no Editor

## ✅ Sistema Já Implementado

Seu projeto tem 3 sistemas de temas robustos:

### 1. **next-themes** (Dark/Light Mode Global)
```tsx
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Alternar Tema: {theme}
    </button>
  )
}
```

### 2. **QuizThemes** (Temas Específicos para Quiz)
```tsx
import { useQuizTheme, QUIZ_THEMES } from '@/components/editor/interactive/styles/QuizThemes'

function TemplateEditor() {
  const { theme, getClass } = useQuizTheme('modern') // elegant, minimal, colorful
  
  return (
    <div className={getClass('background')}>
      <button className={getClass('primary')}>
        Botão com tema aplicado
      </button>
    </div>
  )
}
```

### 3. **Cores da Marca (Tailwind)**
```tsx
function BrandedComponent() {
  return (
    <div className="bg-gradient-to-r from-brand-darkBlue to-brand-lightBlue">
      <h1 className="text-brand-brightBlue">Título com cor da marca</h1>
      <button className="bg-brand-brightPink hover:bg-brand-brightBlue">
        Botão da marca
      </button>
    </div>
  )
}
```

## 🎯 Temas Disponíveis

### QuizThemes (Para Templates):
- `default` - Tema equilibrado para uso geral
- `elegant` - Sofisticado para público executivo  
- `modern` - Vibrante para público jovem
- `minimal` - Limpo e focado no conteúdo
- `colorful` - Divertido para público infantil

### Cores da Marca:
- `brand-darkBlue` - #1A0F3D
- `brand-mediumBlue` - #2E1A6B  
- `brand-lightBlue` - #4A2E9F
- `brand-brightBlue` - #00BFFF
- `brand-brightPink` - #FF00FF

## 🚀 Implementação Recomendada

Para adicionar seletor de tema no editor:

```tsx
import { useState } from 'react'
import { QUIZ_THEMES, QuizTheme } from '@/components/editor/interactive/styles/QuizThemes'

function ThemeSelector() {
  const [selectedTheme, setSelectedTheme] = useState<QuizTheme>('default')
  
  return (
    <div className="p-4 bg-gray-800/80 backdrop-blur-sm rounded-lg">
      <h3 className="text-brand-brightBlue font-semibold mb-3">
        🎨 Tema do Template
      </h3>
      
      <select 
        value={selectedTheme}
        onChange={(e) => setSelectedTheme(e.target.value as QuizTheme)}
        className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600"
      >
        {Object.entries(QUIZ_THEMES).map(([key, config]) => (
          <option key={key} value={key}>
            {config.name} - {config.description}
          </option>
        ))}
      </select>
      
      {/* Preview das cores */}
      <div className="mt-3 flex gap-2">
        {Object.entries(QUIZ_THEMES[selectedTheme].colors).map(([name, color]) => (
          <div 
            key={name}
            className={`w-6 h-6 rounded ${color} border border-gray-300`}
            title={name}
          />
        ))}
      </div>
    </div>
  )
}
```
