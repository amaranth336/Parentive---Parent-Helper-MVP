import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-subtle border border-border-default bg-surface-emphasis px-4 py-2 text-body text-text-primary transition-all duration-fast",
          "placeholder:text-text-muted",
          "focus:border-moss focus:outline-none focus:ring-2 focus:ring-focus/30",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-disabled",
          error && "border-error focus:border-error focus:ring-error/30",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
