import { useEffect, useId, useRef } from "react";

export type AlertAction = {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
};

type Props = {
  open: boolean;
  title: string;
  message?: string;
  actions?: AlertAction[];
  onClose: () => void;
};

/** Versão web do AppAlert do app (sgm-app/src/components/AppAlert). */
export function AppAlert({ open, title, message, actions, onClose }: Props) {
  const titleId = useId();
  const primaryRef = useRef<HTMLButtonElement>(null);
  const list: AlertAction[] = actions?.length ? actions : [{ text: "OK" }];

  useEffect(() => {
    if (open) primaryRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="overlay overlay--center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="alert" role="alertdialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="alert__badge" aria-hidden="true">
          !
        </div>
        <h2 id={titleId} className="alert__title">
          {title}
        </h2>
        {message && <p className="alert__message">{message}</p>}
        <div className="alert__actions">
          {list.map((a, i) => {
            const isPrimary = list.length === 1 || (a.style !== "cancel" && i === list.length - 1);
            const cls =
              a.style === "destructive" ? "btn--danger" : isPrimary ? "btn--primary" : "btn--light";
            return (
              <button
                key={a.text}
                ref={isPrimary ? primaryRef : undefined}
                type="button"
                className={`btn ${cls}`}
                onClick={() => {
                  onClose();
                  a.onPress?.();
                }}
              >
                {a.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
