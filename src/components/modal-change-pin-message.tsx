import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import pinMessageApi from '@/api/pinMessageApi';
import TypeMessagePin from '@/features/Chat/components/TypeMessagePin';

import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PinMessageItem {
  _id: string;
  user: { name: string };
  content: string;
  type?: string;
}

interface ModalChangePinMessageProps {
  visible: boolean;
  message?: PinMessageItem[];
  idMessage?: string;
  onCloseModal?: () => void;
}

export default function ModalChangePinMessage({
  visible,
  message = [],
  onCloseModal,
  idMessage = '',
}: ModalChangePinMessageProps) {
  const [value, setValue] = useState<string>('');
  const queryClient = useQueryClient();
  const { currentConversation } = useSelector((state: any) => state.chat || {});

  const handleOnClickItem = (ele: PinMessageItem) => {
    setValue(ele._id);
  };

  const handleOnOk = async () => {
    if (!value) return;
    await pinMessageApi.unpinMessage({
      messageId: value,
    });
    await pinMessageApi.pinMessage({
      messageId: idMessage,
    });
    window.alert('Ghim tin nhắn thành công');

    queryClient.invalidateQueries({
      queryKey: createQueryKey('fetchPinMessages', { conversationId: currentConversation })
    });

    handleOnCancel();
  };

  const handleOnCancel = () => {
    if (onCloseModal) onCloseModal();
  };

  return (
    <Dialog
      open={visible}
      onOpenChange={(open) => {
        if (!open) handleOnCancel();
      }}
    >
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cập nhật danh sách ghim</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <div className="rounded-md bg-yellow-50 p-3 mb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-yellow-700" />
              </div>
              <p className="text-sm text-yellow-900">
                Đã đạt giới hạn 3 ghim. Ghim cũ dưới đây sẻ được bỏ để cập nhật
                nội dung mới
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {message.map((ele, index) => (
              <button
                key={ele._id ?? index}
                type="button"
                onClick={() => handleOnClickItem(ele)}
                className="w-full text-left flex items-center justify-between gap-4 p-3 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-100">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                  </div>

                  <div>
                    <div className="text-sm font-medium">Tin nhắn</div>
                    <div className="text-sm text-muted-foreground">
                      <TypeMessagePin
                        name={ele.user?.name}
                        content={ele.content}
                        type={ele.type}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    name="pin-message-select"
                    checked={value === ele._id}
                    onChange={() => setValue(ele._id)}
                    className="h-4 w-4 text-primary-600 accent-primary-600"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end space-x-2 mt-4">
          <Button variant="ghost" onClick={handleOnCancel}>
            Hủy
          </Button>
          <Button onClick={handleOnOk} disabled={!value}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
