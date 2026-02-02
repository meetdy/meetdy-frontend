import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

import conversationApi from '@/api/conversationApi';
import messageApi from '@/api/messageApi';
import ConversationAvatar from '../ConversationAvatar';
import ItemsSelected from '../ItemsSelected';
import PersonalAvatar from '../PersonalAvatar';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface ModalShareMessageProps {
  visible?: boolean;
  onCancel?: () => void;
  idMessage?: string;
}

function ModalShareMessage({ visible = false, onCancel, idMessage }: ModalShareMessageProps) {
  const [itemSelected, setItemSelected] = useState<any[]>([]);
  const [frInput, setFrInput] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [checkList, setCheckList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (name = '', type = 0) => {
    const data = await conversationApi.fetchListConversations(name, type);
    const tempdata: any[] = [];
    data.forEach((ele: any) => {
      if (ele.lastMessage) {
        tempdata.push(ele);
      }
    });
    setConversations(tempdata);
  };

  useEffect(() => {
    if (visible) {
      fetchData();
    } else {
      setFrInput('');
      setCheckList([]);
      setItemSelected([]);
    }
  }, [visible]);

  const handleCancel = () => {
    onCancel?.();
  };

  const handleOk = async () => {
    if (!idMessage) return;
    setLoading(true);
    try {
      for (const ele of itemSelected) {
        await messageApi.forwardMessage(idMessage, ele._id);
      }
      toast.success('Chuyển tiếp tin nhắn thành công');
    } catch (error) {
      toast.error('Đã có lỗi xảy ra');
    }
    setLoading(false);
    handleCancel();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFrInput(value);

    if (!value && visible) {
      fetchData();
    } else {
      const realConver = conversations.filter((conver) =>
        conver.name.toLowerCase().includes(value.toLowerCase()),
      );
      setConversations(realConver);
    }
  };

  const handleToggleCheckbox = (elementId: string) => {
    const index = checkList.findIndex((id) => id === elementId);
    let newCheckList = [...checkList];
    let newItemSelected = [...itemSelected];

    if (index !== -1) {
      newItemSelected = newItemSelected.filter((el) => el._id !== elementId);
      newCheckList = newCheckList.filter((id) => id !== elementId);
    } else {
      newCheckList.push(elementId);
      const item = conversations.find((el) => el._id === elementId);
      if (item) {
        newItemSelected.push(item);
      }
    }

    setCheckList(newCheckList);
    setItemSelected(newItemSelected);
    setFrInput('');
    fetchData();
  };

  const handleRemoveItem = (id: string) => {
    setItemSelected(itemSelected.filter((el) => el._id !== id));
    setCheckList(checkList.filter((elId) => elId !== id));
    setFrInput('');
    fetchData();
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-lg max-h-[80vh] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Chuyển tiếp tin nhắn</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nhập cuộc trò chuyện bạn muốn tìm kiếm"
              className="pl-9 rounded-xl"
              onChange={handleSearch}
              value={frInput}
            />
          </div>

          <Separator />

          <div className="flex gap-4 max-h-[300px]">
            <div className={`flex-1 overflow-y-auto ${itemSelected.length > 0 ? '' : 'w-full'}`}>
              <p className="text-sm font-medium mb-2">Danh sách Cuộc trò chuyện</p>
              <div className="space-y-1">
                {conversations.map((element, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={checkList.includes(element._id)}
                      onCheckedChange={() => handleToggleCheckbox(element._id)}
                    />
                    {element.type ? (
                      <ConversationAvatar
                        totalMembers={element.totalMembers}
                        avatar={element.avatar}
                        type={element.type}
                        name={element.name}
                        dimension={22}
                        sizeAvatar={36}
                        frameSize={32}
                        avatarColor={element.avatarColor}
                      />
                    ) : (
                      <PersonalAvatar
                        dimension={36}
                        avatar={element.avatar}
                        name={element.name}
                        color={element.avatarColor}
                      />
                    )}
                    <span className="text-sm truncate">{element.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {itemSelected.length > 0 && (
              <div className="w-40 border-l pl-4 overflow-y-auto">
                <p className="text-sm font-medium mb-2">
                  Đã chọn: {itemSelected.length}
                </p>
                <ItemsSelected items={itemSelected} onRemove={handleRemoveItem} />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} className="rounded-xl">
            Hủy
          </Button>
          <Button onClick={handleOk} disabled={loading || itemSelected.length === 0} className="rounded-xl">
            {loading ? 'Đang chia sẻ...' : 'Chia sẻ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalShareMessage;
