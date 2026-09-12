import { forwardRef, type ButtonHTMLAttributes } from "react";
import Spinner from "../others/Spinner";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-primary text-secondary hover:bg-primary-dark focus-visible:ring-primary/40",
  secondary: "bg-secondary text-white hover:bg-secondary-light focus-visible:ring-secondary/40",
  outline: "border border-border-dark bg-surface text-text hover:bg-background focus-visible:ring-secondary/20",
  ghost: "bg-transparent text-text hover:bg-background focus-visible:ring-secondary/20",
  danger: "bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger/40",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      disabled,
      className = "",
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center rounded-lg font-medium transition-all
          active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2
          disabled:cursor-not-allowed disabled:opacity-60
          ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...rest}
      >
        {loading ? (
          <>
            <Spinner size="sm" />
            <span>{typeof children === "string" ? children : "Loading..."}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && icon}
            {children}
            {icon && iconPosition === "right" && icon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;

{/* <Button variant="primary">Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="danger" loading={isDeleting}>Delete</Button>
<Button icon={<Plus className="h-4 w-4" />}>Add Item</Button> */}