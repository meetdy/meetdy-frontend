import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useDeleteFriend } from '@/hooks/friend/useDeleteFriend';
import userApi from '@/api/userApi';
import conversationApi from '@/api/conversationApi';
import { toast } from 'sonner';

import FriendListItem, { type FriendData } from './FriendListItem';

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
import { Delete, Info } from 'lucide-react';

import {
  setConversations,
  setCurrentConversation,
} from '@/app/chatSlice';
import { fetchListMessagesKey } from '@/hooks/message/useInfiniteListMessages';

type Friend = {
  _id?: string;
  id?: string;
  username?: string;
  name?: string;
  [key: string]: any;
};

type Props = {
  data?: Friend[];
};

function ListFriend({ data = [] }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { mutateAsync: deleteFriend } = useDeleteFriend();
  const [deleteConfirm, setDeleteConfirm] = useState<Friend | null>(null);

  const handleOpenConversation = async (friendData: FriendData) => {
    const res = await conversationApi.createConversationIndividual(friendData._id!);
    const { _id, isExists } = res;

    if (!isExists) {
      const conver = await conversationApi.getConversationById(friendData._id!);
      dispatch(setConversations(conver));
    }

    fetchListMessagesKey({ conversationId: _id, size: 10 });
    dispatch(setCurrentConversation(_id));

    navigate('/chat');
  };

  const handleViewInfo = async (friendData: FriendData) => {
    const tempUser = data.find((ele) => ele?._id === friendData._id || ele?.id === friendData.id);
    if (!tempUser) return;
    await userApi.getUser(tempUser.username as any);
  };

  const handleRequestDelete = (friendData: FriendData) => {
    const tempUser = data.find((ele) => ele?._id === friendData._id || ele?.id === friendData.id);
    if (tempUser) {
      setDeleteConfirm(tempUser);
    }
  };

  const handleDeleteFriend = async () => {
    if (!deleteConfirm?._id) {
      setDeleteConfirm(null);
      return;
    }
    try {
      await deleteFriend(deleteConfirm._id);
      toast.success('Xóa thành công');
    } catch (error) {
      toast.error('Xóa thất bại');
    }
    setDeleteConfirm(null);
  };

  const items = useMemo(() => data.filter(Boolean), [data]);

  const renderAlertWarning = () => {
    return (
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có thực sự muốn xóa <strong>{deleteConfirm?.name}</strong>{' '}
              khỏi danh sách bạn bè?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFriend}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {items.map((e) => (
            <FriendListItem
              key={e._id ?? e.id ?? e.username}
              variant="friend"
              data={e}
              onClick={handleOpenConversation}
              showLastLogin
              isCompact
              menuItems={[
                {
                  label: 'Xem thông tin',
                  icon: Info,
                  onClick: handleViewInfo,
                },
                {
                  label: 'Xóa bạn',
                  icon: Delete,
                  onClick: handleRequestDelete,
                  destructive: true,
                },
              ]}
            />
          ))}
        </div>
      </div>

      {renderAlertWarning()}
    </>
  );
}

export default ListFriend;
