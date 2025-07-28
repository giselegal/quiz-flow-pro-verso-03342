
import React from 'react';
import { Modal as AntModal } from 'antd';
import type { ModalProps as AntModalProps } from 'antd';

export interface ModalProps extends AntModalProps {
  variant?: 'default' | 'confirm' | 'info' | 'success' | 'warning' | 'error';
}

export const Modal: React.FC<ModalProps> = ({
  variant = 'default',
  className = '',
  ...props
}) => {
  const getVariantProps = (variant: ModalProps['variant']) => {
    switch (variant) {
      case 'confirm':
        return { type: 'confirm' };
      case 'info':
        return { type: 'info' };
      case 'success':
        return { type: 'success' };
      case 'warning':
        return { type: 'warning' };
      case 'error':
        return { type: 'error' };
      default:
        return {};
    }
  };

  return (
    <AntModal
      className={className}
      {...getVariantProps(variant)}
      {...props}
    />
  );
};

// Métodos estáticos do Modal
Modal.confirm = AntModal.confirm;
Modal.info = AntModal.info;
Modal.success = AntModal.success;
Modal.warning = AntModal.warning;
Modal.error = AntModal.error;

export default Modal;
