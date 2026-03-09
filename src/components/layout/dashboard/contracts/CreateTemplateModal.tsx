import { useState, type FC } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useContractTemplateStore } from "@/stores/contractTemplate.store";
import toast from "react-hot-toast";

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTemplateModal: FC<CreateTemplateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createTemplate, isLoading } = useContractTemplateStore();

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const resetForm = () => {
    setName("");
    setContent("");
    setIsDefault(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !content) {
      toast.error("Name and Content are required");
      return;
    }

    try {
      await createTemplate({
        name,
        content,
        isDefault,
      });
      toast.success("Template created successfully");
      resetForm();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create template");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Contract Template">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
            Template Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none"
            placeholder="e.g. Premium Safari Template"
          />
        </div>

        <div>
           <label className="flex items-center text-sm font-medium text-muted-foreground">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="mr-2 h-4 w-4 bg-background border rounded outline-none"
            />
            Set as Default Template
          </label>
        </div>

        <div>
          <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
            HTML Content *
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Use placeholders like {'{{clientName}}'}, {'{{totalAmount}}'}, and DocuSign anchors like {'/sig1/'}.
          </p>
          <textarea
            required
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none font-mono text-xs"
            placeholder="<!DOCTYPE html><html>..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 cursor-pointer"
          >
            {isLoading ? "Saving..." : "Create Template"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTemplateModal;
