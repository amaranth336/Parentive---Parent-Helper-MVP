import * as React from "react";
import { cn } from "@/lib/utils";

const Divider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    aria-orientation="horizontal"
    className={cn("h-px w-full bg-border-subtle", className)}
    {...props}
  />
));
Divider.displayName = "Divider";

export { Divider };
