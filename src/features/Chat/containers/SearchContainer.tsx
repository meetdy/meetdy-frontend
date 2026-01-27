import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, UserPlus, Users, Plus } from 'lucide-react';

import userApi from '@/api/userApi';
import ModalClassify from '../components/ModalClassify';
import ModalAddFriend from '@/components/modal-add-friend';
import UserCard from '@/components/user-card';
import ModalCreateGroup from '../components/ModalCreateGroup';
import { createGroup } from '@/app/chatSlice';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
  valueText: string;
  onSearchChange: (text: string) => void;
  onSubmitSearch: () => void;
  isFriendPage?: boolean;
  onFilterClasify?: (value: string) => void;
  valueClassify?: string;
};

export default function SearchContainer({
  valueText,
  onSearchChange,
  onSubmitSearch,
  isFriendPage,
  onFilterClasify,
  valueClassify,
}: Props) {
  const refDebounce = useRef<any>(null);
  const dispatch = useDispatch();
  const { classifies } = useSelector((state: any) => state.chat);

  const [isModalCreateGroup, setIsModalCreateGroup] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isShowModalAddFriend, setShowModalAddFriend] = useState(false);
  const [userIsFind, setUserIsFind] = useState<any>({});
  const [visibleUserCard, setVisibleUserCard] = useState(false);
  const [isModalClassify, setIsModalClassify] = useState(false);

  const handleOnChangeClassify = (value: string) => {
    onFilterClasify?.(value);
  };

  const handleCreateGroup = () => setIsModalCreateGroup(true);
  const handleCancelCreateGroup = () => setIsModalCreateGroup(false);
  const handleOkCreateGroup = (value: any) => {
    setConfirmLoading(true);
    dispatch(createGroup(value) as any);
    setConfirmLoading(false);
    setIsModalCreateGroup(false);
  };

  const handleOpenModalAddFriend = () => setShowModalAddFriend(true);
  const handleCancelAddFriend = () => setShowModalAddFriend(false);

  const handFindUser = async (value: string) => {
    try {
      const user = await userApi.getUser(value);
      setUserIsFind(user);
      setVisibleUserCard(true);
      setShowModalAddFriend(false);
    } catch (error) {
      toast.error('Không tìm thấy người dùng');
    }
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    onSearchChange?.(value);

    if (refDebounce.current) clearTimeout(refDebounce.current);

    refDebounce.current = setTimeout(() => {
      onSubmitSearch?.();
    }, 400);
  };

  const handleOpenModalClassify = () => setIsModalClassify(true);
  const handleCancelModalClassify = () => setIsModalClassify(false);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm cuộc trò chuyện..."
            className="pl-9 h-10 rounded-xl border-input bg-muted/40 focus:bg-background transition-colors"
            value={valueText}
            onChange={handleInputChange}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleOpenModalAddFriend}
          aria-label="Thêm bạn"
          className="h-10 w-10 rounded-xl hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <UserPlus className="w-5 h-5 text-muted-foreground" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleCreateGroup}
          aria-label="Tạo nhóm"
          className="h-10 w-10 rounded-xl hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Users className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      {!isFriendPage && valueText.trim().length === 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {/* All */}
          <Button
            onClick={() => handleOnChangeClassify('0')}
            variant={
              valueClassify === '0' || !valueClassify ? 'default' : 'secondary'
            }
            size="sm"
            className={cn(
              'flex-shrink-0 rounded-full px-3',
              valueClassify === '0' || !valueClassify
                ? ''
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
            )}
          >
            Tất cả
          </Button>

          {classifies?.map((ele: any) => (
            <Button
              key={ele._id}
              onClick={() => handleOnChangeClassify(ele._id)}
              variant={valueClassify === ele._id ? 'default' : 'secondary'}
              size="sm"
              className={cn(
                'flex-shrink-0 rounded-full px-3 flex items-center gap-1.5',
                valueClassify === ele._id
                  ? ''
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
              )}
            >
              {ele.color?.code && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: ele.color.code }}
                />
              )}
              {ele.name}
            </Button>
          ))}

          {/* Add */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleOpenModalClassify}
                variant="secondary"
                size="icon"
                className="flex-shrink-0 w-8 h-8 rounded-full bg-muted hover:bg-muted/80"
              >
                <Plus className="w-4 h-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Quản lý phân loại</TooltipContent>
          </Tooltip>
        </div>
      )}

      <ModalCreateGroup
        isVisible={isModalCreateGroup}
        onCancel={handleCancelCreateGroup}
        onOk={handleOkCreateGroup}
        loading={confirmLoading}
      />

      <ModalAddFriend
        isVisible={isShowModalAddFriend}
        onCancel={handleCancelAddFriend}
        onSearch={handFindUser}
        onEnter={handFindUser}
      />

      <ModalClassify
        isVisible={isModalClassify}
        onCancel={handleCancelModalClassify}
        onOpen={handleOpenModalClassify}
      />

      <UserCard
        user={userIsFind}
        isVisible={visibleUserCard}
        onCancel={() => setVisibleUserCard(false)}
      />
    </div>
  );
}
