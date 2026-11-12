import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { ChevronDown } from "./Icons";
import { formatDate } from "../utils/format";

type Base = { label: ReactNode; error?: string; hint?: string; className?: string };

function Wrapper({
  id,
  label,
  error,
  hint,
  className,
  children,
}: Base & { id: string; children: ReactNode }) {
  return (
    <div className={`field ${className ?? ""}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="field-error" id={`${id}-err`}>
          {error}
        </p>
      ) : hint ? (
        <p className="hint" style={{ margin: 0 }} id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-err` : hint ? `${id}-hint` : undefined;
}

export function TextField({ label, error, hint, className, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} className={className}>
      <input
        id={id}
        className="input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...rest}
      />
    </Wrapper>
  );
}

export function TextAreaField({
  label,
  error,
  hint,
  className,
  ...rest
}: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} className={className}>
      <textarea
        id={id}
        className="input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...rest}
      />
    </Wrapper>
  );
}

/** Dropdown com o círculo escuro do DropDownInput do app, mas com <select> nativo. */
export function SelectField({
  label,
  error,
  hint,
  className,
  placeholder,
  options,
  ...rest
}: Base & SelectHTMLAttributes<HTMLSelectElement> & { placeholder: string; options: readonly string[] }) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} className={className}>
      <div className="select">
        <select
          id={id}
          className="input"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <span className="select__chevron" aria-hidden="true">
          <ChevronDown size={14} />
        </span>
      </div>
    </Wrapper>
  );
}

/** Campo de data com a "pílula" cinzenta do DatePicker do app. */
export function DateField({
  label,
  placeholder,
  error,
  value,
  ...rest
}: Base & InputHTMLAttributes<HTMLInputElement> & { placeholder: string; value: string }) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error}>
      <div className="date-input">
        <input
          id={id}
          type="date"
          className="input"
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          {...rest}
        />
        <span className="date-input__label" aria-hidden="true">
          {placeholder}
        </span>
        {value && (
          <span className="date-input__chip" aria-hidden="true">
            {formatDate(value)}
          </span>
        )}
      </div>
    </Wrapper>
  );
}
