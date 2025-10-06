import React from 'react';

interface FormFieldOption {
    value: string;
    label: string;
}

export interface ModularFormFieldSimpleProps extends React.HTMLAttributes<HTMLDivElement> {
    id?: string;
    name?: string;
    label?: string;
    placeholder?: string;
    helpText?: string;
    required?: boolean;
    disabled?: boolean;
    fieldType?: 'text' | 'email' | 'tel' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
    type?: ModularFormFieldSimpleProps['fieldType'];
    options?: FormFieldOption[];
    value?: string | string[] | boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    marginBottom: '16px',
};

const labelStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 500,
    color: '#2d3748',
};

const baseFieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    backgroundColor: '#fff',
    color: '#1a202c',
    outline: 'none',
};

const helpTextStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#718096',
};

const optionsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
};

const optionItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
    color: '#2d3748',
};

const ModularFormFieldSimple: React.FC<ModularFormFieldSimpleProps> = ({
    id,
    name,
    label,
    placeholder,
    helpText,
    required = false,
    disabled = false,
    fieldType,
    type: legacyType,
    options = [],
    value,
    onChange,
    style,
    ...rest
}) => {
    const resolvedType = fieldType ?? legacyType ?? 'text';
    const controlId = id ?? name ?? undefined;
    const fieldName = name ?? controlId;

    const renderTextInput = () => (
        <input
            id={controlId}
            name={fieldName}
            type={resolvedType === 'password' ? 'password' : resolvedType === 'email' ? 'email' : resolvedType === 'tel' ? 'tel' : 'text'}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            value={typeof value === 'string' ? value : undefined}
            onChange={onChange}
            style={baseFieldStyle}
            {...rest}
        />
    );

    const renderTextarea = () => (
        <textarea
            id={controlId}
            name={fieldName}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            value={typeof value === 'string' ? value : undefined}
            onChange={(event) => onChange?.(event)}
            style={{ ...baseFieldStyle, minHeight: '120px', resize: 'vertical' }}
            {...rest}
        />
    );

    const renderSelect = () => (
        <select
            id={controlId}
            name={fieldName}
            required={required}
            disabled={disabled}
            value={typeof value === 'string' ? value : undefined}
            onChange={(event) => onChange?.(event)}
            style={baseFieldStyle}
            {...rest}
        >
            <option value="" disabled={required}>
                {placeholder ?? 'Selecione uma opção'}
            </option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );

    const renderChoiceList = (inputType: 'checkbox' | 'radio') => {
        const currentValue = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];

        return (
            <div style={optionsContainerStyle} {...rest}>
                {options.map((option) => {
                    const checked = inputType === 'checkbox'
                        ? currentValue.includes(option.value)
                        : currentValue[0] === option.value;

                    return (
                        <label key={option.value} style={optionItemStyle}>
                            <input
                                type={inputType}
                                name={fieldName}
                                value={option.value}
                                required={required}
                                disabled={disabled}
                                checked={checked}
                                onChange={(event) => onChange?.(event)}
                            />
                            <span>{option.label}</span>
                        </label>
                    );
                })}
            </div>
        );
    };

    let fieldControl: React.ReactNode;

    switch (resolvedType) {
        case 'textarea':
            fieldControl = renderTextarea();
            break;
        case 'select':
            fieldControl = renderSelect();
            break;
        case 'checkbox':
        case 'radio':
            fieldControl = renderChoiceList(resolvedType);
            break;
        case 'password':
        case 'email':
        case 'tel':
        case 'text':
        default:
            fieldControl = renderTextInput();
    }

    return (
        <div style={{ ...containerStyle, ...style }}>
            {label && (
                <label htmlFor={controlId} style={labelStyle}>
                    {label}
                    {required ? ' *' : ''}
                </label>
            )}
            {fieldControl}
            {helpText && <span style={helpTextStyle}>{helpText}</span>}
        </div>
    );
};

export default ModularFormFieldSimple;
