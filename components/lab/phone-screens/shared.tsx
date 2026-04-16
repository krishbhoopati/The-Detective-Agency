"use client";

export function PhoneHeader({
  title,
  action,
  actionLabel,
  onAction,
}: {
  title: string;
  action?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div
      className="flex min-h-[64px] items-center justify-between border-b px-4"
      style={{ borderColor: "#d8d0bd", backgroundColor: "#fffaf0" }}
    >
      <h3 className="text-[22px] font-bold">{title}</h3>
      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="flex h-[60px] w-[60px] items-center justify-center text-[28px]"
          aria-label={actionLabel}
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function PhoneAppButton({
  label,
  icon,
  highlighted,
  onClick,
}: {
  label: string;
  icon: string;
  highlighted?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[78px] flex-col items-center justify-center gap-1 text-[15px] font-bold"
      style={{ color: "var(--noir-dark)" }}
      aria-label={`Open ${label}`}
    >
      <span
        className="flex h-[58px] w-[58px] items-center justify-center border-2 text-[28px]"
        style={{
          borderColor: highlighted ? "var(--noir-sepia)" : "#c0b89a",
          backgroundColor: highlighted ? "rgba(200, 169, 110, 0.22)" : "#fffaf0",
        }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

export function PhoneListRow({
  label,
  icon,
  highlighted,
  onClick,
  sublabel,
}: {
  label: string;
  icon?: string;
  highlighted?: boolean;
  onClick: () => void;
  sublabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-2 flex min-h-[60px] w-full items-center justify-between border-2 px-4 text-left"
      style={{
        borderColor: highlighted ? "var(--noir-sepia)" : "#d8d0bd",
        backgroundColor: highlighted ? "rgba(200, 169, 110, 0.22)" : "#fffaf0",
        color: "var(--noir-dark)",
      }}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-[22px]" aria-hidden="true">{icon}</span>}
        <div>
          <p className="text-[20px] font-semibold">{label}</p>
          {sublabel && <p className="text-[15px]" style={{ color: "#66594a" }}>{sublabel}</p>}
        </div>
      </div>
      <span className="text-[20px]" style={{ color: "#9e8c72" }} aria-hidden="true">›</span>
    </button>
  );
}
