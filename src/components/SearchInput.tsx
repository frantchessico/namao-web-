import type { InputHTMLAttributes } from "react";
import { SearchIcon } from "./Icons";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  label: string;
  searchDisabled?: boolean;
  loading?: boolean;
  invalid?: boolean;
  describedBy?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "onSubmit">;

/** O SearchInput do app: caixa com duas camadas por trás e a lupa à direita. */
export function SearchInput({
  value,
  onChange,
  onSubmit,
  label,
  searchDisabled,
  loading,
  invalid,
  describedBy,
  ...rest
}: Props) {
  return (
    <form
      className="search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        // Enter com valor inválido também chega ao onSubmit, para a página mostrar o erro de formato.
        if (!loading) onSubmit();
      }}
    >
      <div className="search__layer1" aria-hidden="true" />
      <div className="search__layer2" aria-hidden="true" />
      <div className={`search__box${invalid ? " invalid" : ""}`}>
        <input
          className="search__input"
          aria-label={label}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={loading}
          autoComplete="off"
          {...rest}
        />
        <button
          type="submit"
          className="search__btn"
          aria-label={loading ? "A pesquisar" : "Pesquisar"}
          aria-busy={loading || undefined}
          // aria-disabled e não disabled: com o botão desactivado o browser ignora o Enter
          // e o utilizador nunca chegaria a ver a mensagem de formato inválido.
          aria-disabled={(searchDisabled && !loading) || undefined}
        >
          {loading ? <span className="spinner" /> : <SearchIcon />}
        </button>
      </div>
    </form>
  );
}
