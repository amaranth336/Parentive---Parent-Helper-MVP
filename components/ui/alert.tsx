import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-subtle border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:h-5 [&>svg]:w-5 [&>svg+div]:pl-8",
  {
    variants: {
      variant: {
        default: "bg-surface-secondary border-border-default text-text-primary",
        info: "bg-info-light border-info text-info-dark [&>svg]:text-info",
        success:
          "bg-success-light border-success text-success-dark [&>svg]:text-success",
        warning:
          "bg-warning-light border-warning text-warning-dark [&>svg]:text-warning",
        error: "bg-error-light border-error text-error-dark [&>svg]:text-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants> & {
      dismissible?: boolean;
      onDismiss?: () => void;
    }
>(({ className, variant, dismissible, onDismiss, children, ...props }, ref) => {
  const Icon = {
    default: Info,
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
  }[variant || "default"];

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon />
      <div className="flex-1">{children}</div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-focus"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-body-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
