import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, Hash, Plus } from 'lucide-react';
import { toast } from 'sonner';

import ChannelItem from '../ChannelItem';

import {
  getLastViewOfMembers,
  setCurrentChannel,
} from '@/features/Chat/slice/chatSlice';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChannelProps {
  onViewChannel?: () => void;
  data?: any[];
  onOpenInfoBlock?: () => void;
}

import { useAddChannel } from '@/hooks/channel/useAddChannel';
import { useFetchListConversations } from '@/hooks/conversation/useFetchListConversations';
import { useQueryClient } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';

function Channel({ onViewChannel, data = [], onOpenInfoBlock }: ChannelProps) {
  const [isDrop, setIsDrop] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [valueInput, setValueInput] = useState('');
  const {
    currentConversation,
    currentChannel,
    totalChannelNotify,
  } = useSelector((state: any) => state.chat);
  const dispatch = useDispatch();

  const { conversations } = useFetchListConversations({ params: {} });
  const mutationAddChannel = useAddChannel();
  const queryClient = useQueryClient();

  const handleOnClick = () => {
    setIsDrop(!isDrop);
  };

  const handleViewAll = () => {
    onViewChannel?.();
    onOpenInfoBlock?.();
  };

  const handleAddChannel = () => {
    setIsVisible(true);
  };

  const handleOk = async () => {
    try {
      await mutationAddChannel.mutateAsync({ name: valueInput, conversationId: currentConversation });
      queryClient.invalidateQueries({
        queryKey: createQueryKey('fetchChannel', { conversationId: currentConversation })
      });
      toast.success('Tạo channel thành công');
      setIsVisible(false);
      setValueInput('');
    } catch (error) {
      console.log(error);
      toast.error('Tạo channel thất bại');
    }
  };

  const handleCancel = () => {
    setIsVisible(false);
    setValueInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueInput(e.target.value);
  };

  const handleViewGeneralChannel = () => {
    dispatch(setCurrentChannel(''));

    dispatch(getLastViewOfMembers({ conversationId: currentConversation }) as any);
  };

  const currentConvo = conversations.find((ele: any) => ele._id === currentConversation);

  return (
    <div className="py-2">
      <button
        onClick={handleOnClick}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>Kênh</span>
          {totalChannelNotify > 0 && (
            <span className="text-xs text-primary">
              ({totalChannelNotify} kênh có tin nhắn)
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${!isDrop ? '-rotate-90' : ''}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all ${isDrop ? 'max-h-96' : 'max-h-0'}`}
      >
        <button
          onClick={handleViewGeneralChannel}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-colors ${!currentChannel ? 'bg-primary/10 text-primary' : ''
            }`}
        >
          <Hash className="h-4 w-4" />
          <span>Kênh chung</span>
          {currentConvo?.numberUnread > 0 && (
            <span className="ml-auto bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
              {currentConvo.numberUnread}
            </span>
          )}
        </button>

        {data.slice(0, 3).map((ele, index) => (
          <ChannelItem
            key={index}
            data={ele}
            isActive={currentChannel === ele._id}
          />
        ))}

        <div className="px-3 py-2 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
            onClick={handleAddChannel}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm Channel
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
            onClick={handleViewAll}
          >
            Xem tất cả
          </Button>
        </div>
      </div>

      <Dialog open={isVisible} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm Channel</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nhập tên channel"
              value={valueInput}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && valueInput.trim() && handleOk()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button onClick={handleOk} disabled={valueInput.trim().length === 0}>
              Tạo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Channel;
