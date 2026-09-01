import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    size: {
      lg: "text-body-lg",
      base: "text-body",
      sm: "text-body-sm",
      label: "text-label",
      eyebrow: "text-eyebrow uppercase",
      utility: "text-utility",
    },
    color: {
      primary: "text-text-primary",
      secondary: "text-text-secondary",
      brand: "text-text-brand",
      muted: "text-text-muted",
      inverse: "text-text-inverse",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
  },
  defaultVariants: {
    size: "base",
    color: "primary",
    weight: "normal",
  },
});

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'> {
  as?: "p" | "span" | "div" | "label";
  size?: "lg" | "base" | "sm" | "label" | "eyebrow" | "utility";
  color?: "primary" | "secondary" | "brand" | "muted" | "inverse";
  weight?: "normal" | "medium" | "semibold";
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, color, weight, as = "p", children, ...props }, ref) => {
    return React.createElement(
      as,
      {
        ref,
        className: cn(textVariants({ size, color, weight, className })),
        ...props,
      },
      children
    );
  }
);
Text.displayName = "Text";

export { Text, textVariants };
