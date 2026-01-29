import { useDispatch } from 'react-redux';

import friendApi from '@/api/friendApi';
import FriendCard from './FriendCard';

import { fetchListMyRequestFriend } from '@/app/friendSlice';


function ListMyFriendRequest({ data = [] }) {
  const dispatch = useDispatch<any>();

  const handleRemoveMyRequest = async (value) => {
    await friendApi.deleteSentRequestFriend(value._id);
    dispatch(fetchListMyRequestFriend());
  };

  return (
    <div className="space-y-3">
      {data &&
        data.length > 0 &&
        data.map((ele) => (
          <FriendCard
            key={ele._id ?? ele.id}
            isMyRequest={true}
            data={ele}
            onCancel={handleRemoveMyRequest}
          />
        ))}
    </div>
  );
}

export default ListMyFriendRequest;
