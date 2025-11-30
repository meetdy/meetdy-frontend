import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

import conversationApi from '@/api/conversationApi';
import friendApi from '@/api/friendApi';
import {
  fetchChannels,
  fetchListFriends,
  fetchListMessages,
  getLastViewOfMembers,
  setConversations,
  setCurrentConversation,
} from '@/features/Chat/slice/chatSlice';
import {
  fetchFriends,
  fetchListMyRequestFriend,
  fetchListRequestFriend,
  fetchPhoneBook,
  setAmountNotify,
} from '@/features/Friend/friendSlice';

import dateUtils from '@/utils/dateUtils';
import getSummaryName from '@/utils/nameHelper';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UserCardProps {
  title?: string;
  isVisible: boolean;
  user: any;
  onCancel?: () => void;
}

export default function UserCard({
  title = 'Thông tin',
  isVisible,
  user,
  onCancel,
}: UserCardProps) {
  console.log('🚀 ~ UserCard ~ user:', user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { amountNotify } = useSelector((state: any) => state.friend);
  const { conversations } = useSelector((state: any) => state.chat);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const coverImage =
    'https://miro.medium.com/max/1124/1*92adf06PCF91kCYu1nPLQg.jpeg';

  const handleClickMessage = async () => {
    const response = await conversationApi.createConversationIndividual(
      user._id,
    );

    const { _id, isExists } = response;

    if (!isExists) {
      const conver = await conversationApi.getConversationById(_id);
      dispatch(setConversations(conver));
    }

    const tempConver = conversations.find((ele: any) => ele._id === _id);

    if (tempConver?.type) {
      dispatch(fetchChannels({ conversationId: _id }));
    }

    dispatch(getLastViewOfMembers({ conversationId: _id }));
    dispatch(fetchListMessages({ conversationId: _id, size: 10 }));
    dispatch(setCurrentConversation(_id));

    navigate('/chat');
    onCancel?.();
  };

  const handleAddFriend = async () => {
    try {
      await friendApi.sendRequestFriend(user._id);
      dispatch(fetchListMyRequestFriend());
      dispatch(fetchPhoneBook());
      toast('Gửi lời mời kết bạn thành công');
      onCancel?.();
    } catch {
      toast('Gửi lời mời kết bạn thất bại');
    }
  };

  const handleAcceptFriend = async () => {
    await friendApi.acceptRequestFriend(user._id);
    dispatch(fetchListRequestFriend());
    dispatch(fetchFriends({ name: '' }));
    dispatch(fetchListFriends({ name: '' }));
    dispatch(setAmountNotify(amountNotify - 1));
    toast('Thêm bạn thành công');
    onCancel?.();
  };

  const handleCancelRequest = async () => {
    await friendApi.deleteSentRequestFriend(user._id);
    dispatch(fetchListMyRequestFriend());
    dispatch(fetchPhoneBook());
    onCancel?.();
  };

  const handleDeleteFriend = async () => {
    try {
      await friendApi.deleteFriend(user._id);
      dispatch(fetchFriends({ name: '' }));
      dispatch(fetchPhoneBook());
      toast('Xóa thành công');
      setOpenConfirmDelete(false);
      onCancel?.();
    } catch {
      toast('Xóa thất bại');
    }
  };

  return (
    <>
      <Dialog open={isVisible} onOpenChange={onCancel}>
        <DialogContent className="max-w-sm p-0">
          <div className="w-full">
            {/* Cover Image */}
            <div
              className="w-full h-44 bg-cover bg-center"
              style={{ backgroundImage: `url(${coverImage})` }}
            />

            {/* Avatar */}
            <div className="flex justify-center -mt-12">
              {user.avatar ? (
                <Avatar className="w-24 h-24 border-4 border-white">
                  <AvatarImage src={user.avatar} />
                </Avatar>
              ) : (
                <Avatar
                  className="w-24 h-24 text-3xl flex justify-center items-center border-4 border-white"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  <AvatarFallback className="text-3xl">
                    {getSummaryName(user.name)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Name */}
            <div className="mt-4 text-center text-xl font-semibold">
              {user.name}
            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-col gap-3 px-4">
              {user.status === 'NOT_FRIEND' && (
                <Button className="w-full" onClick={handleAddFriend}>
                  Kết bạn
                </Button>
              )}

              {user.status === 'FOLLOWER' && (
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleAcceptFriend}>
                    Đồng ý
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={handleAcceptFriend}
                  >
                    Từ chối
                  </Button>
                </div>
              )}

              {user.status === 'YOU_FOLLOW' && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleCancelRequest}
                >
                  Hủy yêu cầu
                </Button>
              )}

              <Button
                variant="secondary"
                className="w-full"
                onClick={handleClickMessage}
              >
                Nhắn tin
              </Button>
            </div>

            {/* Info Section */}
            <div className="mt-6 px-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Giới tính</span>
                <span>{user.gender ? 'Nam' : 'Nữ'}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Ngày sinh</span>
                <span>
                  {dateUtils.transferDateString(
                    user.dateOfBirth?.day,
                    user.dateOfBirth?.month,
                    user.dateOfBirth?.year,
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Nhóm chung</span>
                <span>{`${user.numberCommonGroup} nhóm`}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Bạn chung</span>
                <span>{user.numberCommonFriend}</span>
              </div>
            </div>

            {/* Delete Friend */}
            {user.status === 'FRIEND' && (
              <div className="p-4">
                <Button
                  variant="destructive"
                  className="w-full flex items-center gap-2"
                  onClick={() => setOpenConfirmDelete(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  Hủy kết bạn
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Friend */}
      <AlertDialog open={openConfirmDelete} onOpenChange={setOpenConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc muốn xóa {user.name} khỏi danh sách bạn bè?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteFriend}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
