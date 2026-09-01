import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-subtle border border-border-default bg-surface-emphasis px-4 py-3 text-body text-text-primary transition-all duration-fast",
          "placeholder:text-text-muted",
          "focus:border-moss focus:outline-none focus:ring-2 focus:ring-focus/30",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-disabled",
          "resize-none",
          error && "border-error focus:border-error focus:ring-error/30",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
