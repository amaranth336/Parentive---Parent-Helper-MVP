import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Text } from "./text";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  htmlFor?: string;
  helpText?: string;
  error?: string;
  success?: string;
  required?: boolean;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      className,
      label,
      htmlFor,
      helpText,
      error,
      success,
      required,
      children,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const hasSuccess = !!success;

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && (
          <Label htmlFor={htmlFor}>
            {label}
            {required && (
              <span className="text-error ml-1" aria-label="required">
                *
              </span>
            )}
          </Label>
        )}
        {children}
        {helpText && !hasError && !hasSuccess && (
          <Text size="sm" color="muted" className="mt-1">
            {helpText}
          </Text>
        )}
        {hasError && (
          <Text size="sm" className="text-error mt-1">
            {error}
          </Text>
        )}
        {hasSuccess && (
          <Text size="sm" className="text-success mt-1">
            {success}
          </Text>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export { FormField };
