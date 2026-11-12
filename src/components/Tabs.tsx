import type { CSSProperties } from "react";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  disabled?: boolean;
  style?: CSSProperties;
};

/** Abas segmentadas, iguais ao componente Option do app (Criados / Importados). */
export function Tabs<T extends string>({ options, value, onChange, label, disabled, style }: Props<T>) {
  return (
    <div
      className="tabs tabs--slide"
      role="tablist"
      aria-label={label}
      style={{ ...style, "--tab-count": options.length, "--tab-index": Math.max(0, options.findIndex((o) => o.value === value)) } as CSSProperties}
    >
      <span className="tabs__indicator" aria-hidden="true" />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          className="tab"
          aria-selected={o.value === value}
          disabled={disabled && o.value !== value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
