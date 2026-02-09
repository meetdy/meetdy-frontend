import { useDispatch, useSelector } from 'react-redux';
import { Hash } from 'lucide-react';

import ChannelItem from './ChannelItem';
import { setCurrentChannel } from '@/redux/slice/chatUiSlice';
import { useGetListConversations } from '@/hooks/conversation/useGetListConversations';
import { fetchListMessagesKey } from '@/hooks/message/useInfiniteListMessages';

interface ListChannelProps {
    data?: any[];
}

function ListChannel({ data = [] }: ListChannelProps) {
    const { currentChannel, currentConversation } = useSelector(
        (state: any) => state.chatUi,
    );
    const { conversations } = useGetListConversations({ params: {} });
    const dispatch = useDispatch();

    const handleViewGeneralChannel = () => {
        dispatch(setCurrentChannel(''));
        fetchListMessagesKey({ conversationId: currentConversation, size: 10 });
        // Data will be fetched automatically by the component that needs it
    };

    const currentConvo = conversations.find((ele: any) => ele._id === currentConversation);

    return (
        <div className="space-y-1 p-2">
            <button
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${!currentChannel ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                    }`}
                onClick={handleViewGeneralChannel}
            >
                <Hash className="h-4 w-4" />
                <span className="flex-1 text-left">Kênh chung</span>
                {currentConvo?.numberUnread > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {currentConvo.numberUnread}
                    </span>
                )}
            </button>

            {data.map((ele, index) => (
                <ChannelItem
                    key={index}
                    data={ele}
                    isActive={currentChannel === ele._id}
                />
            ))}
        </div>
    );
}

export default ListChannel;
