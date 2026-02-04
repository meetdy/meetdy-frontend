import { useDispatch, useSelector } from 'react-redux';

import {
  useAcceptRequestFriend,
  useDeleteRequestFriend,
} from '@/hooks/friend';
import { setAmountNotify } from '@/app/friendSlice';
import { AppDispatch } from '@/redux/store';

import FriendListItem, { type FriendData } from './FriendListItem';

function ListRequestFriend({ data = [] }) {
  const dispatch = useDispatch<AppDispatch>();
  const { amountNotify } = useSelector((state: any) => state.friend);

  const { mutate: denyRequest } = useDeleteRequestFriend();
  const { mutate: acceptRequest } = useAcceptRequestFriend();

  const handleRequestDeny = (friendData: FriendData) => {
    denyRequest(friendData._id!, {
      onSuccess: () => {
        dispatch(setAmountNotify(amountNotify - 1));
      },
    });
  };

  const handleOnAccept = (friendData: FriendData) => {
    acceptRequest(friendData._id!, {
      onSuccess: () => {
        dispatch(setAmountNotify(amountNotify - 1));
      },
    });
  };

  return (
    <div className="space-y-3">
      {data &&
        data.length > 0 &&
        data.map((ele) => (
          <FriendListItem
            key={ele._id ?? ele.id}
            variant="request"
            data={ele}
            actions={[
              {
                label: 'Bỏ qua',
                variant: 'outline',
                onClick: handleRequestDeny,
              },
              {
                label: 'Đồng ý',
                onClick: handleOnAccept,
              },
            ]}
          />
        ))}
    </div>
  );
}

export default ListRequestFriend;
