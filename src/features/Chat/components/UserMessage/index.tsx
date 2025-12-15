import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Dispatch } from 'redux';

import {
  Reply,
  ReplyAll,
  MoreHorizontal,
  Pin,
  RotateCcw,
  Trash2,
} from 'lucide-react';

import messageApi from '@/api/messageApi';
import pinMessageApi from '@/api/pinMessageApi';
import ModalChangePinMessage from '@/components/ModalChangePinMessage';
import PersonalIcon from '@/features/Chat/components/PersonalIcon';
import { checkLeader } from '@/utils/groupUtils';

import { deleteMessageClient, fetchPinMessages } from '../../slice/chatSlice';

import LastView from '../LastView';
import ListReaction from '../ListReaction';
import ListReactionOfUser from '../ListReactionOfUser';
import FileMessage from '../MessageType/FileMessage';
import HTMLMessage from '../MessageType/HTMLMessage';
import ImageMessage from '../MessageType/ImageMessage';
import NotifyMessage from '../MessageType/NotifyMessage';
import StickerMessage from '../MessageType/StickerMessage';
import TextMessage from '../MessageType/TextMessage';
import VideoMessage from '../MessageType/VideoMessage';
import VoteMessage from '../MessageType/VoteMessage';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ReactionType = {
  type: string | number;
  user: { _id: string };
};

type MessageType =
  | 'NOTIFY'
  | 'VOTE'
  | 'HTML'
  | 'TEXT'
  | 'IMAGE'
  | 'VIDEO'
  | 'FILE'
  | 'STICKER'
  | string;

type ChatUser = {
  _id: string;
  name: string;
  avatar?: string;
  avatarColor?: string;
};

type ChatMessage = {
  _id: string;
  content?: unknown;
  user: ChatUser;
  createdAt: string;
  type: MessageType;
  isDeleted?: boolean;
  reacts?: ReactionType[];
  tagUsers?: unknown[];
  replyMessage?: unknown;
};

type Conversation = {
  _id: string;
  type: unknown;
};

type RootState = {
  chat: {
    messages: ChatMessage[];
    currentConversation: string;
    conversations: Conversation[];
    pinMessages: unknown[];
    currentChannel: unknown;
  };
  global: {
    user: { _id: string };
  };
};

type Props = {
  message: ChatMessage;
  isMyMessage?: boolean;
  isSameUser?: boolean;
  viewUsers?: unknown[];
  onOpenModalShare?: (messageId: string) => void;
  onReply?: (message: ChatMessage) => void;
  onMention?: (user: ChatUser) => void;
};

function UserMessage({
  message,
  isMyMessage = false,
  isSameUser = false,
  viewUsers = [],
  onOpenModalShare,
  onReply,
  onMention,
}: Props) {
  const {
    _id,
    content,
    user,
    createdAt,
    type,
    isDeleted = false,
    reacts = [],
    tagUsers,
    replyMessage,
  } = message;

  const { name, avatar, avatarColor } = user;

  const {
    messages,
    currentConversation,
    conversations,
    pinMessages,
    currentChannel,
  } = useSelector((state: RootState) => state.chat);

  const global = useSelector((state: RootState) => state.global);

  const dispatch = useDispatch<Dispatch>();

  const [listReactionCurrent, setListReactionCurrent] = useState<
    Array<string | number>
  >([]);
  const [isLeader, setIsLeader] = useState(false);
  const [isVisibleModal, setVisibleModal] = useState(false);

  const isGroup = useMemo(() => {
    const conversation = conversations.find(
      (c) => c._id === currentConversation,
    );
    return Boolean(conversation?.type);
  }, [conversations, currentConversation]);

  const myReact = useMemo(() => {
    if (!reacts?.length) return undefined;
    return reacts.find((ele) => ele.user?._id === global.user._id);
  }, [reacts, global.user._id]);

  useEffect(() => {
    setIsLeader(checkLeader(user._id, conversations, currentConversation));
  }, [messages, user._id, conversations, currentConversation]);

  const listReaction = useMemo(() => ['👍', '❤️', '😆', '😮', '😭', '😡'], []);

  useEffect(() => {
    const unique = new Set<string | number>();
    for (const ele of reacts ?? []) unique.add(ele.type);
    setListReactionCurrent(Array.from(unique));
  }, [reacts]);

  const transferIcon = (reactionType: string | number) => {
    const idx = Number.parseInt(String(reactionType), 10) - 1;
    return listReaction[idx] ?? '';
  };

  const sendReaction = async (reactionType: number) => {
    await messageApi.dropReaction(_id, reactionType);
  };

  const handleClickLike = () => {
    void sendReaction(1);
  };

  const handleClickReaction = (value: string) => {
    const reactionType =
      listReaction.findIndex((element) => element === value) + 1;
    if (reactionType <= 0) return;
    void sendReaction(reactionType);
  };

  const handleOnCloseModal = () => {
    setVisibleModal(false);
  };

  const handlePinMessage = async () => {
    if (pinMessages.length === 3) {
      setVisibleModal(true);
      return;
    }

    try {
      await pinMessageApi.pinMessage(_id);
      dispatch(fetchPinMessages({ conversationId: currentConversation }));
      toast({ title: 'Ghim tin nhắn thành công' });
    } catch {
      toast({ title: 'Ghim tin nhắn thất bại', variant: 'destructive' });
    }
  };

  const handleRedoMessage = async () => {
    await messageApi.redoMessage(_id);
  };

  const handleDeleteMessageClientSide = async () => {
    await messageApi.deleteMessageClientSide(_id);
    dispatch(deleteMessageClient(_id));
  };

  const setMarginTopAndBottom = (id: string) => {
    const index = messages.findIndex((m) => m._id === id);
    if (index === 0) return 'top';
    if (index === messages.length - 1) return 'bottom';
    return '';
  };

  const handleOpenModalShare = () => {
    onOpenModalShare?.(_id);
  };

  const handleReplyMessage = () => {
    onReply?.(message);
    onMention?.(user);
  };

  const dateAt = useMemo(() => new Date(createdAt), [createdAt]);

  if (!isDeleted && type === 'NOTIFY') {
    return (
      <>
        <NotifyMessage message={message} />
        <div className="mt-2 flex items-center justify-center">
          {viewUsers?.length ? <LastView lastView={viewUsers} /> : null}
        </div>
      </>
    );
  }

  return (
    <>
      {type === 'VOTE' ? <VoteMessage data={message} /> : null}

      <div
        className={cn(
          setMarginTopAndBottom(_id),
          'group relative',
          type === 'VOTE' && 'hidden',
        )}
      >
        <div
          className={cn(
            'flex items-end gap-2',
            isMyMessage && 'flex-row-reverse',
          )}
        >
          <div className={cn(isSameUser && 'invisible')}>
            <PersonalIcon
              isHost={isLeader}
              dimension={40}
              avatar={avatar}
              name={user.name}
              color={avatarColor}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div id={_id} className="flex min-w-0 flex-col">
              <div
                className={cn(
                  'flex items-end gap-2',
                  isMyMessage && 'flex-row-reverse',
                )}
              >
                <div
                  className={cn(
                    'relative min-w-0',
                    type === 'IMAGE' || type === 'VIDEO' || type === 'STICKER'
                      ? 'rounded-xl'
                      : 'rounded-2xl',
                    isMyMessage &&
                      type !== 'IMAGE' &&
                      type !== 'VIDEO' &&
                      type !== 'STICKER' &&
                      'bg-primary text-primary-foreground',
                    !isMyMessage &&
                      type !== 'IMAGE' &&
                      type !== 'VIDEO' &&
                      type !== 'STICKER' &&
                      'bg-muted text-foreground',
                    type === 'IMAGE' || type === 'VIDEO' || type === 'STICKER'
                      ? 'bg-transparent'
                      : 'px-3 py-2',
                  )}
                >
                  <span className="sr-only">{name}</span>

                  <div className="min-w-0">
                    {isDeleted ? (
                      <span className="text-sm text-muted-foreground">
                        Tin nhắn đã được thu hồi
                      </span>
                    ) : (
                      <>
                        {type === 'HTML' ? (
                          <HTMLMessage
                            content={content}
                            dateAt={dateAt}
                            isSeen={Boolean(viewUsers?.length)}
                          >
                            {!myReact ? (
                              <ListReaction
                                isMyMessage={isMyMessage}
                                onClickLike={handleClickLike}
                                listReaction={listReaction}
                                onClickReaction={handleClickReaction}
                              />
                            ) : null}
                          </HTMLMessage>
                        ) : type === 'TEXT' ? (
                          <TextMessage
                            tags={tagUsers}
                            content={content}
                            dateAt={dateAt}
                            isSeen={Boolean(viewUsers?.length)}
                            replyMessage={replyMessage}
                          >
                            {!myReact ? (
                              <ListReaction
                                isMyMessage={isMyMessage}
                                onClickLike={handleClickLike}
                                listReaction={listReaction}
                                onClickReaction={handleClickReaction}
                              />
                            ) : null}
                          </TextMessage>
                        ) : type === 'IMAGE' ? (
                          <ImageMessage
                            content={content}
                            dateAt={dateAt}
                            isSeen={Boolean(viewUsers?.length)}
                          >
                            {!myReact ? (
                              <ListReaction
                                type="media"
                                isMyMessage={isMyMessage}
                                onClickLike={handleClickLike}
                                listReaction={listReaction}
                                onClickReaction={handleClickReaction}
                              />
                            ) : null}
                          </ImageMessage>
                        ) : type === 'VIDEO' ? (
                          <VideoMessage
                            content={content}
                            dateAt={dateAt}
                            isSeen={Boolean(viewUsers?.length)}
                          >
                            {!myReact ? (
                              <ListReaction
                                type="media"
                                isMyMessage={isMyMessage}
                                onClickLike={handleClickLike}
                                listReaction={listReaction}
                                onClickReaction={handleClickReaction}
                              />
                            ) : null}
                          </VideoMessage>
                        ) : type === 'FILE' ? (
                          <FileMessage
                            content={content}
                            dateAt={dateAt}
                            isSeen={Boolean(viewUsers?.length)}
                          >
                            {!myReact ? (
                              <ListReaction
                                type="media"
                                isMyMessage={isMyMessage}
                                onClickLike={handleClickLike}
                                listReaction={listReaction}
                                onClickReaction={handleClickReaction}
                              />
                            ) : null}
                          </FileMessage>
                        ) : type === 'STICKER' ? (
                          <StickerMessage
                            content={content}
                            dateAt={dateAt}
                            isSeen={Boolean(viewUsers?.length)}
                          />
                        ) : null}
                      </>
                    )}
                  </div>

                  <div
                    className={cn(
                      'pointer-events-none absolute -bottom-3 flex items-center gap-2',
                      isMyMessage ? 'left-0' : 'right-0',
                      (type === 'IMAGE' || type === 'VIDEO') && 'translate-y-1',
                    )}
                  >
                    {listReactionCurrent.length > 0 && !isDeleted ? (
                      <ListReactionOfUser
                        listReactionCurrent={listReactionCurrent}
                        reacts={reacts}
                        isMyMessage={isMyMessage}
                        onTransferIcon={transferIcon}
                      />
                    ) : null}

                    {myReact && !isDeleted ? (
                      <div
                        className={cn(
                          'pointer-events-auto inline-flex items-center gap-1 rounded-full border bg-background px-2 py-1 shadow-sm',
                          isMyMessage && 'bg-white',
                        )}
                      >
                        <span className="text-sm leading-none">
                          {myReact ? transferIcon(myReact.type) : ''}
                        </span>

                        <ListReaction
                          isMyMessage={isMyMessage}
                          onClickLike={handleClickLike}
                          listReaction={listReaction}
                          onClickReaction={handleClickReaction}
                          isLikeButton={false}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div
                  className={cn(
                    'flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100',
                    isDeleted && 'hidden',
                  )}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleReplyMessage}
                  >
                    <Reply className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleOpenModalShare}
                  >
                    <ReplyAll className="h-4 w-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align={isMyMessage ? 'end' : 'start'}
                      className="min-w-44"
                    >
                      {isGroup && !currentChannel && type !== 'STICKER' ? (
                        <DropdownMenuItem
                          onClick={() => void handlePinMessage()}
                        >
                          <Pin className="mr-2 h-4 w-4" />
                          Ghim tin nhắn
                        </DropdownMenuItem>
                      ) : null}

                      {isMyMessage ? (
                        <DropdownMenuItem
                          onClick={() => void handleRedoMessage()}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Thu hồi tin nhắn
                        </DropdownMenuItem>
                      ) : null}

                      <DropdownMenuItem
                        onClick={() => void handleDeleteMessageClientSide()}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Chỉ xóa ở phía tôi
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <div
              className={cn(
                'mt-2 flex',
                isMyMessage ? 'justify-end' : 'justify-start',
              )}
            >
              {viewUsers?.length ? <LastView lastView={viewUsers} /> : null}
            </div>
          </div>
        </div>
      </div>

      <ModalChangePinMessage
        message={pinMessages}
        visible={isVisibleModal}
        idMessage={_id}
        onCloseModal={handleOnCloseModal}
      />
    </>
  );
}

export default UserMessage;
