import * as React from "react";
import { cn } from "@/lib/utils";

export type OrganicShape =
  | "open"
  | "drift"
  | "lean"
  | "pebble"
  | "room"
  | "sidecar"
  | "quiet-edge";

export interface OrganicShapeProps extends React.HTMLAttributes<HTMLDivElement> {
  shape: OrganicShape;
  color?: "oat" | "sand" | "sage" | "moss";
  size?: "sm" | "md" | "lg" | "xl";
}

const shapeStyles: Record<OrganicShape, string> = {
  open: "rounded-[40%_60%_60%_40%/40%_40%_60%_60%]",
  drift: "rounded-[60%_40%_30%_70%/60%_30%_70%_40%]",
  lean: "rounded-[30%_70%_70%_30%/30%_30%_70%_70%]",
  pebble: "rounded-[50%_50%_50%_50%/60%_60%_40%_40%]",
  room: "rounded-[40%_60%_40%_60%/60%_40%_60%_40%]",
  sidecar: "rounded-[70%_30%_30%_70%/60%_60%_40%_40%]",
  "quiet-edge": "rounded-[45%_55%_55%_45%/55%_45%_55%_45%]",
};

const colorStyles = {
  oat: "bg-oat",
  sand: "bg-sand",
  sage: "bg-sage",
  moss: "bg-moss",
};

const sizeStyles = {
  sm: "w-32 h-32",
  md: "w-48 h-48",
  lg: "w-64 h-64",
  xl: "w-96 h-96",
};

const OrganicShape = React.forwardRef<HTMLDivElement, OrganicShapeProps>(
  ({ className, shape, color = "oat", size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "transition-all duration-slow",
          shapeStyles[shape],
          colorStyles[color],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);
OrganicShape.displayName = "OrganicShape";

const OrganicBrandSurface = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    shape?: OrganicShape;
    color?: "oat" | "sand" | "sage" | "moss";
    children?: React.ReactNode;
  }
>(
  (
    { className, shape = "pebble", color = "sand", children, ...props },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
        <OrganicShape
          shape={shape}
          color={color}
          size="xl"
          className="absolute -top-24 -right-24 opacity-40"
        />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);
OrganicBrandSurface.displayName = "OrganicBrandSurface";

export { OrganicShape, OrganicBrandSurface };
