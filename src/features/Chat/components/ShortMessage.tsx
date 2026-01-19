import {
  Image,
  File,
  PlaySquare,
  Pin,
  UserPlus,
  UserMinus,
  User,
  Edit,
  Hash,
  Key,
  Smile,
  BarChart3,
} from 'lucide-react';
import { JSX } from 'react';
import { useSelector } from 'react-redux';

function getSenderPrefix({
  message,
  currentUserId,
  showName,
}: {
  message: any;
  currentUserId?: string;
  showName?: boolean;
}) {
  if (!showName && message.user._id !== currentUserId) return '';
  return message.user._id === currentUserId
    ? 'Bạn: '
    : `${message.user.name}: `;
}

type InlineMessageProps = {
  prefix: string;
  icon?: React.ReactNode;
  text: string;
};

function InlineMessage({ prefix, icon, text }: InlineMessageProps) {
  return (
    <span className="inline-flex items-center gap-1">
      {prefix}
      {icon}
      {text}
    </span>
  );
}

const NOTIFY_MAP: Record<
  string,
  { icon?: React.ReactNode; text: string }
> = {
  PIN_MESSAGE: {
    icon: <Pin className="w-4 h-4" />,
    text: 'đã ghim một tin nhắn',
  },
  NOT_PIN_MESSAGE: {
    icon: <Pin className="w-4 h-4" />,
    text: 'đã bỏ ghim một tin nhắn',
  },
  'Đã thêm vào nhóm': {
    icon: <UserPlus className="w-4 h-4" />,
    text: 'đã thêm thành viên vào nhóm',
  },
  'Đã xóa ra khỏi nhóm': {
    icon: <UserMinus className="w-4 h-4" />,
    text: 'đã xóa thành viên ra khỏi nhóm',
  },
  'Đã rời khỏi nhóm': {
    text: 'đã rời khỏi nhóm',
  },
  UPDATE_CHANNEL: {
    icon: <Hash className="w-4 h-4" />,
    text: 'đã đổi tên Channel',
  },
  DELETE_CHANNEL: {
    icon: <Hash className="w-4 h-4" />,
    text: 'đã xóa Channel',
  },
  CREATE_CHANNEL: {
    icon: <Hash className="w-4 h-4" />,
    text: 'đã tạo Channel',
  },
  ADD_MANAGERS: {
    icon: <Key className="w-4 h-4" />,
    text: 'đã thêm phó nhóm',
  },
  DELETE_MANAGERS: {
    icon: <Key className="w-4 h-4" />,
    text: 'đã xóa phó nhóm',
  },
  'Ảnh đại diện nhóm đã thay đổi': {
    icon: <Edit className="w-4 h-4" />,
    text: 'đã đổi ảnh nhóm',
  },
};


type ShortMessageProps = {
  message: any;
  type?: boolean;
};

export default function ShortMessage({ message, type }: ShortMessageProps) {
  const { user } = useSelector((s: any) => s.global);
  const prefix = getSenderPrefix({
    message,
    currentUserId: user?._id,
    showName: type,
  });

  if (message.isDeleted) {
    return <span>{prefix}đã thu hồi một tin nhắn</span>;
  }

  // TEXT
  if (message.type === 'TEXT') {
    return <span>{prefix}{message.content}</span>;
  }

  // SIMPLE TYPES
  const SIMPLE_TYPE_MAP: Record<string, JSX.Element> = {
    IMAGE: <Image className="w-4 h-4" />,
    VIDEO: <PlaySquare className="w-4 h-4" />,
    FILE: <File className="w-4 h-4" />,
    STICKER: <Smile className="w-4 h-4" />,
    VOTE: <BarChart3 className="w-4 h-4 text-primary" />,
  };

  if (SIMPLE_TYPE_MAP[message.type]) {
    return (
      <InlineMessage
        prefix={prefix}
        icon={SIMPLE_TYPE_MAP[message.type]}
        text="đã gửi một nội dung"
      />
    );
  }

  // NOTIFY
  if (message.type === 'NOTIFY') {
    if (message.content.startsWith('Đã đổi tên nhóm thành')) {
      return (
        <InlineMessage
          prefix={prefix}
          icon={<Edit className="w-4 h-4" />}
          text="đã đổi tên nhóm"
        />
      );
    }

    if (message.content.startsWith('Đã là bạn bè')) {
      return (
        <InlineMessage
          prefix={prefix}
          icon={<User className="w-4 h-4" />}
          text="đã trở thành bạn bè"
        />
      );
    }

    const notify = NOTIFY_MAP[message.content];
    if (notify) {
      return (
        <InlineMessage
          prefix={prefix}
          icon={notify.icon}
          text={notify.text}
        />
      );
    }
  }

  return null;
}