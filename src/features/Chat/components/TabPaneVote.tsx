import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown } from 'lucide-react';

import { fetchVotes, updateVote } from '@/features/Chat/slice/chatSlice';
import voteApi from '@/api/voteApi';
import { Button } from '@/components/ui/button';
import VoteMessage from './message-type/VoteMessage';

function TabPaneVote() {
  const { currentConversation, votes, totalPagesVote } = useSelector(
    (state: any) => state.chat,
  );

  const dispatch = useDispatch();
  const [query, setQuery] = useState({
    page: 0,
    size: 4,
  });

  useEffect(() => {
    setQuery({
      page: 0,
      size: 4,
    });
    dispatch(
      fetchVotes({
        conversationId: currentConversation,
        ...query,
      }) as any,
    );
  }, [currentConversation]);

  const handleIncreasePage = async () => {
    const response = await voteApi.getVotes(
      currentConversation,
      query.page + 1,
      query.size,
    );
    const { data } = response;
    dispatch(updateVote([...votes, ...data]));

    setQuery({
      size: query.size,
      page: query.page + 1,
    });
  };

  return (
    <div className="space-y-3 p-4">
      {votes.map((ele: any, index: number) => (
        <div key={index} className="rounded-lg border bg-card p-3">
          <VoteMessage data={ele} />
        </div>
      ))}

      {query.page + 1 < totalPagesVote && (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleIncreasePage}
        >
          <ChevronDown className="h-4 w-4 mr-2" />
          Xem thêm
        </Button>
      )}
    </div>
  );
}

export default TabPaneVote;
