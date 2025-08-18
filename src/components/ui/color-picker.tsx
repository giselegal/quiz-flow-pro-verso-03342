interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

// Componente simples de seleção de cor
export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <input
      type="color"
      value={value || '#000000'}
      onChange={e => onChange(e.target.value)}
      className="w-8 h-8 rounded cursor-pointer"
    />
  );
}
