import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Smile,
  Image,
  Link as LinkIcon,
  Type,
  BarChart2,
  Newspaper,
} from 'lucide-react';
import type { RootState } from '@/store';
import UploadFile from '@/customfield/upLoadFile';
import ModalCreateVote from '../ModalCreateVote';
import Sticker from '../Sticker';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

type Props = {
  onClickTextFormat?: () => void;
  isFocus?: boolean;
  onScroll?: (e?: any) => void;
  onViewVotes?: () => void;
  onOpenInfoBlock?: () => void;
};

export default function NavigationChatBox({
  onClickTextFormat,
  isFocus = false,
  onScroll,
  onViewVotes,
  onOpenInfoBlock,
}: Props) {
  const [visiblePop, setVisiblePop] = useState(false);
  const { stickers, currentConversation, conversations } = useSelector(
    (state: RootState) => state.chat,
  );
  const [isVisibleVote, setIsVisibleVote] = useState(false);

  const conver = conversations.find((c) => c._id === currentConversation);
  const checkIsGroup = Boolean(conver && conver.type);

  const handleOnClickTextFormat = () => {
    if (onClickTextFormat) onClickTextFormat();
  };

  const handleOnClickMenu = (key: string) => {
    if (key === 'VOTE') {
      setIsVisibleVote(true);
    } else if (key === 'VIEW_NEWS') {
      if (onViewVotes) onViewVotes();
      if (onOpenInfoBlock) onOpenInfoBlock();
    }
  };

  return (
    <div
      id="navigation-chat-box"
      className={`p-1 rounded-md ${isFocus ? 'border border-blue-500' : ''}`}
    >
      <ul className="flex items-center gap-2">
        <li>
          <Popover open={visiblePop} onOpenChange={setVisiblePop}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="p-2 rounded-full text-lg">
                <Smile className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-2 w-[260px]">
              <Sticker
                onClose={() => setVisiblePop(false)}
                data={stickers}
                onScroll={onScroll}
              />
            </PopoverContent>
          </Popover>
        </li>

        <li>
          <UploadFile typeOfFile="media">
            <Button
              variant="ghost"
              className="p-2 rounded-full text-lg"
              title="Gửi hình ảnh"
            >
              <Image className="w-5 h-5" />
            </Button>
          </UploadFile>
        </li>

        <li>
          <UploadFile typeOfFile="File">
            <Button
              variant="ghost"
              className="p-2 rounded-full text-lg"
              title="Gửi file"
            >
              <LinkIcon className="w-5 h-5" />
            </Button>
          </UploadFile>
        </li>

        <li>
          <button
            type="button"
            title="Định dạng tin nhắn"
            onClick={handleOnClickTextFormat}
            className="p-2 rounded-full hover:bg-slate-100 transition"
          >
            <Type className="w-5 h-5 text-slate-700" />
          </button>
        </li>

        {checkIsGroup && (
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-2 rounded-full text-lg"
                  title="Vote"
                >
                  <BarChart2 className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="w-56">
                <DropdownMenuItem onSelect={() => handleOnClickMenu('VOTE')}>
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4" />
                    <span>Tạo cuộc bình chọn</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleOnClickMenu('VIEW_NEWS')}
                >
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-4 h-4" />
                    <span>Xem bảng tin nhóm</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        )}
      </ul>

      <ModalCreateVote
        visible={isVisibleVote}
        onCancel={() => setIsVisibleVote(false)}
      />
    </div>
  );
}
