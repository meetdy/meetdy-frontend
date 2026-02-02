export type MessageType =
  | 'NOTIFY'
  | 'VOTE'
  | 'HTML'
  | 'TEXT'
  | 'IMAGE'
  | 'VIDEO'
  | 'FILE'
  | 'STICKER';

export type ReactionType = {
  type: string | number;
  user: { _id: string; name?: string };
};

export type ChatUser = {
  _id: string;
  name: string;
  avatar?: string;
  avatarColor?: string;
};

export type VoteOption = {
  name: string;
  userIds: string[];
};

export type BaseChatMessage = {
  _id: string;
  content: string;
  user: ChatUser;
  createdAt: string;
  type: Exclude<MessageType, 'VOTE'>;
  isDeleted?: boolean;
  reacts?: ReactionType[];
  tagUsers?: unknown[];
  replyMessage?: unknown;
};

export type VoteChatMessage = Omit<BaseChatMessage, 'type'> & {
  type: 'VOTE';
  options: VoteOption[];
};

export type ChatMessage = VoteChatMessage | BaseChatMessage;

export type UserMessageProps = {
  message: ChatMessage;
  isMyMessage?: boolean;
  isSameUser?: boolean;
  viewUsers?: unknown[];
  onOpenModalShare?: (messageId: string) => void;
  onReply?: (message: ChatMessage) => void;
  onMention?: (user: ChatUser) => void;
};
