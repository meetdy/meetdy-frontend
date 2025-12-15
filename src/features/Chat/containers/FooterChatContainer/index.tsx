import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

import messageApi from '@/api/messageApi';

import NavigationChatBox from '@/features/Chat/components/NavigationChatBox';
import PersonalIcon from '@/features/Chat/components/PersonalIcon';
import ReplyBlock from '@/features/Chat/components/ReplyBlock';
import TextEditor from '@/features/Chat/components/TextEditor';
import { Button } from '@/components/ui/button';

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

  const { currentConversation, conversations, currentChannel, memberInConversation } =
    useSelector((state: RootState) => state.chat);
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

  const currentConver = conversations.find((ele) => ele._id === currentConversation);
  const getTypeConversation = currentConver?.type ?? false;
  const checkGroup = !!currentConver;

  useEffect(() => {
    if (userMention && Object.keys(userMention || {}).length > 0) {
      let tempMentionSelect = [...mentionSelect];
      let tempMentionList = [...mentionList];
      let tempValueText = valueText;

      if (preMention.current) {
        const exists = tempMentionSelect.some((m) => m._id === preMention.current?._id);
        if (exists) {
          const regex = new RegExp(`^@${preMention.current?.name}`);
          tempValueText = tempValueText.replace(regex, '');
          tempMentionSelect = tempMentionSelect.filter((ele) => ele._id !== preMention.current?._id);
          tempMentionList = [...tempMentionList, preMention.current as MentionUser];
        }
      }

      const checkExist = tempMentionSelect.some((m) => m._id === userMention._id);

      if (!checkExist) {
        if (getTypeConversation) {
          tempValueText = `@${userMention.name} ${tempValueText}`;
        }
        setValueText(tempValueText);
        setMentionSelect([...tempMentionSelect, userMention]);
        tempMentionList = tempMentionList.filter((ele) => ele._id !== userMention._id);
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
      const tempConver = conversations.find((conver) => conver._id === currentConversation);
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

    try {
      const res = await messageApi.sendTextMessage(newMessage);
      if (res && res._id) {
        handleOnScroll(res._id);
      }
    } catch (err) {}

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
      const removed = mentionSelect.filter((m) => !remaining.some((r) => r._id === m._id));
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
        .filter((m) => !mentionSelect.some((s) => s._id === m._id) && m._id !== user?._id);
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
      socket.emit('conversation-last-view', currentConversation, currentChannel);
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
    const before = value.slice(0, lastAtIndex >= 0 ? lastAtIndex : value.length);
    const after = value.slice((lastAtIndex >= 0 ? lastAtIndex : value.length) + (`@${mentionQuery}`).length);
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
      const newMentions = mentionList.filter((m) => !mentionSelect.some((s) => s._id === m._id));
      setMentionsList(newMentions);
    }
  }, []);

  return (
    <div id="main-footer-chat" className="w-full">
      <div className="navigation mb-2">
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

      {replyMessage && Object.keys(replyMessage || {}).length > 0 && (
        <ReplyBlock replyMessage={replyMessage} onCloseReply={onCloseReply} />
      )}

      <div className={`chat-editor flex items-end gap-2 ${showTextFormat ? 'flex-col' : ''}`}>
        <div className="main-editor flex-1 w-full relative">
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
                placeholder={`Nhập @, tin nhắn tới ${detailConversation?.name ?? ''}`}
                rows={1}
                className="w-full resize-none overflow-auto rounded-md border-none bg-transparent px-3 py-2 text-sm focus:outline-none"
                spellCheck={false}
              />
              {showMentionDropdown && filteredMentions.length > 0 && (
                <div className="absolute left-2 bottom-full mb-2 max-h-48 w-80 overflow-auto rounded-md border bg-white shadow-lg">
                  <ul>
                    {filteredMentions.map((m) => (
                      <li
                        key={m._id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectMention(m);
                        }}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 cursor-pointer"
                      >
                        <div className="w-6 h-6 flex-shrink-0">
                          <PersonalIcon dimension={24} avatar={m.avatar} name={m.name} />
                        </div>
                        <div className="text-sm">{m.name}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        <div className={`addtion-interaction flex items-center ${showTextFormat ? 'self-end' : ''}`}>
          <div className="like-emoji mr-2">
            <div className="send-text-thumb">
              <Button
                onClick={handleSentMessage}
                variant="ghost"
                className="p-2 rounded-full"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}