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

export function Field({ label, htmlFor, children, error, hint }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {hint && <span className="field-hint">{hint}</span>}
      {children}
      {error && <span className="field-error">{error}</span>}
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

export function Checkbox({ label, hint, className = '', ...props }: CheckboxProps) {
  return (
    <label className={`checkbox-label ${className}`.trim()}>
      <input type="checkbox" className="checkbox" {...props} />
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
}

export function RadioGroup({ children, className = '' }: RadioGroupProps) {
  return <div className={`radio-group ${className}`.trim()}>{children}</div>;
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
}

export function Button({
  variant = 'primary',
  size = 'default',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = [
    'btn',
    variant === 'primary' && 'btn-primary',
    variant === 'ghost' && 'btn-ghost',
    size === 'sm' && 'btn-sm',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
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
  return (
    <div className={`alert alert-${variant} ${className}`.trim()}>
      {children}
    </div>
  );
}
