/**
 * Form Components
 * 
 * Reusable form components that follow the Parentive design system.
 */

import React from 'react';

interface FieldProps {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
}

type FieldControlProps = {
  "aria-invalid"?: boolean | "true" | "false";
  "aria-describedby"?: string;
};

function describedById(htmlFor: string | undefined, suffix: "hint" | "error") {
  return htmlFor ? `${htmlFor}-${suffix}` : undefined;
}

export function Field({ label, htmlFor, children, error, hint }: FieldProps) {
  const hintId = hint ? describedById(htmlFor, "hint") : undefined;
  const errorId = error ? describedById(htmlFor, "error") : undefined;
  const fieldDescribedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  let control = children;
  if (React.isValidElement(children) && React.Children.count(children) === 1) {
    const child = children as React.ReactElement<FieldControlProps>;
    const existingDescribedBy = child.props["aria-describedby"];
    const ariaDescribedBy =
      [existingDescribedBy, fieldDescribedBy].filter(Boolean).join(" ") || undefined;

    control = React.cloneElement(child, {
      "aria-invalid": error ? true : child.props["aria-invalid"],
      "aria-describedby": ariaDescribedBy,
    });
  }

  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {hint && (
        <span className="field-hint" id={hintId}>
          {hint}
        </span>
      )}
      {control}
      {error && (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      )}
    </div>
  );
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function TextInput({ error, className = '', ...props }: TextInputProps) {
  return (
    <input
      type="text"
      className={`${className} ${error ? 'input-error' : ''}`.trim()}
      {...props}
    />
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function TextArea({ error, className = '', ...props }: TextAreaProps) {
  return (
    <textarea
      className={`textarea ${className} ${error ? 'input-error' : ''}`.trim()}
      {...props}
    />
  );
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function Checkbox({
  label,
  hint,
  className = '',
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  ...props
}: CheckboxProps) {
  return (
    <label className={`checkbox-label ${className}`.trim()}>
      <input
        type="checkbox"
        className="checkbox"
        {...props}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
      />
      <span className="checkbox-content">
        <span className="checkbox-text">{label}</span>
        {hint && <span className="checkbox-hint">{hint}</span>}
      </span>
    </label>
  );
}

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function Radio({ label, hint, className = '', ...props }: RadioProps) {
  return (
    <label className={`radio-label ${className}`.trim()}>
      <input type="radio" className="radio" {...props} />
      <span className="radio-content">
        <span className="radio-text">{label}</span>
        {hint && <span className="radio-hint">{hint}</span>}
      </span>
    </label>
  );
}

interface RadioGroupProps {
  children: React.ReactNode;
  className?: string;
  legend?: string;
}

export function RadioGroup({ children, className = '', legend }: RadioGroupProps) {
  const classes = `radio-group ${className}`.trim();

  if (legend) {
    return (
      <fieldset className={classes}>
        <legend>{legend}</legend>
        {children}
      </fieldset>
    );
  }

  return <div className={classes}>{children}</div>;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error, className = '', children, ...props }: SelectProps) {
  return (
    <select
      className={`select ${className} ${error ? 'input-error' : ''}`.trim()}
      {...props}
    >
      {children}
    </select>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'sm';
  block?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'default',
  block = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const ariaDisabled = props['aria-disabled'];
  const isDisabled =
    Boolean(disabled) || ariaDisabled === true || ariaDisabled === 'true';
  const classes = [
    'btn',
    variant === 'primary' && 'btn-primary',
    variant === 'secondary' && 'btn-secondary',
    variant === 'ghost' && 'btn-ghost',
    size === 'sm' && 'btn-sm',
    block && 'btn-block',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props} disabled={isDisabled}>
      {children}
    </button>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return <div className={`card ${className}`.trim()}>{children}</div>;
}

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'error' | 'success';
  className?: string;
}

export function Alert({ children, variant = 'info', className = '' }: AlertProps) {
  const role = variant === 'error' ? 'alert' : 'status';

  return (
    <div role={role} className={`alert alert-${variant} ${className}`.trim()}>
      {children}
    </div>
  );
}
