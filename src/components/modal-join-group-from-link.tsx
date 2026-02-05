import conversationApi from '@/api/conversationApi';
import ConversationAvatar from '@/features/Chat/components/ConversationAvatar';
import PersonalAvatar from '@/features/Chat/components/PersonalAvatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type User = {
  avatar?: string;
  avatarColor?: string;
  name?: string;
};

type Info = {
  _id?: string;
  name?: string;
  users?: User[];
};

type Props = {
  isVisible: boolean;
  info?: Info;
  onCancel?: () => void;
};

export default function ModalJoinGroupFromLink({
  isVisible,
  info = {},
  onCancel,
}: Props) {
  const { _id, name = '', users = [] } = info;

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const tempAvatar = users.map((ele) => ({
    avatar: ele.avatar,
    avatarColor: ele.avatarColor,
  }));

  const handleOk = async () => {
    try {
      if (!_id) return;
      await conversationApi.joinGroupFromLink(_id);
      handleCancel();
      window.alert('Tham gia nhóm thành công');
    } catch (error) {
      console.error(error);
      window.alert('Đã có lỗi xảy ra khi tham gia nhóm');
    }
  };

  return (
    <Dialog
      open={isVisible}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
    >
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Thông tin nhóm</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <div className="w-[96px] h-[96px]">
              <ConversationAvatar
                totalMembers={users.length}
                avatar={tempAvatar}
                isGroupCard={true}
              />
            </div>
            <div className="text-lg font-semibold">{name}</div>
            <div className="text-sm text-muted-foreground">{`${users.length} thành viên`}</div>
          </div>

          <hr className="border-t border-neutral-200" />

          <div>
            <div className="grid grid-cols-3 gap-3">
              {users.map((ele, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10">
                    <PersonalAvatar
                      avatar={ele.avatar}
                      name={ele.name}
                      color={ele.avatarColor}
                    />
                  </div>
                  <div className="text-sm text-center truncate w-full">
                    {ele.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end space-x-2 mt-4">
          <Button variant="ghost" onClick={handleCancel}>
            Hủy
          </Button>
          <Button onClick={handleOk}>Tham gia</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
