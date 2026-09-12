import { forwardRef, type InputHTMLAttributes } from "react";
import { Calendar, AlertCircle } from "lucide-react";

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, helperText, className = "", id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text">
            {label}
          </label>
        )}
        <div className="relative">
          <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-text-muted" />
          <input
            ref={ref}
            id={inputId}
            type="date"
            className={`w-full rounded-lg border bg-surface py-2.5 pl-10 pr-9 text-sm text-text
              transition-colors focus:outline-none focus:ring-2
              [color-scheme:light]
              ${error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border focus:border-primary focus:ring-primary/25"}
              ${className}`}
            {...rest}
          />
          {error && <AlertCircle className="pointer-events-none absolute right-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-danger" />}
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

DatePicker.displayName = "DatePicker";
export default DatePicker;

{/* <DatePicker
  label="Start Date"
  value={startDate}
  max={endDate || undefined}
  error={startDate && endDate && startDate > endDate ? "Start date must be before end date" : undefined}
  onChange={(e) => setStartDate(e.target.value)}
/> */}