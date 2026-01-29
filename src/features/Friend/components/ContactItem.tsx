import { useState } from 'react';

import userApi from '@/api/userApi';
import PersonalAvatar from '@/features/Chat/components/PersonalAvatar';
import UserCard from '@/components/user-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ContactItemProps {
  data: any;
}

function ContactItem({ data }: ContactItemProps) {
  const [userIsFind, setUserIsFind] = useState<any>({});
  const [visibleUserCard, setVisibleUserCard] = useState(false);

  const handleViewDetail = async () => {
    const user = await userApi.getUser(data.username);
    setUserIsFind(user);
    setVisibleUserCard(true);
  };

  const handleCancelModalUserCard = () => {
    setVisibleUserCard(false);
  };

  const getStatusBadge = () => {
    if (data.status === 'NOT_FRIEND') {
      return <Badge variant="destructive">Chưa kết bạn</Badge>;
    } else if (data.status === 'YOU_FOLLOW') {
      return <Badge variant="secondary">Đã gửi lời mời kết bạn</Badge>;
    }
    return <Badge variant="default">Bạn bè</Badge>;
  };

  return (
    <div className="flex items-center justify-between w-full p-3 rounded-xl border bg-card hover:shadow-sm transition">
      <button
        type="button"
        className="flex items-center gap-3 flex-1 text-left"
        onClick={handleViewDetail}
      >
        <PersonalAvatar avatar={data.avatar} dimension={48} name={data.name} />
        <div className="flex flex-col">
          <span className="font-medium text-sm">{data.name}</span>
          <span className="mt-1 text-xs text-muted-foreground inline-flex items-center gap-1">
            {getStatusBadge()}
          </span>
        </div>
      </button>

      <Button variant="outline" size="sm" onClick={handleViewDetail}>
        Xem chi tiết
      </Button>

      <UserCard
        user={userIsFind}
        isVisible={visibleUserCard}
        onCancel={handleCancelModalUserCard}
      />
    </div>
  );
}

export default ContactItem;
