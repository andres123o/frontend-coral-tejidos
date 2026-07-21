interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar productos..."
      className="w-full max-w-sm rounded-full border border-ink/20 bg-transparent px-4 py-1.5 text-button text-ink outline-none placeholder:text-ink/50"
    />
  );
}
