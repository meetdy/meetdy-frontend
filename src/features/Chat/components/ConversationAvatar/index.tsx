import { UserOutlined } from '@ant-design/icons';
import AvatarCustom from '@/components/AvatarCustom';

type Props = {
  avatar: any;
  dimension?: number;
  isGroupCard?: boolean;
  totalMembers: number;
  type?: string;
  name?: string;
  isActived?: boolean;
  sizeAvatar?: number;
  frameSize?: number;
  avatarColor?: string;
};

export default function ConversationAvatar({
  avatar,
  dimension = 28,
  totalMembers,
  type,
  name,
  isActived = false,
  sizeAvatar = 48,
  frameSize = 48,
  avatarColor = '',
}: Props) {
  const renderSingleAvatar = () => (
    <div className="relative inline-block">
      {isActived && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
      )}

      <AvatarCustom
        size={sizeAvatar}
        src={avatar}
        color={avatarColor}
        name={name}
      />
    </div>
  );

  const renderArrayAvatar = () => {
    if (totalMembers === 2) {
      return (
        <div
          className="relative flex items-center justify-center"
          style={{ width: frameSize, height: frameSize }}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <AvatarBubble avatar={avatar[0]} size={dimension} />
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 border border-white rounded-full">
            <AvatarBubble avatar={avatar[1]} size={dimension} />
          </div>
        </div>
      );
    }

    if (totalMembers === 3) {
      return (
        <div
          className="relative"
          style={{ width: frameSize, height: frameSize }}
        >
          <div className="absolute left-0 top-0">
            <AvatarBubble avatar={avatar[0]} size={dimension} />
          </div>

          <div className="absolute right-0 top-0">
            <AvatarBubble avatar={avatar[1]} size={dimension} />
          </div>

          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2"
            style={{ marginTop: -(dimension / 6) }}
          >
            <AvatarBubble avatar={avatar[2]} size={dimension} />
          </div>
        </div>
      );
    }

    if (totalMembers > 3) {
      return (
        <div
          className="relative"
          style={{ width: frameSize, height: frameSize }}
        >
          <div className="absolute left-0 top-0">
            <AvatarBubble avatar={avatar[0]} size={dimension} />
          </div>

          <div className="absolute right-0 top-0">
            <AvatarBubble avatar={avatar[1]} size={dimension} />
          </div>

          <div className="absolute left-0 bottom-0">
            <AvatarBubble avatar={avatar[2]} size={dimension} />
          </div>

          <div className="absolute right-0 bottom-0 bg-indigo-600 text-white text-xs w-7 h-7 flex items-center justify-center rounded-full border-2 border-white">
            +{totalMembers - 3}
          </div>
        </div>
      );
    }

    return null;
  };

  const isGroup = type || totalMembers > 3;

  return (
    <div className="flex items-center justify-center">
      {isGroup ? renderArrayAvatar() : renderSingleAvatar()}
    </div>
  );
}

function AvatarBubble({ avatar, size }: any) {
  const bg = avatar?.avatarColor || '#ccc';
  const img = avatar?.avatar;

  return img ? (
    <img
      src={img}
      className="rounded-full object-cover border border-white"
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className="flex items-center justify-center rounded-full text-white border border-white"
      style={{ width: size, height: size, backgroundColor: bg }}
    >
      <UserOutlined className="text-xs" />
    </div>
  );
}
