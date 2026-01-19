import parse from 'html-react-parser';
import { Edit, Pin, Key } from 'lucide-react';
import AvatarCustom from '@/components/avatar-custom';
import { useSelector } from 'react-redux';

export enum NotifyType {
  ADD_MEMBER = 'ADD_MEMBER',
  REMOVE_MEMBER = 'REMOVE_MEMBER',
  CREATE_GROUP = 'CREATE_GROUP',
  JOIN_GROUP = 'JOIN_GROUP',
  LEAVE_GROUP = 'LEAVE_GROUP',
  FRIEND = 'FRIEND',
  PIN = 'PIN',
  UNPIN = 'UNPIN',
  RENAME_GROUP = 'RENAME_GROUP',
  JOIN_BY_LINK = 'JOIN_BY_LINK',
  UPDATE_CHANNEL = 'UPDATE_CHANNEL',
  DELETE_CHANNEL = 'DELETE_CHANNEL',
  CREATE_CHANNEL = 'CREATE_CHANNEL',
  UPDATE_AVATAR = 'UPDATE_AVATAR',
  ADD_MANAGER = 'ADD_MANAGER',
  REMOVE_MANAGER = 'REMOVE_MANAGER',
  UNKNOWN = 'UNKNOWN',
}

export function getNotifyType(content: string): NotifyType {
  if (content === 'Đã thêm vào nhóm') return NotifyType.ADD_MEMBER;
  if (content === 'Đã xóa ra khỏi nhóm') return NotifyType.REMOVE_MEMBER;
  if (content === 'Đã tạo nhóm') return NotifyType.CREATE_GROUP;
  if (content === 'Đã tham gia nhóm') return NotifyType.JOIN_GROUP;
  if (content === 'Đã rời khỏi nhóm') return NotifyType.LEAVE_GROUP;
  if (content === 'Đã là bạn bè') return NotifyType.FRIEND;
  if (content === 'PIN_MESSAGE') return NotifyType.PIN;
  if (content === 'NOT_PIN_MESSAGE') return NotifyType.UNPIN;
  if (content.startsWith('Đã đổi tên nhóm thành'))
    return NotifyType.RENAME_GROUP;
  if (content === 'Tham gia từ link') return NotifyType.JOIN_BY_LINK;
  if (content === 'UPDATE_CHANNEL') return NotifyType.UPDATE_CHANNEL;
  if (content === 'DELETE_CHANNEL') return NotifyType.DELETE_CHANNEL;
  if (content === 'CREATE_CHANNEL') return NotifyType.CREATE_CHANNEL;
  if (content === 'Ảnh đại diện nhóm đã thay đổi')
    return NotifyType.UPDATE_AVATAR;
  if (content === 'ADD_MANAGERS') return NotifyType.ADD_MANAGER;
  if (content === 'DELETE_MANAGERS') return NotifyType.REMOVE_MANAGER;

  return NotifyType.UNKNOWN;
}

type NotifyUserAvatarProps = {
  user?: {
    name?: string;
    avatar?: string;
    avatarColor?: string;
  };
};

export function NotifyUserAvatar({ user }: NotifyUserAvatarProps) {
  return (
    <AvatarCustom
      size={16}
      src={user?.avatar}
      name={user?.name}
      color={user?.avatarColor}
    />
  );
}

type NotifyRowProps = {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
};

export function NotifyRow({ icon, title, description }: NotifyRowProps) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <div className="flex items-center gap-2">{title}</div>
        {description && (
          <div className="text-sm text-slate-500">{description}</div>
        )}
      </div>
    </div>
  );
}



type ManipulatedUser = {
  _id: string;
  name: string;
  avatar?: string;
  avatarColor?: string;
};

type Message = {
  content: string;
  manipulatedUsers?: ManipulatedUser[];
  user?: {
    _id?: string;
    name?: string;
    avatar?: string;
    avatarColor?: string;
  };
};

type Props = {
  message: Message;
};


function renderUsers(
  users: ManipulatedUser[],
  currentUserId?: string
) {
  return users.slice(0, 3).map((u, i) => {
    const name = u._id === currentUserId ? 'bạn' : u.name;
    return (
      <span key={u._id} className="font-semibold">
        {i === 0 ? ` ${name}` : `, ${name}`}
      </span>
    );
  });
}

export default function NotifyMessage({ message }: Props) {
  const global = useSelector((s: any) => s.global);

  const { content, manipulatedUsers = [], user } = message;
  const notifyType = getNotifyType(content);

  const isMe = user?._id === global.user?._id;
  const actorName = isMe ? 'Bạn' : user?.name;

  switch (notifyType) {
    case NotifyType.CREATE_GROUP:
      return (
        <NotifyRow
          icon={<NotifyUserAvatar user={user} />}
          title={<span className="font-medium">{actorName}</span>}
          description="đã tạo nhóm"
        />
      );

    case NotifyType.ADD_MEMBER:
      return (
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center -space-x-1">
            {manipulatedUsers.slice(0, 3).map(u => (
              <AvatarCustom
                key={u._id}
                size={16}
                src={u.avatar}
                name={u.name}
                color={u.avatarColor}
              />
            ))}
          </div>

          <div className="flex flex-wrap">
            <span className="font-semibold">{actorName}</span>
            <span className="mx-1">đã thêm</span>
            {renderUsers(manipulatedUsers, global.user?._id)}
          </div>
        </div>
      );

    case NotifyType.PIN:
      return (
        <NotifyRow
          icon={<Pin className="w-4 h-4 text-slate-600" />}
          title={<span className="font-medium">{actorName}</span>}
          description="đã ghim một tin nhắn"
        />
      );

    case NotifyType.UNPIN:
      return (
        <NotifyRow
          icon={<Pin className="w-4 h-4 text-red-600" />}
          title={<span className="font-medium">{actorName}</span>}
          description="đã xóa ghim một tin nhắn"
        />
      );

    case NotifyType.RENAME_GROUP:
      return (
        <NotifyRow
          icon={
            <>
              <NotifyUserAvatar user={user} />
              <Edit className="w-4 h-4 text-slate-600" />
            </>
          }
          title={<span className="font-medium">{actorName}</span>}
          description={parse(content)}
        />
      );

    case NotifyType.ADD_MANAGER:
      return (
        <NotifyRow
          icon={
            <>
              <NotifyUserAvatar user={user} />
              <Key className="w-4 h-4 text-slate-600" />
            </>
          }
          title={
            <>
              <span className="font-medium">{actorName}</span> đã thêm
              {renderUsers(manipulatedUsers, global.user?._id)} làm phó nhóm
            </>
          }
        />
      );

    default:
      return null;
  }
}