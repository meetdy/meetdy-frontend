import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PersonalAvatar from '@/features/Chat/components/PersonalAvatar';
import { Empty } from '@/components/ui/empty';
import {
  setCurrentConversation,
} from '@/app/chatSlice';
import { fetchListMessagesKey } from '@/hooks/message/useInfiniteListMessages';

interface ConverPersonalSearchProps {
  data?: any[];
}

function ConverPersonalSearch({ data = [] }: ConverPersonalSearchProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickItem = (value: any) => {
    fetchListMessagesKey({ conversationId: value._id, size: 10 });
    dispatch(setCurrentConversation(value._id));
    navigate('/chat');
  };

  return (
    <div className="space-y-1">
      {data.length === 0 && <Empty />}
      {data.map((ele, index) => (
        <button
          key={index}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
          onClick={() => handleClickItem(ele)}
        >
          <PersonalAvatar
            avatar={ele.avatar}
            color={ele.avatarColor}
            name={ele.name}
          />
          <span className="font-medium text-sm">{ele.name}</span>
        </button>
      ))}
    </div>
  );
}

export default ConverPersonalSearch;
