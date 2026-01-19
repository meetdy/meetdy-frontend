import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Key, UserMinus, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import Scrollbars from 'react-custom-scrollbars-2';

import conversationApi from '@/api/conversationApi';
import InfoTitle from '../InfoTitle';
import PersonalAvatar from '../PersonalAvatar';

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
import { Badge } from '@/components/ui/badge';

interface InfoFriendSearchProps {
  onBack?: (value?: any) => void;
  members?: any[];
  onChoseUser?: (user: any) => void;
}

function InfoFriendSearch({ onBack, members = [], onChoseUser }: InfoFriendSearchProps) {
  const { user } = useSelector((state: any) => state.global);
  const { currentConversation, conversations } = useSelector((state: any) => state.chat);
  const dispatch = useDispatch();
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  const converData = conversations.find((ele: any) => ele._id === currentConversation);
  const { managerIds, leaderId } = converData || { managerIds: [], leaderId: '' };

  const handleOnBack = (value?: any) => {
    onBack?.(value);
  };

  const handleClickUser = (ele: any) => {
    onChoseUser?.(ele);
  };

  const removeMember = async (idMember: string) => {
    try {
      await conversationApi.deleteMember(currentConversation, idMember);
      toast.success('Xóa thành công');
    } catch (error) {
      toast.error('Xóa thất bại');
    }
    setDeleteConfirm(null);
  };

  const handleAddLeader = async (id: string) => {
    try {
      await conversationApi.addManagerGroup(currentConversation, [id]);
      toast.success('Thêm thành công');
    } catch (error) {
      toast.error('Thêm thất bại');
    }
  };

  const handleDeleteLeader = async (id: string) => {
    try {
      await conversationApi.deleteManager(currentConversation, [id]);
      toast.success('Gỡ thành công');
    } catch (error) {
      toast.error('Gỡ thất bại');
    }
  };

  const isLeader = leaderId === user._id;
  const isManager = managerIds.find((ele: string) => ele === user._id);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b">
        <InfoTitle
          isBack={true}
          text="Thành viên"
          onBack={handleOnBack}
          isSelect={false}
        />
      </div>

      <Scrollbars
        autoHide={true}
        autoHideTimeout={1000}
        autoHideDuration={200}
        style={{ width: '100%', flex: 1 }}
      >
        <div className="p-4">
          <h3 className="text-sm font-semibold mb-3">
            Danh sách thành viên ({members.length})
          </h3>

          <div className="space-y-1">
            {members.map((ele, index) => (
              <ContextMenu key={index}>
                <ContextMenuTrigger asChild>
                  <button
                    onClick={() => handleClickUser(ele)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <PersonalAvatar
                        avatar={ele.avatar}
                        dimension={40}
                        name={ele.name}
                        color={ele.avatarColor}
                        isHost={
                          ele._id === leaderId ||
                          managerIds.find((managerId: string) => managerId === ele._id)
                        }
                      />
                      <span className="font-medium text-sm">{ele.name}</span>
                    </div>
                    {ele._id !== user._id && (
                      <Badge variant={ele.isFriend ? 'default' : 'secondary'}>
                        {ele.isFriend ? 'Bạn bè' : 'Người lạ'}
                      </Badge>
                    )}
                  </button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  {ele._id !== user._id && (
                    <>
                      {(isLeader || isManager) && (
                        <ContextMenuItem
                          onClick={() => setDeleteConfirm(ele)}
                          className="text-destructive focus:text-destructive"
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Xóa khỏi nhóm
                        </ContextMenuItem>
                      )}
                      {isLeader && !managerIds.find((id: string) => id === ele._id) && (
                        <ContextMenuItem onClick={() => handleAddLeader(ele._id)}>
                          <Key className="h-4 w-4 mr-2" />
                          Thêm phó nhóm
                        </ContextMenuItem>
                      )}
                      {isLeader && managerIds.find((id: string) => id === ele._id) && (
                        <ContextMenuItem onClick={() => handleDeleteLeader(ele._id)}>
                          <UserCog className="h-4 w-4 mr-2" />
                          Gỡ quyền phó nhóm
                        </ContextMenuItem>
                      )}
                    </>
                  )}
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        </div>
      </Scrollbars>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cảnh báo</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có thực sự muốn xóa <strong>{deleteConfirm?.name}</strong> khỏi nhóm?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => removeMember(deleteConfirm?._id)}>
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default InfoFriendSearch;
