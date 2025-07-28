import React from 'react';
import { Form as AntForm, FormProps as AntFormProps, FormItemProps as AntFormItemProps } from 'antd';
import { styled } from 'styled-components';

const StyledForm = styled(AntForm)`
  .ant-form-item-label > label {
    color: var(--foreground);
    font-weight: 500;
    font-size: 14px;
  }

  .ant-form-item-explain-error {
    color: var(--destructive);
    font-size: 12px;
  }

  .ant-form-item-explain-success {
    color: var(--success);
    font-size: 12px;
  }

  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-form-item-control-input-content {
    .ant-input,
    .ant-select-selector,
    .ant-input-number {
      border-color: var(--border);
      background-color: var(--background);
      color: var(--foreground);

      &:hover {
        border-color: var(--brand-primary);
      }

      &:focus {
        border-color: var(--brand-primary);
        box-shadow: 0 0 0 2px var(--ring);
      }
    }
  }
`;

const StyledFormItem = styled(AntForm.Item)`
  .ant-form-item-label {
    padding-bottom: 4px;
  }
`;

interface FormProps extends AntFormProps {
  variant?: 'default' | 'compact';
}

interface FormItemProps extends AntFormItemProps {
  variant?: 'default' | 'compact';
}

export const Form: React.FC<FormProps> & {
  Item: React.FC<FormItemProps>;
  useForm: typeof AntForm.useForm;
} = ({ 
  variant = 'default',
  layout = 'vertical',
  ...props 
}) => {
  return (
    <StyledForm
      layout={layout}
      size={variant === 'compact' ? 'small' : 'middle'}
      {...props}
    />
  );
};

const FormItem: React.FC<FormItemProps> = ({ 
  variant = 'default',
  ...props 
}) => {
  return (
    <StyledFormItem
      {...props}
    />
  );
};

Form.Item = FormItem;
Form.useForm = AntForm.useForm;

export default Form;
