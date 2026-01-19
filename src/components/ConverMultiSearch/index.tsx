import { Empty } from '../ui/empty';
import { useDispatch } from 'react-redux';

import ConversationAvatar from '@/features/Chat/components/ConversationAvatar';

import {
  setCurrentConversation,
} from '@/features/Chat/slice/chatSlice';
import { useNavigate } from 'react-router-dom';

function ConverMultiSearch({ data }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickItem = (value) => {
    dispatch(setCurrentConversation(value._id));

    navigate('/chat');
  };

  return (
    <div>
      {data.length === 0 && <Empty />}

      {data.map((ele, index) => (
        <div key={index} onClick={() => handleClickItem(ele)}>
          <ConversationAvatar
            avatar={ele.avatar}
            totalMembers={ele.totalMembers}
            type={ele.type}
            name={ele.name}
          />
          <div>{ele.name}</div>
        </div>
      ))}
    </div>
  );
}

export default ConverMultiSearch;
