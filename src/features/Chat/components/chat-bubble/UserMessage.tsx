import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import { useGetPinMessages, usePinMessage } from '@/hooks/message/pin-message';
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

import ModalChangePinMessage from '@/components/modal-change-pin-message';
import PersonalAvatar from '@/features/Chat/components/PersonalAvatar';
import { checkLeader } from '@/utils/feature-utils';

import { chatKeys } from '@/hooks/chat';
import { removeMessageById } from '@/hooks/chat/messageCacheUtils';
import type { MessagesCache } from '@/hooks/chat/messageCacheUtils';
import { useMessageReactions } from '../../hooks/useMessageReactions';
import type { UserMessageProps, ChatMessage } from '../../types/message.types';

import ListReaction from '../reaction/ReactionPopup';
import ListReactionOfUser from '../reaction/ReactionDropped';
import NotifyMessage from '../message-type/NotifyMessage';
import VoteMessage from '../message-type/VoteMessage';
import LastView from '../LastView';

import FileMessage from '../message-type/FileMessage';
import HTMLMessage from '../message-type/HTMLMessage';
import ImageMessage from '../message-type/ImageMessage';
import StickerMessage from '../message-type/StickerMessage';
import TextMessage from '../message-type/TextMessage';
import VideoMessage from '../message-type/VideoMessage';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type RootState = {
    chat: {
        messages: ChatMessage[];
        conversations: Array<{ _id: string; type: unknown }>;
    };
    chatUi: {
        currentConversation: string;
        currentChannel: string;
    };
    global: {
        user: { _id: string };
    };
};

function UserMessage({
    message,
    isMyMessage = false,
    isSameUser = false,
    viewUsers = [],
    onOpenModalShare,
    onReply,
    onMention,
}: UserMessageProps) {
    const global = useSelector((state: RootState) => state.global);

    const [isLeader, setIsLeader] = useState(false);
    const [isVisibleModal, setVisibleModal] = useState(false);

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
        currentConversation,
        currentChannel,
    } = useSelector((state: RootState) => state.chatUi);

    const queryClient = useQueryClient();

    const { data: pinMessages } = useGetPinMessages({
        conversationId: currentConversation,
        enabled: !!currentConversation
    });

    const { doPinMessage } = usePinMessage();

    const {
        myReact,
        listReactionCurrent,
        listReaction,
        transferIcon,
        handleClickLike,
        handleClickReaction,
    } = useMessageReactions(_id, reacts, global.user._id);

    const isMediaMessage = useMemo(
        () => type === 'IMAGE' || type === 'VIDEO' || type === 'STICKER',
        [type],
    );

    // const isGroup = useMemo(() => {
    //     const conversation = conversations.find(
    //         (c) => c._id === currentConversation,
    //     );
    //     return Boolean(conversation?.type);
    // }, [conversations, currentConversation]);

    // useEffect(() => {
    //     setIsLeader(checkLeader(user._id, conversations, currentConversation));
    // }, [messages, user._id, conversations, currentConversation]);

    const handleOnCloseModal = useCallback(() => {
        setVisibleModal(false);
    }, []);

    const handlePinMessage = useCallback(async () => {
        if ((pinMessages?.length ?? 0) >= 3) {
            setVisibleModal(true);
            return;
        }
        try {
            doPinMessage({ messageId: _id });
            toast.success('Ghim tin nhắn thành công');
        } catch {
            toast.error('Ghim tin nhắn thất bại');
        }
    }, [_id, pinMessages, queryClient, currentConversation]);

    const handleRedoMessage = useCallback(async () => {
        await messageApi.redoMessage(_id);
    }, [_id]);

    const handleDeleteMessageClientSide = useCallback(async () => {
        await messageApi.deleteMessageClientSide(_id);
        // Remove from React Query cache
        const key = chatKeys.messages.infinite(
            currentConversation,
            currentChannel ? String(currentChannel) : undefined,
        );
        queryClient.setQueryData<MessagesCache>(key, (old) =>
            removeMessageById(old, _id),
        );
    }, [_id, queryClient, currentConversation, currentChannel]);

    // const setMarginTopAndBottom = useCallback((id: string) => {
    //     const index = messages.findIndex((m) => m._id === id);
    //     if (index === 0) return 'top';
    //     if (index === messages.length - 1) return 'bottom';
    //     return '';
    // }, [messages]);

    const handleOpenModalShare = useCallback(() => {
        onOpenModalShare?.(_id);
    }, [_id, onOpenModalShare]);

    const handleReplyMessage = useCallback(() => {
        onReply?.(message);
        onMention?.(user);
    }, [message, user, onReply, onMention]);

    const dateAt = useMemo(() => new Date(createdAt), [createdAt]);

    const safeContent = useMemo(
        () => (typeof content === 'string' ? content : ''),
        [content],
    );

    const pinMessageModalItems = useMemo(
        () =>
            (pinMessages ?? []).map((pm) => ({
                _id: pm.id,
                user: { name: '' },
                content: pm.content,
                type: 'TEXT',
            })),
        [pinMessages],
    );

    // Render message content based on type
    const renderMessageContent = useCallback(() => {
        if (isDeleted) {
            return (
                <span className="text-sm text-muted-foreground">
                    Tin nhắn đã được thu hồi
                </span>
            );
        }

        const commonReactionProps = {
            isMyMessage,
            onClickLike: handleClickLike,
            listReaction: listReaction as string[],
            onClickReaction: handleClickReaction,
        };

        const reactionElement = !myReact ? (
            <ListReaction {...commonReactionProps} />
        ) : null;

        const mediaReactionElement = !myReact ? (
            <ListReaction type="media" {...commonReactionProps} />
        ) : null;

        switch (type) {
            case 'HTML':
                return (
                    <HTMLMessage
                        content={safeContent}
                        dateAt={dateAt}
                        isSeen={Boolean(viewUsers?.length)}
                    >
                        {reactionElement}
                    </HTMLMessage>
                );

            case 'TEXT':
                return (
                    <TextMessage
                        tags={tagUsers}
                        content={safeContent}
                        dateAt={dateAt}
                        isSeen={Boolean(viewUsers?.length)}
                        replyMessage={replyMessage}
                    >
                        {reactionElement}
                    </TextMessage>
                );

            case 'IMAGE':
                return (
                    <ImageMessage
                        content={safeContent}
                        dateAt={dateAt}
                        isSeen={Boolean(viewUsers?.length)}
                    >
                        {mediaReactionElement}
                    </ImageMessage>
                );

            case 'VIDEO':
                return (
                    <VideoMessage
                        content={safeContent}
                        dateAt={dateAt}
                        isSeen={Boolean(viewUsers?.length)}
                    >
                        {mediaReactionElement}
                    </VideoMessage>
                );

            case 'FILE':
                return (
                    <FileMessage
                        content={safeContent}
                        dateAt={dateAt}
                        isSeen={Boolean(viewUsers?.length)}
                    >
                        {mediaReactionElement}
                    </FileMessage>
                );

            case 'STICKER':
                return (
                    <StickerMessage
                        content={safeContent}
                        dateAt={dateAt}
                        isSeen={Boolean(viewUsers?.length)}
                    />
                );

            default:
                return null;
        }
    }, [
        isDeleted,
        type,
        safeContent,
        dateAt,
        viewUsers,
        tagUsers,
        replyMessage,
        myReact,
        isMyMessage,
        handleClickLike,
        listReaction,
        handleClickReaction,
    ]);

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
            {message.type === 'VOTE' ? <VoteMessage data={message} /> : null}

            <div
                className={cn(
                    // setMarginTopAndBottom(_id),
                    'group relative transition-all duration-150',
                    type === 'VOTE' && 'hidden',
                )}
            >
                <div
                    className={cn(
                        'flex items-end gap-3 transition-all duration-200',
                        isMyMessage && 'flex-row-reverse',
                    )}
                >
                    <div className={cn(
                        'transition-opacity duration-200',
                        isSameUser && 'invisible'
                    )}>
                        <PersonalAvatar
                            isHost={isLeader}
                            dimension={40}
                            avatar={avatar}
                            name={user.name}
                            color={avatarColor}
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div id={_id} className="flex min-w-0 flex-col gap-1">
                            <div
                                className={cn(
                                    'flex items-end gap-2.5 transition-all duration-200',
                                    isMyMessage && 'flex-row-reverse',
                                )}
                            >
                                <div
                                    className={cn(
                                        'relative min-w-0 max-w-[72%] transition-all duration-200',
                                        isMediaMessage ? 'rounded-xl' : 'rounded-xl shadow-sm',
                                        isMyMessage &&
                                        !isMediaMessage &&
                                        'bg-blue-100 text-foreground border border-blue-200/40',
                                        !isMyMessage &&
                                        !isMediaMessage &&
                                        'bg-muted/60 text-foreground border border-border/40 hover:bg-muted/80',
                                        isMediaMessage ? 'bg-transparent' : 'px-4 py-2.5',
                                    )}
                                >
                                    <span className="sr-only">{name}</span>

                                    <div className="min-w-0">
                                        {renderMessageContent()}
                                    </div>

                                    <div
                                        className={cn(
                                            'pointer-events-none absolute -bottom-3 flex items-center gap-2 transition-all duration-200',
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
                                                    'pointer-events-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-popover px-2.5 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md',
                                                )}
                                            >
                                                <span className="text-sm leading-none">
                                                    {myReact ? transferIcon(myReact.type) : ''}
                                                </span>

                                                <ListReaction
                                                    isMyMessage={isMyMessage}
                                                    onClickLike={handleClickLike}
                                                    listReaction={listReaction as string[]}
                                                    onClickReaction={handleClickReaction}
                                                    isLikeButton={false}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <div
                                    className={cn(
                                        'flex items-center gap-1 opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100',
                                        isDeleted && 'hidden',
                                    )}
                                >
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-md hover:bg-accent/80 active:scale-95 transition-all duration-150"
                                        onClick={handleReplyMessage}
                                        aria-label="Reply to message"
                                    >
                                        <Reply className="h-4 w-4 text-muted-foreground" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-md hover:bg-accent/80 active:scale-95 transition-all duration-150"
                                        onClick={handleOpenModalShare}
                                        aria-label="Forward message"
                                    >
                                        <ReplyAll className="h-4 w-4 text-muted-foreground" />
                                    </Button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-md hover:bg-accent/80 active:scale-95 transition-all duration-150"
                                                aria-label="More actions"
                                            >
                                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent
                                            align={isMyMessage ? 'end' : 'start'}
                                            className="min-w-48 rounded-md shadow-lg"
                                        >
                                            {/* {isGroup && !currentChannel && type !== 'STICKER' ? (
                                                <DropdownMenuItem
                                                    onClick={() => void handlePinMessage()}
                                                    className="cursor-pointer gap-3 py-2.5"
                                                >
                                                    <Pin className="h-4 w-4" />
                                                    <span>Ghim tin nhắn</span>
                                                </DropdownMenuItem>
                                            ) : null} */}

                                            {isMyMessage ? (
                                                <DropdownMenuItem
                                                    onClick={() => void handleRedoMessage()}
                                                    className="cursor-pointer gap-3 py-2.5"
                                                >
                                                    <RotateCcw className="h-4 w-4" />
                                                    <span>Thu hồi tin nhắn</span>
                                                </DropdownMenuItem>
                                            ) : null}

                                            <DropdownMenuItem
                                                onClick={() => void handleDeleteMessageClientSide()}
                                                className="cursor-pointer gap-3 py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span>Chỉ xóa ở phía tôi</span>
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
                message={pinMessageModalItems}
                visible={isVisibleModal}
                messageId={_id}
                onCloseModal={handleOnCloseModal}
            />
        </>
    );
}

export default UserMessage;
