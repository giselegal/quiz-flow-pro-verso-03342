interface QuizInputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'password';
  required?: boolean;
  width?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const QuizInput: React.FC<QuizInputProps> = ({
  label,
  placeholder = '',
  type = 'text',
  required = false,
  width = '100%',
  value = '',
  onChange,
  className = '',
}) => {
  const containerStyle: React.CSSProperties = {
    margin: '1rem 0',
    width,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#432818',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.875rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease',
    backgroundColor: '#ffffff',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: '#dc2626' }}> *</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        style={inputStyle}
        onFocus={e => {
          e.target.style.borderColor = '#b89b7a';
          e.target.style.outline = 'none';
          e.target.style.boxShadow = '0 0 0 3px rgba(184, 155, 122, 0.1)';
        }}
        onBlur={e => {
          e.target.style.borderColor = '#e5e7eb';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
};

export default QuizInput;
