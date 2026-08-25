import * as React from 'react';

const variantStyles = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
  secondary:
    'bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800',
  outline:
    'border-2 border-primary-600 text-primary-700 hover:bg-primary-50 active:bg-primary-100',
  ghost: 'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
  link: 'text-primary-600 underline-offset-4 hover:underline',
};

const sizeStyles = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-14 px-8 text-lg',
  icon: 'h-11 w-11',
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children,
        {
          ...props,
          className: classes,
          ref,
        } as React.HTMLAttributes<HTMLElement>
      );
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
