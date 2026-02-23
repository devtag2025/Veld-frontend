import { X } from "lucide-react";
import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative z-50 w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto bg-card rounded-lg shadow-xl border`}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b sticky top-0 bg-card z-10">
          <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-3 sm:p-4">{children}</div>
      </div>
    </div>
  );
};

export { Modal };
