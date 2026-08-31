import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  color?: "moss" | "walnut" | "honey" | "sage";
}

const Icon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ className, icon: IconComponent, size = "md", color = "moss", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const colorClasses = {
      moss: "text-moss",
      walnut: "text-walnut",
      honey: "text-honey",
      sage: "text-sage",
    };

    return (
      <div
        ref={ref}
        className={cn("inline-flex", className)}
        {...props}
      >
        <IconComponent
          className={cn(sizeClasses[size], colorClasses[color])}
          strokeWidth={1.75}
        />
      </div>
    );
  }
);
Icon.displayName = "Icon";

export { Icon };
