import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import conversationApi from '@/api/conversationApi';
import {
  fetchListMessages,
  setConversations,
  setCurrentConversation,
} from '@/features/Chat/slice/chatSlice';
import dateUtils from '@/utils/dateUtils';

import PersonalIcon from '@/features/Chat/components/PersonalIcon';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { Delete, DotIcon, Info } from 'lucide-react';

type FriendItemProps = {
  data: any;
  onClickMenu?: (key: string, id: string) => void;
};

export default function FriendItem({ data, onClickMenu }: FriendItemProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMenuSelect = (key: string) => {
    onClickMenu?.(key, data._id);
  };

  const handleOpenConversation = async () => {
    const res = await conversationApi.createConversationIndividual(data._id);
    const { _id, isExists } = res;

    if (!isExists) {
      const conver = await conversationApi.getConversationById(data._id);
      dispatch(setConversations(conver));
    }

    dispatch(fetchListMessages({ conversationId: _id, size: 10 }));
    dispatch(setCurrentConversation(_id));

    navigate('/chat');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className="flex items-center justify-between w-full p-3 rounded-lg cursor-pointer hover:bg-accent select-none"
          onContextMenu={(e) => {
            e.preventDefault();
          }}
        >
          {/* Left Section */}
          <div
            className="flex items-center gap-3 flex-1"
            onClick={handleOpenConversation}
          >
            <PersonalIcon
              isActive={data.isOnline}
              avatar={data.avatar}
              name={data.name}
              color={data.avatarColor}
            />

            <div className="flex flex-col">
              <span className="font-medium text-sm">{data.name}</span>

              {data.lastLogin && (
                <span className="text-xs text-muted-foreground">
                  Truy cập {dateUtils.toTime(data.lastLogin)} trước
                </span>
              )}
            </div>
          </div>

          {/* Right Section */}
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted"
            >
              <Icon icon={DotIcon} className="text-lg" />
            </Button>
          </DropdownMenuTrigger>
        </div>
      </DropdownMenuTrigger>

      {/* Menu Content */}
      <DropdownMenuContent className="w-40">
        <DropdownMenuItem onClick={() => handleMenuSelect('1')}>
          <Icon icon={Info} className="mr-2 text-base" />
          Xem thông tin
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => handleMenuSelect('2')}
        >
          <Icon icon={Delete} className="mr-2 text-base" />
          Xóa bạn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
