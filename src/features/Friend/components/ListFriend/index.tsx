import { useMemo, useState } from 'react';
import { useDeleteFriend } from '@/hooks/friend/useDeleteFriend';
import userApi from '@/api/userApi';
import { toast } from 'sonner';

import FriendItem from '../FriendItem';

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
  const { mutateAsync: deleteFriend } = useDeleteFriend();
  const [deleteConfirm, setDeleteConfirm] = useState<Friend | null>(null);

  const handleOnClickMenu = async (key: string, id: string) => {
    const tempUser = data.find((ele) => ele?._id === id || ele?.id === id);
    if (!tempUser) return;

    if (key === '2') {
      setDeleteConfirm(tempUser);
      return;
    }

    await userApi.getUser(tempUser.username as any);
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
        <div className="flex flex-col">
          {items.map((e) => (
            <FriendItem
              key={e._id ?? e.id ?? e.username}
              data={e}
              onClickMenu={handleOnClickMenu}
            />
          ))}
        </div>
      </div>

      {renderAlertWarning()}
    </>
  );
}

export default ListFriend;
