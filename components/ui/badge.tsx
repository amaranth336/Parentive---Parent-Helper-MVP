import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-utility font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-moss text-text-inverse",
        secondary:
          "bg-sage text-text-primary",
        outline:
          "border border-border-default bg-surface-emphasis text-text-primary",
        success:
          "bg-success text-text-inverse",
        warning:
          "bg-warning text-text-primary",
        error:
          "bg-error text-text-inverse",
        info:
          "bg-info text-text-inverse",
        accent:
          "bg-honey text-text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
