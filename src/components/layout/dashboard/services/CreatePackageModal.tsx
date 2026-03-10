import { useState, type FC } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { usePackageStore } from '@/stores/package.store';
import toast from 'react-hot-toast';

interface CreatePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePackageModal: FC<CreatePackageModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createPackage, isLoading } = usePackageStore();

  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [price, setPrice] = useState('');

  const resetForm = () => {
    setName('');
    setDetails('');
    setPrice('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createPackage({
        name,
        details,
        price: Number(price),
      });
      toast.success('Package created successfully');
      resetForm();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create package');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Package">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
            Package Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. Premium Safari"
          />
        </div>

        <div>
           <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
            Price ($) *
          </label>
          <input
            type="number"
            required
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. 15000"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold mb-1 uppercase text-muted-foreground">
            Description
          </label>
          <textarea
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full bg-background border rounded-lg text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-primary"
            placeholder="Enter package description..."
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
            {isLoading ? 'Creating...' : 'Create Package'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePackageModal;
