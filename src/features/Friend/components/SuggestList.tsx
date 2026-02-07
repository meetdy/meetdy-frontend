import { useMemo, useState } from 'react';
import UserCard from '@/components/user-card';
import FriendListItem, { type FriendData } from './FriendListItem';

type SuggestUser = {
  id?: string;
  status?: string;
  [key: string]: any;
};

interface SuggestListProps {
  data?: SuggestUser[];
}

export default function SuggestList({ data = [] }: SuggestListProps) {
  const [isUserCardVisible, setIsUserCardVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SuggestUser>({});

  const handleSelectUser = (user: SuggestUser) => {
    setSelectedUser(user);
    setIsUserCardVisible(true);
  };

  const handleCloseUserCard = () => {
    setIsUserCardVisible(false);
  };

  const filteredData = useMemo(
    () => data.filter((u) => u.status === 'FOLLOWING' || u.status === 'NOT_FRIEND'),
    [data],
  );

  return (
    <div className="space-y-3">
      <UserCard
        user={selectedUser}
        isVisible={isUserCardVisible}
        onCancel={handleCloseUserCard}
      />

      {filteredData.length === 0 ? (
        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          Không có gợi ý kết bạn phù hợp.
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredData.map((item) => (
            <FriendListItem
              key={
                item.id ??
                `${item.username ?? ''}-${item.name ?? ''}`
              }
              variant="suggestion"
              data={item}
              onClick={() => handleSelectUser(item)}
              showCommonInfo
            />
          ))}
        </div>
      )}
    </div>
  );
}
