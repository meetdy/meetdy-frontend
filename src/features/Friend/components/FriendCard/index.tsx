import PersonalAvatar from '@/features/Chat/components/PersonalAvatar';
import { Button } from '@/components/ui/button';

type FriendData = {
  _id?: string;
  id?: string;
  avatar?: string;
  avatarColor?: string;
  name?: string;
};

interface FriendCardProps {
  readonly isMyRequest?: boolean;
  readonly data: FriendData;
  readonly onAccept?: (data: FriendData) => void;
  readonly onDeny?: (data: FriendData) => void;
  readonly onCancel?: (data: FriendData) => void;
}

function FriendCard({
  isMyRequest = false,
  data,
  onAccept,
  onDeny,
  onCancel,
}: FriendCardProps) {
  const handleRemoveMyRequest = () => onCancel?.(data);
  const handleDeniedRequest = () => onDeny?.(data);
  const handleAcceptFriend = () => onAccept?.(data);

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-xl border hover:shadow-sm transition">
      <div className="flex items-center gap-3">
        <PersonalAvatar
          avatar={data.avatar}
          dimension={48}
          name={data.name}
          color={data.avatarColor}
        />
        <div className="font-medium text-sm sm:text-base">{data.name}</div>
      </div>

      <div className="flex items-center gap-2">
        {isMyRequest ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRemoveMyRequest}
          >
            Hủy yêu cầu
          </Button>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={handleDeniedRequest}>
              Bỏ qua
            </Button>
            <Button size="sm" onClick={handleAcceptFriend}>
              Đồng ý
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default FriendCard;
