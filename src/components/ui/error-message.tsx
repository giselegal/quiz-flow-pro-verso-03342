import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
    title?: string;
    message?: string;
    children?: React.ReactNode;
    className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    title = 'Erro',
    message,
    children,
    className,
}) => {
    return (
        <Alert variant="destructive" className={className}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            {message && <AlertDescription>{message}</AlertDescription>}
            {children && <AlertDescription>{children}</AlertDescription>}
        </Alert>
    );
};

export default ErrorMessage;
