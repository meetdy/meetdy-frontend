import { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
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
  fetchListMessages,
  setCurrentConversation,
} from '@/features/Chat/slice/chatSlice';
import classifyUtils from '@/utils/classifyUtils';

import SubMenuClassify from '@/components/SubMenuClassify';

interface GroupCardProps {
  data: any;
  onRemove?: (key: string, id: string) => void;
}

export default function GroupCard({ data, onRemove }: GroupCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    dispatch(fetchListMessages({ conversationId: data._id, size: 10 }));
    dispatch(setCurrentConversation(data._id));
    navigate('/chat');
  };

  const menu = (
    <DropdownMenuContent className="w-48">
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <span className="font-medium text-gray-800">Phân loại</span>
        </DropdownMenuSubTrigger>

        <DropdownMenuSubContent>
          <SubMenuClassify data={classifies} idConver={data._id} />
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
  );

  return (
    <div onClick={handleOnClick} className="relative">
      {classify && (
        <Badge
          className="absolute top-2 left-2 px-2 py-1 text-xs"
          style={{ backgroundColor: classify.color.code }}
        >
          {classify.name}
        </Badge>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative cursor-pointer">
            <div className="group-card flex flex-col items-center p-4 rounded-lg bg-white hover:bg-gray-50 shadow-sm">
              <div className="mb-2">
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

              <div className="text-base font-semibold text-gray-800">
                {data.name}
              </div>

              <div className="text-sm text-gray-500">
                {data?.totalMembers} thành viên
              </div>

              <div
                className="absolute right-2 top-2"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-gray-100">
                      <BsThreeDotsVertical size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  {menu}
                </DropdownMenu>
              </div>
            </div>
          </div>
        </DropdownMenuTrigger>
        {menu}
      </DropdownMenu>
    </div>
  );
}
