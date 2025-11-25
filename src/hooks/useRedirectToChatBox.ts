import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setCurrentConversation } from '@/features/Chat/slice/chatSlice';

const useRedirectToChatBox = (idConver) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  navigate('/chat');
  dispatch(setCurrentConversation(idConver));
};

export default useRedirectToChatBox;
