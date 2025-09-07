import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export interface SmartFormProps<TSchema extends z.ZodTypeAny> {
  schema: TSchema;
  defaultValues?: z.infer<TSchema>;
  onSubmit: (values: z.infer<TSchema>) => void | Promise<void>;
  children: (ctx: {
    register: ReturnType<typeof useForm>['register'];
    formState: ReturnType<typeof useForm>['formState'];
    setValue: ReturnType<typeof useForm>['setValue'];
    getValues: ReturnType<typeof useForm>['getValues'];
  }) => React.ReactNode;
  className?: string;
}

export function SmartForm<TSchema extends z.ZodTypeAny>({ schema, defaultValues, onSubmit, children, className }: SmartFormProps<TSchema>) {
  const form = useForm<z.infer<TSchema>>({ resolver: zodResolver(schema), defaultValues });
  const { handleSubmit, register, formState, setValue, getValues } = form as any;

  return (
    <form className={className} onSubmit={handleSubmit(onSubmit)}>
      {children({ register, formState, setValue, getValues })}
    </form>
  );
}

export default SmartForm;
