import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IntroStepSchema } from '@/schemas/intro.schema';

type FormValues = typeof IntroStepSchema._type;

interface Props {
    stepId: string;
    props: Partial<FormValues> | undefined;
    onApply: (values: FormValues) => void;
}

const IntroStepEditor: React.FC<Props> = ({ stepId, props, onApply }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(IntroStepSchema),
        defaultValues: props as any,
        mode: 'onChange'
    });

    useEffect(() => { reset(props as any); }, [stepId]);

    const submit = (data: FormValues) => onApply(data);

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
            <div>
                <label className="text-xs">Título</label>
                <input {...register('title')} className="w-full border rounded px-2 py-1 text-sm" />
                {errors?.title && <div className="text-red-600 text-xs">{errors.title.message as any}</div>}
            </div>
            <div>
                <label className="text-xs">Subtítulo</label>
                <textarea {...register('subtitle')} className="w-full border rounded p-2 text-sm" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-xs">Logo URL</label>
                    <input {...register('logoUrl')} className="w-full border rounded px-2 py-1 text-sm" />
                </div>
                <div>
                    <label className="text-xs">Background Image</label>
                    <input {...register('backgroundImage')} className="w-full border rounded px-2 py-1 text-sm" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-xs">CTA</label>
                    <input {...register('cta')} className="w-full border rounded px-2 py-1 text-sm" />
                </div>
                <div>
                    <label className="text-xs">Layout</label>
                    <select {...register('layout')} className="w-full border rounded px-2 py-1 text-sm">
                        <option value="centered">Centralizado</option>
                        <option value="split">Dividido</option>
                        <option value="cover">Capa</option>
                    </select>
                </div>
            </div>
            <label className="text-xs flex items-center gap-2">
                <input type="checkbox" {...register('showProgress')} /> Mostrar progresso
            </label>

            <div className="flex gap-2">
                <button type="submit" className="px-3 py-1.5 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700">Aplicar</button>
            </div>
        </form>
    );
};

export default IntroStepEditor;
