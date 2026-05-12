import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: React.ReactNode;
  searchText?: string; // Optional raw text for searching if label is complex
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  disabled?: boolean;
}

export const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  className = "",
  buttonClassName,
  disabled = false,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={
          buttonClassName ||
          `w-full bg-background border rounded-lg py-2 px-3 outline-none flex items-center justify-between text-left text-sm ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer focus:ring-1 focus:ring-primary"
          }`
        }
      >
        <span className="truncate block pr-2 text-sm">
          {selectedOption ? selectedOption.label : <span className="text-muted-foreground">{placeholder}</span>}
        </span>
        <ChevronDown size={16} className="text-muted-foreground shrink-0" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 min-w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto py-1">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors text-muted-foreground"
          >
            {placeholder}
          </button>
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">No options available</div>
          ) : (
            options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors whitespace-normal break-words flex items-start gap-2 border-t border-muted/10 ${
                  value === opt.value ? "bg-primary/5" : ""
                }`}
              >
                <div className="mt-0.5 shrink-0 w-4">
                  {value === opt.value && <Check size={14} className="text-primary" />}
                </div>
                <div className="flex-1 leading-snug">{opt.label}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
