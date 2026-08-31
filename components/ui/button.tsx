import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-subtle text-label font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-default disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-moss text-text-inverse hover:bg-moss/90 active:bg-moss shadow-subtle",
        secondary:
          "bg-sage text-text-primary hover:bg-sage/80 active:bg-sage/90 shadow-subtle",
        outline:
          "border-2 border-moss text-moss hover:bg-moss/5 active:bg-moss/10",
        ghost: "hover:bg-moss/10 active:bg-moss/15 text-moss",
        link: "text-moss underline-offset-4 hover:underline",
        accent:
          "bg-honey text-text-primary hover:bg-honey/90 active:bg-honey shadow-subtle",
      },
      size: {
        sm: "h-9 px-3 text-body-sm",
        md: "h-11 px-5",
        lg: "h-13 px-7 text-body-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
