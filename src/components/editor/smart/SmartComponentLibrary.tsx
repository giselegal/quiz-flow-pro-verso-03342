/**
 * 🧠 SMART COMPONENT LIBRARY - FASE 2
 * 
 * Biblioteca de componentes inteligentes com:
 * ✅ Auto-configuração baseada em contexto
 * ✅ Preview em tempo real
 * ✅ Validação automática de propriedades
 * ✅ Adaptive design patterns
 * ✅ Accessibility features integradas
 * ✅ Performance optimization automática
 */

import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
    forwardRef,
    Component,
    ReactNode,
    CSSProperties
} from 'react';
import { useEditorCore, EditorElement } from '../core/EditorCore';

// 🎯 BASE SMART COMPONENT INTERFACE
export interface SmartComponentProps {
    id: string;
    editorMode?: boolean;
    autoConfig?: boolean;
    preview?: boolean;
    validation?: boolean;
    accessibility?: boolean;
    performance?: boolean;
    onUpdate?: (id: string, updates: Partial<EditorElement>) => void;
    onError?: (id: string, error: string) => void;
    className?: string;
    style?: CSSProperties;
}

export interface SmartComponentConfig {
    autoResize: boolean;
    responsiveBreakpoints: { mobile: number; tablet: number; desktop: number };
    validationRules: Record<string, (value: any) => string | null>;
    defaultProperties: Record<string, any>;
    requiredProperties: string[];
    a11yEnabled: boolean;
    performanceOptimized: boolean;
}

// 🎯 SMART COMPONENT BASE CLASS
export abstract class SmartComponentBase<T extends SmartComponentProps = SmartComponentProps> extends Component<T> {
    protected config: SmartComponentConfig;
    protected validationErrors: string[] = [];
    protected performanceMetrics: { renderTime: number; updateCount: number } = {
        renderTime: 0,
        updateCount: 0
    };

    constructor(props: T) {
        super(props);

        this.config = {
            autoResize: true,
            responsiveBreakpoints: { mobile: 480, tablet: 768, desktop: 1024 },
            validationRules: {},
            defaultProperties: {},
            requiredProperties: [],
            a11yEnabled: true,
            performanceOptimized: true
        };
    }

    componentDidMount() {
        if (this.props.autoConfig) {
            this.autoConfigureComponent();
        }

        if (this.props.validation) {
            this.validateProperties();
        }

        if (this.config.performanceOptimized) {
            this.startPerformanceTracking();
        }
    }

    componentDidUpdate() {
        this.performanceMetrics.updateCount++;

        if (this.props.validation) {
            this.validateProperties();
        }
    }

    protected autoConfigureComponent(): void {
        // Override in subclasses
    }

    protected validateProperties(): void {
        this.validationErrors = [];

        // Check required properties
        for (const prop of this.config.requiredProperties) {
            if (!(prop in this.props)) {
                this.validationErrors.push(`Required property '${prop}' is missing`);
            }
        }

        // Run custom validation rules
        for (const [prop, validator] of Object.entries(this.config.validationRules)) {
            const value = (this.props as any)[prop];
            const error = validator(value);
            if (error) {
                this.validationErrors.push(error);
            }
        }

        if (this.validationErrors.length > 0) {
            this.props.onError?.(this.props.id, this.validationErrors.join(', '));
        }
    }

    protected startPerformanceTracking(): void {
        const startTime = performance.now();

        setTimeout(() => {
            this.performanceMetrics.renderTime = performance.now() - startTime;
        }, 0);
    }

    protected getResponsiveValue<V>(values: { mobile?: V; tablet?: V; desktop?: V; default: V }): V {
        const width = window.innerWidth;

        if (width <= this.config.responsiveBreakpoints.mobile && values.mobile !== undefined) {
            return values.mobile;
        }

        if (width <= this.config.responsiveBreakpoints.tablet && values.tablet !== undefined) {
            return values.tablet;
        }

        if (width >= this.config.responsiveBreakpoints.desktop && values.desktop !== undefined) {
            return values.desktop;
        }

        return values.default;
    }

    protected generateA11yProps(): Record<string, any> {
        if (!this.config.a11yEnabled) return {};

        return {
            'aria-label': this.getA11yLabel(),
            'role': this.getA11yRole(),
            'tabIndex': this.isInteractive() ? 0 : -1
        };
    }

    protected abstract getA11yLabel(): string;
    protected abstract getA11yRole(): string;
    protected abstract isInteractive(): boolean;

    render() {
        const startTime = performance.now();

        try {
            const content = this.renderContent();

            if (this.config.performanceOptimized) {
                this.performanceMetrics.renderTime = performance.now() - startTime;
            }

            return content;
        } catch (error) {
            this.props.onError?.(this.props.id, `Render error: ${error}`);
            return this.renderError();
        }
    }

    protected abstract renderContent(): ReactNode;

    protected renderError(): ReactNode {
        return (
            <div className="smart-component-error" style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                padding: '12px',
                color: '#dc2626'
            }}>
                <strong>Component Error</strong>
                <ul>
                    {this.validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            </div>
        );
    }
}

// 🎯 SMART BUTTON COMPONENT
interface SmartButtonProps extends SmartComponentProps {
    text?: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    onClick?: () => void;
    autoOptimize?: boolean;
}

export class SmartButton extends SmartComponentBase<SmartButtonProps> {
    constructor(props: SmartButtonProps) {
        super(props);

        this.config = {
            ...this.config,
            defaultProperties: {
                text: 'Button',
                variant: 'primary',
                size: 'md',
                disabled: false,
                loading: false
            },
            requiredProperties: ['text'],
            validationRules: {
                text: (value: string) => {
                    if (!value || value.trim().length === 0) {
                        return 'Button text cannot be empty';
                    }
                    if (value.length > 50) {
                        return 'Button text should be less than 50 characters';
                    }
                    return null;
                }
            }
        };
    }

    protected autoConfigureComponent(): void {
        // Auto-configure based on context
        const { text = 'Button' } = this.props;

        // Suggest variant based on text content
        let suggestedVariant: SmartButtonProps['variant'] = 'primary';

        if (text.toLowerCase().includes('delete') || text.toLowerCase().includes('remove')) {
            suggestedVariant = 'danger';
        } else if (text.toLowerCase().includes('save') || text.toLowerCase().includes('submit')) {
            suggestedVariant = 'success';
        } else if (text.toLowerCase().includes('cancel') || text.toLowerCase().includes('close')) {
            suggestedVariant = 'secondary';
        } else if (text.toLowerCase().includes('warn') || text.toLowerCase().includes('alert')) {
            suggestedVariant = 'warning';
        }

        // Auto-size based on text length
        let suggestedSize: SmartButtonProps['size'] = 'md';
        if (text.length > 20) {
            suggestedSize = 'lg';
        } else if (text.length < 8) {
            suggestedSize = 'sm';
        }

        // Update component if auto-optimization is enabled
        if (this.props.autoOptimize) {
            this.props.onUpdate?.(this.props.id, {
                properties: {
                    ...this.props,
                    variant: suggestedVariant,
                    size: suggestedSize
                }
            });
        }
    }

    protected getA11yLabel(): string {
        const { text = 'Button', loading, disabled } = this.props;

        let label = text;
        if (loading) label += ' (loading)';
        if (disabled) label += ' (disabled)';

        return label;
    }

    protected getA11yRole(): string {
        return 'button';
    }

    protected isInteractive(): boolean {
        return !this.props.disabled && !this.props.loading;
    }

    protected renderContent(): ReactNode {
        const {
            text = 'Button',
            variant = 'primary',
            size = 'md',
            disabled = false,
            loading = false,
            icon,
            onClick,
            className = '',
            style = {},
            editorMode = false,
            preview = false
        } = this.props;

        const variantStyles = {
            primary: { background: '#3b82f6', color: 'white', border: 'none' },
            secondary: { background: '#6b7280', color: 'white', border: 'none' },
            success: { background: '#10b981', color: 'white', border: 'none' },
            warning: { background: '#f59e0b', color: 'white', border: 'none' },
            danger: { background: '#ef4444', color: 'white', border: 'none' }
        };

        const sizeStyles = {
            sm: { padding: '6px 12px', fontSize: '14px', borderRadius: '4px' },
            md: { padding: '8px 16px', fontSize: '16px', borderRadius: '6px' },
            lg: { padding: '12px 24px', fontSize: '18px', borderRadius: '8px' }
        };

        const responsivePadding = this.getResponsiveValue({
            mobile: '6px 12px',
            tablet: '8px 16px',
            desktop: '12px 24px',
            default: sizeStyles[size].padding
        });

        const buttonStyle: CSSProperties = {
            ...variantStyles[variant],
            ...sizeStyles[size],
            padding: responsivePadding,
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 500,
            outline: 'none',
            ...style
        };

        const a11yProps = this.generateA11yProps();

        return (
            <button
                className={`smart-button smart-button-${variant} smart-button-${size} ${className}`}
                style={buttonStyle}
                disabled={disabled || loading}
                onClick={editorMode ? undefined : onClick}
                {...a11yProps}
            >
                {loading && (
                    <span className="loading-spinner" style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid currentColor',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                )}

                {icon && !loading && (
                    <span className="button-icon">{icon}</span>
                )}

                <span className="button-text">{text}</span>

                {preview && (
                    <div className="preview-overlay" style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '2px dashed #3b82f6',
                        borderRadius: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#3b82f6',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>
                        PREVIEW
                    </div>
                )}
            </button>
        );
    }
}

// 🎯 SMART INPUT COMPONENT
interface SmartInputProps extends SmartComponentProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    placeholder?: string;
    value?: string;
    label?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    autoComplete?: string;
    autoValidate?: boolean;
    onChange?: (value: string) => void;
    onBlur?: () => void;
}

export class SmartInput extends SmartComponentBase<SmartInputProps> {
    private inputRef = React.createRef<HTMLInputElement>();
    private value = this.props.value || '';
    private setValue = (v: string) => { };
    private errors: string[] = [];
    private setErrors = (e: string[]) => { };

    constructor(props: SmartInputProps) {
        super(props);

        this.config = {
            ...this.config,
            defaultProperties: {
                type: 'text',
                placeholder: '',
                value: '',
                required: false,
                autoValidate: true
            },
            validationRules: {
                email: (value: string) => {
                    if (this.props.type === 'email' && value) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        return emailRegex.test(value) ? null : 'Invalid email format';
                    }
                    return null;
                },
                minLength: (value: string) => {
                    const { minLength } = this.props;
                    if (minLength && value.length < minLength) {
                        return `Minimum length is ${minLength} characters`;
                    }
                    return null;
                },
                maxLength: (value: string) => {
                    const { maxLength } = this.props;
                    if (maxLength && value.length > maxLength) {
                        return `Maximum length is ${maxLength} characters`;
                    }
                    return null;
                },
                required: (value: string) => {
                    if (this.props.required && (!value || value.trim().length === 0)) {
                        return 'This field is required';
                    }
                    return null;
                }
            }
        };
    }

    protected autoConfigureComponent(): void {
        const { placeholder, type = 'text' } = this.props;

        // Auto-suggest input type based on placeholder or label
        let suggestedType = type;
        const text = (placeholder || this.props.label || '').toLowerCase();

        if (text.includes('email')) suggestedType = 'email';
        else if (text.includes('password')) suggestedType = 'password';
        else if (text.includes('phone') || text.includes('tel')) suggestedType = 'tel';
        else if (text.includes('url') || text.includes('website')) suggestedType = 'url';
        else if (text.includes('number') || text.includes('age') || text.includes('count')) suggestedType = 'number';

        // Auto-suggest autocomplete
        let autoComplete = '';
        if (text.includes('name')) autoComplete = 'name';
        else if (text.includes('email')) autoComplete = 'email';
        else if (text.includes('phone')) autoComplete = 'tel';
        else if (text.includes('address')) autoComplete = 'address-line1';

        if (this.props.autoConfig && (suggestedType !== type || autoComplete)) {
            this.props.onUpdate?.(this.props.id, {
                properties: {
                    ...this.props,
                    type: suggestedType,
                    autoComplete
                }
            });
        }
    }

    protected getA11yLabel(): string {
        const { label, placeholder, required } = this.props;
        let a11yLabel = label || placeholder || 'Input field';
        if (required) a11yLabel += ' (required)';
        return a11yLabel;
    }

    protected getA11yRole(): string {
        return 'textbox';
    }

    protected isInteractive(): boolean {
        return true;
    }

    private validateInput = (inputValue: string): string[] => {
        const validationErrors: string[] = [];

        for (const [rule, validator] of Object.entries(this.config.validationRules)) {
            const error = validator(inputValue);
            if (error) {
                validationErrors.push(error);
            }
        }

        return validationErrors;
    };

    private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);

        if (this.props.autoValidate) {
            const newErrors = this.validateInput(newValue);
            setErrors(newErrors);
        }

        this.props.onChange?.(newValue);
    };

    protected renderContent(): ReactNode {
        const {
            type = 'text',
            placeholder = '',
            label,
            required = false,
            className = '',
            style = {},
            editorMode = false,
            preview = false
        } = this.props;

        const hasErrors = errors.length > 0;

        const inputStyle: CSSProperties = {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '6px',
            border: `2px solid ${hasErrors ? '#ef4444' : '#d1d5db'}`,
            fontSize: '16px',
            outline: 'none',
            transition: 'all 0.2s ease',
            backgroundColor: 'white',
            ...style
        };

        const focusStyle: CSSProperties = {
            borderColor: hasErrors ? '#ef4444' : '#3b82f6',
            boxShadow: `0 0 0 3px ${hasErrors ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
        };

        const a11yProps = this.generateA11yProps();

        return (
            <div className={`smart-input-wrapper ${className}`}>
                {label && (
                    <label className="smart-input-label" style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#374151'
                    }}>
                        {label}
                        {required && <span style={{ color: '#ef4444' }}>*</span>}
                    </label>
                )}

                <div style={{ position: 'relative' }}>
                    <input
                        ref={this.inputRef}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        required={required}
                        className="smart-input"
                        style={inputStyle}
                        onChange={this.handleChange}
                        onBlur={this.props.onBlur}
                        onFocus={(e) => {
                            Object.assign(e.target.style, focusStyle);
                        }}
                        onBlur={(e) => {
                            Object.assign(e.target.style, inputStyle);
                            this.props.onBlur?.();
                        }}
                        disabled={editorMode}
                        {...a11yProps}
                    />

                    {preview && (
                        <div className="preview-overlay" style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(59, 130, 246, 0.05)',
                            border: '2px dashed #3b82f6',
                            borderRadius: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#3b82f6',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            pointerEvents: 'none'
                        }}>
                            PREVIEW
                        </div>
                    )}
                </div>

                {hasErrors && (
                    <div className="smart-input-errors" style={{
                        marginTop: '6px'
                    }}>
                        {errors.map((error, index) => (
                            <div key={index} style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                marginBottom: '2px'
                            }}>
                                {error}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

// 🎯 SMART IMAGE COMPONENT
interface SmartImageProps extends SmartComponentProps {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
    lazy?: boolean;
    placeholder?: string;
    fallback?: string;
    autoOptimize?: boolean;
    responsive?: boolean;
}

export class SmartImage extends SmartComponentBase<SmartImageProps> {
    private imageRef = React.createRef<HTMLImageElement>();
    private loading = true;
    private setLoading = (l: boolean) => { };
    private error = false;
    private setError = (e: boolean) => { };
    private naturalSize = { width: 0, height: 0 };
    private setNaturalSize = (s: any) => { };

    constructor(props: SmartImageProps) {
        super(props);

        this.config = {
            ...this.config,
            defaultProperties: {
                objectFit: 'cover',
                lazy: true,
                responsive: true,
                autoOptimize: true
            },
            validationRules: {
                src: (value: string) => {
                    if (!value) return 'Image source is required';
                    try {
                        new URL(value);
                        return null;
                    } catch {
                        return 'Invalid image URL';
                    }
                },
                alt: (value: string) => {
                    if (!value || value.trim().length === 0) {
                        return 'Alt text is required for accessibility';
                    }
                    return null;
                }
            }
        };
    }

    protected autoConfigureComponent(): void {
        const { src, alt } = this.props;

        // Auto-generate alt text if missing
        if (!alt && src) {
            const filename = src.split('/').pop()?.split('.')[0];
            const suggestedAlt = filename ? filename.replace(/[-_]/g, ' ') : 'Image';

            if (this.props.autoOptimize) {
                this.props.onUpdate?.(this.props.id, {
                    properties: {
                        ...this.props,
                        alt: suggestedAlt
                    }
                });
            }
        }
    }

    protected getA11yLabel(): string {
        return this.props.alt || 'Image';
    }

    protected getA11yRole(): string {
        return 'img';
    }

    protected isInteractive(): boolean {
        return false;
    }

    private handleLoad = () => {
        setLoading(false);
        setError(false);

        if (this.imageRef.current) {
            setNaturalSize({
                width: this.imageRef.current.naturalWidth,
                height: this.imageRef.current.naturalHeight
            });
        }
    };

    private handleError = () => {
        setLoading(false);
        setError(true);
        this.props.onError?.(this.props.id, 'Failed to load image');
    };

    protected renderContent(): ReactNode {
        const {
            src = '',
            alt = '',
            width,
            height,
            objectFit = 'cover',
            lazy = true,
            placeholder,
            fallback,
            responsive = true,
            className = '',
            style = {},
            preview = false
        } = this.props;

        const containerStyle: CSSProperties = {
            position: 'relative',
            display: 'inline-block',
            width: responsive ? '100%' : width,
            height: responsive ? 'auto' : height,
            maxWidth: '100%',
            overflow: 'hidden',
            ...style
        };

        const imageStyle: CSSProperties = {
            width: '100%',
            height: '100%',
            objectFit,
            transition: 'opacity 0.3s ease'
        };

        const a11yProps = this.generateA11yProps();

        if (error && fallback) {
            return (
                <div className={`smart-image-wrapper ${className}`} style={containerStyle}>
                    <img
                        src={fallback}
                        alt={alt}
                        style={imageStyle}
                        {...a11yProps}
                    />
                </div>
            );
        }

        if (error) {
            return (
                <div className={`smart-image-error ${className}`} style={{
                    ...containerStyle,
                    background: '#f3f4f6',
                    border: '1px dashed #d1d5db',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    fontSize: '14px',
                    minHeight: '100px'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div>📷</div>
                        <div>Image failed to load</div>
                    </div>
                </div>
            );
        }

        return (
            <div className={`smart-image-wrapper ${className}`} style={containerStyle}>
                {loading && placeholder && (
                    <div className="image-placeholder" style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af'
                    }}>
                        {placeholder}
                    </div>
                )}

                <img
                    ref={this.imageRef}
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={lazy ? 'lazy' : 'eager'}
                    style={{
                        ...imageStyle,
                        opacity: loading ? 0 : 1
                    }}
                    onLoad={this.handleLoad}
                    onError={this.handleError}
                    {...a11yProps}
                />

                {preview && (
                    <div className="preview-overlay" style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '2px dashed #3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#3b82f6',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>
                        PREVIEW
                    </div>
                )}

                {/* Performance info for debugging */}
                {this.props.editorMode && (
                    <div className="image-info" style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontFamily: 'monospace'
                    }}>
                        {naturalSize.width}×{naturalSize.height}
                        {loading && ' (loading...)'}
                    </div>
                )}
            </div>
        );
    }
}

// 🎯 COMPONENT FACTORY
export class SmartComponentFactory {
    private static components = new Map<string, typeof SmartComponentBase>([
        ['button', SmartButton],
        ['input', SmartInput],
        ['image', SmartImage]
    ]);

    static register(type: string, component: typeof SmartComponentBase): void {
        this.components.set(type, component);
    }

    static create(type: string, props: SmartComponentProps): React.ReactElement | null {
        const ComponentClass = this.components.get(type);
        if (!ComponentClass) {
            console.warn(`Unknown smart component type: ${type}`);
            return null;
        }

        return React.createElement(ComponentClass, props);
    }

    static getAvailableTypes(): string[] {
        return Array.from(this.components.keys());
    }
}

// 🎯 SMART COMPONENT WRAPPER
export const SmartComponentWrapper: React.FC<{
    type: string;
    props: SmartComponentProps;
}> = ({ type, props }) => {
    return SmartComponentFactory.create(type, props);
};

export default SmartComponentFactory;