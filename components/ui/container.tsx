import * as React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  narrow?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ narrow = false, wide = false, className = '', children, ...props }, ref) => {
    let sizeClass = 'max-w-7xl';
    if (narrow) sizeClass = 'max-w-4xl';
    if (wide) sizeClass = 'max-w-8xl';

    const classes = `${sizeClass} mx-auto px-4 sm:px-6 lg:px-8 ${className}`.trim();

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
