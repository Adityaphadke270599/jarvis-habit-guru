import * as React from "react";
import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "ghost" | "text";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-brass text-paper hover:bg-brass-deep active:bg-brass-deep " +
    "disabled:bg-paper-edge disabled:text-ink-faint",
  ghost:
    "bg-paper-deep text-ink hover:bg-paper-edge active:bg-paper-edge " +
    "disabled:text-ink-faint",
  text:
    "bg-transparent text-ink-soft hover:text-ink active:text-ink " +
    "disabled:text-ink-faint",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-9  px-3 text-body-sm rounded-md gap-1.5",
  md: "h-11 px-5 text-body    rounded-lg gap-2",
  lg: "h-14 px-6 text-body-lg rounded-lg gap-2",
};

/* The primary action surface.
 * Always one tap. Primary variant is brass — reserved for THE action on a screen. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      leadingIcon,
      trailingIcon,
      fullWidth,
      className,
      children,
      type = "button",
      ...rest
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center font-medium",
        "transition-colors duration-[var(--ds-dur-quick)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        "disabled:cursor-not-allowed",
        VARIANT[variant],
        SIZE[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  )
);

Button.displayName = "Button";
