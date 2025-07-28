import React from 'react';
import { Form as AntForm, FormProps as AntFormProps, FormItemProps as AntFormItemProps } from 'antd';
import { styled } from 'styled-components';

const StyledForm = styled(AntForm)`
  .ant-form-item-label > label {
    color: #432818;
    font-weight: 500;
    font-size: 14px;
  }

  .ant-form-item-explain-error {
    color: #ff4d4f;
    font-size: 12px;
  }

  .ant-form-item-explain-success {
    color: #52c41a;
    font-size: 12px;
  }

  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-form-item-control-input-content {
    .ant-input,
    .ant-select-selector,
    .ant-input-number {
      border-color: rgba(184, 155, 122, 0.3);

      &:hover {
        border-color: #B89B7A;
      }

      &:focus {
        border-color: #B89B7A;
        box-shadow: 0 0 0 2px rgba(184, 155, 122, 0.2);
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
