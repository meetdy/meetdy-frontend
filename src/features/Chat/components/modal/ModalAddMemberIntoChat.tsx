import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Pencil, AlertCircle, Search } from "lucide-react";
import PersonalAvatar from "../PersonalAvatar";
import ItemsSelected from "../ItemsSelected";

import { useGetFriends } from "@/hooks/friend";

export default function ModalAddMemberIntoChat({
  onConfirm,
  onCancel,
  isVisible,
  typeModal,
}) {
  const { data: friends = [] } = useGetFriends({});

  const [itemSelected, setItemSelected] = useState<any[]>([]);
  const [frInput, setFrInput] = useState("");
  const [checkList, setCheckList] = useState<string[]>([]);
  const [nameGroup, setNameGroup] = useState("");
  const [isShowError, setIsShowError] = useState(false);
  const [initialFriend, setInitialFriend] = useState<any[]>([]);

  useEffect(() => {
    if (isVisible) {
      setInitialFriend(friends || []);
    } else {
      setFrInput("");
      setCheckList([]);
      setItemSelected([]);
      setNameGroup("");
      setIsShowError(false);
    }
  }, [isVisible]);

  const handleConfirm = () => {
    const userIds = itemSelected.map((ele) => ele._id);

    if (typeModal === 1) {
      onConfirm?.([...checkList], nameGroup);
    } else {
      onConfirm?.(userIds);
    }
  };

  const handleSearch = (e: any) => {
    const value = e.target.value;
    setFrInput(value);

    if (!value) {
      setInitialFriend(friends || []);
    } else {
      const result = (friends || []).filter((ele) =>
        ele.name.toLowerCase().includes(value.toLowerCase())
      );
      setInitialFriend(result);
    }
  };

  const handleChangeCheckBox = (value: string) => {
    const exists = checkList.includes(value);
    let newCheck = [...checkList];
    let newItems = [...itemSelected];

    if (exists) {
      newCheck = newCheck.filter((ele) => ele !== value);
      newItems = newItems.filter((ele) => ele._id !== value);
    } else {
      newCheck.push(value);
      const user = initialFriend.find((ele) => ele._id === value);
      if (user) newItems.push(user);
    }

    setCheckList(newCheck);
    setItemSelected(newItems);
  };

  const handleRemoveItem = (id: string) => {
    setCheckList((prev) => prev.filter((ele) => ele !== id));
    setItemSelected((prev) => prev.filter((ele) => ele._id !== id));
    setFrInput("");
    setInitialFriend(friends);
  };

  const checkInitialValue = (id: string) => {
    return ['']?.includes(id);
  };

  return (
    <Dialog open={isVisible} onOpenChange={(v) => onCancel(v)}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            {typeModal === 2 ? "Thêm thành viên" : "Tạo nhóm"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {typeModal === 1 && (
            <>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Pencil className="w-4 h-4 text-gray-500" />
                </div>

                <div className="flex-1">
                  <Input
                    placeholder="Nhập tên nhóm"
                    value={nameGroup}
                    onChange={(e) => setNameGroup(e.target.value)}
                    onBlur={() =>
                      setIsShowError(!(nameGroup.trim().length > 0))
                    }
                    className="rounded-md"
                  />
                  {isShowError && (
                    <div className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-4 h-4" /> Tên nhóm không được để trống
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm font-medium">Thêm bạn vào nhóm</div>
            </>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Nhập tên bạn muốn tìm kiếm"
              value={frInput}
              onChange={handleSearch}
              className="pl-10 rounded-md"
            />
          </div>

          <div className="w-full h-px bg-gray-200" />

          <div className="flex gap-4">
            <div className="flex-1">
              <div className="font-medium mb-2">Danh sách bạn bè</div>

              <ScrollArea className="h-64 pr-2">
                <div className="flex flex-col gap-3">
                  {initialFriend.map((ele) => (
                    <label
                      key={ele._id}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${checkInitialValue(ele._id)
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-slate-50"
                        }`}
                    >
                      <Checkbox
                        disabled={checkInitialValue(ele._id)}
                        checked={checkList.includes(ele._id)}
                        onCheckedChange={() =>
                          handleChangeCheckBox(ele._id)
                        }
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
              <div className="w-2/5 flex flex-col">
                {/* Header */}
                <div className="font-medium mb-2 flex items-center justify-between">
                  <span>Đã chọn</span>
                  <span className="text-sm text-slate-500">
                    {itemSelected.length}
                  </span>
                </div>
                <ScrollArea className="h-64 pr-2">
                  <div className="flex flex-col gap-1">
                    <ItemsSelected
                      items={itemSelected}
                      onRemove={handleRemoveItem}
                    />
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onCancel(false)} className="rounded-md">
            Hủy
          </Button>
          <Button
            disabled={
              (typeModal === 1 && !nameGroup.trim().length) ||
              checkList.length < 1
            }
            onClick={handleConfirm}
            className="rounded-md"
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
