import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Virtuoso } from 'react-virtuoso';

import conversationApi from '@/api/conversationApi';
import SubMenuClassify from '@/components/sub-menu-classify';
import ConversationSingle from '@/features/Chat/components/ConversationSingle';
import { useGetListClassify } from '@/hooks/classify/useGetListClassify';
import { useGetListConversations } from '@/hooks/conversation/useGetListConversations';
import {
  fetchChannels,
  getLastViewOfMembers,
  setCurrentChannel,
  setCurrentConversation,
} from '@/features/Chat/slice/chatSlice';
import {
  getMembersConversation,
  setTypeOfConversation,
} from '../../slice/chatSlice';
import type { RootState, AppDispatch } from '@/redux/store';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { Tag } from 'lucide-react';

// OPTIMIZATION: Extracted to a memoized component to prevent re-rendering the whole list
type ConversationItemProps = {
  conversation: any;
  onClick: (id: string) => void;
  onOpenConfirm: (id: string) => void;
  user: any;
  classifies: any[];
};

const ConversationItem = React.memo(
  ({
    conversation,
    onClick,
    onOpenConfirm,
    user,
    classifies,
  }: ConversationItemProps) => {
    const { numberUnread } = conversation;

    if (!conversation.lastMessage) return null;

    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <li
            className={`${numberUnread === 0 ? '' : 'arrived-message'}`}
            onContextMenu={(e) => {
              // Prevent default is handled by ContextMenuTrigger, but we might want to ensure
              // any custom logic doesn't interfere.
              // e.preventDefault();
            }}
          >
            <ConversationSingle
              conversation={conversation}
              onClick={onClick}
            />
          </li>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          {/* Classify Submenu */}
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Tag className="w-4 h-4 mr-2" />
              Phân loại
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-56">
              <SubMenuClassify
                data={classifies}
                chatId={conversation._id}
                menuType="context"
              />
            </ContextMenuSubContent>
          </ContextMenuSub>

          {user._id === conversation.leaderId && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={() => onOpenConfirm(conversation._id)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                Xoá hội thoại
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    );
  },
);

ConversationItem.displayName = 'ConversationItem';

type Props = {
  valueClassify: string;
};

export default function ConversationContainer({ valueClassify }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations } = useGetListConversations({ params: {} });
  const { classifies } = useGetListClassify();

  // OPTIMIZATION: Select only needed user state, ignore other global state changes
  const user = useSelector((state: RootState) => state.global.user);

  const tempClassify = useMemo(
    () => classifies?.find((ele) => ele._id === valueClassify) ?? 0,
    [classifies, valueClassify],
  );

  const checkConverInClassify = useCallback(
    (idMember: string) => {
      if (tempClassify === 0) return true;
      const index = tempClassify.conversationIds.findIndex(
        (ele: string) => ele === idMember,
      );
      return index > -1;
    },
    [tempClassify],
  );

  // OPTIMIZATION: Memoize filter to allow stable reference for list rendering
  const converFilter = useMemo(
    () => conversations.filter((ele) => checkConverInClassify(ele._id)),
    [conversations, checkConverInClassify],
  );

  const handleConversationClick = useCallback(
    async (conversationId: string) => {
      dispatch(setCurrentConversation(conversationId));
      dispatch(setCurrentChannel(''));
      dispatch(getLastViewOfMembers({ conversationId }));

      dispatch(getMembersConversation({ conversationId }));
      dispatch(setTypeOfConversation(conversationId));
      dispatch(fetchChannels({ conversationId }));
    },
    [dispatch],
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    msg: string;
    type: 'success' | 'error' | '';
  }>({
    msg: '',
    type: '',
  });

  const deleteConver = async (id: string) => {
    try {
      await conversationApi.deleteConversation(id);
      setToast({ msg: 'Xóa thành công', type: 'success' });
    } catch (error) {
      setToast({ msg: 'Đã có lỗi xảy ra', type: 'error' });
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
      setTimeout(() => setToast({ msg: '', type: '' }), 3000);
    }
  };

  const openConfirm = useCallback((id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  }, []);

  return (
    <div className="relative h-full">
      {toast.msg && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-sm shadow-md ${toast.type === 'success'
            ? 'bg-green-50 text-green-800'
            : 'bg-red-50 text-red-800'
            }`}
        >
          {toast.msg}
        </div>
      )}

      <div style={{ height: '100%', width: '100%' }}>
        <Virtuoso
          style={{ height: '100%' }}
          data={converFilter}
          itemContent={(index, conversationEle) => (
            <ConversationItem
              key={conversationEle._id}
              conversation={conversationEle}
              onClick={handleConversationClick}
              onOpenConfirm={openConfirm}
              user={user}
              classifies={classifies}
            />
          )}
        />
      </div>

      {confirmOpen && deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setConfirmOpen(false)}
          />
          <div className="z-50 w-[420px] max-w-full rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-medium">Xác nhận</h3>
            <p className="mt-2 text-sm text-slate-600">
              Toàn bộ nội dung cuộc trò chuyện sẽ bị xóa, bạn có chắc chắn muốn
              xóa?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setConfirmOpen(false);
                  setDeleteId(null);
                }}
                className="rounded-md px-4 py-2 text-sm hover:bg-slate-100"
              >
                Không
              </button>
              <button
                onClick={() => deleteConver(deleteId)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
