interface InputBoxProps {
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function InputBox({
  type = "text",
  name = "",
  placeholder = "",
  value = "",
  onChange,
  className = "w-11/12 h-10 p-2 mb-3 bg-card border border-border rounded-[var(--radius-pill)] text-foreground placeholder-foreground/40 font-body-sm text-[12px] font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors",
}: InputBoxProps) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}
