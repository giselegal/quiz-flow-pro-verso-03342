import React from 'react';
import type { Block } from '@/types/editor';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { BlockRendererCommonProps } from './QuizIntroHeaderBlock';

interface FormInputBlockProps extends BlockRendererCommonProps {
    block: Block;
}

const FormInputBlock: React.FC<FormInputBlockProps> = ({ block, isSelected, isEditable, onSelect, onOpenProperties, contextData }) => {
    const props = block.properties || {};
    const label = props.label || 'Como posso te chamar?';
    const placeholder = props.placeholder || 'Digite seu primeiro nome aqui...';
    const buttonText = props.buttonText || 'Continuar';
    const onNameSubmit: ((name: string) => void) | undefined = contextData?.onNameSubmit;

    const inputRef = React.useRef<HTMLInputElement | null>(null);

    return (
        <SelectableBlock
            blockId={block.id}
            isSelected={!!isSelected}
            isEditable={!!isEditable}
            onSelect={() => onSelect?.(block.id)}
            blockType="Form Input"
            onOpenProperties={() => onOpenProperties?.(block.id)}
            isDraggable={true}
        >
            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto">
                <form className="w-full space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label htmlFor={`${block.id}-input`} className="block text-xs font-semibold text-[#432818] mb-1.5">
                            {label} <span className="text-red-500">*</span>
                        </label>
                        <input
                            id={`${block.id}-input`}
                            type="text"
                            placeholder={placeholder}
                            className="w-full p-2.5 bg-[#FEFEFE] rounded-md border-2 border-[#B89B7A] focus:outline-none focus:ring-2 focus:ring-[#A1835D]"
                            ref={inputRef}
                            name="userName"
                            data-name-input
                            required
                        />
                    </div>
                    <button
                        type="button"
                        className="w-full py-3 px-4 text-base font-semibold rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2 bg-[#B89B7A] text-white hover:bg-[#A1835D] hover:shadow-lg"
                        onClick={() => {
                            const name = String(inputRef.current?.value || '').trim();
                            if (name && onNameSubmit) onNameSubmit(name);
                        }}
                    >
                        {buttonText}
                    </button>
                </form>
            </div>
        </SelectableBlock>
    );
};

export default React.memo(FormInputBlock);
