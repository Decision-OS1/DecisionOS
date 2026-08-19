"use client";

interface YesNoToggleProps {
  value: string;
  onChange: (value: "yes" | "no") => void;
  label?: string;
}

export function YesNoToggle({ value, onChange, label }: YesNoToggleProps) {
  return (
    <div>
      {label && (
        <p className="mb-2 text-sm font-medium text-text">{label}</p>
      )}
      <div className="flex gap-2">
        {(["yes", "no"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-xl px-5 py-2 text-sm font-semibold capitalize transition ${
              value === opt
                ? "bg-primary text-white"
                : "border border-border bg-surface text-text-muted hover:border-primary"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

interface OptionListProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function OptionList({ options, value, onChange }: OptionListProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
            value === option
              ? "border-primary bg-primary-soft text-primary"
              : "border-border bg-surface text-text hover:border-primary/50"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

interface CheckboxListProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  columns?: 1 | 2;
}

export function CheckboxList({ options, value, onChange, columns = 2 }: CheckboxListProps) {
  function toggle(option: string) {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  }

  return (
    <div className={`grid gap-2 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {options.map((option) => {
        const checked = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
              checked
                ? "border-primary bg-primary-soft text-primary"
                : "border-border bg-surface text-text hover:border-primary/50"
            }`}
          >
            <span
              className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md border text-[10px] ${
                checked ? "border-primary bg-primary text-white" : "border-border"
              }`}
            >
              {checked ? "✓" : ""}
            </span>
            {option}
          </button>
        );
      })}
    </div>
  );
}

interface LikertScaleProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function LikertScale({ label, value, onChange }: LikertScaleProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-text">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-muted">Low trust</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition ${
              value === n
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface text-text-muted hover:border-primary"
            }`}
          >
            {n}
          </button>
        ))}
        <span className="text-xs text-text-muted">High trust</span>
      </div>
    </div>
  );
}

interface TextFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export function TextField({ label, value, onChange, placeholder, type = "text" }: TextFieldProps) {
  return (
    <div>
      {label && <p className="mb-1.5 text-sm font-medium text-text">{label}</p>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

interface TextAreaFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 5 }: TextAreaFieldProps) {
  return (
    <div>
      {label && <p className="mb-1.5 text-sm font-medium text-text">{label}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
