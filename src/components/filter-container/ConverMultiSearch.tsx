import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import {
  setCurrentConversation,
} from '@/app/chatSlice';

import ConversationAvatar from '@/features/Chat/components/ConversationAvatar';
import { Empty } from '@/components/ui/empty';

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
