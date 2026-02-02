import React, { useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useDispatch, useSelector } from 'react-redux';
import { useInfiniteListMessages } from '@/hooks/message/useInfiniteListMessages';
import { useGetLastViewOfMembers } from '@/hooks/conversation/useGetLastViewOfMembers';
import { useGetLastViewChannel } from '@/hooks/channel/useGetLastViewChannel';
import { useGetMessageInChannel } from '@/hooks/channel/useGetMessageInChannel';
import ModalShareMessage from '@/features/Chat/components/modal/ModalShareMessage';
import UserMessage from '@/features/Chat/components/chat-bubble/UserMessage';
import type { RootState, AppDispatch } from '@/redux/store';
import type { Scrollbars as ScrollbarsType } from 'react-custom-scrollbars-2';
import DividerCustom from '../components/DividerCustom';

type Props = {
  scrollId?: string;
  hasNewMessage?: any;
  onBackToBottom?: (value: boolean, message?: string) => void;
  onResetScrollButton?: (value: boolean) => void;
  turnOnScrollButton?: boolean;
  onReply?: (mes: any) => void;
  onMention?: (user: any) => void;
};

export default function BodyChatContainer({
  scrollId,
  hasNewMessage,
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
    currentConversation,
    lastViewOfMember = [],
    currentChannel,
  } = useSelector((state: RootState) => state.chat);

  const { user } = useSelector((state: RootState) => state.global);
  const [position, setPosition] = useState<number>(1);
  const [visibleModalShare, setVisibleModalShare] = useState<boolean>(false);
  const [idMessageShare, setIdMessageShare] = useState<string>('');

  // Use new hook for infinite scrolling
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages
  } = useInfiniteListMessages({
    conversationId: currentConversation,
    channelId: currentChannel,
    size: 20,
    enabled: !!currentConversation,
  });

  // Reverse pages order so oldest messages come first (for infinite scroll upwards)
  // Then reverse each page's data if API returns newest first
  const messages = data?.pages
    .slice()
    .reverse()
    .flatMap((page) => page.data.slice()) || [];

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
    if (
      hasNewMessage &&
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
  }, [hasNewMessage, position, onBackToBottom]);

  const renderMessages = (messagesList: any[]) => {
    const result: React.ReactNode[] = [];
    const seenIds = new Set<string>();

    for (let i = 0; i < messagesList.length; i++) {
      const preMessage = messagesList[i - 1];
      const currentMessage = messagesList[i];

      const messageId = currentMessage._id;
      const uniqueKey = seenIds.has(messageId)
        ? `${messageId}-${i}`
        : messageId;
      seenIds.add(messageId);

      const senderId = currentMessage.user._id;
      const isMyMessage = senderId === user._id;

      if (i === 0) {
        result.push(
          <UserMessage
            key={uniqueKey}
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
          <div key={`divider-${uniqueKey}`}>
            <DividerCustom dateString={dateTempt2} />
            <UserMessage
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
            key={uniqueKey}
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

    // Load more older messages when scrolling to top
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      previousHeight.current = scrollHeight;
      void fetchNextPage();
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

  // Scroll to bottom on initial load or conversation change
  useEffect(() => {
    if ((messages || []).length > 0 && !isFetchingNextPage) {
      sleep(200).then(() => {
        if (scrollbars.current) {
          scrollbars.current.scrollToBottom();
        }
      });
    }
  }, [currentConversation, currentChannel]);

  // Maintain scroll position when loading more messages
  useEffect(() => {
    if (previousHeight.current !== null && scrollbars.current) {
      const currentHeight = scrollbars.current.getScrollHeight();
      const heightDifference = currentHeight - previousHeight.current;

      if (heightDifference > 0) {
        scrollbars.current.scrollTop(heightDifference);
      }

      previousHeight.current = null;
    }
  }, [messages]);

  return (
    <Scrollbars
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
      ref={scrollbars}
      onScrollFrame={handleOnScrolling}
      // @ts-ignore onStop exists in runtime
      onStop={handleOnStop}
      className="h-full"
    >
      <div className="min-h-full bg-background">
        <div className="mx-auto w-full max-w-4xl px-6 py-5">
          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-4">
              <svg
                className="w-8 h-8 animate-spin text-primary"
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

          <div className="space-y-3">
            {renderMessages(messages)}
          </div>

          <ModalShareMessage
            visible={visibleModalShare}
            onCancel={() => setVisibleModalShare(false)}
            idMessage={idMessageShare}
          />
        </div>
      </div>
    </Scrollbars>
  );
}
