import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-8 h-8 text-xs",
      md: "w-12 h-12 text-sm",
      lg: "w-16 h-16 text-base",
      xl: "w-24 h-24 text-lg",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Organic background shape in Oat */}
        <div className="absolute inset-0 bg-oat rounded-organic" />
        
        {/* Serif 'p' in Deep Moss */}
        <span
          className="relative z-10 font-serif text-moss font-normal"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1.75em",
            fontWeight: 400,
          }}
        >
          p
        </span>
        
        {/* Muted Honey dot */}
        <div
          className="absolute bg-honey rounded-full"
          style={{
            width: "0.22em",
            height: "0.22em",
            top: "0.25em",
            right: "0.25em",
          }}
        />
      </div>
    );
  }
);
Logo.displayName = "Logo";

const Wordmark = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: "sm" | "md" | "lg";
  }
>(({ className, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "text-h4",
    md: "text-h3",
    lg: "text-h2",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "font-heading font-semibold text-moss tracking-tight",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      Parentive
    </div>
  );
});
Wordmark.displayName = "Wordmark";

const LogoLockup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: "sm" | "md" | "lg";
    tagline?: boolean;
  }
>(({ className, size = "md", tagline = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      <Logo size={size} />
      <div className="flex flex-col">
        <Wordmark size={size} />
        {tagline && (
          <span className="text-utility text-text-muted mt-0.5">
            Trusted, flexible help for real life
          </span>
        )}
      </div>
    </div>
  );
});
LogoLockup.displayName = "LogoLockup";

export { Logo, Wordmark, LogoLockup };
