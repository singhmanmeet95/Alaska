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
  className = "w-11/12 h-10 p-2 mb-3 text-xs bg-gray-200 rounded-sm",
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
