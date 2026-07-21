import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const fieldClass =
  "w-full rounded-lg border border-ink/15 bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-ink/30 focus:ring-2 focus:ring-hero-deep/30";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink/60">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1.5 block text-xs text-ink/40">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldClass} resize-none ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-ink/10 bg-surface p-6 shadow-sm ${className}`}>{children}</div>;
}

export function BackLink({ to, label = "Volver" }: { to: string; label?: string }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-hero/20 hover:text-ink"
    >
      <FaChevronLeft className="h-3.5 w-3.5" />
    </Link>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink/60">{description}</p>}
      </div>
      {action}
    </div>
  );
}

const buttonVariants = {
  primary: "bg-ink text-white hover:bg-ink/90",
  secondary: "border border-ink/15 bg-surface text-ink hover:bg-hero/20",
  ghost: "text-ink/60 hover:text-ink",
  danger: "text-red-600 hover:text-red-700",
} as const;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonVariants }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant]} ${className}`}
    />
  );
}
