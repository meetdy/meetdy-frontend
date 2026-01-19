import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Hash, Trash, Pencil } from 'lucide-react';
import { toast } from 'sonner';

import {
  fetchMessageInChannel,
  getLastViewChannel,
  setCurrentChannel,
} from '@/features/Chat/slice/chatSlice';
import channelApi from '@/api/channelApi';
import ModalChangeNameChannel from '../ModalChangeNameChannel';
import { useDeleteChannel } from '@/hooks/channel/useDeleteChannel';
import { useRenameChannel } from '@/hooks/channel/useRenameChannel';
import { useGetListConversations } from '@/hooks/conversation/useGetListConversations';
import { useQueryClient } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ChannelItemProps {
  isActive?: boolean;
  data?: any;
}

function ChannelItem({ isActive = false, data = {} }: ChannelItemProps) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { user } = useSelector((state: any) => state.global);

  const { conversations } = useGetListConversations({ params: {} });
  const mutationRename = useRenameChannel();
  const mutationDelete = useDeleteChannel();
  const queryClient = useQueryClient();
  const { currentConversation } = useSelector((state: any) => state.chat);

  const handleViewChannel = () => {
    dispatch(setCurrentChannel(data._id));
    dispatch(fetchMessageInChannel({ channelId: data._id, size: 10, page: 0 }) as any);
    dispatch(getLastViewChannel({ channelId: data._id }) as any);
  };

  const handleOnCancel = () => {
    setVisible(false);
  };

  const handleOnOk = async (name: string) => {
    try {
      await channelApi.renameChannel(name, data._id);
      setVisible(false);
      toast.success('Đổi tên channel thành công');
    } catch (error) {
      toast.error('Đã có lỗi xảy ra');
    }
  };

  const handleDeleteChannel = async () => {
    try {
      await mutationDelete.mutateAsync(data._id);
      queryClient.invalidateQueries({
        queryKey: createQueryKey('fetchChannel', { conversationId: currentConversation })
      });
      toast.success('Xóa Channel thành công');
    } catch (error) {
      toast.error('Đã có lỗi xảy ra');
    }
    setConfirmDelete(false);
  };

  const isLeader = conversations.find((ele: any) => ele.leaderId === user._id);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <button
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-colors ${isActive ? 'bg-primary/10 text-primary' : ''
              }`}
            onClick={handleViewChannel}
          >
            <Hash className="h-4 w-4" />
            <span className="flex-1 text-left truncate">{data.name}</span>
            {data.numberUnread > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                {data.numberUnread}
              </span>
            )}
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setVisible(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Đổi tên Channel
          </ContextMenuItem>
          {isLeader && (
            <ContextMenuItem
              onClick={() => setConfirmDelete(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="h-4 w-4 mr-2" />
              Xóa Channel
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>

      <ModalChangeNameChannel
        visible={visible}
        onCancel={handleOnCancel}
        onOk={handleOnOk}
        initialValue={data.name}
      />

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cảnh báo</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có thực sự muốn xóa Channel này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteChannel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ChannelItem;
