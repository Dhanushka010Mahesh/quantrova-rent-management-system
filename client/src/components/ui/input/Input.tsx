import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;         // presence of error => validated/invalid state
  success?: boolean;       // validated/valid state (green tick)
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, helperText, icon, type = "text", className = "", id, ...rest }, ref) => {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (show ? "text" : "password") : type;
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={`w-full rounded-lg border bg-surface py-2.5 text-sm text-text placeholder:text-text-muted/70
              transition-colors focus:outline-none focus:ring-2
              ${icon ? "pl-10" : "pl-3"}
              ${isPassword || error || success ? "pr-10" : "pr-3"}
              ${
                error
                  ? "border-danger focus:border-danger focus:ring-danger/20"
                  : success
                  ? "border-success focus:border-success focus:ring-success/20"
                  : "border-border focus:border-primary focus:ring-primary/25"
              }
              ${className}`}
            {...rest}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-secondary"
              tabIndex={-1}
            >
              {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          )}

          {!isPassword && error && (
            <AlertCircle className="absolute right-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-danger" />
          )}
          {!isPassword && success && !error && (
            <CheckCircle2 className="absolute right-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-success" />
          )}
        </div>

        {error ? (
          <p className="mt-1.5 text-xs text-danger">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

// <Input label="Name" placeholder="Enter name" />
// <Input label="Email" type="email" error={errors.email} />
// <Input label="Username" success helperText="Username is available" />