import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-brand-gold text-white hover:bg-brand-gold-soft shadow-sm",
  secondary:
    "bg-brand-navy text-white hover:bg-brand-navy-deep shadow-sm",
  outline:
    "border border-brand-navy/20 bg-transparent text-brand-navy hover:border-brand-navy/40 hover:bg-white",
  "outline-light":
    "border border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/5",
  ghost:
    "bg-transparent text-brand-navy hover:bg-brand-cream-dark",
};

const sizes = {
  sm: "px-4 py-2.5 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-sm sm:text-base",
};

export default function Button({
  children,
  to,
  href,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  onClick,
  disabled = false,
  ...props
}) {
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
