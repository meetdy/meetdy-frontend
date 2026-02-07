import { JSX, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type ModalAddFriendProps = {
  isVisible: boolean;
  onCancel?: () => void;
  onSearch?: (value: string) => void;
  onEnter?: (value: string) => void;
};

export default function ModalAddFriend({
  isVisible,
  onCancel,
  onSearch,
  onEnter,
}: ModalAddFriendProps): JSX.Element {
  const [value, setValue] = useState('');

  const handleConfirm = () => {
    if (onSearch) onSearch(value);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter(value);
    }
  };

  return (
    <Dialog
      open={isVisible}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
    >
      <DialogContent className="w-full max-w-[360px]">
        <DialogHeader>
          <DialogTitle>Thêm bạn</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Input
            placeholder="Nhập số điện thoại hoặc email"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
        </div>
        <DialogFooter className="flex items-center justify-end space-x-2">
          <Button variant="ghost" onClick={handleCancel}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={!(value.trim().length > 0)}>
            Tìm kiếm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
