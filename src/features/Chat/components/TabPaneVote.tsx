import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronDown } from 'lucide-react';

import { useGetVotes } from '@/hooks/vote/useGetVotes';
import { Button } from '@/components/ui/button';
import VoteMessage from './message-type/VoteMessage';

function TabPaneVote() {
  const { currentConversation } = useSelector(
    (state: any) => state.chat,
  );

  const [page, setPage] = useState(0);
  const size = 4;

  const { data: voteData } = useGetVotes({
    params: {
      conversationId: currentConversation,
      page,
      size,
    },
    enabled: !!currentConversation,
  });

  const [accumulatedVotes, setAccumulatedVotes] = useState<any[]>([]);

  useEffect(() => {
    // Reset accumulated votes when conversation changes
    setAccumulatedVotes([]);
    setPage(0);
  }, [currentConversation]);

  useEffect(() => {
    // Accumulate votes as pages are loaded
    if (voteData?.data) {
      if (page === 0) {
        setAccumulatedVotes(voteData.data);
      } else {
        setAccumulatedVotes(prev => [...prev, ...voteData.data]);
      }
    }
  }, [voteData, page]);

  const handleIncreasePage = () => {
    setPage(prev => prev + 1);
  };

  const hasMorePages = voteData ? page + 1 < voteData.totalPages : false;

  return (
    <div className="space-y-3 p-4">
      {accumulatedVotes.map((ele: any, index: number) => (
        <div key={index} className="rounded-lg border bg-card p-3">
          <VoteMessage data={ele} />
        </div>
      ))}

      {hasMorePages && (
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
