import { setCurrentConversation } from 'features/Chat/slice/chatSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

const useRedirectToChatBox = (idConver) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    navigate('/chat');
    dispatch(setCurrentConversation(idConver));
};

export default useRedirectToChatBox;
