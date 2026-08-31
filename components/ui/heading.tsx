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
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "display" | "display-sm";
  color?: "primary" | "brand" | "secondary" | "inverse";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as = "h2", color, children, ...props }, ref) => {
    const Component = (as === "display" || as === "display-sm" ? "h1" : as) as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    
    // Map the 'as' value to valid variant keys (h5/h6 map to h4)
    const variantAs = (as === "h5" || as === "h6" ? "h4" : as) as "h1" | "h2" | "h3" | "h4" | "display" | "display-sm";
    
    return React.createElement(
      Component,
      {
        ref,
        className: cn(headingVariants({ as: variantAs, color, className })),
        ...props,
      },
      children
    );
  }
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
