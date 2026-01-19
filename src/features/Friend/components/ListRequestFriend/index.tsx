import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import friendApi from '@/api/friendApi';

import {
  fetchFriends,
  fetchListRequestFriend,
  setAmountNotify,
} from '@/features/Friend/friendSlice';

import FriendCard from '../FriendCard';

import { useQueryClient } from '@tanstack/react-query';
import { createKeyGetFriends } from '@/hooks/friend/useGetFriends';

import { AppDispatch } from '@/redux/store';

function ListRequestFriend({ data = [] }) {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const { amountNotify } = useSelector((state: any) => state.friend);

  const handleRequestDeny = async (value) => {
    await friendApi.deleteRequestFriend(value._id);

    dispatch(setAmountNotify(amountNotify - 1));
    dispatch(fetchListRequestFriend() as any);
  };

  const handleOnAccept = async (value) => {
    await friendApi.acceptRequestFriend(value._id);
    dispatch(fetchListRequestFriend() as any);
    dispatch(fetchFriends({ name: '' } as any) as any);

    queryClient.invalidateQueries({ queryKey: createKeyGetFriends({ name: '' }) });

    dispatch(setAmountNotify(amountNotify - 1));

    toast.success('Thêm bạn thành công');
  };

  return (
    <div>
      {data &&
        data.length > 0 &&
        data.map((ele) => (
          <FriendCard
            key={ele._id ?? ele.id}
            data={ele}
            isMyRequest={false}
            onDeny={handleRequestDeny}
            onAccept={handleOnAccept}
          />
        ))}
    </div>
  );
}

export default ListRequestFriend;
