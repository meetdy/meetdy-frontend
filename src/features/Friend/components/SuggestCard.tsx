import PersonalAvatar from '@/features/Chat/components/PersonalAvatar';
import { Card, CardContent } from '@/components/ui/card';

type SuggestUser = {
  id?: string;
  _id?: string;
  name?: string;
  avatar?: string;
  avatarColor?: string;
  numberCommonGroup?: number;
  numberCommonFriend?: number;
  status?: string;
};

interface SuggestCardProps {
  data: SuggestUser;
  onClick?: (user: SuggestUser) => void;
}

function SuggestCard({ data, onClick }: SuggestCardProps) {
  const handleOnClick = () => {
    if (onClick) onClick(data);
  };

  const commonGroups = data.numberCommonGroup ?? 0;
  const commonFriends = data.numberCommonFriend ?? 0;

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleOnClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleOnClick();
      }}
      className="cursor-pointer select-none transition hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <CardContent className="p-4 flex items-center gap-4">
        <PersonalAvatar
          avatar={data.avatar}
          name={data.name}
          dimension={56}
          color={data.avatarColor}
        />

        <div className="min-w-0 flex-1">
          <div className="font-medium truncate">{data.name}</div>
          <div className="mt-1 text-sm text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
            <span>{commonGroups} nhóm chung</span>
            <span>{commonFriends} bạn chung</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SuggestCard;
