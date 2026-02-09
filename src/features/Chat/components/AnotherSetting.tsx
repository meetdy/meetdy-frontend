import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown, LogOut, Trash } from 'lucide-react';
import { toast } from 'sonner';

import conversationApi from '@/api/conversationApi';
import { chatKeys } from '@/hooks/chat';
import { removeConversation as removeConvFromList } from '@/hooks/chat/conversationCacheUtils';
import { setCurrentConversation } from '@/redux/slice/chatUiSlice';
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
import { socket } from '@/lib/socket';
import { useGetListConversations } from '@/hooks/conversation/useGetListConversations';

function AnotherSetting() {
  const [isDrop, setIsDrop] = useState(true);
  const queryClient = useQueryClient();
  const { currentConversation } = useSelector(
    (state: any) => state.chatUi,
  );

  const { conversations } = useGetListConversations({ params: {} });

  const { user } = useSelector((state: any) => state.global);
  const dispatch = useDispatch();
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleOnClick = () => {
    setIsDrop(!isDrop);
  };

  const handleLeaveGroup = async () => {
    try {
      await conversationApi.leaveGroup(currentConversation);
      toast.success('Rời nhóm thành công');
      socket.emit('leave-conversation', currentConversation);
      // Remove from React Query cache + reset current conversation
      queryClient.setQueryData(
        chatKeys.conversations.list({}),
        (old: any[] | undefined) => removeConvFromList(old, currentConversation),
      );
      dispatch(setCurrentConversation(''));
    } catch (error) {
      toast.error('Rời nhóm thất bại');
    }
    setShowLeaveConfirm(false);
  };

  const handleDeleteGroup = async () => {
    try {
      await conversationApi.deleteConversation(currentConversation);
      toast.success('Xóa thành công');
      socket.emit('delete-conversation', currentConversation);
    } catch (error) {
      toast.error('Đã có lỗi xảy ra');
    }
    setShowDeleteConfirm(false);
  };

  const convo = conversations.find((ele: any) => ele._id === currentConversation);
  const isLeader = convo?.managerIds?.includes(user._id);

  return (
    <div className="border-b py-3">
      <button
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-muted/50 transition-colors rounded-lg"
        onClick={handleOnClick}
      >
        <span className="font-medium text-sm">Cài đặt khác</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${!isDrop ? '-rotate-90' : ''}`}
        />
      </button>

      <div className={`overflow-hidden transition-all ${isDrop ? 'max-h-96' : 'max-h-0'}`}>
        {isLeader ? (
          <button
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <div className="p-2 rounded-lg bg-destructive/10">
              <Trash className="h-4 w-4" />
            </div>
            <span className="text-sm">Giải tán nhóm</span>
          </button>
        ) : (
          <button
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-destructive"
            onClick={() => setShowLeaveConfirm(true)}
          >
            <div className="p-2 rounded-lg bg-destructive/10">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="text-sm">Rời nhóm</span>
          </button>
        )}
      </div>

      <AlertDialog open={showLeaveConfirm} onOpenChange={setShowLeaveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cảnh báo</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có thực sự muốn rời khỏi nhóm?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveGroup}>Đồng ý</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận</AlertDialogTitle>
            <AlertDialogDescription>
              Toàn bộ nội dung cuộc trò chuyện sẽ bị xóa, bạn có chắc chắn muốn xóa?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AnotherSetting;
