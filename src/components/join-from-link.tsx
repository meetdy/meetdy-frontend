import { useParams, useNavigate } from 'react-router-dom';

function JoinFromLink() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  navigate('/chat', {
    state: { conversationId },
  });

  return <>{conversationId}</>;
}

export default JoinFromLink;
