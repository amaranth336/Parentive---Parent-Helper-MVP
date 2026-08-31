import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    };

    return (
      <div
        ref={ref}
        role="status"
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <Loader2
          className={cn("animate-spin text-moss", sizeClasses[size])}
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

const LoadingState = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    message?: string;
  }
>(({ className, message = "Loading...", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center gap-4 py-12",
      className
    )}
    {...props}
  >
    <Spinner size="lg" />
    <p className="text-body text-text-muted">{message}</p>
  </div>
));
LoadingState.displayName = "LoadingState";

const EmptyState = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
  }
>(
  (
    {
      className,
      title = "No items found",
      description,
      icon,
      action,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 text-center",
        className
      )}
      {...props}
    >
      {icon && <div className="text-text-muted">{icon}</div>}
      <div className="space-y-2">
        <h3 className="text-h4 font-heading text-text-primary">{title}</h3>
        {description && (
          <p className="text-body-sm text-text-muted max-w-md">{description}</p>
        )}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
);
EmptyState.displayName = "EmptyState";

export { Spinner, LoadingState, EmptyState };
