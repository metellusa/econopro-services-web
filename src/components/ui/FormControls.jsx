export function FieldLabel({ children, htmlFor, hint }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-2 block text-sm font-semibold text-brand-navy">{children}</span>
      {hint ? <span className="sr-only">{hint}</span> : null}
    </label>
  );
}

export function fieldClassName(extra = "") {
  return [
    "w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink",
    "outline-none transition placeholder:text-slate-400",
    "focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function FormField({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  hint,
  as = "input",
  children,
  className = "",
  id,
  ...props
}) {
  const fieldId = id || name;

  return (
    <div className={className}>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      {as === "textarea" ? (
        <textarea
          id={fieldId}
          name={name}
          required={required}
          placeholder={placeholder}
          className={fieldClassName()}
          {...props}
        />
      ) : as === "select" ? (
        <select
          id={fieldId}
          name={name}
          required={required}
          className={fieldClassName()}
          {...props}
        >
          {children}
        </select>
      ) : (
        <input
          id={fieldId}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={fieldClassName()}
          {...props}
        />
      )}
      {hint ? <p className="mt-2 text-xs text-brand-muted">{hint}</p> : null}
    </div>
  );
}
