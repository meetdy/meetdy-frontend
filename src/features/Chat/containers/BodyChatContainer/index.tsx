import React, { useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNextPageMessage,
  fetchNextPageMessageOfChannel,
  setRaisePage,
} from '../../slice/chatSlice';
import DividerCustom from '@/features/Chat/components/DividerCustom';
import ModalShareMessage from '@/features/Chat/components/ModalShareMessage';
import UserMessage from '@/features/Chat/components/UserMessage';
import type { RootState, AppDispatch } from '@/store';
import type { Scrollbars as ScrollbarsType } from 'react-custom-scrollbars-2';

type Props = {
  scrollId?: string;
  onSCrollDown?: any;
  onBackToBottom?: (value: boolean, message?: string) => void;
  onResetScrollButton?: (value: boolean) => void;
  turnOnScrollButton?: boolean;
  onReply?: (mes: any) => void;
  onMention?: (user: any) => void;
};

export default function BodyChatContainer({
  scrollId,
  onSCrollDown,
  onBackToBottom,
  onResetScrollButton,
  turnOnScrollButton,
  onReply,
  onMention,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const scrollbars = useRef<ScrollbarsType | null>(null);
  const previousHeight = useRef<number | null>(null);
  const tempPosition = useRef<number | null>(null);

  const {
    messages = [],
    currentConversation,
    currentPage,
    lastViewOfMember = [],
    currentChannel,
  } = useSelector((state: RootState) => state.chat);

  const { user } = useSelector((state: RootState) => state.global);
  const [position, setPosition] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleModalShare, setVisibleModalShare] = useState<boolean>(false);
  const [idMessageShare, setIdMessageShare] = useState<string>('');

  const handleOpenModalShare = (_id: string) => {
    setVisibleModalShare(true);
    setIdMessageShare(_id);
  };

  useEffect(() => {
    setIdMessageShare('');
  }, [currentConversation]);

  useEffect(() => {
    if (turnOnScrollButton) {
      scrollbars.current?.scrollToBottom();
      onResetScrollButton?.(false);
    }
  }, [turnOnScrollButton, onResetScrollButton]);

  useEffect(() => {
    const fetchMessageWhenPageRaise = async () => {
      if (currentChannel) {
        await dispatch(
          fetchNextPageMessageOfChannel({
            channelId: currentChannel,
            page: currentPage,
            size: 10,
          }),
        );
      } else {
        await dispatch(
          fetchNextPageMessage({
            conversationId: currentConversation,
            page: currentPage,
            size: 10,
          }),
        );
      }
    };

    async function fetchNextListMessage() {
      if ((currentPage ?? 0) > 0) {
        setLoading(true);
        await fetchMessageWhenPageRaise();
        setLoading(false);

        const sb = scrollbars.current;
        if (sb && previousHeight.current !== null) {
          // @ts-expect-error methods from react-custom-scrollbars-2
          sb.scrollTop(sb.getScrollHeight() - previousHeight.current);
        }
      }
    }
    fetchNextListMessage();
  }, [currentPage, currentChannel, currentConversation, dispatch]);

  useEffect(() => {
    if (
      onSCrollDown &&
      scrollbars.current &&
      scrollbars.current.getScrollHeight() >
        scrollbars.current.getClientHeight()
    ) {
      if (position >= 0.95) {
        scrollbars.current?.scrollToBottom();
      } else {
        onBackToBottom?.(true, 'Có tin nhắn mới');
      }
    }
  }, [onSCrollDown, position, onBackToBottom]);

  const renderMessages = (messagesList: any[]) => {
    const result: React.ReactNode[] = [];

    for (let i = 0; i < messagesList.length; i++) {
      const preMessage = messagesList[i - 1];
      const currentMessage = messagesList[i];

      const senderId = currentMessage.user._id;
      const isMyMessage = senderId === user._id;

      if (i === 0) {
        result.push(
          <UserMessage
            key={currentMessage._id ?? `m-${i}`}
            message={currentMessage}
            isMyMessage={isMyMessage}
            onOpenModalShare={handleOpenModalShare}
            onReply={onReply}
            onMention={onMention}
          />,
        );
        continue;
      }

      const dateTempt2 = new Date(currentMessage.createdAt);
      const dateTempt1 = new Date(preMessage.createdAt);

      const isSameUser =
        currentMessage.user._id === preMessage.user._id &&
        preMessage.type !== 'NOTIFY';

      const timeIsEqual =
        dateTempt2.setHours(dateTempt2.getHours() - 6) > dateTempt1.getTime();

      const viewUsers: any[] = [];
      if (i === messagesList.length - 1) {
        const lastViewNotMe = (lastViewOfMember || []).filter((ele: any) => {
          if (
            ele.user._id === messagesList[i].user._id ||
            ele.user._id === user._id
          )
            return false;
          return true;
        });

        lastViewNotMe.forEach((ele: any) => {
          const { lastView, user: u } = ele;
          if (new Date(lastView) >= new Date(messagesList[i].createdAt))
            viewUsers.push(u);
        });
      }

      if (timeIsEqual) {
        result.push(
          <div key={currentMessage._id ?? `m-${i}`}>
            <DividerCustom dateString={dateTempt2} />
            <UserMessage
              key={`um-${i}`}
              message={currentMessage}
              isMyMessage={isMyMessage}
              viewUsers={viewUsers}
              onOpenModalShare={handleOpenModalShare}
              onReply={onReply}
              onMention={onMention}
            />
          </div>,
        );
      } else {
        result.push(
          <UserMessage
            key={currentMessage._id ?? `um-${i}`}
            message={currentMessage}
            isMyMessage={isMyMessage}
            isSameUser={isSameUser}
            viewUsers={viewUsers}
            onOpenModalShare={handleOpenModalShare}
            onReply={onReply}
            onMention={onMention}
          />,
        );
      }
    }

    return result;
  };

  const handleOnScrolling = ({ scrollTop, scrollHeight, top }: any) => {
    tempPosition.current = top;
    if (
      scrollbars.current &&
      scrollbars.current.getScrollHeight() ===
        scrollbars.current.getClientHeight()
    ) {
      onBackToBottom?.(false);
      return;
    }

    if (scrollTop === 0) {
      previousHeight.current = scrollHeight;
      dispatch(setRaisePage());
    }

    if (top < 0.85) {
      onBackToBottom?.(true);
    } else {
      onBackToBottom?.(false);
    }
  };

  const handleOnStop = (_value: any) => {
    setPosition(tempPosition.current ?? 0);
  };

  useEffect(() => {
    if (scrollId) {
      scrollbars.current?.scrollToBottom();
    }
  }, [scrollId]);

  function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  useEffect(() => {
    if ((messages || []).length > 0) {
      sleep(500).then(() => {
        if (scrollbars.current) {
          scrollbars.current.scrollToBottom();
        }
      });
    }
  }, [currentConversation, currentChannel, messages]);

  return (
    <Scrollbars
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
      ref={scrollbars}
      onScrollFrame={handleOnScrolling}
      onStop={handleOnStop}
      className="h-full"
    >
      <div>
        {loading && (
          <div className="flex items-center justify-center py-4">
            <svg
              className="w-8 h-8 animate-spin text-slate-700"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
        )}
      </div>
      {renderMessages(messages)}
      <ModalShareMessage
        visible={visibleModalShare}
        onCancel={() => setVisibleModalShare(false)}
        idMessage={idMessageShare}
      />
    </Scrollbars>
  );
}
