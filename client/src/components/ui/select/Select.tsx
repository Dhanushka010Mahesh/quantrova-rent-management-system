import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Option[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className = "", id, ...rest }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-text">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none rounded-lg border bg-surface py-2.5 pl-3 pr-9 text-sm text-text
              transition-colors focus:outline-none focus:ring-2
              ${error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border focus:border-primary focus:ring-primary/25"}
              ${className}`}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {error ? (
            <AlertCircle className="pointer-events-none absolute right-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-danger" />
          ) : (
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-text-muted" />
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

Select.displayName = "Select";
export default Select;