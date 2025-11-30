import { Empty } from '../ui/empty';
import { useDispatch } from 'react-redux';

import ConversationAvatar from '@/features/Chat/components/ConversationAvatar';

import {
  fetchListMessages,
  setCurrentConversation,
} from '@/features/Chat/slice/chatSlice';
import { useNavigate } from 'react-router-dom';

function ConverMultiSearch({ data }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickItem = (value) => {
    dispatch(fetchListMessages({ conversationId: value._id, size: 10 }));
    dispatch(setCurrentConversation(value._id));

    navigate('/chat');
  };

  return (
    <div className="list-filter_single-conver">
      {data.length === 0 && <Empty />}

      {data.map((ele, index) => (
        <div
          key={index}
          className="single-conver_item"
          onClick={() => handleClickItem(ele)}
        >
          <ConversationAvatar
            avatar={ele.avatar}
            totalMembers={ele.totalMembers}
            type={ele.type}
            name={ele}
          />

          <div className="single-conver_name">{ele.name}</div>
        </div>
      ))}
    </div>
  );
}

export default ConverMultiSearch;
