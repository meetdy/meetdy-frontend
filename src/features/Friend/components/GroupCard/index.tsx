import { useEffect, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';

import { Badge } from '@/components/ui/badge';
import ConversationAvatar from '@/features/Chat/components/ConversationAvatar';

import {
  setCurrentConversation,
} from '@/features/Chat/slice/chatSlice';
import classifyUtils from '@/utils/classifyUtils';

import SubMenuClassify from '@/components/SubMenuClassify';
import { fetchListMessagesKey } from '@/hooks/message/useInfiniteListMessages';

interface GroupCardProps {
  data: any;
  onRemove?: (key: string, id: string) => void;
}

export default function GroupCard({ data, onRemove }: GroupCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const { classifies } = useSelector((state: any) => state.chat);

  const [classify, setClassify] = useState<any>(null);

  useEffect(() => {
    if (classifies.length > 0) {
      setClassify(classifyUtils.getClassifyOfObject(data._id, classifies));
    }
  }, [classifies]);

  const handleOnSelectMenu = (key: string) => {
    if (key === '2' && onRemove) {
      onRemove(key, data._id);
    }
  };

  const handleOnClick = async () => {
    fetchListMessagesKey({ conversationId: data._id, size: 10 });
    dispatch(setCurrentConversation(data._id));
    navigate('/chat');
  };

  return (
    <div className="relative">
      {classify && (
        <Badge
          className="absolute top-2 left-2 px-2 py-1 text-xs rounded-lg"
          style={{ backgroundColor: classify.color.code }}
        >
          {classify.name}
        </Badge>
      )}

      <div className="relative">
        <div className="group-card flex flex-col items-center p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
          <button
            type="button"
            className="flex flex-col items-center gap-2 w-full text-left focus-visible:outline-none"
            onClick={handleOnClick}
          >
            <div className="mb-1">
              <ConversationAvatar
                avatar={data.avatar}
                dimension={52}
                type={data.type}
                totalMembers={data.totalMembers}
                isGroupCard={true}
                sizeAvatar={48}
                frameSize={96}
              />
            </div>

            <div className="text-base font-semibold text-slate-800">
              {data.name}
            </div>

            <div className="text-sm text-slate-500">
              {data?.totalMembers} thành viên
            </div>
          </button>

          <div className="absolute right-2 top-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <MoreVertical className="w-4 h-4 text-slate-500" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48 rounded-xl">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span className="font-medium text-gray-800">Phân loại</span>
                  </DropdownMenuSubTrigger>

                  <DropdownMenuSubContent className="rounded-xl">
                    <SubMenuClassify data={classifies} chatId={data._id} />
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => handleOnSelectMenu('2')}
                  className="text-red-600 cursor-pointer"
                >
                  Rời nhóm
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
