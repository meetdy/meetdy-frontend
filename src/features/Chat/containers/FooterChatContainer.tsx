import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useSelector } from 'react-redux';

import messageApi from '@/api/messageApi';

import NavigationChatBox from '@/features/Chat/components/NavigationChatBox';
import PersonalAvatar from '@/features/Chat/components/PersonalAvatar';
import ReplyBlock from '@/features/Chat/components/ReplyBlock';
import TextEditor from '@/features/Chat/components/TextEditor';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RootState } from '@/redux/store';

type MentionUser = {
    _id: string;
    name: string;
    avatar?: string;
};

type Props = {
    onScrollWhenSentText?: (id: string) => void;
    onOpenInfoBlock?: () => void;
    socket: any;
    replyMessage?: any;
    onCloseReply?: () => void;
    userMention?: any;
    onRemoveMention?: () => void;
    onViewVotes?: () => void;
};

export default function FooterChatContainer({
    onScrollWhenSentText,
    onOpenInfoBlock,
    socket,
    replyMessage,
    onCloseReply,
    userMention,
    onRemoveMention,
    onViewVotes,
}: Props) {
    const preMention = useRef<MentionUser | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const {
        currentConversation,
        conversations,
        currentChannel,
        memberInConversation,
    } = useSelector((state: RootState) => state.chat);
    const { user } = useSelector((state: RootState) => state.global);

    const [showTextFormat, setShowTextFormat] = useState(false);
    const [isShowLike, setShowLike] = useState(true);
    const [valueText, setValueText] = useState('');
    const [isHightLight, setHightLight] = useState(false);
    const [detailConversation, setDetailConversation] = useState<any>({});
    const [mentionList, setMentionsList] = useState<MentionUser[]>([]);
    const [mentionSelect, setMentionSelect] = useState<MentionUser[]>([]);
    const [mentionQuery, setMentionQuery] = useState('');
    const [showMentionDropdown, setShowMentionDropdown] = useState(false);
    const [filteredMentions, setFilteredMentions] = useState<MentionUser[]>([]);

    const currentConver = conversations.find(
        (ele) => ele._id === currentConversation,
    );
    const getTypeConversation = currentConver?.type ?? false;

    useEffect(() => {
        if (userMention && Object.keys(userMention || {}).length > 0) {
            let tempMentionSelect = [...mentionSelect];
            let tempMentionList = [...mentionList];
            let tempValueText = valueText;

            if (preMention.current) {
                const exists = tempMentionSelect.some(
                    (m) => m._id === preMention.current?._id,
                );
                if (exists) {
                    const regex = new RegExp(`^@${preMention.current?.name}`);
                    tempValueText = tempValueText.replace(regex, '');
                    tempMentionSelect = tempMentionSelect.filter(
                        (ele) => ele._id !== preMention.current?._id,
                    );
                    tempMentionList = [
                        ...tempMentionList,
                        preMention.current as MentionUser,
                    ];
                }
            }

            const checkExist = tempMentionSelect.some(
                (m) => m._id === userMention._id,
            );

            if (!checkExist) {
                if (getTypeConversation) {
                    tempValueText = `@${userMention.name} ${tempValueText}`;
                }
                setValueText(tempValueText);
                setMentionSelect([...tempMentionSelect, userMention]);
                tempMentionList = tempMentionList.filter(
                    (ele) => ele._id !== userMention._id,
                );
                setMentionsList(tempMentionList);
            }
            preMention.current = userMention;
        }
    }, [userMention]);

    useEffect(() => {
        if (memberInConversation && memberInConversation.length > 0) {
            setMentionsList(memberInConversation);
        } else {
            setMentionsList([]);
        }
    }, [memberInConversation]);

    useEffect(() => {
        setValueText('');
        setMentionSelect([]);
    }, [currentConversation]);

    useEffect(() => {
        if (currentConversation) {
            const tempConver = conversations.find(
                (conver) => conver._id === currentConversation,
            );
            if (tempConver) {
                setDetailConversation(tempConver);
            }
        }
    }, [currentConversation, conversations]);

    const handleClickTextFormat = () => {
        setShowTextFormat((s) => !s);
        setValueText('');
    };

    async function sendMessage(value: string, type: 'TEXT' | 'HTML') {
        const listId = mentionSelect.map((ele) => ele._id);

        const newMessage: any = {
            content: value,
            type,
            conversationId: currentConversation,
            tags: listId,
        };

        if (replyMessage && Object.keys(replyMessage || {}).length > 0) {
            newMessage.replyMessageId = replyMessage._id;
        }

        if (currentChannel) {
            newMessage.channelId = currentChannel;
        }

        const sendViaSocket = async () => {
            if (!socket?.connected) {
                throw new Error('Socket not connected');
            }

            const emitter = socket.timeout ? socket.timeout(5000) : socket;
            const response = await emitter.emitWithAck('send-message', newMessage);

            if (response?.error) {
                throw new Error(response.error);
            }

            return response;
        };

        try {
            const res = await sendViaSocket();
            if (res?._id) {
                handleOnScroll(res._id);
            }
        } catch (err) {
            console.warn('Send via socket failed, fallback to REST', err);
            // Fallback to REST in case socket send fails
            try {
                const res = await messageApi.sendTextMessage(newMessage);
                if (res?._id) {
                    handleOnScroll(res._id);
                }
            } catch (error_) {
                // Optionally log the error; UI feedback handled by socket listeners elsewhere
                console.error('Send message failed via socket and REST', error_);
            }
        }

        setMentionsList(memberInConversation || []);
        setMentionSelect([]);

        if (onCloseReply) {
            onCloseReply();
        }
        if (onRemoveMention) {
            onRemoveMention();
        }
    }

    const handleOnScroll = (id: string) => {
        if (onScrollWhenSentText) {
            onScrollWhenSentText(id);
        }
    };

    const handleSentMessage = () => {
        if (valueText.trim()) {
            if (showTextFormat) {
                sendMessage(valueText, 'HTML');
            } else {
                sendMessage(valueText, 'TEXT');
            }
            setValueText('');
            socket.emit('not-typing', currentConversation, user);
        }
    };

    const syncMentionsFromText = (text: string) => {
        const remaining = mentionSelect.filter((m) => text.includes(`@${m.name}`));
        if (remaining.length !== mentionSelect.length) {
            setMentionSelect(remaining);
            const removed = mentionSelect.filter(
                (m) => !remaining.some((r) => r._id === m._id),
            );
            if (removed.length > 0 && onRemoveMention) {
                onRemoveMention();
            }
            const newMentionList = [...mentionList];
            removed.forEach((r) => {
                if (!newMentionList.some((m) => m._id === r._id)) {
                    newMentionList.push(r);
                }
            });
            setMentionsList(newMentionList);
        }
    };

    const handleOnChangeInput = (value: string) => {
        syncMentionsFromText(value);
        value.length > 0 ? setShowLike(false) : setShowLike(true);
        setValueText(value);

        const match = /@([\p{L}\w]*)$/u.exec(value);
        if (match) {
            const q = match[1];
            setMentionQuery(q);
            const filtered = (mentionList || [])
                .filter((m) => m.name.toLowerCase().includes(q.toLowerCase()))
                .filter(
                    (m) =>
                        !mentionSelect.some((s) => s._id === m._id) && m._id !== user?._id,
                );
            setFilteredMentions(filtered);
            setShowMentionDropdown(true);
        } else {
            setShowMentionDropdown(false);
            setFilteredMentions([]);
            setMentionQuery('');
        }

        if (value.length > 0 && !currentChannel) {
            socket.emit('typing', currentConversation, user);
        } else {
            socket.emit('not-typing', currentConversation, user);
        }
    };

    const handleShowLike = (value: boolean) => {
        setShowLike(value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            const valueInput = (event.target as HTMLTextAreaElement).value;
            if (valueInput.trim().length > 0) {
                sendMessage(valueInput, 'TEXT');
                setValueText('');
                socket.emit('not-typing', currentConversation, user);
            }
            event.preventDefault();
        }
    };

    const handleOnFocus = () => {
        if (currentChannel) {
            socket.emit(
                'conversation-last-view',
                currentConversation,
                currentChannel,
            );
        } else {
            socket.emit('conversation-last-view', currentConversation);
        }
        setHightLight(true);
    };

    const handleOnBlur = () => {
        setHightLight(false);
        socket.emit('not-typing', currentConversation, user);
    };

    const handleSetValueEditor = (content: string) => {
        setValueText(content);
    };

    const handleSelectMention = (member: MentionUser) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const value = valueText;
        const lastAtIndex = value.lastIndexOf('@' + mentionQuery);
        const before = value.slice(
            0,
            lastAtIndex >= 0 ? lastAtIndex : value.length,
        );
        const after = value.slice(
            (lastAtIndex >= 0 ? lastAtIndex : value.length) +
            `@${mentionQuery}`.length,
        );
        const inserted = `${before}@${member.name} ${after}`;
        setValueText(inserted);
        setMentionSelect((prev) => [...prev, member]);
        setMentionsList((prev) => prev.filter((m) => m._id !== member._id));
        setShowMentionDropdown(false);
        setFilteredMentions([]);
        setMentionQuery('');
        preMention.current = member;
        textarea.focus();
        const caretPos = (before + `@${member.name} `).length;
        requestAnimationFrame(() => {
            textarea.setSelectionRange(caretPos, caretPos);
        });
    };

    useEffect(() => {
        if (mentionSelect.length > 0) {
            const newMentions = mentionList.filter(
                (m) => !mentionSelect.some((s) => s._id === m._id),
            );
            setMentionsList(newMentions);
        }
    }, []);

    return (
        <div id="main-footer-chat" className="w-full space-y-2">
            {replyMessage && Object.keys(replyMessage || {}).length > 0 && (
                <ReplyBlock replyMessage={replyMessage} onCloseReply={onCloseReply} />
            )}

            <div
                className={cn(
                    'rounded-2xl border border-border bg-muted/40 transition-all duration-200',
                    isHightLight && 'border-primary/40 bg-card ring-2 ring-ring/20',
                )}
            >
                <div className="px-3 pt-2">
                    <NavigationChatBox
                        isFocus={isHightLight}
                        onClickTextFormat={handleClickTextFormat}
                        onScroll={(e?: any) => {
                            if (onScrollWhenSentText) onScrollWhenSentText(e);
                        }}
                        onViewVotes={onViewVotes}
                        onOpenInfoBlock={onOpenInfoBlock}
                    />
                </div>

                <div
                    className={cn(
                        'flex items-end gap-2 px-3 pb-3',
                        showTextFormat && 'flex-col',
                    )}
                >
                    <div className="flex-1 w-full relative">
                        {showTextFormat ? (
                            <TextEditor
                                showFormat={showTextFormat}
                                onFocus={handleOnFocus}
                                onBlur={handleOnBlur}
                                showLike={handleShowLike}
                                valueHtml={valueText}
                                onSetValue={handleSetValueEditor}
                            />
                        ) : (
                            <>
                                <textarea
                                    ref={textareaRef}
                                    value={valueText}
                                    onChange={(e) => handleOnChangeInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    onFocus={handleOnFocus}
                                    onBlur={handleOnBlur}
                                    placeholder={`Nhắn tin tới ${detailConversation?.name ?? ''
                                        }...`}
                                    rows={1}
                                    className="w-full resize-none overflow-auto rounded-md border-none bg-transparent px-1 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
                                    spellCheck={false}
                                />
                                {showMentionDropdown && filteredMentions.length > 0 && (
                                    <div className="absolute left-0 bottom-full mb-2 max-h-48 w-72 overflow-auto rounded-2xl border border-border bg-popover">
                                        <div className="p-1">
                                            {filteredMentions.map((m) => (
                                                <button
                                                    type="button"
                                                    key={m._id}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        handleSelectMention(m);
                                                    }}
                                                    className="flex w-full items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left"
                                                >
                                                    <div className="w-8 h-8 shrink-0">
                                                        <PersonalAvatar
                                                            dimension={32}
                                                            avatar={m.avatar}
                                                            name={m.name}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-foreground">
                                                        {m.name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div
                        className={cn(
                            'flex items-center gap-1',
                            showTextFormat && 'self-end',
                        )}
                    >
                        <Button
                            onClick={handleSentMessage}
                            disabled={!valueText.trim()}
                            size="icon"
                            className={cn(
                                'h-9 w-9 rounded-md transition-all duration-200',
                                valueText.trim()
                                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg'
                                    : 'bg-muted text-muted-foreground cursor-not-allowed',
                            )}
                            aria-label="Gửi tin nhắn"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
