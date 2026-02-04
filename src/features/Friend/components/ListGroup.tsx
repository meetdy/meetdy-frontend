import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { AlertCircle, LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import conversationApi from '@/api/conversationApi';
import { socket } from '@/lib/socket';
import { createKeyListConversations } from '@/hooks/conversation/useGetListConversations';
import FriendListItem, { type FriendData } from './FriendListItem';
import { Badge } from '@/components/ui/badge';
import { getClassifyOfObject } from '@/utils';
import { setCurrentConversation } from '@/app/chatSlice';
import { fetchListMessagesKey } from '@/hooks/message/useInfiniteListMessages';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';

function ListGroup({ data = [] }) {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const queryClient = useQueryClient();
  const { classifies } = useSelector((state: any) => state.chat);

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [groupClassifies, setGroupClassifies] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    if (classifies.length > 0) {
      const classifyMap = new Map();
      data.forEach((group: any) => {
        const classify = getClassifyOfObject(group._id, classifies);
        if (classify) {
          classifyMap.set(group._id, classify);
        }
      });
      setGroupClassifies(classifyMap);
    }
  }, [classifies, data]);

  const handleOpenConversation = async (groupData: FriendData) => {
    fetchListMessagesKey({ conversationId: groupData._id!, size: 10 });
    dispatch(setCurrentConversation(groupData._id));
    navigate('/chat');
  };

  const openRemoveDialog = (groupData: FriendData) => {
    setSelectedGroupId(groupData._id!);
    setOpenConfirm(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedGroupId) return;

    try {
      await conversationApi.leaveGroup(selectedGroupId);

      toast.success('Rời nhóm thành công');

      socket.emit('leave-conversation', selectedGroupId);
      queryClient.invalidateQueries({
        queryKey: createKeyListConversations({ name: '', type: 2 }),
      });
    } catch (error) {
      toast.error('Rời nhóm thất bại');
    }

    setOpenConfirm(false);
  };

  const filteredGroups = data.filter((i: any) => i.totalMembers > 2);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredGroups.map((group: any) => {
          const classify = groupClassifies.get(group._id);

          return (
            <div key={group.id ?? group._id} className="relative">
              {classify && (
                <Badge
                  className="absolute top-2 left-2 z-10 px-2 py-1 text-xs rounded-lg"
                  style={{ backgroundColor: classify.color.code }}
                >
                  {classify.name}
                </Badge>
              )}

              <FriendListItem
                variant="group"
                data={group}
                onClick={handleOpenConversation}
                menuItems={[
                  {
                    label: 'Rời nhóm',
                    icon: LogOut,
                    onClick: openRemoveDialog,
                    destructive: true,
                  },
                ]}
              />
            </div>
          );
        })}
      </div>

      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Cảnh báo
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn rời khỏi nhóm này?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove}>
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ListGroup;
