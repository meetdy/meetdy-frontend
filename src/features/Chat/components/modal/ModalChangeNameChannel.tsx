import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ModalChangeNameChannelProps {
  initialValue?: string;
  visible?: boolean;
  onConfirm?: (name: string) => void;
  onCancel?: () => void;
}

function ModalChangeNameChannel({
  initialValue = '',
  visible = false,
  onConfirm,
  onCancel,
}: ModalChangeNameChannelProps) {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (visible) {
      setValue(initialValue);
    }
  }, [initialValue, visible]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue(e.target.value);
  };

  const handleCancel = () => {
    onCancel?.();
    setValue(initialValue);
  };

  const handleConfirm = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    onConfirm?.(trimmed);
  };

  const isDisabled =
    !value.trim() || value.trim() === initialValue.trim();

  return (
    <Dialog
      open={visible}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Đổi tên Channel
          </DialogTitle>
        </DialogHeader>

        {/* BODY */}
        <div className="py-4">
          <Input
            autoFocus
            placeholder="Nhập tên mới"
            value={value}
            maxLength={100}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isDisabled) {
                handleConfirm();
              }
            }}
          />

          {/* Helper text */}
          <p className="text-xs text-slate-500 mt-2">
            Tối đa 100 ký tự
          </p>
        </div>

        {/* FOOTER */}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Hủy
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={isDisabled}
          >
            Thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalChangeNameChannel;
