import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Pencil, AlertCircle, Search } from 'lucide-react';
import PersonalAvatar from './PersonalAvatar';
import ItemsSelected from './ItemsSelected';

type Props = {
  isVisible: boolean;
  onCancel: (v: boolean) => void;
  onOk: (v: any) => void;
  loading?: boolean;
};

export default function ModalCreateGroup({
  isVisible,
  onCancel,
  onOk,
  loading,
}: Readonly<Props>) {
  const [checkList, setCheckList] = useState<string[]>([]);
  const [itemSelected, setItemSelected] = useState<any[]>([]);
  const [isShowError, setIsShowError] = useState(false);
  const [nameGroup, setNameGroup] = useState('');
  const [frInput, setFrInput] = useState('');

  const { friends } = useSelector((state: any) => state.chat);

  useEffect(() => {
    if (!isVisible) {
      setFrInput('');
      setCheckList([]);
      setItemSelected([]);
      setNameGroup('');
      setIsShowError(false);
    }
  }, [isVisible]);

  const filteredFriends = useMemo(() => {
    const value = frInput.trim();
    if (!isVisible) return [];
    if (!value) return friends;

    return friends.filter((f: any) =>
      f.name?.toLowerCase().includes(value.toLowerCase()),
    );
  }, [friends, frInput, isVisible]);

  const handleOk = () => {
    const userIds = itemSelected.map((item) => item._id);
    onOk?.({ name: nameGroup, userIds });
  };

  const handleChangeName = (e: any) => {
    setNameGroup(e.target.value);
  };

  const handleOnBlur = () => {
    setIsShowError(nameGroup.length <= 0);
  };

  const handleChangeFriend = (e: any) => {
    const value = e.target.value;
    setFrInput(value);
  };

  const handleChangeCheckBox = (id: string) => {
    const isChecked = checkList.includes(id);
    let newList = [...checkList];
    let newItems = [...itemSelected];

    if (isChecked) {
      newList = newList.filter((v) => v !== id);
      newItems = newItems.filter((ele) => ele._id !== id);
    } else {
      newList.push(id);
      const user = filteredFriends.find((ele) => ele._id === id);
      if (user) newItems.push(user);
    }

    setCheckList(newList);
    setItemSelected(newItems);
  };

  const handleRemoveItem = (id: string) => {
    setCheckList((p) => p.filter((x) => x !== id));
    setItemSelected((p) => p.filter((x) => x._id !== id));
  };

  return (
    <Dialog open={isVisible} onOpenChange={(v) => onCancel(v)}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Tạo nhóm</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
              <Pencil className="w-4 h-4 text-gray-500" />
            </div>
            <Input
              placeholder="Nhập tên nhóm"
              value={nameGroup}
              onChange={handleChangeName}
              onBlur={handleOnBlur}
              className="rounded-xl"
            />
          </div>
        </div>

        {isShowError && (
          <div className="text-red-500 flex items-center gap-1 text-sm mt-1">
            <AlertCircle className="w-4 h-4" /> Tên nhóm không được để trống
          </div>
        )}

        <div className="font-semibold text-sm mt-2 mb-2">Thêm bạn vào nhóm</div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Nhập tên"
            className="pl-9 rounded-xl"
            value={frInput}
            onChange={handleChangeFriend}
          />
        </div>

        <div className="w-full h-px bg-gray-200 my-4" />

        <div className="flex gap-4">
          <div
            className={`flex-1 transition-all ${itemSelected.length === 0 ? 'w-full' : ''
              }`}
          >
            <div className="font-medium mb-2">Danh sách bạn bè</div>

            <ScrollArea className="h-60 pr-2">
              <div className="flex flex-col gap-3">
                {filteredFriends.map((ele) => (
                  <label
                    key={ele._id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                  >
                    <Checkbox
                      checked={checkList.includes(ele._id)}
                      onCheckedChange={() => handleChangeCheckBox(ele._id)}
                    />
                    <PersonalAvatar
                      dimension={36}
                      avatar={ele.avatar}
                      name={ele.name}
                      color={ele.avatarColor}
                    />
                    <span>{ele.name}</span>
                  </label>
                ))}
              </div>
            </ScrollArea>
          </div>

          {itemSelected.length > 0 && (
            <div className="w-1/3">
              <div className="font-medium mb-2">
                Đã chọn: {itemSelected.length}
              </div>
              <ScrollArea className="h-60 pr-2">
                <ItemsSelected
                  items={itemSelected}
                  onRemove={handleRemoveItem}
                />
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onCancel(false)}
            className="rounded-xl"
          >
            Hủy
          </Button>
          <Button
            disabled={!(itemSelected.length > 0 && nameGroup.length > 0)}
            onClick={handleOk}
            className="rounded-xl"
          >
            Tạo nhóm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
