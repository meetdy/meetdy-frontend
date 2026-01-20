import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

import conversationApi from '@/api/conversationApi';
import { fetchListGroup } from '@/app/friendSlice';
import { socket } from '@/lib/socket';
import GroupCard from '../GroupCard';

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
  const dispatch = useDispatch();
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const openRemoveDialog = (groupId: string) => {
    setSelectedGroupId(groupId);
    setOpenConfirm(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedGroupId) return;

    try {
      await conversationApi.leaveGroup(selectedGroupId);

      toast.success('Rời nhóm thành công');

      socket.emit('leave-conversation', selectedGroupId);
      dispatch(fetchListGroup({ name: '', type: 2 }));
    } catch (error) {
      toast.error('Rời nhóm thất bại');
    }

    setOpenConfirm(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data
          .filter((i) => i.totalMembers > 2)
          .map((group) => (
            <GroupCard
              key={group.id}
              data={group}
              onRemove={() => openRemoveDialog(group.id)}
            />
          ))}
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
