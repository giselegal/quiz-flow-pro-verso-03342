# Relatório de Dependências - Unificação

## Editores Analisados

### EditorPro.tsx
```typescript
1:import React from 'react';
2:import { cn } from '../../lib/utils';
3:import { QuizRenderer } from '../core/QuizRenderer';
4:import CanvasDropZone from './canvas/CanvasDropZone';
5:import { DndProvider } from './DndProvider';
6:import { useEditor } from './EditorProvider';
7:import { EnhancedComponentsSidebar } from './EnhancedComponentsSidebar';
```

### SchemaDrivenEditorResponsive.tsx
```typescript
1:import { useEditor } from '@/context/EditorContext';
2:import { BlockType } from '@/types/editor';
3:import { QuizMainDemo } from './QuizMainDemo';
4:import { CanvasDropZone } from './canvas/CanvasDropZone.simple';
5:import ComponentsSidebar from './components/ComponentsSidebar';
6:import FunnelStagesPanel from './funnel/FunnelStagesPanelUnified';
7:import './interactive/styles/quiz-animations.css';
8:import { FourColumnLayout } from './layout/FourColumnLayout';
9:import { PropertiesPanel } from './properties/PropertiesPanel';
10:import { EditorToolbar } from './toolbar/EditorToolbar';
12:import React, { useState } from 'react';
```

### QuizEditorInterface.tsx
```typescript
1:import React, { useState } from 'react';
2:import { Button } from '@/components/ui/button';
3:import { Card } from '@/components/ui/card';
4:import { toast } from '@/components/ui/use-toast';
```

### QuizEditorPro.tsx
```typescript
```
