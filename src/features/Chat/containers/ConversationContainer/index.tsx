import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import conversationApi from '@/api/conversationApi';
import SubMenuClassify from '@/components/SubMenuClassify';
import ConversationSingle from '@/features/Chat/components/ConversationSingle';
import { useFetchListClassify } from '@/hooks/classify/useFetchListClassify';
import { useFetchListConversations } from '@/hooks/conversation/useFetchListConversations';
import {
  fetchChannels,
  fetchListMessages,
  getLastViewOfMembers,
  setCurrentChannel,
} from '@/features/Chat/slice/chatSlice';
import {
  getMembersConversation,
  setTypeOfConversation,
} from '../../slice/chatSlice';
import type { RootState, AppDispatch } from '@/redux/store';

type Props = {
  valueClassify: string;
};

export default function ConversationContainer({ valueClassify }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations } = useFetchListConversations({});
  const { classifies } = useFetchListClassify();
  
  const { user } = useSelector((state: RootState) => state.global);

  const tempClassify =
    classifies?.find((ele) => ele._id === valueClassify) ?? 0;

  const checkConverInClassify = (idMember: string) => {
    if (tempClassify === 0) return true;
    const index = tempClassify.conversationIds.findIndex(
      (ele: string) => ele === idMember,
    );
    return index > -1;
  };

  const converFilter = conversations.filter((ele) =>
    checkConverInClassify(ele._id),
  );

  const handleConversationClick = async (conversationId: string) => {
    dispatch(setCurrentChannel(''));
    dispatch(getLastViewOfMembers({ conversationId }));
    dispatch(fetchListMessages({ conversationId, size: 10 }));
    dispatch(getMembersConversation({ conversationId }));
    dispatch(setTypeOfConversation(conversationId));
    dispatch(fetchChannels({ conversationId }));
  };

  const [contextMenu, setContextMenu] = useState<{
    id: string | null;
    x: number;
    y: number;
  }>({ id: null, x: 0, y: 0 });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    msg: string;
    type: 'success' | 'error' | '';
  }>({
    msg: '',
    type: '',
  });

  const refContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!refContainer.current) return;
      const el = e.target as HTMLElement;
      if (!refContainer.current.contains(el)) {
        setContextMenu({ id: null, x: 0, y: 0 });
      }
    }
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', () =>
      setContextMenu({ id: null, x: 0, y: 0 }),
    );
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ id, x: e.clientX, y: e.clientY });
  };

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

  const openConfirm = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
    setContextMenu({ id: null, x: 0, y: 0 });
  };

  return (
    <div id="conversation-main" ref={refContainer} className="relative">
      {toast.msg && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-sm shadow-md ${
            toast.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <ul className="list_conversation">
        {converFilter.map((conversationEle, index) => {
          const { numberUnread } = conversationEle;
          if (!conversationEle.lastMessage) return null;
          return (
            <li
              key={conversationEle._id}
              onContextMenu={(e) => handleContextMenu(e, conversationEle._id)}
              className={`conversation-item ${
                numberUnread === 0 ? '' : 'arrived-message'
              }`}
            >
              <ConversationSingle
                conversation={conversationEle}
                onClick={handleConversationClick}
              />

              {contextMenu.id === conversationEle._id && (
                <div
                  className="absolute z-40 min-w-[220px] rounded-md border bg-white shadow-lg"
                  style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                  <div className="p-2">
                    <SubMenuClassify
                      data={classifies}
                      chatId={conversationEle._id}
                    />
                    {user._id === conversationEle.leaderId && (
                      <button
                        onClick={() => openConfirm(conversationEle._id)}
                        className="mt-2 w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50"
                      >
                        Xoá hội thoại
                      </button>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

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
