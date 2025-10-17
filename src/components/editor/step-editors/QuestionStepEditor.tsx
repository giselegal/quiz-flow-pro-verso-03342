import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { QuestionStepSchema } from '@/schemas/question.schema';

type FormValues = typeof QuestionStepSchema._type;

interface Props {
    stepId: string;
    props: Partial<FormValues> | undefined;
    onApply: (values: FormValues) => void;
}

const QuestionStepEditor: React.FC<Props> = ({ stepId, props, onApply }) => {
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(QuestionStepSchema),
        defaultValues: props as any,
        mode: 'onChange'
    });

    const { fields, append, remove, move } = useFieldArray({ control, name: 'options' as const });

    useEffect(() => {
        reset(props as any);
    }, [stepId]);

    const submit = (data: FormValues) => onApply(data);

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
            <div>
                <label className="text-xs">Pergunta</label>
                <textarea {...register('question')} className="w-full border rounded p-2 text-sm" rows={3} />
                {errors?.question && <div className="text-red-600 text-xs">{errors.question.message as any}</div>}
            </div>

            <div className="grid grid-cols-2 gap-2">
                <label className="text-xs flex items-center gap-2">
                    <input type="checkbox" {...register('multiSelect')} /> Multi-seleção
                </label>
                <label className="text-xs flex items-center gap-2">
                    <input type="checkbox" {...register('autoAdvance')} /> Avanço automático
                </label>
                <div>
                    <span className="block text-xs">Obrigatórias</span>
                    <input type="number" className="w-full border rounded px-2 py-1 text-sm" {...register('requiredSelections', { valueAsNumber: true })} />
                </div>
                <div>
                    <span className="block text-xs">Máximo</span>
                    <input type="number" className="w-full border rounded px-2 py-1 text-sm" {...register('maxSelections', { valueAsNumber: true })} />
                </div>
                <div>
                    <span className="block text-xs">Layout</span>
                    <select className="w-full border rounded px-2 py-1 text-sm" {...register('layout')}>
                        <option value="auto">Auto</option>
                        <option value="grid-2">Grid 2</option>
                        <option value="grid-3">Grid 3</option>
                        <option value="list">Lista</option>
                    </select>
                </div>
                <label className="text-xs flex items-center gap-2">
                    <input type="checkbox" {...register('showImages')} /> Mostrar imagens
                </label>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="text-xs font-medium">Opções</div>
                    <button
                        type="button"
                        className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                        onClick={() => append({ label: 'Nova opção', value: '', points: 0 } as any)}
                    >+ Opção</button>
                </div>
                {fields.map((f, idx) => (
                    <div key={f.id} className="grid grid-cols-12 gap-2 items-start">
                        <input className="col-span-4 border rounded px-2 py-1 text-sm" placeholder="Label" {...register(`options.${idx}.label` as const)} />
                        <input className="col-span-3 border rounded px-2 py-1 text-sm" placeholder="Value" {...register(`options.${idx}.value` as const)} />
                        <input className="col-span-3 border rounded px-2 py-1 text-sm" placeholder="Imagem (URL)" {...register(`options.${idx}.image` as const)} />
                        <input type="number" className="col-span-1 border rounded px-2 py-1 text-sm" placeholder="Pts" {...register(`options.${idx}.points` as const, { valueAsNumber: true })} />
                        <button type="button" className="col-span-1 text-[11px] px-2 py-1 rounded bg-rose-100 hover:bg-rose-200" onClick={() => remove(idx)}>Del</button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <button type="submit" className="px-3 py-1.5 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700">Aplicar</button>
            </div>
        </form>
    );
};

export default QuestionStepEditor;
