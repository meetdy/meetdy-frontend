import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import conversationApi from '@/api/conversationApi';
import {
  setConversations,
  setCurrentConversation,
} from '@/features/Chat/slice/chatSlice';
import dateUtils from '@/utils/dateUtils';

import PersonalAvatar from '@/features/Chat/components/PersonalAvatar';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { Delete, Info, Menu } from 'lucide-react';
import { fetchListMessagesKey } from '@/hooks/message/useInfiniteListMessages';

type FriendItemProps = {
  readonly data: any;
  readonly onClickMenu?: (key: string, id: string) => void;
};

export default function FriendItem({ data, onClickMenu }: FriendItemProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

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

    fetchListMessagesKey({ conversationId: _id, size: 10 });
    dispatch(setCurrentConversation(_id));

    navigate('/chat');
  };

  return (
    <DropdownMenu>
      <div className="flex items-center justify-between w-full p-3 rounded-xl border bg-card hover:shadow-sm transition select-none">
        <button
          type="button"
          className="flex items-center gap-3 flex-1 text-left"
          onClick={handleOpenConversation}
        >
          <PersonalAvatar
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
        </button>

        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
          >
            <Icon icon={Menu} />
          </button>
        </DropdownMenuTrigger>
      </div>

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
