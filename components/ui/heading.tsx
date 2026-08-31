import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("font-heading text-balance", {
  variants: {
    as: {
      h1: "text-h1",
      h2: "text-h2",
      h3: "text-h3",
      h4: "text-h4",
      display: "text-display-md md:text-display-lg",
      "display-sm": "text-display-sm md:text-display-md",
    },
    color: {
      primary: "text-text-primary",
      brand: "text-text-brand",
      secondary: "text-text-secondary",
      inverse: "text-text-inverse",
    },
  },
  defaultVariants: {
    as: "h2",
    color: "primary",
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "display" | "display-sm";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as = "h2", color, children, ...props }, ref) => {
    const Component = (as === "display" || as === "display-sm" ? "h1" : as) as keyof JSX.IntrinsicElements;
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ as, color, className }))}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
