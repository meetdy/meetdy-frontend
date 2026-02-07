import { useState } from 'react';

import userApi from '@/api/userApi';
import UserCard from '@/components/user-card';
import FriendListItem, { type FriendData } from './FriendListItem';
import { Badge } from '@/components/ui/badge';

interface ContactItemProps {
  data: any;
}

function ContactItem({ data }: ContactItemProps) {
  const [userIsFind, setUserIsFind] = useState<any>({});
  const [visibleUserCard, setVisibleUserCard] = useState(false);

  const handleViewDetail = async (data: FriendData) => {
    console.log('🚀 ~ handleViewDetail ~ data:', data)

    const user = await userApi.getUser(data.username!);
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
    <>
      <FriendListItem
        variant="contact"
        data={data}
        onClick={handleViewDetail}
        badge={getStatusBadge()}
        actions={[
          {
            label: 'Xem chi tiết',
            variant: 'outline',
            onClick: handleViewDetail,
          },
        ]}
      />

      <UserCard
        user={userIsFind}
        isVisible={visibleUserCard}
        onCancel={handleCancelModalUserCard}
      />
    </>
  );
}

export default ContactItem;
