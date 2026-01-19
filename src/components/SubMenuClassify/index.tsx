import { useState } from 'react';

import { Tag } from 'lucide-react';

import { useAddClassifyForConversation } from '@/hooks/classify/useAddClassifyForConversation';
import { useQueryClient } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import ModalClassify from '@/features/Chat/components/ModalClassify';

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface SubMenuClassifyProps {
  data: any[];
  chatId: string;
}

export default function SubMenuClassify({
  data,
  chatId,
}: SubMenuClassifyProps) {
  const [visible, setVisible] = useState(false);
  const { mutateAsync: addClassifyForConversation } =
    useAddClassifyForConversation();
  const queryClient = useQueryClient();

  const handleClickClassify = async (id: string) => {
    await addClassifyForConversation({ classifyId: id, conversationId: chatId });
    queryClient.invalidateQueries({
      queryKey: createQueryKey('classifies', {}),
    });
    // Also invalidate conversation to show the new tag
    queryClient.invalidateQueries({
      queryKey: createQueryKey('fetchListConversations', {}),
    });
    queryClient.invalidateQueries({
      queryKey: createQueryKey('fetchConversationById', {
        conversationId: chatId,
      }),
    });
  };

  return (
    <>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-sm font-semibold px-3 py-1">
          Danh sách thẻ
        </DropdownMenuLabel>

        {data.length > 0 &&
          data.map((ele) => (
            <DropdownMenuItem
              key={ele._id}
              onClick={() => handleClickClassify(ele._id)}
              className="cursor-pointer flex items-center gap-2"
            >
              <Tag className="w-4 h-4" style={{ color: ele.color.code }} />
              {ele.name}
            </DropdownMenuItem>
          ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => setVisible(true)}
          className="cursor-pointer flex items-center gap-2"
        >
          <Tag className="w-4 h-4" /> Quản lý thẻ phân loại
        </DropdownMenuItem>
      </DropdownMenuContent>

      <ModalClassify
        isVisible={visible}
        onCancel={() => setVisible(false)}
        onOpen={() => setVisible(true)}
      />
    </>
  );
}
