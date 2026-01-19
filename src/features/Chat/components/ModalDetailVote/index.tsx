import { useSelector } from 'react-redux';
import PersonalAvatar from '../PersonalAvatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModalDetailVoteProps {
  visible: boolean;
  onCancel?: () => void;
  data?: any[];
}

function ModalDetailVote({ visible, onCancel, data = [] }: ModalDetailVoteProps) {
  const { memberInConversation } = useSelector((state: any) => state.chat);

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết bình chọn</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {data.map((ele, index) => {
            if (ele.userIds.length > 0) {
              return (
                <div key={index} className="space-y-2">
                  <div className="font-medium text-sm">
                    {ele.name} ({ele.userIds.length})
                  </div>
                  <div className="space-y-1">
                    {ele.userIds.map((userId: string, idx: number) => {
                      const user = memberInConversation.find(
                        (member: any) => member._id === userId,
                      );

                      if (user) {
                        return (
                          <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                            <PersonalAvatar
                              name={user?.name}
                              avatar={user?.avatar}
                              dimension={32}
                            />
                            <span className="text-sm">{user?.name}</span>
                          </div>
                        );
                      } else {
                        return (
                          <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                            <PersonalAvatar noneUser={true} dimension={32} />
                            <span className="text-sm text-muted-foreground">
                              Đã rời nhóm
                            </span>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ModalDetailVote;
