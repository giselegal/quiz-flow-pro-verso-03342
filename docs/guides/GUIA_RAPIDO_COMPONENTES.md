# 🚀 GUIA RÁPIDO: IMPLEMENTAÇÃO DE COMPONENTES EDITÁVEIS

Este guia rápido mostra como implementar rapidamente um novo componente editável seguindo o checklist criado.

## 📋 Checklist Rápido (5 minutos)

### ✅ 1. Criar o Componente

- [ ] Interface TypeScript completa
- [ ] Propriedades padrão definidas
- [ ] Callbacks de edição (onUpdate, onClick)
- [ ] Estilos responsivos
- [ ] Estados visuais (hover, selected, disabled)
- [ ] Debug logs

### ✅ 2. Criar Painel de Propriedades

- [ ] Função `render[ComponentName]Properties`
- [ ] Controles por tipo de propriedade
- [ ] Organização em cards
- [ ] Função de reset
- [ ] Debug info (desenvolvimento)

### ✅ 3. Integrar ao Sistema

- [ ] Adicionar ao `ComponentSpecificPropertiesPanel`
- [ ] Registrar no switch principal
- [ ] Adicionar ao `ComponentTestingPanel`
- [ ] Configurar nome amigável

### ✅ 4. Testar

- [ ] Teste em http://localhost:8082/test/components
- [ ] Verificar propriedades editáveis
- [ ] Validar estados visuais
- [ ] Confirmar logs de debug

## 📁 Estrutura de Arquivos

```
src/components/
├── blocks/[tipo]/           # Componente principal
│   └── MeuComponente.tsx    # Interface + implementação
├── editor/properties/       # Painel de propriedades
│   └── MeuComponenteProperties.tsx
└── examples/               # Exemplos e referências
    ├── ExampleEditableComponent.tsx
    └── ExampleEditableComponentProperties.tsx
```

## 💡 Exemplo Prático Completo

Veja os arquivos criados em `src/components/examples/`:

- `ExampleEditableComponent.tsx` - Componente completo com todos os recursos
- `ExampleEditableComponentProperties.tsx` - Painel de propriedades completo

## 🔧 Comandos Rápidos

```bash
# Aplicar formatação Prettier
npx prettier --write src/components/**/*.tsx

# Executar servidor de desenvolvimento
npm run dev

# Testar componentes
# Acesse: http://localhost:8082/test/components
```

## 🎯 Padrões Importantes

### Interface TypeScript

```typescript
interface MeuComponenteProps {
  // OBRIGATÓRIAS
  id: string;
  properties?: {
    /* suas propriedades */
  };
  isEditing?: boolean;
  onUpdate?: (id: string, updates: any) => void;

  // OPCIONAIS
  className?: string;
  style?: React.CSSProperties;
}
```

### Implementação Base

```typescript
export const MeuComponente: React.FC<MeuComponenteProps> = ({
  id,
  properties = { /* defaults */ },
  isEditing = false,
  onUpdate,
}) => {
  // Debug logs
  useEffect(() => {
    console.log(`${id} properties updated:`, properties);
  }, [properties, id]);

  // Handle updates
  const handleUpdate = (updates: any) => {
    onUpdate?.(id, updates);
  };

  // Render
  return (
    <div
      id={id}
      onClick={() => isEditing && handleClick()}
      style={{
        cursor: isEditing ? 'pointer' : 'default',
        border: isSelected ? '2px dashed #B89B7A' : 'none'
      }}
    >
      {/* Conteúdo do componente */}
    </div>
  );
};
```

### Painel de Propriedades

```typescript
export const renderMeuComponenteProperties = (
  componentId: string,
  properties: any = {},
  onPropertyChange: (property: string, value: any) => void,
) => {
  const handleChange = (property: string, value: any) => {
    console.log(`${componentId} property changed: ${property} = ${value}`);
    onPropertyChange(property, value);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Meu Componente</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Controles de propriedades */}
        </CardContent>
      </Card>
    </div>
  );
};
```

### Integração ao Sistema

```typescript
// Em ComponentSpecificPropertiesPanel.tsx
import { renderMeuComponenteProperties } from './MeuComponenteProperties';

// No switch principal:
case 'meu-componente':
  return renderMeuComponenteProperties(componentId, properties, onPropertyChange);
```

## 🎨 Tipos de Controles Disponíveis

| Tipo      | Componente          | Uso                                   |
| --------- | ------------------- | ------------------------------------- |
| Boolean   | `Switch`            | Habilitar/desabilitar funcionalidades |
| String    | `Input`             | Textos simples                        |
| Multiline | `Textarea`          | Textos longos                         |
| Options   | `Select`            | Seleção entre opções                  |
| Color     | `Input[type=color]` | Cores                                 |
| Number    | `Slider`            | Valores numéricos com range           |
| File      | `Input[type=file]`  | Upload de arquivos                    |

## 🐛 Debug e Monitoramento

```typescript
// Sempre adicione logs para facilitar debug
useEffect(() => {
  if (isEditing) {
    console.log(`Component ${id} entered editing mode`);
  }
}, [isEditing, id]);

// Log de mudanças de propriedades
useEffect(() => {
  console.log(`Component ${id} properties updated:`, properties);
}, [properties, id]);
```

## ⚡ Dicas de Performance

1. Use `useCallback` para funções que são passadas como props
2. Implemente `useMemo` para cálculos complexos de estilos
3. Evite re-renderizações desnecessárias com `React.memo` se necessário
4. Use `useEffect` com dependências específicas

## 📖 Recursos Adicionais

- **Checklist Completo**: `CHECKLIST_COMPONENTES_EDITOR.md`
- **Componente Exemplo**: `src/components/examples/ExampleEditableComponent.tsx`
- **Painel Exemplo**: `src/components/examples/ExampleEditableComponentProperties.tsx`
- **Teste Interativo**: http://localhost:8082/test/components

---

**💪 Lembre-se**: Seguindo este guia, você terá um componente totalmente funcional e integrado ao sistema de edição em poucos minutos!
