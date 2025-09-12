import React from 'react';

export const TextEditor: React.FC<any> = () => <div>Text Editor</div>;
export const NumberEditor: React.FC<any> = () => <div>Number Editor</div>;
export const ColorEditor: React.FC<any> = () => <div>Color Editor</div>;

export const pickPropertyEditor = (type: string) => {
  switch (type) {
    case 'text': return TextEditor;
    case 'number': return NumberEditor;  
    case 'color': return ColorEditor;
    default: return TextEditor;
  }
};