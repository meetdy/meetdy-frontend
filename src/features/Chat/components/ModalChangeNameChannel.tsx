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
  visible?: boolean;
  onOk?: (name: string) => void;
  onCancel?: () => void;
  initialValue?: string;
}

function ModalChangeNameChannel({
  visible = false,
  onOk,
  onCancel,
  initialValue = '',
}: ModalChangeNameChannelProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, visible]);

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleCancel = () => {
    onCancel?.();
    setValue('');
  };

  const handleOk = () => {
    onOk?.(value);
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Đổi tên Channel</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Nhập tên mới"
            value={value}
            onChange={handleOnchange}
            onKeyDown={(e) => e.key === 'Enter' && value.trim() && handleOk()}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button onClick={handleOk} disabled={value.trim().length === 0}>
            Thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalChangeNameChannel;
