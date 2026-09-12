interface StatusToggleProps {
  active: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}

export default function StatusToggle({ active, onChange, disabled }: StatusToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!active);
      }}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50
        ${active ? "bg-success" : "bg-border-dark"}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform
          ${active ? "translate-x-4.5" : "translate-x-1"}`}
      />
    </button>
  );
}