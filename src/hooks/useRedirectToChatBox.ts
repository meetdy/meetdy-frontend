import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setCurrentConversation } from '@/redux/slice/chatUiSlice';

const useRedirectToChatBox = (chatId) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  navigate('/chat');
  dispatch(setCurrentConversation(chatId));
};

export default useRedirectToChatBox;
