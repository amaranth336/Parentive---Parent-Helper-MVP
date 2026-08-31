import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const calloutVariants = cva(
  "rounded-card border-l-4 p-6 shadow-card",
  {
    variants: {
      variant: {
        default: "bg-surface-secondary border-l-moss",
        brand: "bg-sand border-l-honey",
        emphasis: "bg-sage/20 border-l-sage",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  title?: string;
}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, variant, title, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(calloutVariants({ variant, className }))}
        {...props}
      >
        {title && (
          <h4 className="text-h4 font-heading text-text-brand mb-2">
            {title}
          </h4>
        )}
        <div className="text-body text-text-primary">{children}</div>
      </div>
    );
  }
);
Callout.displayName = "Callout";

export { Callout, calloutVariants };
