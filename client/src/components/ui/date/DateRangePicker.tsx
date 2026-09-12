import DatePicker from "./DatePicker";

interface DateRangeValue {
  start: string;
  end: string;
}

interface DateRangePickerProps {
  label?: string;
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  error?: string;
}

export default function DateRangePicker({ label, value, onChange, error }: DateRangePickerProps) {
  const rangeInvalid = value.start && value.end && value.start > value.end;

  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-sm font-medium text-text">{label}</label>}
      <div className="flex items-center gap-2">
        <DatePicker
          value={value.start}
          max={value.end || undefined}
          onChange={(e) => onChange({ ...value, start: e.target.value })}
          className="flex-1"
        />
        <span className="text-sm text-text-muted">to</span>
        <DatePicker
          value={value.end}
          min={value.start || undefined}
          onChange={(e) => onChange({ ...value, end: e.target.value })}
          className="flex-1"
        />
      </div>
      {(error || rangeInvalid) && (
        <p className="mt-1.5 text-xs text-danger">{error ?? "End date must be after start date"}</p>
      )}
    </div>
  );
}