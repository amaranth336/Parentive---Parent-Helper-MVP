import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionVariants = cva("w-full", {
  variants: {
    spacing: {
      sm: "py-section-sm",
      md: "py-section-md",
      lg: "py-section-lg",
      xl: "py-section-xl",
      none: "py-0",
    },
    width: {
      full: "max-w-full",
      sm: "max-w-container-sm mx-auto px-4",
      md: "max-w-container-md mx-auto px-4",
      lg: "max-w-container-lg mx-auto px-6",
      xl: "max-w-container-xl mx-auto px-6",
    },
  },
  defaultVariants: {
    spacing: "md",
    width: "lg",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: "section" | "div" | "article" | "main" | "aside";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, width, as: Component = "section", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(sectionVariants({ spacing, width, className }))}
        {...props}
      />
    );
  }
);
Section.displayName = "Section";

export { Section, sectionVariants };
