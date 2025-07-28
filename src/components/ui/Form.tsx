
import React from 'react';
import { Form as AntForm } from 'antd';
import type { FormProps as AntFormProps, FormItemProps as AntFormItemProps } from 'antd';

export interface FormProps extends AntFormProps {
  variant?: 'default' | 'compact';
}

export interface FormItemProps extends AntFormItemProps {
  variant?: 'default' | 'compact';
}

export const Form: React.FC<FormProps> & {
  Item: React.FC<FormItemProps>;
  useForm: typeof AntForm.useForm;
} = ({ 
  variant = 'default',
  layout = 'vertical',
  className = '',
  ...props 
}) => {
  const combinedClassName = [
    variant === 'compact' ? 'space-y-2' : 'space-y-4',
    className
  ].filter(Boolean).join(' ');

  return (
    <AntForm
      layout={layout}
      size={variant === 'compact' ? 'small' : 'middle'}
      className={combinedClassName}
      {...props}
    />
  );
};

const FormItem: React.FC<FormItemProps> = ({ 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const combinedClassName = [
    variant === 'compact' ? 'mb-2' : 'mb-4',
    className
  ].filter(Boolean).join(' ');

  return (
    <AntForm.Item
      className={combinedClassName}
      {...props}
    />
  );
};

Form.Item = FormItem;
Form.useForm = AntForm.useForm;

export default Form;
