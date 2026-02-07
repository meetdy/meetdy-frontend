import { useCancelSentRequestFriend } from '@/hooks/friend';
import FriendListItem, { type FriendData } from './FriendListItem';

function ListMyFriendRequest({ data = [] }) {
  const { mutate: cancelRequest } = useCancelSentRequestFriend();

  const handleRemoveMyRequest = (friendData: FriendData) => {
    cancelRequest(friendData._id!);
  };

  return (
    <div className="space-y-3">
      {data &&
        data.length > 0 &&
        data.map((ele) => (
          <FriendListItem
            key={ele._id ?? ele.id}
            variant="sent-request"
            data={ele}
            actions={[
              {
                label: 'Hủy yêu cầu',
                variant: 'destructive',
                onClick: handleRemoveMyRequest,
              },
            ]}
          />
        ))}
    </div>
  );
}

export default ListMyFriendRequest;
